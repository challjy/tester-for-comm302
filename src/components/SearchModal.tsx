import React, { useState } from 'react';
import { MarketItem } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectTicker: (item: MarketItem) => void;
  isDark?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectTicker,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filterPills = ['All', 'Stocks', 'Crypto', 'Indices', 'Forex', 'Futures'];

  const filtered = items.filter(item => {
    // category filter
    if (filterType === 'Stocks' && !item.category.includes('stocks')) return false;
    if (filterType === 'Crypto' && item.category !== 'Crypto') return false;
    if (filterType === 'Indices' && item.category !== 'Indices') return false;
    if (filterType === 'Forex' && item.category !== 'Forex') return false;
    if (filterType === 'Futures' && item.category !== 'Futures') return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className={`relative w-full sm:max-w-xl max-h-[88vh] flex flex-col rounded-b-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden border ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
      }`}>
        {/* Search Input Bar */}
        <div className={`p-4 border-b flex items-center space-x-3 ${
          isDark ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
        }`}>
          <svg className="w-5 h-5 text-[#787b86] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>

          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, stocks, crypto, futures..."
            className={`w-full text-base font-semibold focus:outline-none bg-transparent placeholder-[#787b86] ${
              isDark ? 'text-white' : 'text-[#131722]'
            }`}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-bold text-[#787b86] hover:text-[#131722] p-1"
            >
              Clear
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#787b86] hover:text-[#131722]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 px-4 py-2.5 overflow-x-auto no-scrollbar border-b border-[#e0e3eb]/40 text-xs">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setFilterType(pill)}
              className={`px-3 py-1 rounded-full font-medium shrink-0 transition-all cursor-pointer ${
                filterType === pill
                  ? isDark ? 'bg-white text-[#131722] font-semibold' : 'bg-[#131722] text-white font-semibold'
                  : isDark ? 'bg-[#131722] text-[#787b86] hover:text-white' : 'bg-[#f0f3fa] text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto max-h-[60vh] divide-y divide-[#e0e3eb]/30 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#787b86] text-xs">
              No matching instruments found for "{query}".
            </div>
          ) : (
            filtered.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectTicker(item);
                    onClose();
                  }}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isDark ? 'hover:bg-[#2a2e39]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
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
                      <div className="text-[11px] text-[#787b86]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
