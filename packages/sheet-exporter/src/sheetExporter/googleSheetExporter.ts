import { GoogleSheetCredentials, LocaleSettings } from '../@types/googleSheet';
import { GoogleSpreadSheetManager } from '../Manager/SpreadSheetManager';
import { GoogleWorkSheetManager } from '../Manager/WorkSheetManager';

export interface GoogleSheetExporterParams {
  credentials: GoogleSheetCredentials;
  localeSettings?: LocaleSettings;
}

export async function googleSheetExporter(
  googleSheetExporterParams: GoogleSheetExporterParams
) {
  const { credentials, localeSettings } = googleSheetExporterParams;

  const googleSpreadSheetManager = new GoogleSpreadSheetManager(credentials);
  const doc = await googleSpreadSheetManager.loadDoc();

  const workSheetManager = new GoogleWorkSheetManager({ doc });

  return googleSpreadSheetManager;
}
