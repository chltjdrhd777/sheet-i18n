import { validator } from '@sheet-i18n/shared-utils';

import {
  InvalidI18nStoreParamsError,
  InvalidLocaleSetError,
  InvalidSupportedLocalesError,
  NoDefaultLocaleInSupportedLocalesError,
} from './Errors';
import { I18nContextState } from './createI18nContext';

const preRequisites = ['supportedLocales', 'localeSet', 'defaultLocale'];

export class I18nStore<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
> {
  readonly supportedLocales: TSupportedLocales;
  readonly defaultLocale: TSupportedLocales[number];
  readonly localeSet: TLocaleSet;

  constructor(
    i18nStoreParams: I18nContextState<TSupportedLocales, TLocaleSet>
  ) {
    this.validateParams(i18nStoreParams);
    this.validateSupportedLocales(i18nStoreParams);

    const { supportedLocales, defaultLocale, localeSet } = i18nStoreParams;

    this.supportedLocales = supportedLocales;
    this.defaultLocale = defaultLocale;
    this.localeSet = localeSet;
  }

  /** [check 1] Validate initial params */
  private validateParams(
    i18nStoreParams: I18nContextState<TSupportedLocales, TLocaleSet>
  ): void {
    if (validator.hasInvalidValuePrerequisites(i18nStoreParams)) {
      throw new InvalidI18nStoreParamsError(
        `⚠️ Invalid params when initiating i18nStore. ${preRequisites.join(', ')} is required.`
      );
    }
  }

  /** [check 2] Validate supportedLocales, defaultLocale, and localeSet */
  private validateSupportedLocales({
    supportedLocales,
    defaultLocale,
    localeSet,
  }: I18nContextState<TSupportedLocales, TLocaleSet>): void {
    if (
      !Array.isArray(supportedLocales) ||
      typeof defaultLocale !== 'string' ||
      typeof localeSet !== 'object'
    ) {
      throw new InvalidI18nStoreParamsError(
        '⚠️ Invalid params. Please input the correct params for initiating i18nStore.\n'
      );
    }

    let isNotAllString = false;
    let isNotValidLocaleSet = false;
    let isNoDefaultInSupported = true;

    for (let locale of supportedLocales as Array<unknown>) {
      if (typeof locale !== 'string') {
        isNotAllString = true;
        break;
      }
      if (validator.isNullish(localeSet[locale as TSupportedLocales[number]])) {
        isNotValidLocaleSet = true;
        break;
      }

      if (locale === defaultLocale) {
        isNoDefaultInSupported = false;
        break;
      }
    }

    if (isNotAllString) {
      throw new InvalidSupportedLocalesError(
        '⚠️ "supportedLocales" must be a locale array'
      );
    }

    if (isNotValidLocaleSet) {
      throw new InvalidLocaleSetError(
        '⚠️ "localeSet" is invalid. The keys must consist of supportedLocales and value must be an translation object'
      );
    }

    if (isNoDefaultInSupported) {
      throw new NoDefaultLocaleInSupportedLocalesError(
        '⚠️ There is no "defaultLocale" in "supportedLocales"'
      );
    }
  }
}
