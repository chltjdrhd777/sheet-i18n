import { GoogleSheetCredentials, LocaleSettings } from '../@types/googleSheet';
import { GoogleSpreadSheetManager } from '../SpreadSheetManager';

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

  return googleSpreadSheetManager;
}
