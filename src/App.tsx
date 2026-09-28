/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketItem } from './types/market';
import { INITIAL_MARKET_ITEMS } from './data/marketData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { MarketsScreen } from './components/MarketsScreen';
import { WatchlistScreen } from './components/WatchlistScreen';
import { IdeasScreen } from './components/IdeasScreen';
import { NewsScreen } from './components/NewsScreen';
import { MenuScreen } from './components/MenuScreen';
import { TickerDetailModal } from './components/TickerDetailModal';
import { SearchModal } from './components/SearchModal';
import { GetStartedModal } from './components/GetStartedModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('markets');
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [selectedTicker, setSelectedTicker] = useState<MarketItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('tv_theme') === 'dark';
  });
  
  // Watchlist persisted state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_watchlist');
    return saved ? JSON.parse(saved) : ['sp500', 'nasdaq100', 'nvda', 'aapl', 'tsla', 'btcusd'];
  });

  // Paper trading state
  const [paperBalance, setPaperBalance] = useState<number>(() => {
    const saved = localStorage.getItem('tv_paper_balance');
    return saved ? parseFloat(saved) : 100000.00;
  });
  const [tradesCount, setTradesCount] = useState<number>(() => {
    const saved = localStorage.getItem('tv_trades_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlistIds));
  }, [watchlistIds]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('tv_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Subtle real-time price fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketItems(prevItems => {
        // Pick one or two random items to update slightly
        const randomIndex = Math.floor(Math.random() * prevItems.length);
        return prevItems.map((item, idx) => {
          if (idx !== randomIndex) return item;
          // small tick between -0.15% and +0.15%
          const pctDelta = (Math.random() - 0.49) * 0.002;
          const newPrice = +(item.price * (1 + pctDelta)).toFixed(item.price < 10 ? 4 : 2);
          const newChange = +(item.change + (newPrice - item.price)).toFixed(2);
          const newChangePct = +(item.changePercent + (pctDelta * 100)).toFixed(2);
          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePct,
            dayHigh: Math.max(item.dayHigh, newPrice),
            dayLow: Math.min(item.dayLow, newPrice),
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleToggleWatchlist = (item: MarketItem) => {
    if (watchlistIds.includes(item.id)) {
      setWatchlistIds(prev => prev.filter(id => id !== item.id));
      showToast(`Removed ${item.symbol} from Watchlist`);
    } else {
      setWatchlistIds(prev => [...prev, item.id]);
      showToast(`Added ${item.symbol} to Watchlist`);
    }
  };

  const handleExecuteTrade = (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => {
    const total = shares * price;
    setPaperBalance(prev => {
      const next = type === 'BUY' ? prev - total : prev + total;
      localStorage.setItem('tv_paper_balance', next.toString());
      return next;
    });
    setTradesCount(prev => {
      const next = prev + 1;
      localStorage.setItem('tv_trades_count', next.toString());
      return next;
    });
    showToast(`Executed ${type} ${shares} ${symbol} @ $${price.toFixed(2)}`);
  };

  const handleResetPaperBalance = () => {
    setPaperBalance(100000.00);
    setTradesCount(0);
    localStorage.setItem('tv_paper_balance', '100000');
    localStorage.setItem('tv_trades_count', '0');
    showToast('Reset paper trading balance to $100,000.00');
  };

  const handleSelectTickerBySymbol = (symbol: string) => {
    const found = marketItems.find(
      i => i.symbol.toUpperCase() === symbol.toUpperCase() || i.id.toUpperCase() === symbol.toUpperCase()
    );
    if (found) {
      setSelectedTicker(found);
    } else {
      // Fallback
      setSelectedTicker(marketItems[0]);
    }
  };

  // Sync selected ticker live updates if modal is open
  const currentSelectedTicker = selectedTicker 
    ? marketItems.find(i => i.id === selectedTicker.id) || selectedTicker
    : null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors selection:bg-[#2962ff]/20 ${
      isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
    }`}>
      {/* Container wrapper constrained to standard mobile width on desktop, full-width on mobile */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.06)] border-x border-[#f0f3fa] dark:border-[#2a2e39]">
        
        {/* Main Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMenu={() => setActiveTab('menu')}
          onOpenGetStarted={() => setIsGetStartedOpen(true)}
          isDark={isDark}
        />

        {/* Dynamic Screen View */}
        <div className="flex-1">
          {activeTab === 'markets' && (
            <MarketsScreen
              marketItems={marketItems}
              onSelectTicker={(item) => setSelectedTicker(item)}
              isDark={isDark}
            />
          )}

          {activeTab === 'watchlist' && (
            <WatchlistScreen
              watchlistIds={watchlistIds}
              allMarketItems={marketItems}
              onSelectTicker={(item) => setSelectedTicker(item)}
              onRemoveFromWatchlist={(id) => {
                setWatchlistIds(prev => prev.filter(item => item !== id));
                showToast('Removed from Watchlist');
              }}
              onOpenSearch={() => setIsSearchOpen(true)}
              isDark={isDark}
            />
          )}

          {activeTab === 'ideas' && (
            <IdeasScreen
              onSelectTickerBySymbol={handleSelectTickerBySymbol}
              isDark={isDark}
            />
          )}

          {activeTab === 'news' && (
            <NewsScreen
              onSelectTickerBySymbol={handleSelectTickerBySymbol}
              isDark={isDark}
            />
          )}

          {activeTab === 'menu' && (
            <MenuScreen
              isDark={isDark}
              onToggleTheme={() => setIsDark(!isDark)}
              paperBalance={paperBalance}
              tradesCount={tradesCount}
              onResetPaperBalance={handleResetPaperBalance}
              onOpenGetStarted={() => setIsGetStartedOpen(true)}
            />
          )}
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 inset-x-0 mx-auto max-w-xs z-50 px-4 py-2 bg-[#131722] text-white text-xs font-semibold rounded-full shadow-xl flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-3">
            <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Bottom Navigation Dock */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          watchlistCount={watchlistIds.length}
          isDark={isDark}
        />

        {/* Ticker Detail / Interactive Chart Modal */}
        <TickerDetailModal
          item={currentSelectedTicker}
          onClose={() => setSelectedTicker(null)}
          isWatchlisted={currentSelectedTicker ? watchlistIds.includes(currentSelectedTicker.id) : false}
          onToggleWatchlist={handleToggleWatchlist}
          onExecuteTrade={handleExecuteTrade}
          isDark={isDark}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          items={marketItems}
          onSelectTicker={(item) => setSelectedTicker(item)}
          isDark={isDark}
        />

        {/* Get Started Welcome Modal */}
        <GetStartedModal
          isOpen={isGetStartedOpen}
          onClose={() => setIsGetStartedOpen(false)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
