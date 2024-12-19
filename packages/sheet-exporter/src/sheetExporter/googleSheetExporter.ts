import {
  GoogleSheetCredentials,
  headerRowCoordinates,
} from '../@types/googleSheet';
import { GoogleSpreadSheetManager } from '../Manager/SpreadSheetManager';
import { GoogleWorkSheetManager } from '../Manager/WorkSheetManager';

export interface GoogleSheetExporterConfig {
  headerRowCoordinates?: headerRowCoordinates;
  ignoredSheets?: string[];
}
export interface GoogleSheetExporterParams extends GoogleSheetExporterConfig {
  credentials: GoogleSheetCredentials;
}

export async function googleSheetExporter(
  googleSheetExporterParams: GoogleSheetExporterParams
) {
  const { credentials, ...googleSheetExporterConfig } =
    googleSheetExporterParams;

  // init document
  const googleSpreadSheetManager = new GoogleSpreadSheetManager(credentials);
  const doc = await googleSpreadSheetManager.loadDoc();

  // init workSheetManager
  const workSheetManager = new GoogleWorkSheetManager({
    doc,
    googleSheetExporterConfig,
  });
  const allSheets = workSheetManager.getManyWorkSheets();

  workSheetManager.initSheetRegistry(allSheets);

  // test////////////////////////
  await workSheetManager.getTranslationJsonData(allSheets);

  return googleSpreadSheetManager;
}
