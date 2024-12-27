'use client';

import { validator } from '@sheet-i18n/shared-utils';

import { createI18nStore } from './createI18nStore';
import { IntlProvider, IntlProviderProps } from './IntlProvider';
import { useTranslation } from './useTranslation';
import { InvalidI18nContextStateError } from './Errors';

export interface I18nContextState<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
> {
  supportedLocales: Readonly<TSupportedLocales>;
  defaultLocale: TSupportedLocales[number];
  localeSet: TLocaleSet;
}

export function createI18nContext<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
>(
  i18nStore: ReturnType<typeof createI18nStore<TSupportedLocales, TLocaleSet>>
) {
  if (validator.isNullish(i18nStore)) {
    throw new InvalidI18nContextStateError(
      '⚠️ no i18nStore provided. To use createI18nContext, you must provide an i18nStore as a parameter'
    );
  }

  const IntlProviderImpl = ({
    currentLocale,
    children,
  }: Omit<IntlProviderProps<TSupportedLocales, TLocaleSet>, 'i18nStore'>) => (
    <IntlProvider currentLocale={currentLocale} i18nStore={i18nStore}>
      {children}
    </IntlProvider>
  );

  const useTranslationImpl = <
    SheetTitle extends keyof TLocaleSet[TSupportedLocales[number]],
  >(
    sheetTitle: SheetTitle
  ): ReturnType<
    typeof useTranslation<
      TSupportedLocales,
      TLocaleSet,
      SheetTitle,
      keyof TLocaleSet[TSupportedLocales[number]][SheetTitle]
    >
  > => useTranslation({ sheetTitle, i18nStore });

  return {
    IntlProvider: IntlProviderImpl,
    useTranslation: useTranslationImpl,
  };
}
