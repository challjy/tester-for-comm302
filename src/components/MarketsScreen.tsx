import React, { useState } from 'react';
import { MarketItem, AssetCategory } from '../types/market';

interface MarketsScreenProps {
  marketItems: MarketItem[];
  onSelectTicker: (item: MarketItem) => void;
  isDark?: boolean;
}

export const MarketsScreen: React.FC<MarketsScreenProps> = ({
  marketItems,
  onSelectTicker,
  isDark = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('Indices');
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('everywhere');
  const [trendingTab, setTrendingTab] = useState<'gainers' | 'losers'>('gainers');

  // Categories list exactly matching screenshot
  const categories: AssetCategory[] = [
    'Indices',
    'Futures',
    'Forex',
    'Government bonds',
    'Crypto',
    'US stocks',
    'World stocks',
  ];

  const regions = [
    { id: 'everywhere', label: 'Markets, everywhere' },
    { id: 'americas', label: 'Americas' },
    { id: 'europe', label: 'Europe' },
    { id: 'asia', label: 'Asia-Pacific' },
    { id: 'crypto', label: 'Crypto & Web3' },
  ];

  // Specific groups
  const keyIndices = marketItems.filter(item => 
    ['sp500', 'nasdaq100', 'dow30', 'russell2000'].includes(item.id)
  );

  const worldIndices = marketItems.filter(item => 
    ['ni225', 'ukx', 'dax', 'hsi'].includes(item.id)
  );

  const usStocks = marketItems.filter(item => 
    ['nvda', 'aapl', 'msft', 'googl', 'amzn'].includes(item.id)
  );

  const trendingGainers = marketItems.filter(item => 
    ['tsla', 'amd', 'btcusd', 'pltr', 'coin'].includes(item.id)
  );

  const trendingLosers = marketItems.filter(item => 
    ['intc', 'ba', 'ethusd', 'nke'].includes(item.id)
  );

  // If user selected specific filter tab other than Indices
  const isFiltered = selectedCategory !== 'Indices';
  const filteredItems = isFiltered 
    ? marketItems.filter(item => item.category === selectedCategory)
    : [];

  return (
    <main className={`w-full pb-28 transition-colors ${isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'}`}>
      {/* Title Section with Dropdown */}
      <section className="px-4 pt-5 pb-2 relative">
        <div className="relative inline-block text-left">
          <button 
            onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
            aria-label="Select market category" 
            className="flex items-center space-x-1.5 text-left group focus:outline-none cursor-pointer"
          >
            <h1 className={`text-[26px] tracking-tight font-extrabold leading-tight ${
              isDark ? 'text-white' : 'text-[#131722]'
            }`}>
              {regions.find(r => r.id === currentRegion)?.label || 'Markets, everywhere'}
            </h1>
            <svg 
              className={`w-5 h-5 stroke-[2.5] transform transition-transform mt-0.5 ${
                regionDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
              } ${isDark ? 'text-white' : 'text-[#131722]'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="m19.5 8.25-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Region Dropdown Menu */}
          {regionDropdownOpen && (
            <div className={`absolute left-0 mt-2 w-64 rounded-xl shadow-xl border z-30 py-2 animate-in fade-in zoom-in-95 duration-100 ${
              isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
            }`}>
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#787b86]">
                Market Region
              </div>
              {regions.map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    setCurrentRegion(reg.id);
                    setRegionDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors ${
                    currentRegion === reg.id
                      ? isDark ? 'bg-[#2962ff]/20 text-[#2962ff] font-semibold' : 'bg-[#2962ff]/10 text-[#2962ff] font-semibold'
                      : isDark ? 'text-[#d1d4dc] hover:bg-[#2a2e39]' : 'text-[#131722] hover:bg-[#f0f3fa]'
                  }`}
                >
                  <span>{reg.label}</span>
                  {currentRegion === reg.id && (
                    <svg className="w-4 h-4 text-[#2962ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Tabs: Horizontally scrollable capsule filter navigation bar */}
      <nav 
        aria-label="Market Categories" 
        className={`border-y py-2 transition-colors sticky top-[53px] z-20 backdrop-blur-md ${
          isDark 
            ? 'border-[#2a2e39] bg-[#131722]/95' 
            : 'border-[#f0f3fa] bg-white/95'
        }`}
      >
        <div className="flex items-center space-x-2 px-4 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? 'bg-white text-[#131722] font-semibold shadow-sm'
                      : 'bg-[#131722] text-white font-semibold shadow-sm'
                    : isDark
                      ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39] font-medium'
                      : 'text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa] font-medium'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </nav>

      {/* If a dedicated category is selected (e.g. Futures, Forex, Bonds, Crypto) show filtered view */}
      {isFiltered ? (
        <section className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
              {selectedCategory}
            </h2>
            <button
              onClick={() => setSelectedCategory('Indices')}
              className="text-xs font-semibold text-[#2962ff] hover:underline"
            >
              Reset to all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectTicker(item)}
                className={`border rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                  isDark ? 'bg-[#1e222d] border-[#2a2e39] hover:border-[#363a45]' : 'bg-white border-[#e0e3eb] hover:border-[#b2b5be]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: item.badgeBgColor }}
                  >
                    {item.badgeText || item.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                      {item.symbol}
                    </div>
                    <div className="text-[11px] text-[#787b86]">
                      {item.name} · {item.exchange}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-base ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                    {item.currency === 'USD' ? '$' : ''}{item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 4 : 2 })}
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 ${item.change >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Key Major Indices Slider */}
          <section aria-label="Key Major Indices" className="pt-4 pb-2">
            <div className="flex space-x-3.5 px-4 overflow-x-auto no-scrollbar scroll-smooth">
              {keyIndices.map((item) => {
                const isPositive = item.change >= 0;
                return (
                  <article
                    key={item.id}
                    onClick={() => onSelectTicker(item)}
                    className={`min-w-[240px] max-w-[240px] border rounded-2xl p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0 cursor-pointer transition-all hover:border-[#2962ff] active:scale-[0.98] ${
                      isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2.5 mb-2">
                        <span 
                          className="w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                          style={{ backgroundColor: item.badgeBgColor }}
                        >
                          {item.badgeText}
                        </span>
                        <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                          {item.symbol}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                          {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className={`flex items-center text-xs font-semibold mt-0.5 ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          <span>
                            {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sparkline Chart */}
                    <div className="mt-4 h-12 w-full">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <defs>
                          <linearGradient id={`grad-${item.id}`} x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.28" />
                            <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {isPositive ? (
                          <>
                            <path d="M 0,32 Q 25,35 45,22 T 80,14 L 100,6 L 100,40 L 0,40 Z" fill={`url(#grad-${item.id})`} />
                            <path d="M 0,32 Q 25,35 45,22 T 80,14 L 100,6" fill="none" stroke="#089981" strokeWidth="2" strokeLinecap="round" />
                          </>
                        ) : (
                          <>
                            <path d="M 0,10 Q 30,8 55,24 T 80,26 L 100,34 L 100,40 L 0,40 Z" fill={`url(#grad-${item.id})`} />
                            <path d="M 0,10 Q 30,8 55,24 T 80,26 L 100,34" fill="none" stroke="#f23645" strokeWidth="2" strokeLinecap="round" />
                          </>
                        )}
                      </svg>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* World Indices Section */}
          <section className="mt-6">
            <div className="px-4 flex items-center justify-between mb-3">
              <button 
                onClick={() => setSelectedCategory('World stocks')}
                className="group inline-flex items-center space-x-1 cursor-pointer focus:outline-none"
              >
                <h2 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  World indices
                </h2>
                <svg className={`w-4 h-4 stroke-[2.5] transform group-hover:translate-x-0.5 transition-transform ${isDark ? 'text-white' : 'text-[#131722]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="flex space-x-3.5 px-4 overflow-x-auto no-scrollbar scroll-smooth">
              {worldIndices.map((item) => {
                const isPositive = item.change >= 0;
                return (
                  <article
                    key={item.id}
                    onClick={() => onSelectTicker(item)}
                    className={`min-w-[240px] max-w-[240px] border rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0 cursor-pointer transition-all hover:border-[#2962ff] active:scale-[0.98] ${
                      isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 mb-1.5">
                      <span 
                        className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: item.badgeBgColor }}
                      >
                        {item.badgeText}
                      </span>
                      <div>
                        <span className={`font-bold text-sm tracking-tight block leading-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                          {item.symbol}
                        </span>
                        <span className="text-[11px] text-[#787b86]">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-semibold mt-0.5 ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* US Stocks Section */}
          <section className="mt-7">
            <div className="px-4 flex items-center justify-between mb-3">
              <button 
                onClick={() => setSelectedCategory('US stocks')}
                className="group inline-flex items-center space-x-1.5 cursor-pointer focus:outline-none"
              >
                <span className="text-lg leading-none">🇺🇸</span>
                <h2 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  US stocks
                </h2>
                <svg className={`w-4 h-4 stroke-[2.5] transform group-hover:translate-x-0.5 transition-transform ${isDark ? 'text-white' : 'text-[#131722]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m8.25 4.5 7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="flex space-x-3.5 px-4 overflow-x-auto no-scrollbar scroll-smooth">
              {usStocks.map((item) => {
                const isPositive = item.change >= 0;
                return (
                  <article
                    key={item.id}
                    onClick={() => onSelectTicker(item)}
                    className={`min-w-[240px] max-w-[240px] border rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0 cursor-pointer transition-all hover:border-[#2962ff] active:scale-[0.98] ${
                      isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 mb-1.5">
                      {/* Logo badges */}
                      {item.logoType === 'nvidia' && (
                        <div className="w-7 h-7 rounded-full bg-[#76b900] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.74 8.77c0 .12-.02.24-.02.37 0 3.25 2.64 5.9 5.89 5.9.68 0 1.34-.12 1.95-.34.33-.12.56-.37.56-.72 0-.46-.38-.83-.84-.83-.16 0-.31.05-.44.13-.37.24-.81.38-1.28.38-1.39 0-2.52-1.13-2.52-2.52 0-.25.04-.49.1-.71.07-.26.04-.52-.11-.72-.16-.22-.42-.35-.7-.35-.29 0-.54.14-.69.36-.04.07-.06.15-.07.23z"></path>
                          </svg>
                        </div>
                      )}
                      {item.logoType === 'apple' && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          isDark ? 'bg-white text-black' : 'bg-black text-white'
                        }`}>
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.56.65-.96 1.7-.85 2.72 1 .08 2.02-.48 2.55-1.22z"></path>
                          </svg>
                        </div>
                      )}
                      {item.logoType === 'microsoft' && (
                        <div className="w-7 h-7 rounded-full bg-[#00a4ef] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M1 1h10v10H1zm12 0h10v10H13zM1 13h10v10H1zm12 0h10v10H13z"></path>
                          </svg>
                        </div>
                      )}
                      {item.logoType === 'text' && (
                        <div 
                          className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: item.badgeBgColor }}
                        >
                          {item.badgeText}
                        </div>
                      )}

                      <div>
                        <span className={`font-bold text-sm tracking-tight block leading-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#787b86]">
                          {item.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                        ${item.price.toFixed(2)}
                      </div>
                      <div className={`text-xs font-semibold mt-0.5 ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Trending Movers Section */}
          <section aria-label="Most Active Stocks Table" className="mt-8 px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                Trending Movers
              </h2>
              {/* Gainers / Losers Pills Toggle */}
              <div className={`flex items-center space-x-1 p-0.5 rounded-lg text-[11px] font-medium ${
                isDark ? 'bg-[#1e222d] text-[#787b86]' : 'bg-[#f0f3fa] text-[#787b86]'
              }`}>
                <button
                  onClick={() => setTrendingTab('gainers')}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-all ${
                    trendingTab === 'gainers'
                      ? isDark 
                        ? 'bg-[#2a2e39] text-white font-semibold shadow-xs' 
                        : 'bg-white text-[#131722] font-semibold shadow-xs'
                      : 'hover:text-[#131722]'
                  }`}
                >
                  Gainers
                </button>
                <button
                  onClick={() => setTrendingTab('losers')}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-all ${
                    trendingTab === 'losers'
                      ? isDark 
                        ? 'bg-[#2a2e39] text-white font-semibold shadow-xs' 
                        : 'bg-white text-[#131722] font-semibold shadow-xs'
                      : 'hover:text-[#131722]'
                  }`}
                >
                  Losers
                </button>
              </div>
            </div>

            {/* List Table Card */}
            <div className={`border rounded-2xl divide-y overflow-hidden shadow-xs ${
              isDark 
                ? 'bg-[#1e222d] border-[#2a2e39] divide-[#2a2e39]' 
                : 'bg-white border-[#e0e3eb] divide-[#f0f3fa]'
            }`}>
              {(trendingTab === 'gainers' ? trendingGainers : trendingLosers).map((item) => {
                const isPositive = item.change >= 0;
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectTicker(item)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-[#2a2e39]/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
                        style={{ backgroundColor: item.badgeBgColor }}
                      >
                        {item.badgeText || item.symbol.slice(0, 1)}
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#787b86]">
                          {item.symbol} · {item.exchange}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                        ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span 
                        className={`inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold rounded ${
                          isPositive
                            ? 'text-[#089981] bg-[#089981]/10'
                            : 'text-[#f23645] bg-[#f23645]/10'
                        }`}
                      >
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
};
