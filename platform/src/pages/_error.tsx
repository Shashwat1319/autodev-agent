import * as Sentry from '@sentry/nextjs';
import type { NextPageContext } from 'next';
import Link from 'next/link';

ErrorPage.getInitialProps = async (ctx: NextPageContext) => {
  const { statusCode } = ctx.res || { statusCode: 500 };
  const err = ctx.err;
  if (err) {
    Sentry.captureException(err);
  }
  return { statusCode };
};

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-orange-600 flex items-center justify-center text-2xl font-bold text-black mx-auto mb-4">
          !
        </div>
        <h1 className="text-xl font-bold mb-2">
          {statusCode || 'Error'}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {statusCode === 404
            ? 'This page does not exist.'
            : 'An unexpected error occurred. Our team has been notified.'}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
