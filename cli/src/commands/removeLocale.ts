import { Command, flags } from '@oclif/command';
import { bgGreen, bgRed, bgYellow, black } from 'chalk';
import { readFile, unlink, writeFile } from 'fs';
import { promisify } from 'util';
import generatei18nTemplateFile from '../util/generatei18nTemplateFile';
import { extractVariablesFromEnv } from './addLocale';

export default class RemoveLocale extends Command {
  static description = 'Remove a locale';

  static examples = [
    `$ yarn tgnm removeLocale es-MX
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
    } = this.parse(RemoveLocale);

    if (env.DEFAULT_LOCALE === locale) {
      return console.info(
        black(bgYellow(` ${locale} is the default locale. Change the default locale before remove it `)),
      );
    }

    const supportedLocales = env.LOCALES.split(',').map((locale) => locale.trim());

    if (!supportedLocales.includes(locale)) {
      return console.error(black(bgRed(` ${locale} is not a supported locale `)));
    }

    const newSupportedLocales = supportedLocales.filter((l) => l !== locale);

    const newEnvFile = envFile.replace(`LOCALES=${env.LOCALES}`, `LOCALES=${newSupportedLocales}`);

    await promisify(unlink)(`src/i18n/${locale}.ts`);
    await promisify(writeFile)('src/i18n/index.ts', generatei18nTemplateFile(env.DEFAULT_LOCALE, newSupportedLocales));
    await promisify(writeFile)('.env', newEnvFile);

    console.info(black(bgGreen(` ${locale} removed `)));
  }
}
