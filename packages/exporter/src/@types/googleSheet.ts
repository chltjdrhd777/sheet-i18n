export interface GoogleSheetCredentials {
  sheetId: string;
  clientEmail: string;
  privateKey: string;
}

export interface LocaleSettings {
  supportedLocales: string[];
  defaultLocale: string;
}

// Sheet
export type SheetTitle = string;
export type ColumnIndex = number;
export type ColumnAddress = string;
export type RowNumber = number;
export type CellValue = string;
export type Locale = string;
