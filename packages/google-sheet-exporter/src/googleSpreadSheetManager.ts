import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { CustomErrorConstructor } from '@sheet-i18n/errors';
import { validator } from '@sheet-i18n/shared-utils';

import { SheetManager } from './abstract';
import {
  InValidInitConfigError,
  LoadDocError,
  NoAuthClientError,
  NoSheetError,
} from './errors';

import { GoogleSheetCredentials } from '.';

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

  /** initiate sheet manager */
  protected init() {
    this.validateCredentials();
    this.initAuthentication();
  }

  /** check required parameters */
  protected validateCredentials(): never | void {
    if (validator.hasEmptyValueInObj(this.credentials)) {
      throw new InValidInitConfigError(
        'Not valid GoogleSheetCredentials. please set required credentials in googleSheetCredentials: {sheetId}, {clientEmail}, {privateKey}'
      );
    }
  }

  /** 인증 인스턴스 생성 메서드 */
  protected initAuthentication() {
    this.validateCredentials();

    this.authClient = new JWT({
      email: this.credentials.clientEmail,
      key: this.credentials.privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  /** Document 로드 메서드 */
  public async loadDoc(): Promise<GoogleSpreadsheet> {
    this.validateCredentials();

    try {
      this.doc = new GoogleSpreadsheet(
        this.credentials.sheetId as string,
        this.authClient as JWT
      );
      await this.doc.loadInfo();

      return this.doc;
    } catch {
      throw new LoadDocError(
        'Google Spreadsheet document load failed. It is possible you are not authorized to access the document. please check your environment variables.'
      );
    }
  }

  healthCheck() {
    console.log('healthCheck');
  }
}

/** 에러 스테이터스 맵 */
export const sheetErrorStatusMap = new Map<CustomErrorConstructor, number>([
  [InValidInitConfigError, 400],
  [NoAuthClientError, 400],
  [NoSheetError, 400],
  [LoadDocError, 400],
]);
