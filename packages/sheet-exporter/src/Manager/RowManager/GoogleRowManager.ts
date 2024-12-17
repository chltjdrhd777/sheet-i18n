import {
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { Row } from '../../Abstracts';
import { GetManyRowsError, GetRowError, NoSheetError } from '../../Errors';

export class GoogleRowManager extends Row {
  private sheet: GoogleSpreadsheetWorksheet;

  constructor(sheet: GoogleSpreadsheetWorksheet) {
    super();
    this.sheet = sheet;
  }

  protected validate() {
    if (validator.isNullish(this.sheet)) {
      throw new NoSheetError('Sheet is not found. Please create sheet first.');
    }
  }

  protected init() {
    this.validate();
  }

  public async getManyRows(options?: {
    offset?: number;
    limit?: number;
  }): Promise<GoogleSpreadsheetRow[]> {
    this.validate();

    try {
      return await this?.sheet?.getRows(options);
    } catch {
      throw new GetManyRowsError(
        `Failed to get rows from "${this?.sheet?.title}". Please check your configurations first.`
      );
    }
  }

  public async getRow(rowIdx: number): Promise<GoogleSpreadsheetRow> {
    try {
      const allRows = await this.getManyRows();

      return allRows?.[rowIdx];
    } catch {
      throw new GetRowError(
        'Failed to get row from sheet. Please check your configurations first.'
      );
    }
  }
}
