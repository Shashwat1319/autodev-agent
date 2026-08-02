import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <Analytics />
    </ErrorBoundary>
  );
}
