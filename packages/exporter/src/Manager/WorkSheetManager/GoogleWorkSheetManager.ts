import fs from 'fs';
import path from 'path';

import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { WorkSheet } from '../../Abstracts';
import {
  ExportTranslationsError,
  NoDocumentError,
  NoSheetError,
} from '../../Errors/GoogleSheetErrors';
import { CellValue, Locale, SheetTitle } from '../../@types/googleSheet';
import { GoogleRowManager } from '../RowManager';
import { GoogleCellManager } from '../CellManager';
import { GoogleSheetExporterParams } from '../../sheetExporter/googleSheetExporter';

interface WorkSheetManagerParams {
  doc: GoogleSpreadsheet;
  googleSheetExporterParams: GoogleSheetExporterParams;
}

type SheetRegistry = Map<
  SheetTitle,
  {
    rowManager: GoogleRowManager;
    cellManager: GoogleCellManager;
  }
>;

export class GoogleWorkSheetManager extends WorkSheet {
  private doc: GoogleSpreadsheet;
  private googleSheetExporterParams: GoogleSheetExporterParams;
  private sheetRegistry: SheetRegistry = new Map();

  constructor({ doc, googleSheetExporterParams }: WorkSheetManagerParams) {
    super();

    this.doc = doc;
    this.googleSheetExporterParams = googleSheetExporterParams;

    this.init();
  }

  protected validate() {
    if (validator.isNullish(this.doc)) {
      throw new NoDocumentError(
        'GoogleSpreadsheet document is not found. Please check your configurations first.'
      );
    }
  }

  protected init() {
    this.validate();
    this.initSheetRegistry();
  }

  /** get all work sheet on document */
  public getManyWorkSheets(): GoogleSpreadsheetWorksheet[] {
    const { ignoredSheets } = this.googleSheetExporterParams ?? {};
    const sheets = this?.doc?.sheetsByIndex;

    if (validator.isNullish(sheets)) {
      throw new NoSheetError(
        'No sheet on your document. Please make spreadsheet first.'
      );
    }

    if (ignoredSheets) {
      return sheets.filter((sheet) => !ignoredSheets.includes(sheet.title));
    }

    return sheets;
  }

  /** get specific workSheet */
  public getWorksheet(title: string): GoogleSpreadsheetWorksheet {
    const sheet = this?.doc?.sheetsByTitle?.[title];

    if (validator.isNullish(sheet)) {
      throw new NoSheetError(
        `"${title}" sheet is not found. Existing sheets are: ${Object.keys(this?.doc?.sheetsByTitle ?? []).join(', ')}`
      );
    }

    return sheet;
  }

  /** sheetRegistry = state responsible for sheet row and cell control by Manager Classes */
  public getSheetRegistry() {
    return this.sheetRegistry;
  }
  public setSheetRegistry(sheetRegistry: SheetRegistry) {
    this.sheetRegistry = sheetRegistry;

    return this.sheetRegistry;
  }
  public registerSheet(
    sheetRegistry: SheetRegistry,
    sheet: GoogleSpreadsheetWorksheet
  ) {
    sheetRegistry.set(sheet.title, {
      rowManager: new GoogleRowManager(sheet),
      cellManager: new GoogleCellManager(sheet),
    });

    return sheetRegistry;
  }
  public initSheetRegistry() {
    const sheets = this.getManyWorkSheets();

    const sheetRegistry: SheetRegistry = this.getSheetRegistry();

    sheets.forEach((sheet) => this.registerSheet(sheetRegistry, sheet));

    this.setSheetRegistry(sheetRegistry);
  }

  /** handlers for sheet json data */
  public getTranslations = async () => {
    const isServer = typeof window === 'undefined';

    if (!isServer) {
      throw new ExportTranslationsError(
        'Export sheets is only available in node.js environment.'
      );
    }

    const translationDataMap = await this.getTranslationDataMap();

    return Object.fromEntries(translationDataMap);
  };

