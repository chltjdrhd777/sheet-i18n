import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { WorkSheet } from '../../Abstracts';
import { NoDocumentError, NoSheetError } from '../../Errors/GoogleSheetErrors';
import { SheetTitle } from '../../@types/googleSheet';
import { GoogleRowManager } from '../RowManager';
import { GoogleCellManager } from '../CellManager';
import { GoogleSheetExporterConfig } from '../../sheetExporter/googleSheetExporter';

interface WorkSheetManagerParams {
  doc: GoogleSpreadsheet;
  googleSheetExporterConfig: GoogleSheetExporterConfig;
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
  private googleSheetExporterConfig: GoogleSheetExporterConfig;
  private sheetRegistry: SheetRegistry = new Map();

  constructor({ doc, googleSheetExporterConfig }: WorkSheetManagerParams) {
    super();
    this.doc = doc;
    this.googleSheetExporterConfig = googleSheetExporterConfig;
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
  }

  /** get all work sheet on document */
  public getManyWorkSheets(): GoogleSpreadsheetWorksheet[] {
    const { ignoredSheets } = this.googleSheetExporterConfig ?? {};
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

  public initSheetRegistry(sheets: GoogleSpreadsheetWorksheet[] = []) {
    const sheetRegistry: SheetRegistry = this.getSheetRegistry();

    sheets.forEach((sheet) => this.registerSheet(sheetRegistry, sheet));

    this.setSheetRegistry(sheetRegistry);
  }

  /** translation sheet json data */
  public async getTranslationJsonData(sheets: GoogleSpreadsheetWorksheet[]) {
    const jsonDataList = await Promise.all(
      sheets.map((sheet) => this.getSheetJsonData(sheet))
    );

    console.log('jsondatalist is', jsonDataList);
  }

  public async getSheetJsonData(sheet: GoogleSpreadsheetWorksheet) {
    const jsonData = {};

    const registry = this.sheetRegistry?.get(sheet.title);

    if (!registry) return jsonData;

    const headerRowNumber =
      this.googleSheetExporterConfig?.headerRowCoordinates?.headerRowNumber;

    await registry.rowManager.loadRowsFromHeaderRowNumber(headerRowNumber);
    const rows = await registry.rowManager.getManyRows();
    const headers = registry.rowManager.getHeaderValues();

    console.log('rows is', rows);
    console.log('headers is', headers);

    return {};
  }
}
