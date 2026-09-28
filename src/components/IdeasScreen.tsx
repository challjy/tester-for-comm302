import React, { useState } from 'react';
import { TradingIdea, MarketItem } from '../types/market';
import { INITIAL_IDEAS } from '../data/marketData';

interface IdeasScreenProps {
  onSelectTickerBySymbol: (symbol: string) => void;
  isDark?: boolean;
}

export const IdeasScreen: React.FC<IdeasScreenProps> = ({
  onSelectTickerBySymbol,
  isDark = false,
}) => {
  const [ideas, setIdeas] = useState<TradingIdea[]>(INITIAL_IDEAS);
  const [filterSentiment, setFilterSentiment] = useState<'All' | 'Bullish' | 'Bearish'>('All');
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [newIdeaModal, setNewIdeaModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState('NVDA');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSentiment, setNewSentiment] = useState<'Bullish' | 'Bearish'>('Bullish');

  const toggleLike = (id: string) => {
    setUserLikes(prev => {
      const isLiked = !prev[id];
      setIdeas(ideas.map(idea => {
        if (idea.id === id) {
          return { ...idea, likes: idea.likes + (isLiked ? 1 : -1) };
        }
        return idea;
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handlePostIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: TradingIdea = {
      id: `user-idea-${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      author: 'You (Trader)',
      authorAvatar: 'ME',
      title: newTitle,
      timeframe: '1D',
      sentiment: newSentiment,
      likes: 1,
      comments: 0,
      timeAgo: 'Just now',
      content: newContent || 'Technical setup with strong support/resistance reaction and volume confirmation.'
    };

    setIdeas([created, ...ideas]);
    setUserLikes(prev => ({ ...prev, [created.id]: true }));
    setNewTitle('');
    setNewContent('');
    setNewIdeaModal(false);
  };

  const filteredIdeas = ideas.filter(i => {
    if (filterSentiment === 'All') return true;
    return i.sentiment === filterSentiment;
  });

  return (
    <div className={`w-full min-h-[calc(100vh-60px)] pb-28 px-4 pt-4 transition-colors ${
      isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
            Trading Ideas
          </h1>
          <p className="text-xs text-[#787b86]">
            Community market setups and technical analysis
          </p>
        </div>

        <button
          onClick={() => setNewIdeaModal(true)}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-[#2962ff] to-[#7c3aed] hover:opacity-95 active:scale-95 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
          <span>Share Idea</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-4">
        {(['All', 'Bullish', 'Bearish'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterSentiment(tab)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              filterSentiment === tab
                ? isDark ? 'bg-white text-[#131722] font-semibold' : 'bg-[#131722] text-white font-semibold'
                : isDark ? 'bg-[#1e222d] text-[#787b86] hover:text-white' : 'bg-[#f0f3fa] text-[#787b86] hover:text-[#131722]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ideas Feed */}
      <div className="space-y-4">
        {filteredIdeas.map((idea) => {
          const isLiked = !!userLikes[idea.id];
          return (
            <article
              key={idea.id}
              className={`border rounded-2xl p-4 transition-all hover:border-[#2962ff]/50 shadow-xs ${
                isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2962ff] to-[#7c3aed] text-white text-[11px] font-bold flex items-center justify-center">
                    {idea.authorAvatar}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                      {idea.author}
                    </span>
                    <span className="text-[10px] text-[#787b86]">
                      {idea.timeAgo} · {idea.timeframe} Chart
                    </span>
                  </div>
                </div>

                {/* Sentiment Badge & Symbol */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onSelectTickerBySymbol(idea.symbol)}
                    className="px-2 py-0.5 rounded text-xs font-bold bg-[#2962ff]/10 text-[#2962ff] hover:bg-[#2962ff]/20 cursor-pointer"
                  >
                    {idea.symbol}
                  </button>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    idea.sentiment === 'Bullish' 
                      ? 'bg-[#089981]/10 text-[#089981]' 
                      : 'bg-[#f23645]/10 text-[#f23645]'
                  }`}>
                    {idea.sentiment}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <h3 className={`font-bold text-sm tracking-tight mb-1.5 leading-snug ${
                isDark ? 'text-white' : 'text-[#131722]'
              }`}>
                {idea.title}
              </h3>
              <p className="text-xs text-[#787b86] leading-relaxed mb-3">
                {idea.content}
              </p>

              {/* Target / Stop Loss preview if available */}
              {(idea.targetPrice || idea.stopLoss) && (
                <div className={`flex items-center space-x-4 mb-3 p-2 rounded-xl text-xs ${
                  isDark ? 'bg-[#131722]' : 'bg-[#f8f9fd]'
                }`}>
                  {idea.targetPrice && (
                    <div>
                      <span className="text-[#787b86]">Target: </span>
                      <strong className="text-[#089981]">${idea.targetPrice.toLocaleString()}</strong>
                    </div>
                  )}
                  {idea.stopLoss && (
                    <div>
                      <span className="text-[#787b86]">Stop: </span>
                      <strong className="text-[#f23645]">${idea.stopLoss.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#e0e3eb]/40 text-xs text-[#787b86]">
                <button
                  onClick={() => toggleLike(idea.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    isLiked ? 'text-[#f23645] bg-[#f23645]/10' : 'hover:text-[#131722]'
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"/>
                  </svg>
                  <span className="font-semibold">{idea.likes}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  </svg>
                  <span>{idea.comments} comments</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Share Idea Modal */}
      {newIdeaModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl ${
            isDark ? 'bg-[#1e222d] border-[#2a2e39] text-white' : 'bg-white border-[#e0e3eb] text-[#131722]'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-lg">Publish Trading Idea</h3>
              <button onClick={() => setNewIdeaModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostIdea} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#787b86] mb-1">Symbol</label>
                  <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g. NVDA"
                    className={`w-full px-3 py-2 rounded-xl text-sm font-bold border uppercase ${
                      isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-gray-50 border-[#e0e3eb]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#787b86] mb-1">Sentiment</label>
                  <select
                    value={newSentiment}
                    onChange={(e) => setNewSentiment(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-sm font-semibold border ${
                      isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-gray-50 border-[#e0e3eb]'
                    }`}
                  >
                    <option value="Bullish">Bullish 📈</option>
                    <option value="Bearish">Bearish 📉</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#787b86] mb-1">Idea Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Breakout retest on 4-hour timeframe"
                  className={`w-full px-3 py-2 rounded-xl text-sm border ${
                    isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-gray-50 border-[#e0e3eb]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#787b86] mb-1">Analysis / Notes</label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detail your price levels, catalyst, and volume profile..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${
                    isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-gray-50 border-[#e0e3eb]'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-white bg-[#2962ff] hover:bg-[#1e53e5] cursor-pointer"
              >
                Publish to Community
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
