import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { BASE_URL } from '../lib/config';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 — Page Not Found | AutoDev</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="canonical" href={`${BASE_URL}/404`} />
        <meta name="description" content="Page not found. The AutoDev page you are looking for does not exist or has been moved." />
        <meta property="og:title" content="404 — Page Not Found | AutoDev" />
        <meta property="og:description" content="The page you are looking for does not exist or has been moved." />
        <meta property="og:image" content={`${BASE_URL}/api/og`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`${BASE_URL}/404`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex" />
      </Head>
      <Layout currentPage="">
        <main id="main-content" className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center text-4xl font-bold text-cyan-400 mx-auto mb-6">
              404
            </div>
            <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
            <p className="text-gray-400 text-sm mb-8">
              This page does not exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
              >
                Go to Homepage
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 glass text-gray-300 px-6 py-3 rounded-xl hover:bg-white/[0.08] transition text-sm"
              >
                Open Dashboard
              </Link>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
