import { GoogleSpreadSheetManager } from './googleSpreadSheetManager';

export interface GoogleSheetCredentials {
  sheetId: string;
  clientEmail: string;
  privateKey: string;
}

export interface LocaleSettings {
  supportedLocales: string[];
  defaultLocale: string;
}

export interface GoogleSheetExporterParams {
  googleSheetCredentials: GoogleSheetCredentials;
  localeSettings?: LocaleSettings;
}

export async function googleSheetExporter(
  googleSheetExporterParams: GoogleSheetExporterParams
) {
  const { googleSheetCredentials, localeSettings } = googleSheetExporterParams;

  const googleSpreadSheetManager = new GoogleSpreadSheetManager(
    googleSheetCredentials
  );
  const doc = await googleSpreadSheetManager.loadDoc();

  console.log('doc is', doc);

  return googleSpreadSheetManager;
}
