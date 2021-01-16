import i18next from 'i18next';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { locales, Translator } from '../../i18n';
import { isProdEnv } from '../../util';

const TranslatorContext = createContext<Translator>(() => '');

export interface TranslatorProviderProps {
  locale: keyof typeof locales;
}

export function TranslatorProvider({ children, locale }: Required<PropsWithChildren<TranslatorProviderProps>>) {
  const [isFetchingLanguage, setFetchingLanguage] = useState(true);
  const [translator, setTranslator] = useState<Translator>(() => () => '');

  useEffect(() => {
    setFetchingLanguage(true);

    locales[locale]()
      .then((translation) =>
        i18next.init({
          lng: locale,
          debug: !isProdEnv,
          resources: { [locale]: { translation } },
        }),
      )
      .then((t) => {
        setTranslator(() => t);
      });
  }, [locale]);

  useEffect(() => setFetchingLanguage(false), [translator]);

  if (isFetchingLanguage) {
    return null;
  }

  return <TranslatorContext.Provider value={translator}>{children}</TranslatorContext.Provider>;
}

export function useTranslator(): Translator {
  const translator = useContext(TranslatorContext);

  return translator;
}
