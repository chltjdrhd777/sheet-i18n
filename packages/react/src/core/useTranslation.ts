import {
  MessageDescriptor,
  ResolvedIntlConfig,
  createIntlCache,
  createIntl,
  useIntl,
  IntlShape,
} from 'react-intl';

import { createI18nStore } from './createI18nStore';

const intlCache = createIntlCache();

type UseIntlParams<D = MessageDescriptor> =
  Parameters<IntlShape['$t']> extends [D, ...infer R]
    ? [...R, Omit<D, 'id'>]
    : never;
type $TParams = Partial<UseIntlParams>;

interface UseTranslationParams<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
  TSheetTitle = keyof TLocaleSet[TSupportedLocales[number]],
> {
  sheetTitle: TSheetTitle;
  i18nStore: ReturnType<typeof createI18nStore<TSupportedLocales, TLocaleSet>>;
}

export function useTranslation<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
  TSheetTitle extends keyof TLocaleSet[TSupportedLocales[number]],
  TMessageId extends keyof TLocaleSet[TSupportedLocales[number]][TSheetTitle],
>({
  sheetTitle,
}: UseTranslationParams<TSupportedLocales, TLocaleSet, TSheetTitle>) {
  const currentIntl = useIntl();
  const totalMessages = currentIntl.messages;
  const targetMessages = totalMessages[
    sheetTitle
  ] as unknown as ResolvedIntlConfig['messages'];

  const newIntl = createIntl(
    { ...currentIntl, messages: targetMessages },
    intlCache
  );

  const t = <
    TValues extends $TParams['0'],
    TOpts extends $TParams['1'],
    T_Descriptor extends $TParams['2'],
  >(
    id: TMessageId,
    values?: TValues,
    opts?: TOpts,
    _descriptor?: T_Descriptor
  ) => {
    const descriptor = { ...(_descriptor ?? {}), id } as MessageDescriptor;

    return newIntl.$t<TValues[keyof TValues]>(descriptor, values, opts);
  };

  return { t };
}
