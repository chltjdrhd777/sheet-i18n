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
  const locale = currentLocale ?? detectClientLanguage(i18nStore);

  return (
    <ReactIntlProvider
      locale={locale}
      messages={
        i18nStore?.localeSet[locale] as unknown as Record<
          TSupportedLocales[number],
          any
        >
      }
    >
      {children}
    </ReactIntlProvider>
  );
}

function detectClientLanguage<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
>(
  i18nStore: I18nStore<TSupportedLocales, TLocaleSet>
): TSupportedLocales[number] {
  const { defaultLocale, supportedLocales } = i18nStore;

  if (typeof navigator !== 'undefined' && navigator?.languages) {
    const preferredLocale = navigator.languages.find((lang) =>
      supportedLocales.includes(lang as TSupportedLocales[number])
    );

    return (preferredLocale as TSupportedLocales[number]) ?? defaultLocale;
  }

  return defaultLocale ?? '';
}
