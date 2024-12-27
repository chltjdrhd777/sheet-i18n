import { validator } from '@sheet-i18n/shared-utils';

import {
  InvalidI18nStoreParamsError,
  InvalidLocaleSetError,
  InvalidSupportedLocalesError,
  NoDefaultLocaleInSupportedLocalesError,
} from './Errors';
import { I18nContextState } from './createI18nContext';

const preRequisites = ['supportedLocales', 'localeSet', 'defaultLocale'];

export function createI18nStore<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
>(i18nStoreParams: I18nContextState<TSupportedLocales, TLocaleSet>) {
  /** [check 1] param is nullish */
  if (validator.hasInvalidValuePrerequisites(i18nStoreParams)) {
    throw new InvalidI18nStoreParamsError(
      `Invalid params when initiating i18nStore. ${preRequisites.join(', ')} is required.`
    );
  }

  const { supportedLocales, defaultLocale, localeSet } = i18nStoreParams;

  /** check validation of supportedLocales, defaultLocale, localeSet */
  const _supportedLocales = supportedLocales as unknown as string[];
  const _defaultLocale = defaultLocale as unknown as string;

  /** [check 2] invalid params */
  isInvalidSupportedLocales(_supportedLocales, _defaultLocale, localeSet);

  /** return the copy of params */
  return { ...i18nStoreParams };
}

function isInvalidSupportedLocales(
  supportedLocales: string[],
  defaultLocale: string,
  localeSet: Record<string, any>
) {
  if (
    !Array.isArray(supportedLocales) ||
    typeof defaultLocale !== 'string' ||
    typeof localeSet !== 'object'
  ) {
    throw new InvalidI18nStoreParamsError(
      'Invalid params. please input the correct params for initiating i18nStore.'
    );
  }

  let isNotAllString = false;
  let isNoDefaultInSupported = true;
  let isNotValidLocaleSet = false;

  supportedLocales.forEach((l) => {
    if (typeof l !== 'string') isNotAllString = true;
    if (l === defaultLocale) isNoDefaultInSupported = false;
    if (validator.isNullish(localeSet[l])) isNotValidLocaleSet = true;
  });

  // [case 1] if not all string in supportedLocales
  if (isNotAllString) {
    throw new InvalidSupportedLocalesError(
      '"supportedLocales" must be string array'
    );
  }

  // [case 2] if no defaultLocale in supportedLocales
  if (isNoDefaultInSupported) {
    throw new NoDefaultLocaleInSupportedLocalesError(
      'There is no "defaultLocale" in "supportedLocales"'
    );
  }

  // [case 3] invalid localeSet
  if (isNotValidLocaleSet) {
    throw new InvalidLocaleSetError(
      '"localeSet" is invalid. The keys consist of supportedLocales'
    );
  }
}
