'use client';

import { createI18nStore } from './createI18nStore';
import { IntlProvider, IntlProviderProps } from './IntlProvider';
import { useTranslation } from './useTranslation';

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
