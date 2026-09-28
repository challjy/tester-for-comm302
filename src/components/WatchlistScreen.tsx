import React, { useState } from 'react';
import { MarketItem } from '../types/market';

interface WatchlistScreenProps {
  watchlistIds: string[];
  allMarketItems: MarketItem[];
  onSelectTicker: (item: MarketItem) => void;
  onRemoveFromWatchlist: (id: string) => void;
  onOpenSearch: () => void;
  isDark?: boolean;
}

export const WatchlistScreen: React.FC<WatchlistScreenProps> = ({
  watchlistIds,
  allMarketItems,
  onSelectTicker,
  onRemoveFromWatchlist,
  onOpenSearch,
  isDark = false,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gainers' | 'losers'>('all');
  const [sortKey, setSortKey] = useState<'symbol' | 'price' | 'changePercent'>('changePercent');

  const watchlistedItems = allMarketItems.filter(item => watchlistIds.includes(item.id));

  // Sort and filter
  const filteredItems = watchlistedItems
    .filter(item => {
      if (activeTab === 'gainers') return item.change >= 0;
      if (activeTab === 'losers') return item.change < 0;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === 'symbol') return a.symbol.localeCompare(b.symbol);
      if (sortKey === 'price') return b.price - a.price;
      return b.changePercent - a.changePercent;
    });

  return (
    <div className={`w-full min-h-[calc(100vh-60px)] pb-28 px-4 pt-4 transition-colors ${
      isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
            Watchlist
          </h1>
          <p className="text-xs text-[#787b86]">
            {watchlistedItems.length} instrument{watchlistedItems.length === 1 ? '' : 's'} tracked
          </p>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-white bg-[#2962ff] hover:bg-[#1e53e5] active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          <span>Add symbol</span>
        </button>
      </div>

      {/* Tabs and Sort filter */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className={`flex items-center p-0.5 rounded-lg border ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-[#f0f3fa] border-transparent'
        }`}>
          {(['all', 'gainers', 'losers'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all cursor-pointer ${
                activeTab === tab
                  ? isDark ? 'bg-[#2a2e39] text-white font-semibold' : 'bg-white text-[#131722] font-semibold shadow-xs'
                  : 'text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as any)}
          className={`px-2 py-1 rounded-lg border text-xs focus:outline-none cursor-pointer ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
          }`}
        >
          <option value="changePercent">% Change</option>
          <option value="price">Price</option>
          <option value="symbol">Symbol</option>
        </select>
      </div>

      {/* Watchlist Items List */}
      {filteredItems.length === 0 ? (
        <div className={`text-center py-16 px-4 rounded-2xl border border-dashed ${
          isDark ? 'border-[#2a2e39] bg-[#1e222d]/40' : 'border-[#e0e3eb] bg-[#fafbfc]'
        }`}>
          <div className="w-12 h-12 rounded-full bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-[#131722]'}`}>
            No symbols in this view
          </h3>
          <p className="text-xs text-[#787b86] mb-4 max-w-xs mx-auto">
            Add indices, stocks, or cryptocurrencies from Markets or use the search bar.
          </p>
          <button
            onClick={onOpenSearch}
            className="px-4 py-2 text-xs font-semibold rounded-full text-white bg-[#2962ff] hover:bg-[#1e53e5] cursor-pointer"
          >
            Search Markets
          </button>
        </div>
      ) : (
        <div className={`border rounded-2xl divide-y overflow-hidden shadow-xs ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39] divide-[#2a2e39]' : 'bg-white border-[#e0e3eb] divide-[#f0f3fa]'
        }`}>
          {filteredItems.map(item => {
            const isPositive = item.change >= 0;
            return (
              <div
                key={item.id}
                className={`p-3.5 flex items-center justify-between group transition-colors ${
                  isDark ? 'hover:bg-[#2a2e39]/60' : 'hover:bg-slate-50'
                }`}
              >
                <div 
                  onClick={() => onSelectTicker(item)}
                  className="flex items-center space-x-3 cursor-pointer flex-1"
                >
                  <div 
                    className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs"
                    style={{ backgroundColor: item.badgeBgColor }}
                  >
                    {item.badgeText || item.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                        {item.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86] px-1 py-0.2 bg-gray-100 dark:bg-gray-800 rounded">
                        {item.exchange}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#787b86] truncate max-w-[140px] sm:max-w-xs">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div 
                    onClick={() => onSelectTicker(item)}
                    className="text-right cursor-pointer"
                  >
                    <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                      {item.currency === 'USD' ? '$' : ''}{item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 4 : 2 })}
                    </div>
                    <span 
                      className={`inline-block mt-0.5 px-2 py-0.5 text-[11px] font-semibold rounded ${
                        isPositive ? 'text-[#089981] bg-[#089981]/10' : 'text-[#f23645] bg-[#f23645]/10'
                      }`}
                    >
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(item.id);
                    }}
                    title="Remove from watchlist"
                    className="opacity-40 group-hover:opacity-100 hover:text-[#f23645] p-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
