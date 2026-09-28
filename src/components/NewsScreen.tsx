import React, { useState } from 'react';
import { NewsArticle } from '../types/market';
import { INITIAL_NEWS } from '../data/marketData';

interface NewsScreenProps {
  onSelectTickerBySymbol: (symbol: string) => void;
  isDark?: boolean;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({
  onSelectTickerBySymbol,
  isDark = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ['All', 'Breaking', 'Stocks', 'Crypto', 'Macro', 'Earnings'];

  const filteredNews = selectedCategory === 'All'
    ? INITIAL_NEWS
    : INITIAL_NEWS.filter(n => n.category === selectedCategory);

  return (
    <div className={`w-full min-h-[calc(100vh-60px)] pb-28 px-4 pt-4 transition-colors ${
      isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
            Market News
          </h1>
          <p className="text-xs text-[#787b86]">
            Real-time financial headlines & macroeconomic briefings
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 mb-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1 rounded-full text-xs shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? isDark
                  ? 'bg-white text-[#131722] font-semibold'
                  : 'bg-[#131722] text-white font-semibold'
                : isDark
                  ? 'bg-[#1e222d] text-[#787b86] hover:text-white'
                  : 'bg-[#f0f3fa] text-[#787b86] hover:text-[#131722]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Feed */}
      <div className="space-y-3">
        {filteredNews.map((article) => (
          <article
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer hover:border-[#2962ff]/50 shadow-xs ${
              isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#2962ff]">{article.source}</span>
                <span className="text-[#787b86]">· {article.timeAgo}</span>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold ${
                article.category === 'Breaking'
                  ? 'bg-[#f23645]/10 text-[#f23645]'
                  : article.category === 'Crypto'
                  ? 'bg-[#f7931a]/10 text-[#f7931a]'
                  : 'bg-[#2962ff]/10 text-[#2962ff]'
              }`}>
                {article.category}
              </span>
            </div>

            <h3 className={`font-bold text-sm tracking-tight mb-1.5 leading-snug ${
              isDark ? 'text-white' : 'text-[#131722]'
            }`}>
              {article.title}
            </h3>

            <p className="text-xs text-[#787b86] line-clamp-2 leading-relaxed">
              {article.summary}
            </p>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#e0e3eb]/30 text-xs text-[#787b86]">
              <span>{article.readTime}</span>
              {article.relatedSymbol && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTickerBySymbol(article.relatedSymbol!);
                  }}
                  className="font-bold text-[#2962ff] hover:underline"
                >
                  View ${article.relatedSymbol} →
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="fixed inset-0" onClick={() => setActiveArticle(null)} />
          <div className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 border shadow-2xl z-10 ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#2962ff] uppercase tracking-wider">
                {activeArticle.source} · {activeArticle.timeAgo}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <h2 className={`text-xl font-extrabold tracking-tight mb-3 leading-snug ${
              isDark ? 'text-white' : 'text-[#131722]'
            }`}>
              {activeArticle.title}
            </h2>

            <div className={`p-4 rounded-xl text-xs leading-relaxed space-y-2 mb-4 border ${
              isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
            }`}>
              <div className="font-bold uppercase tracking-wider text-[#787b86] text-[10px]">
                Market Briefing
              </div>
              <p>{activeArticle.summary}</p>
              <p>
                Traders are watching upcoming central bank commentaries and volatility skews. Sentiment indices suggest constructive medium-term momentum across tech, cyclicals, and energy.
              </p>
            </div>

            {activeArticle.relatedSymbol && (
              <button
                onClick={() => {
                  const sym = activeArticle.relatedSymbol!;
                  setActiveArticle(null);
                  onSelectTickerBySymbol(sym);
                }}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#2962ff] hover:bg-[#1e53e5] cursor-pointer"
              >
                Open Chart for {activeArticle.relatedSymbol}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
