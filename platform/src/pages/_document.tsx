import { Html, Head, Main, NextScript } from 'next/document';

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AutoDev — GitHub Profile Analyzer & README Generator',
  description:
    'Analyze any GitHub profile with a score out of 100, generate beautiful READMEs in 3 styles, and auto-commit your code with a free CLI agent. No login, no database.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://autodev-kappa.vercel.app',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:site_name" content="AutoDev" />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
