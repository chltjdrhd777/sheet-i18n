import { validator } from '@sheet-i18n/shared-utils';

import { GoogleSheetCredentials, RowNumber } from '../@types/googleSheet';
import { GoogleSpreadSheetManager } from '../Manager/SpreadSheetManager';
import { GoogleWorkSheetManager } from '../Manager/WorkSheetManager';
import { InValidPreRequisitesError } from '../Errors/GoogleSheetErrors';

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
  const { credentials, defaultLocale } = googleSheetExporterParams;
  const preRequisites: GoogleSheetExporterPreRequisites = {
    credentials,
    defaultLocale,
  };

  if (validator.hasInvalidValuePrerequisites(preRequisites)) {
    throw new InValidPreRequisitesError(
      `Please set the valid requisites first: ${Object.entries(preRequisites).join(', ')}`
    );
  }

  // init document
  const googleSpreadSheetManager = new GoogleSpreadSheetManager(credentials);
  const doc = await googleSpreadSheetManager.loadDoc();

  // init workSheetManager
  const workSheetManager = new GoogleWorkSheetManager({
    doc,
    googleSheetExporterParams,
  });
  const allSheets = workSheetManager.getManyWorkSheets();

  workSheetManager.initSheetRegistry(allSheets);

  // expose members
  return {
    getTranslations: workSheetManager.getTranslations,
    exportTranslations: workSheetManager.exportTranslations,
  };
}
