import { CustomError } from '@sheet-i18n/errors';

/**createI18nStore */
export class InvalidI18nStoreParamsError extends CustomError {}
export class InvalidSupportedLocalesError extends CustomError {}
export class NoDefaultLocaleInSupportedLocalesError extends CustomError {}
export class InvalidLocaleSetError extends CustomError {}

/**createI18nContext */
export class InvalidI18nContextStateError extends CustomError {}
