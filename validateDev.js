/* eslint-disable @typescript-eslint/no-var-requires */
const { stat, readFile } = require('fs');
const { promisify } = require('util');
const chalk = require('chalk');

const extractVariablesFromEnv = (content) =>
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

async function validateEnv() {
  try {
    await promisify(stat)('./.env');

    const envFile = await promisify(readFile)('./.env', { encoding: 'utf8' });
    extractVariablesFromEnv(envFile);
  } catch (error) {
    throw new Error('Missing .env file, create one in the root of the project based on .env.template');
  }
}

async function validateLocaleFiles() {
  const envFile = await promisify(readFile)('./.env', { encoding: 'utf8' });
  const env = extractVariablesFromEnv(envFile);

  const supportedLocales = env.LOCALES.split(',').map((locale) => locale.trim());

  const results = await Promise.all(
    supportedLocales.map(async (locale) => {
      try {
        await promisify(stat)(`./src/i18n/${locale}.ts`);

        return '';
      } catch (error) {
        return locale;
      }
    }),
  );

  const missingLocales = results.filter(Boolean);

  if (missingLocales.length) {
    throw new Error(
      `Missing i18n file for: ${missingLocales.join(
        ', ',
      )}. Create the file in src/i18n/ and make sure to include all the supported paths`,
    );
  }
}

async function main() {
  try {
    await validateEnv();
    await validateLocaleFiles();
  } catch (error) {
    console.log(chalk.red(error.message));

    return process.exit(1);
  }
}

main();
