import React from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMenu: () => void;
  onOpenGetStarted: () => void;
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenMenu,
  onOpenGetStarted,
  isDark = false,
}) => {
  return (
    <header className={`sticky top-0 z-40 transition-colors backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between ${
      isDark 
        ? 'bg-[#131722]/95 border-[#2a2e39] text-[#d1d4dc]' 
        : 'bg-white/95 border-[#f0f3fa] text-[#131722]'
    }`}>
      {/* Left: Navigation Hamburger & TradingView Wordmark */}
      <div className="flex items-center space-x-3.5">
        <button 
          onClick={onOpenMenu}
          aria-label="Open Navigation Menu" 
          className={`p-1 focus:outline-none transition-colors rounded-lg ${
            isDark ? 'hover:bg-[#2a2e39] text-white' : 'hover:text-[#2962ff] text-[#131722]'
          }`}
        >
          <svg className="w-6 h-6 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* TradingView Geometric Wordmark / Logo */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="TradingView Home" 
          className="flex items-center space-x-1.5 focus:outline-none group"
        >
          <svg 
            className={`h-6 w-auto transition-transform group-hover:scale-105 ${
              isDark ? 'text-white' : 'text-[#131722]'
            }`} 
            fill="currentColor" 
            viewBox="0 0 36 28"
          >
            {/* TradingView iconic glyph */}
            <rect height="28" rx="2" width="8" x="0" y="0"></rect>
            <path d="M12 0h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H12V0z"></path>
            <path d="M26 12h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-8V12z"></path>
            <path d="M12 20h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8v-8z"></path>
          </svg>
        </button>
      </div>

      {/* Right: Search & Get Started CTA */}
      <div className="flex items-center space-x-2.5">
        <button 
          onClick={onOpenSearch}
          aria-label="Search markets" 
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${
            isDark 
              ? 'hover:bg-[#2a2e39] text-[#d1d4dc] hover:text-white' 
              : 'hover:bg-[#f0f3fa] text-[#131722] hover:text-[#2962ff]'
          }`}
        >
          <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Get Started Button with signature gradient */}
        <button 
          onClick={onOpenGetStarted}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-[#2962ff] to-[#7c3aed] shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