  public exportTranslations = async () => {
    const isServer = typeof window === 'undefined';

    if (!isServer) {
      throw new ExportTranslationsError(
        'Export sheets is only available in node.js environment.'
      );
    }

    const defaultExportPath = path.resolve(process.cwd());

    const translationDataMap = await this.getTranslationDataMap();

    const exportPath =
      this.googleSheetExporterParams?.exportPath ?? defaultExportPath;

    if (validator.isNullish(exportPath) || !fs.existsSync(exportPath)) {
      throw new ExportTranslationsError(
        `Invalid or missing export path: ${exportPath} Please check the export path is valid.(default is a current working directory)`
      );
    }

    const writePromises = Array.from(translationDataMap.entries()).map(
      async ([lang, translationData]) => {
        const stringified = JSON.stringify(translationData, null, 2);
        const fileName = `${lang}.json`;
        const filePath = path.resolve(exportPath, fileName);

        try {
          await fs.promises.writeFile(filePath, stringified);
        } catch {
          throw new ExportTranslationsError(
            `Failed to write file to: ${filePath}`
          );
        }
      }
    );

    try {
      await Promise.all(writePromises);
    } catch (error) {
      throw error;
    }
  };

  public async getTranslationDataMap() {
    const sheets = this.getManyWorkSheets();
    const defaultLocale = this.googleSheetExporterParams.defaultLocale;
    const translationDataMap = new Map<Locale, Record<SheetTitle, {}>>();
    const sheetMetaDataList = await Promise.all(
      sheets.map((sheet) => this.getSheetMetaData(sheet))
    );

    sheetMetaDataList.forEach((sheetMetaData) => {
      if (sheetMetaData === null) return;

      const { sheetTitle, headers, rows } = sheetMetaData;

      if (!headers.includes(defaultLocale)) {
        console.log(
          `defaultLocale "${defaultLocale}" is not found in "${sheetTitle}" sheet headerValues, ignored...`
        );

        return;
      }

      headers.forEach((lang) => {
        const translationData = translationDataMap.get(lang) ?? {};
        const sheetData = translationData[sheetTitle] ?? {};

        // rows = Array<locale in headerValue, cellValue>
        rows.forEach((row) => {
          const defaultLocaleValue = row[defaultLocale];

          if (defaultLocaleValue) {
            (sheetData as Record<string, any>)[defaultLocaleValue] = row[lang];
          }
        });

        translationData[sheetTitle] = sheetData;

        translationDataMap.set(lang, translationData);
      });
    });

    return translationDataMap;
  }

  public async getSheetMetaData(sheet: GoogleSpreadsheetWorksheet) {
    const registry = this.sheetRegistry?.get(sheet.title);

    if (!registry) return null;

    const headerStartRowNumber =
      this.googleSheetExporterParams?.headerStartRowNumber;

    await registry.rowManager.loadRowsFromHeaderRowNumber(headerStartRowNumber);
    const rows = await registry.rowManager.getManyRows();
    const headers = registry.rowManager.getHeaderValues();
    const parsedRows = rows.map((row) => row.toObject());

    return {
      sheetTitle: sheet.title,
      headers,
      rows: parsedRows,
    };
  }

  /** update sheet */
  public updateSheet = async (dataSet: Map<SheetTitle, Set<CellValue>>) => {
    if (validator.isNullish(dataSet)) {
      console.log('dataSet is not found. update finished');

      return;
    }

    try {
      const transactions = Array.from(dataSet.entries()).map(
        async ([sheetTitle, cellValueSet]) => {
          const registry = this.sheetRegistry?.get(sheetTitle);

          // if sheet is not found, return null
          if (validator.isNullish(registry)) {
            console.log(`sheet "${sheetTitle}" is not found. ignored...`);

            return null;
          }

          const rowManager = registry.rowManager;

          await rowManager.loadRowsFromHeaderRowNumber(
            this.googleSheetExporterParams?.headerStartRowNumber
          );

          const headerValues = rowManager.getHeaderValues();
          const defaultLocale = this.googleSheetExporterParams.defaultLocale;

          // if defaultLocale is not found in header, return null
          if (!headerValues.includes(defaultLocale)) {
            console.log(
              `sheet "${sheetTitle} has no "${defaultLocale}" header. ignored...`
            );

            return null;
          }

          const updateDataSet = Array.from(cellValueSet).map((v) => ({
            [defaultLocale]: v,
          }));

          await rowManager.addRows(updateDataSet);

          console.log('update finished');
        }
      );

      await Promise.all(transactions);
    } catch (err) {
      throw err;
    }
  };
}
