import { validator } from '@sheet-i18n/shared-utils';

import { GoogleSheetCredentials, RowNumber } from '../@types/googleSheet';
import { GoogleSpreadSheetManager } from '../Manager/SpreadSheetManager';
import { GoogleWorkSheetManager } from '../Manager/WorkSheetManager';

export interface GoogleSheetExporterPreRequisites {
  credentials: GoogleSheetCredentials;
  defaultLocale: string;
}
export interface GoogleSheetExporterConfig {
  /**@param headerStartRowNumber: row number of header */
  headerStartRowNumber?: RowNumber;
  /**@param ignoredSheets: sheets to be ignored */
  ignoredSheets?: string[];
  /**@param exportPath: path to export(run only in node.js environment) */
  exportPath?: string;
}
export interface GoogleSheetExporterParams
  extends GoogleSheetExporterPreRequisites,
    GoogleSheetExporterConfig {}

export async function googleSheetExporter(
  googleSheetExporterParams: GoogleSheetExporterParams
) {
  // prerequisites: validate params
  validator.checkPrerequisiteParams(googleSheetExporterParams, [
    'credentials',
    'defaultLocale',
  ]);

  // 1. init document
  const googleSpreadSheetManager = new GoogleSpreadSheetManager(
    googleSheetExporterParams.credentials
  );
  const doc = await googleSpreadSheetManager.loadDoc();

  // 2. init workSheetManager
  const workSheetManager = new GoogleWorkSheetManager({
    doc,
    googleSheetExporterParams,
  });

  // expose members
  return {
    getTranslations: workSheetManager.getTranslations,
    exportTranslations: workSheetManager.exportTranslations,
    updateSheet: workSheetManager.updateSheet,
  };
}
