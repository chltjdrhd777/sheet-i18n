import { GoogleSheetCredentials, LocaleSettings } from '../@types/googleSheet';
import { GoogleSpreadSheetManager } from '../Manager/SpreadSheetManager';
import { GoogleWorkSheetManager } from '../Manager/WorkSheetManager';

export interface GoogleSheetExporterParams {
  credentials: GoogleSheetCredentials;
  ignoreSheets?: string[];
  localeSettings?: LocaleSettings;
}

export async function googleSheetExporter(
  googleSheetExporterParams: GoogleSheetExporterParams
) {
  const { credentials, ignoreSheets, localeSettings } =
    googleSheetExporterParams;

  const googleSpreadSheetManager = new GoogleSpreadSheetManager(credentials);
  const doc = await googleSpreadSheetManager.loadDoc();

  const workSheetManager = new GoogleWorkSheetManager({ doc });
  const allSheets = workSheetManager.getManyWorkSheets(ignoreSheets);

  console.log('all sheets is', allSheets);

  return googleSpreadSheetManager;
}
