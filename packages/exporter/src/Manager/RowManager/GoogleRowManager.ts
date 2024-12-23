import {
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { Row } from '../../Abstracts';
import {
  GetManyRowsError,
  GetRowError,
  LoadHeaderRowError,
  NoSheetError,
} from '../../Errors/GoogleSheetErrors';
import { RowNumber } from '../../@types/googleSheet';

export class GoogleRowManager extends Row {
  private sheet: GoogleSpreadsheetWorksheet;

  constructor(sheet: GoogleSpreadsheetWorksheet) {
    super();
    this.sheet = sheet;
    this.init();
  }

  protected validate() {
    if (validator.isNullish(this.sheet)) {
      throw new NoSheetError('Sheet is not found. Please create sheet first.');
    }
  }

  protected init() {
    this.validate();
  }

  public getHeaderValues(): string[] {
    return (this?.sheet?.headerValues ?? []).filter(
      (headerValue) => !validator.isEmpty(headerValue)
    );
  }

  public async loadRowsFromHeaderRowNumber(headerStartRowNumber?: RowNumber) {
    try {
      await this?.sheet?.loadHeaderRow(headerStartRowNumber);
    } catch {
      throw new LoadHeaderRowError(
        'Failed to load header row. If your dataset does not start from the row number 1, please set "headerCoordinates" config first. The header coordinates of all sheet should be set in the same way.'
      );
    }
  }

  public async getManyRows(options?: {
    offset?: number;
    limit?: number;
  }): Promise<GoogleSpreadsheetRow[]> {
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
