import React from 'react';

interface MenuScreenProps {
  isDark: boolean;
  onToggleTheme: () => void;
  paperBalance: number;
  tradesCount: number;
  onResetPaperBalance: () => void;
  onOpenGetStarted: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({
  isDark,
  onToggleTheme,
  paperBalance,
  tradesCount,
  onResetPaperBalance,
  onOpenGetStarted,
}) => {
  return (
    <div className={`w-full min-h-[calc(100vh-60px)] pb-28 px-4 pt-4 transition-colors ${
      isDark ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-white text-[#131722]'
    }`}>
      {/* Title */}
      <h1 className={`text-2xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-[#131722]'}`}>
        Menu & Settings
      </h1>

      {/* Profile Card */}
      <div className={`p-4 rounded-2xl border mb-4 shadow-xs ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#2962ff] to-[#7c3aed] text-white font-bold flex items-center justify-center text-lg shadow-sm">
              TV
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  Trader Guest
                </span>
                <span className="text-[10px] bg-[#2962ff]/10 text-[#2962ff] px-2 py-0.5 rounded-full font-bold">
                  PRO DEMO
                </span>
              </div>
              <p className="text-xs text-[#787b86]">Paper Trading Account</p>
            </div>
          </div>

          <button
            onClick={onOpenGetStarted}
            className="px-3 py-1.5 text-xs font-semibold rounded-full text-white bg-[#2962ff] hover:bg-[#1e53e5] cursor-pointer"
          >
            Upgrade
          </button>
        </div>

        {/* Paper Balance Summary */}
        <div className={`p-3.5 rounded-xl border mt-2 ${
          isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
        }`}>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-[#787b86]">Paper Trading Balance</span>
            <span className="text-[10px] text-[#089981] font-bold">REAL-TIME SIM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
              ${paperBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <button
              onClick={onResetPaperBalance}
              className="text-xs font-semibold text-[#787b86] hover:text-[#2962ff] underline cursor-pointer"
            >
              Reset $100K
            </button>
          </div>
          <div className="text-[11px] text-[#787b86] mt-1">
            Executed Orders: <strong className={isDark ? 'text-white' : 'text-[#131722]'}>{tradesCount}</strong>
          </div>
        </div>
      </div>

      {/* Global Market Status */}
      <div className={`p-4 rounded-2xl border mb-4 shadow-xs ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 text-[#787b86]`}>
          Global Market Sessions
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#131722]'}`}>US Markets (NYSE/NASDAQ)</span>
            </div>
            <span className="text-[#089981] font-medium">Regular Hours</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#131722]'}`}>Crypto Web3 Markets</span>
            </div>
            <span className="text-[#089981] font-medium">Open 24/7</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#787b86]"></span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#131722]'}`}>London (LSE / FTSE)</span>
            </div>
            <span className="text-[#787b86]">Closed</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#787b86]"></span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#131722]'}`}>Tokyo (TSE / Nikkei)</span>
            </div>
            <span className="text-[#787b86]">Closed</span>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className={`p-4 rounded-2xl border shadow-xs ${
        isDark ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-[#e0e3eb]'
      }`}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-[#787b86]">
          Appearance & Settings
        </h3>

        <div className="space-y-4 text-sm">
          {/* Dark / Light Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>Dark Theme</div>
              <div className="text-xs text-[#787b86]">Signature TradingView dark mode</div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isDark ? 'bg-[#2962ff] justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Sound / Ticker ticks */}
          <div className="flex items-center justify-between pt-3 border-t border-[#e0e3eb]/40">
            <div>
              <div className={`font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>Live Market Feeds</div>
              <div className="text-xs text-[#787b86]">Simulated real-time quote updates</div>
            </div>
            <span className="text-xs font-bold text-[#089981]">Active</span>
          </div>

          {/* Version Info */}
          <div className="pt-3 border-t border-[#e0e3eb]/40 text-xs text-[#787b86] flex justify-between">
            <span>TradingView Mobile Experience</span>
            <span>v2.8.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
