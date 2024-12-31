import { CustomError } from '@sheet-i18n/errors';

/** Logger */
export class InitLoggerError extends CustomError {}

/** Flag */
export class InvalidFlagParams extends CustomError {}

/** Translation Store Errors */
export class InvalidDataError extends CustomError {}
export class MissingFieldsError extends CustomError {}
export class DataNotFoundError extends CustomError {}
export class UnsupportedActionError extends CustomError {}
