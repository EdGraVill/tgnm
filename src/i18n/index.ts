import { DottedLanguageObjectStringPaths } from '../types';
import { getObjectPaths } from '../util';
import enUS, { LangType } from './en-US';

export type LangPath = DottedLanguageObjectStringPaths<LangType>;

const locales = {
  'en-US': async () => (await import('./en-US')).default,
};

export async function loadLocale(locale: keyof typeof locales) {
  const language = await locales[locale]();

  return (path: LangPath): string => path.split('.').reduce((prev, curr) => prev[curr], language);
}

export const langPathList = getObjectPaths(enUS);

export const langPaths = langPathList.reduce(
  (prev, curr) => ({
    ...prev,
    [curr]: curr,
  }),
  {},
) as Record<LangPath, string>;

export const i18n = (path: LangPath) => langPaths[path];
