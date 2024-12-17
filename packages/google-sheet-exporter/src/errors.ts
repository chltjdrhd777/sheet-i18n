import { CustomError } from '@sheet-i18n/errors';

export class NoRequiredConfigError extends CustomError {}

export class InValidInitConfigError extends CustomError {}
export class NoAuthClientError extends CustomError {}
export class LoadDocError extends CustomError {}

export class NoSheetError extends CustomError {}
export class LoadCellsError extends CustomError {}
export class GetRowsError extends CustomError {}

export class InvalidDefaultLocaleHeaderError extends CustomError {}
export class InvalidHeadersError extends CustomError {}
