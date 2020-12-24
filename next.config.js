module.exports = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  i18n: {
    locales: process.env.LOCALES.split(',').map((locale) => locale.trim()),
    defaultLocale: process.env.DEFAULT_LOCALE,
  },
});
