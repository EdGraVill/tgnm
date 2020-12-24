import { Command, flags } from '@oclif/command';
import { bgGreen, bgRed, bgYellow, black } from 'chalk';
import { readdir, readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { extractVariablesFromEnv, generatei18nTemplateFile } from './addLocale';

export default class SetDefaultLocale extends Command {
  static description = 'Set a default locale';

  static examples = [
    `$ yarn tgnm setDefaultLocale es-MX
es-MX is now the default locale
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'locale', required: true }];

  async run() {
    const envFile = await promisify(readFile)('.env', { encoding: 'utf8' });
    const env = extractVariablesFromEnv(envFile);

    const {
      args: { locale },
    } = this.parse(SetDefaultLocale);

    if (env.DEFAULT_LOCALE === locale) {
      return console.info(black(bgYellow(` ${locale} is already the default locale `)));
    }

    const supportedLocales = env.LOCALES.split(',').map((locale) => locale.trim());

    if (!supportedLocales.includes(locale)) {
      return console.error(black(bgRed(` ${locale} is not a supported locale. Try adding it `)));
    }

    let newEnvFile = envFile.replace(
      `LOCALES=${env.LOCALES}`,
      `LOCALES=${
        supportedLocales.includes(locale) ? supportedLocales.join(',') : [...supportedLocales, locale].join(',')
      }`,
    );

    newEnvFile = newEnvFile.replace(`DEFAULT_LOCALE=${env.DEFAULT_LOCALE}`, `DEFAULT_LOCALE=${locale}`);

    let localeContent = await promisify(readFile)(`src/i18n/${locale}.ts`, { encoding: 'utf8' });
    localeContent = localeContent.replace(`import { LangType } from './${env.DEFAULT_LOCALE}';\n\n`, '');
    localeContent = localeContent.replace('const lang: LangType', 'const lang');
    localeContent = localeContent.replace(
      'export default lang;',
      'export type LangType = typeof lang;\n\nexport default lang;',
    );

    await promisify(writeFile)(`src/i18n/${locale}.ts`, localeContent);
    await promisify(writeFile)('src/i18n/index.ts', generatei18nTemplateFile(locale, supportedLocales));
    await promisify(writeFile)('.env', newEnvFile);

    let defaultContent = await promisify(readFile)(`src/i18n/${env.DEFAULT_LOCALE}.ts`, { encoding: 'utf8' });
    defaultContent = defaultContent.replace('\n\nexport type LangType = typeof lang;', '');
    defaultContent = defaultContent.replace('const lang', 'const lang: LangType');

    await promisify(writeFile)(
      `src/i18n/${env.DEFAULT_LOCALE}.ts`,
      `import { LangType } from './${locale}';\n\n${defaultContent}`,
    );

    const otherLocales = (await promisify(readdir)('src/i18n'))
      .map((file) => file.replace('.ts', ''))
      .filter((file) => file !== 'index' && file !== locale && file !== env.DEFAULT_LOCALE);

    await Promise.all(
      otherLocales.map(async (otherLocale) => {
        const otherContent = await promisify(readFile)(`src/i18n/${otherLocale}.ts`, { encoding: 'utf8' });

        await promisify(writeFile)(`src/i18n/${otherLocale}.ts`, otherContent.replace(env.DEFAULT_LOCALE, locale));
      }),
    );

    console.info(black(bgGreen(` ${locale} is now the default locale `)));
  }
}
