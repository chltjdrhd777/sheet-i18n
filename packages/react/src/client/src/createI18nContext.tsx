import { validator } from '@sheet-i18n/shared-utils';
import { I18nStore } from '@sheet-i18n/react-core';

import { IntlProvider, IntlProviderProps } from './IntlProvider';
import { useTranslation } from './useTranslation';
import {
  InvalidI18nContextStateError,
  IsNotInstanceOfI18nStoreError,
} from './Errors';

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
>(i18nStore: I18nStore<TSupportedLocales, TLocaleSet>) {
  if (validator.isNullish(i18nStore)) {
    throw new InvalidI18nContextStateError(
      '⚠️ no i18nStore provided. To use createI18nContext, you must provide an i18nStore as a parameter'
    );
  }

  if (i18nStore instanceof I18nStore !== true) {
    throw new IsNotInstanceOfI18nStoreError(
      '⚠️ The provided i18nStore is invalid. Please ensure a store instance you passed is an instance of I18nStore.'
    );
  }

  const IntlProviderImpl = ({
    currentLocale,
    children,
  }: Omit<
    IntlProviderProps<TSupportedLocales, TLocaleSet>,
    'currentLocale' | 'i18nStore'
  > & { currentLocale?: string }) => (
    <IntlProvider
      currentLocale={currentLocale as TSupportedLocales[number]}
      i18nStore={i18nStore}
    >
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
