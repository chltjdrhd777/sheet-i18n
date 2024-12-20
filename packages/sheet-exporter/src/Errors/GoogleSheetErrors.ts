import { CustomError } from '@sheet-i18n/errors';

// initiation error
export class InValidPreRequisitesError extends CustomError {}
export class NoRequiredConfigError extends CustomError {}
export class InValidInitConfigError extends CustomError {}
export class NoAuthClientError extends CustomError {}
export class LoadDocError extends CustomError {}

// sheet error
export class NoSheetError extends CustomError {}

// document error
export class NoDocumentError extends CustomError {}

// workSheet error
export class NoWorkSheetRegistryError extends CustomError {}
export class GetTranslationJsonDataError extends CustomError {}

// row error
export class GetManyRowsError extends CustomError {}
export class GetRowError extends CustomError {}
export class LoadHeaderRowError extends CustomError {}
export class OutOfRowBoundsError extends CustomError {}

// cell error
export class getManyCellsError extends CustomError {}
export class getCellError extends CustomError {}
export class LoadCellsError extends CustomError {}

export class InvalidDefaultLocaleHeaderError extends CustomError {}
export class InvalidHeadersError extends CustomError {}

// export error
export class ExportSheetsError extends CustomError {}
