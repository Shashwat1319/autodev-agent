import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import PHBanner from './PHBanner';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/readme-generator', label: 'README' },
  { href: '/dashboard?user=Shashwat1319', label: 'Pro' },
];

const HOME_EXTRA = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
];

export default function Layout({
  children,
  currentPage,
  subtitle,
  showHomeLinks,
}: {
  children: ReactNode;
  currentPage: string;
  subtitle?: string;
  showHomeLinks?: boolean;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    if (!mobileMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenu(false);
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mobileMenu]);

  const isActive = (href: string) => currentPage === href
    ? 'text-cyan-400 font-medium'
    : 'text-gray-400 hover:text-white transition';

  return (
    <>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-500 focus:text-white focus:text-sm focus:font-semibold">
        Skip to content
      </a>
      <header className="fixed top-0 left-0 right-0 z-50" role="banner">
        <div className="glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-black group-hover:scale-105 transition">A</div>
              <span className="text-lg font-bold">
                <span className="text-cyan-400">{'{'}</span>AutoDev<span className="text-cyan-400">{'}'}</span>
              </span>
              {subtitle && <span className="text-xs text-gray-500 ml-2 hidden sm:inline">{subtitle}</span>}
            </Link>
            <nav className="hidden md:flex items-center gap-4 sm:gap-6 text-sm" aria-label="Main navigation">
              {showHomeLinks && HOME_EXTRA.map(l => (
                <a key={l.href} href={l.href} className="text-gray-400 hover:text-white transition">{l.label}</a>
              ))}
              {NAV_LINKS.filter(l => showHomeLinks || l.href !== '/').map(l => (
                <Link key={l.href} href={l.href} className={`text-xs ${isActive(l.href)}`}>{l.label}</Link>
              ))}
              {showHomeLinks && (
                <a href="https://github.com/Shashwat1319/autodev-agent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              )}
            </nav>
            <div className="md:hidden flex items-center gap-2">
              {showHomeLinks && (
                <a href="https://github.com/Shashwat1319/autodev-agent" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              )}
              <button aria-label={mobileMenu ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(v => !v)} className="text-gray-400 hover:text-white transition p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenu ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
              </button>
            </div>
          </div>
        </div>
        <PHBanner />
      </header>

      {mobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileMenu(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass rounded-b-2xl p-6 pt-28" onClick={e => e.stopPropagation()}>
            <nav className="flex flex-col gap-4 text-center" aria-label="Mobile navigation">
              {(showHomeLinks
                ? [...HOME_EXTRA, ...NAV_LINKS.filter(l => l.href !== '/')]
                : NAV_LINKS
              ).map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileMenu(false)}
                  className="text-lg font-medium text-gray-300 hover:text-white transition">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

        <div className="min-h-screen bg-[#0a0f1e] text-white" role="presentation">
          {children}
        </div>
    </>
  );
}
