import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { Cell } from '../../Abstracts';
import {
  LoadCellsError,
  NoSheetError,
  OutOfRowBoundsError,
} from '../../Errors/GoogleSheetErrors';

export class GoogleCellManager extends Cell {
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

  public async loadCells(gridRange?: {
    startRowIndex?: number;
    endRowIndex?: number;
    startColumnIndex?: number;
    endColumnIndex?: number;
  }): Promise<void> {
    try {
      await this.sheet?.loadCells(gridRange);
    } catch {
      throw new LoadCellsError(
        `Failed to load ${this.sheet?.title} cells. Please check your configurations first.`
      );
    }
  }

  public async getRowCells(rowIndex: number) {
    const rowCount = this.sheet.rowCount;

    if (rowIndex < 0 || rowIndex >= rowCount) {
      throw new OutOfRowBoundsError(`Row index ${rowIndex} is out of bounds.`);
    }

    await this.loadCells({
      startRowIndex: rowIndex,
      endRowIndex: rowIndex + 1,
    });

    console.log('sheet info is', this.sheet);

    return [];
  }

  public getSpecificCell() {
    return {};
  }
}
