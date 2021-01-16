import { AppProps } from 'next/app';
import { TranslatorProvider } from '../client';
import { locales } from '../i18n';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const locale = router.locale as keyof typeof locales;

  return (
    <TranslatorProvider locale={locale}>
      <Component {...pageProps} />
    </TranslatorProvider>
  );
}
