import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { WorkSheet } from '../../Abstracts';
import { NoDocumentError, NoSheetError } from '../../Errors';

interface WorkSheetManagerParams {
  doc: GoogleSpreadsheet;
}

export class GoogleWorkSheetManager extends WorkSheet {
  private doc: GoogleSpreadsheet;

  constructor({ doc }: WorkSheetManagerParams) {
    super();
    this.doc = doc;
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
    return this.doc.sheetsByIndex;
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
}
