export interface GoogleSheetCredentials {
  sheetId: string;
  clientEmail: string;
  privateKey: string;
}

export interface LocaleSettings {
  supportedLocales: string[];
  defaultLocale: string;
}
