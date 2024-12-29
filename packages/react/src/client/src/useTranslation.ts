import {
  MessageDescriptor,
  ResolvedIntlConfig,
  createIntlCache,
  createIntl,
  useIntl,
  IntlShape,
} from 'react-intl';
import { I18nStore } from '@sheet-i18n/react-core';

const intlCache = createIntlCache();

type UseIntlParams<D = MessageDescriptor> =
  Parameters<IntlShape['$t']> extends [D, ...infer R]
    ? [...R, Omit<D, 'id'>]
    : never;
type $TParams = Partial<UseIntlParams>;
type BigIntExcludedValues =
  $TParams[0] extends Record<string, infer V>
    ? Record<string, Exclude<V, bigint>>
    : never;
type BigIntExcludedReactNode = Exclude<React.ReactNode, bigint>;

interface UseTranslationParams<
  TSupportedLocales extends readonly string[],
  TLocaleSet extends Record<TSupportedLocales[number], Record<string, any>>,
  TSheetTitle = keyof TLocaleSet[TSupportedLocales[number]],
> {
  sheetTitle: TSheetTitle;
  i18nStore: I18nStore<TSupportedLocales, TLocaleSet>;
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
    TValues extends BigIntExcludedValues,
    TOpts extends $TParams[1],
    TDescriptor extends $TParams[2],
  >(
    id: TMessageId,
    values?: TValues,
    opts?: TOpts,
    _descriptor?: TDescriptor
  ) => {
    const descriptor = { ...(_descriptor ?? {}), id } as MessageDescriptor;

    return newIntl.$t<BigIntExcludedReactNode>(descriptor, values, opts);
  };

  return { t };
}
