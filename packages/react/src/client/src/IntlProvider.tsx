import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { I18nStore } from '@sheet-i18n/react-core';

export type IntlProviderProps<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
> = {
  i18nStore: I18nStore<TSupportedLocales, TLocaleSet>;
  currentLocale: TSupportedLocales[number];
  children: React.ReactNode;
};

export function IntlProvider<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
>({
  i18nStore,
  currentLocale,
  children,
}: IntlProviderProps<TSupportedLocales, TLocaleSet>) {
  const { defaultLocale, localeSet } = i18nStore;
  const locale = currentLocale ?? defaultLocale;

  return (
    <ReactIntlProvider
      locale={locale}
      messages={
        localeSet[currentLocale] as unknown as Record<
          TSupportedLocales[number],
          any
        >
      }
    >
      {children}
    </ReactIntlProvider>
  );
}
