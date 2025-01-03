import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { validator } from '@sheet-i18n/shared-utils';

import { SheetManager } from '../../Abstracts';
import {
  InValidInitConfigError,
  LoadDocError,
} from '../../Errors/GoogleSheetErrors';
import { GoogleSheetCredentials } from '../../@types/googleSheet';

export type GoogleSpreadSheetManagerParams = GoogleSheetCredentials;

export class GoogleSpreadSheetManager extends SheetManager {
  private credentials: Partial<GoogleSheetCredentials>;
  private authClient: JWT | null = null;
  private doc: GoogleSpreadsheet | null = null;

  constructor(googleSpreadSheetManagerParams: GoogleSpreadSheetManagerParams) {
    super();
    this.credentials = googleSpreadSheetManagerParams;
    this.init();
  }

  /** check required parameters */
  protected validate(): never | void {
    if (validator.hasEmptyValueInObj(this.credentials)) {
      throw new InValidInitConfigError(
        'Not valid GoogleSheetCredentials. please set required credentials in googleSheetCredentials: {sheetId}, {clientEmail}, {privateKey}'
      );
    }
  }

  /** initiate sheet manager */
  protected init() {
    this.validate();
    this.initAuthentication();
  }

  /** authentication */
  protected initAuthentication() {
    this.authClient = new JWT({
      email: this.credentials.clientEmail,
      key: this.credentials.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  /** document loader */
  public async loadDoc(): Promise<GoogleSpreadsheet> {
    try {
      this.doc = new GoogleSpreadsheet(
        this.credentials.sheetId as string,
        this.authClient as JWT
      );
      await this.doc.loadInfo();

      return this.doc;
    } catch {
      throw new LoadDocError(
        'Google Spreadsheet document load is failed. It is possible you are not authorized to access the document. please check your credentials again.'
      );
    }
  }
}
