export default function PHBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-2 sm:gap-3">
        <span className="text-lg">🚀</span>
        <p className="text-xs sm:text-sm text-gray-300">
          We&apos;re live on{' '}
          <a
            href="https://www.producthunt.com/products/autodev-2"
            target="_blank" rel="noopener noreferrer"
            className="text-orange-400 font-semibold hover:text-orange-300 transition"
          >
            Product Hunt
          </a>
          <span className="hidden sm:inline"> — support us with an upvote!</span>
        </p>
        <a
          href="https://www.producthunt.com/products/autodev-2"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition whitespace-nowrap"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H7v2h4v-2zm6 0h-4v2h4v-2z"/></svg>
          Upvote
        </a>
      </div>
    </div>
  );
}
