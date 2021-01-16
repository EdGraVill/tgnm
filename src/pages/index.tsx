import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslator } from '../client';
import styles from '../styles/Home.module.css';

export default function Home() {
  const t = useTranslator();
  const { locale } = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>TGNM</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {t('client.index.welcomeTo')} <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          {t('client.index.getStarted')} <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>{t('client.index.documentation.title')} &rarr;</h3>
            <p>{t('client.index.documentation.description')}</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h3>{t('client.index.learn.title')} &rarr;</h3>
            <p>{t('client.index.learn.description')}</p>
          </a>

          <a href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
            <h3>{t('client.index.examples.title')} &rarr;</h3>
            <p>{t('client.index.examples.description')}</p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h3>{t('client.index.deploy.title')} &rarr;</h3>
            <p>{t('client.index.deploy.description')}</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link href="/" locale={locale === 'en-US' ? 'es-MX' : 'en-US'}>
          <a>
            {t('client.index.otherLangage')}
            <span>
              {globalThis?.location?.href || ''}
              {locale === 'en-US' ? 'es-MX' : ''}
            </span>
          </a>
        </Link>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('client.index.poweredBy')} <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
