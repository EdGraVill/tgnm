import { Command, flags } from '@oclif/command';
import { bgGreen, bgYellow, black } from 'chalk';
import { readdir, readFile, writeFile } from 'fs';
import { promisify } from 'util';
import generatei18nTemplateFile from '../util/generatei18nTemplateFile';

export const extractVariablesFromEnv = (content: string): { [key: string]: string } =>
  content
    .split('\n')
    .filter((line) => line && line[0] !== '#')
    .map((line) => line.trim().split('='))
    .reduce(
      (prev, [key, value]) => ({
        ...prev,
        [key]: value,
      }),
      {},
    );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const jsStringify = (object: Record<string, any>, preserve = false, level = 1) => {
  let string = '{\n';

  const tab = '  '.repeat(level);

  Object.keys(object).forEach((key) => {
    if (object[key] instanceof Array) {
      string += `${tab}${key}: ${JSON.stringify(object[key])},\n`;
    } else if (typeof object[key] === 'object') {
      string += `${tab}${key}: ${jsStringify(object[key], preserve, level + 1)}`;
    } else if (typeof object[key] === 'string') {
      string += `${tab}${key}: '${preserve ? object[key] : 'Pending translation'}',\n`;
    } else {
      string += `${tab}${key}: ${JSON.stringify(object[key])},\n`;
    }
  });

  string += level === 1 ? '};\n' : `${'  '.repeat(level - 1)}},\n`;

  return string;
};

export default class AddLocale extends Command {
  static description = 'Create a i18n file for a specific locale';

  static examples = [
    `$ yarn tgnm addLocale es-MX
Creating es-MX.ts from en-US.ts
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    defaultLocale: flags.boolean({ char: 'D', default: false, description: 'Set this locale as default locale' }),
    force: flags.boolean({ char: 'F', default: false, description: 'Force to re-create files for an existing locale' }),
    preserve: flags.boolean({ char: 'p', default: false, description: 'Preserve default locale translation text' }),
  };

  static args = [{ name: 'locale', required: true }];

  async run() {
    const envFile = await promisify(readFile)('.env', { encoding: 'utf8' });
    const env = extractVariablesFromEnv(envFile);

    const {
      args: { locale },
      flags: { force, defaultLocale, preserve },
    } = this.parse(AddLocale);

    const supportedLocales = env.LOCALES.split(',').map((locale) => locale.trim());

    if (supportedLocales.includes(locale) && !force) {
      return console.info(
        black(
          bgYellow(
            ` Locale ${locale} already exist. If you think this is a mistake, --force to re-create files. This will erase all the content for an already-exist file. \n To switch default locale use "yarn tgnm setDefaultLocale [LOCALE]" `,
          ),
        ),
      );
    }

    let newEnvFile = envFile.replace(
      `LOCALES=${env.LOCALES}`,
      `LOCALES=${
        supportedLocales.includes(locale) ? supportedLocales.join(',') : [...supportedLocales, locale].join(',')
      }`,
    );

    if (defaultLocale) {
      newEnvFile = newEnvFile.replace(`DEFAULT_LOCALE=${env.DEFAULT_LOCALE}`, `DEFAULT_LOCALE=${locale}`);
    }

    const defaultLocaleContent = (await import(`../../../src/i18n/${env.DEFAULT_LOCALE}.ts`)).default;

    let newLocaleContent = '';

    if (!defaultLocale) {
      newLocaleContent = `import { LangType } from './${env.DEFAULT_LOCALE}';\n\nconst lang: LangType = ${jsStringify(
        defaultLocaleContent,
        preserve,
      )}\nexport default lang;\n`;
    } else {
      newLocaleContent = `const lang = ${jsStringify(
        defaultLocaleContent,
        preserve,
      )}\nexport type LangType = typeof lang;\n\nexport default lang;\n`;
    }

    await promisify(writeFile)(`src/i18n/${locale}.ts`, newLocaleContent);
    await promisify(writeFile)(
      'src/i18n/index.ts',
      generatei18nTemplateFile(
        defaultLocale ? locale : env.DEFAULT_LOCALE,
        supportedLocales.includes(locale) ? supportedLocales : [...supportedLocales, locale],
      ),
    );
    await promisify(writeFile)('.env', newEnvFile);

    if (defaultLocale && env.DEFAULT_LOCALE !== locale) {
      let content = await promisify(readFile)(`src/i18n/${env.DEFAULT_LOCALE}.ts`, { encoding: 'utf8' });
      content = content.replace('\n\nexport type LangType = typeof lang;', '');
      content = content.replace('const lang', 'const lang: LangType');

      await promisify(writeFile)(
        `src/i18n/${env.DEFAULT_LOCALE}.ts`,
        `import { LangType } from './${locale}';\n\n${content}`,
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
    }

    console.info(black(bgGreen(` Created ${locale}.ts from ${env.DEFAULT_LOCALE}.ts `)));
  }
}
