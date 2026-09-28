import React from 'react';

export type TabType = 'markets' | 'watchlist' | 'ideas' | 'news' | 'menu';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  watchlistCount?: number;
  isDark?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  watchlistCount = 0,
  isDark = false,
}) => {
  return (
    <nav 
      aria-label="Bottom Navigation" 
      className={`fixed bottom-0 inset-x-0 backdrop-blur-md border-t px-4 py-2 flex items-center justify-around z-40 text-[10px] font-medium transition-colors ${
        isDark 
          ? 'bg-[#131722]/95 border-[#2a2e39] text-[#787b86]' 
          : 'bg-white/95 border-[#e0e3eb] text-[#787b86]'
      }`}
    >
      {/* Markets Tab */}
      <button
        onClick={() => onTabChange('markets')}
        className={`flex flex-col items-center space-y-1 transition-colors relative py-0.5 px-2 ${
          activeTab === 'markets' 
            ? 'text-[#2962ff] font-semibold' 
            : isDark ? 'hover:text-[#d1d4dc]' : 'hover:text-[#131722]'
        }`}
      >
        <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Markets</span>
      </button>

      {/* Watchlist Tab */}
      <button
        onClick={() => onTabChange('watchlist')}
        className={`flex flex-col items-center space-y-1 transition-colors relative py-0.5 px-2 ${
          activeTab === 'watchlist' 
            ? 'text-[#2962ff] font-semibold' 
            : isDark ? 'hover:text-[#d1d4dc]' : 'hover:text-[#131722]'
        }`}
      >
        <div className="relative">
          <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {watchlistCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#2962ff] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </div>
        <span>Watchlist</span>
      </button>

      {/* Ideas / Charts Tab */}
      <button
        onClick={() => onTabChange('ideas')}
        className={`flex flex-col items-center space-y-1 transition-colors relative py-0.5 px-2 ${
          activeTab === 'ideas' 
            ? 'text-[#2962ff] font-semibold' 
            : isDark ? 'hover:text-[#d1d4dc]' : 'hover:text-[#131722]'
        }`}
      >
        <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Ideas</span>
      </button>

      {/* News Tab */}
      <button
        onClick={() => onTabChange('news')}
        className={`flex flex-col items-center space-y-1 transition-colors relative py-0.5 px-2 ${
          activeTab === 'news' 
            ? 'text-[#2962ff] font-semibold' 
            : isDark ? 'hover:text-[#d1d4dc]' : 'hover:text-[#131722]'
        }`}
      >
        <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>News</span>
      </button>

      {/* Menu Tab */}
      <button
        onClick={() => onTabChange('menu')}
        className={`flex flex-col items-center space-y-1 transition-colors relative py-0.5 px-2 ${
          activeTab === 'menu' 
            ? 'text-[#2962ff] font-semibold' 
            : isDark ? 'hover:text-[#d1d4dc]' : 'hover:text-[#131722]'
        }`}
      >
        <svg className="w-5 h-5 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Menu</span>
      </button>
    </nav>
  );
};
