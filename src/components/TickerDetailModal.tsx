import React, { useState } from 'react';
import { MarketItem } from '../types/market';
import { generateCandles } from '../data/marketData';

interface TickerDetailModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (item: MarketItem) => void;
  onExecuteTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
  isDark?: boolean;
}

export const TickerDetailModal: React.FC<TickerDetailModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade,
  isDark = false,
}) => {
  if (!item) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y' | 'ALL'>('1D');
  const [chartType, setChartType] = useState<'area' | 'candles'>('area');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [shares, setShares] = useState(10);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const isPositive = item.change >= 0;

  // Generate synthetic chart points based on timeframe
  const pointsCount = timeframe === '1D' ? 24 : timeframe === '5D' ? 35 : timeframe === '1M' ? 30 : 45;
  const candleData = React.useMemo(() => {
    return generateCandles(item.price, pointsCount);
  }, [item.price, timeframe, pointsCount]);

  // Points for line/area chart
  const linePrices = candleData.map(c => c.close);
  const minVal = Math.min(...linePrices) * 0.995;
  const maxVal = Math.max(...linePrices) * 1.005;
  const range = maxVal - minVal || 1;

  const width = 360;
  const height = 180;
  const paddingX = 12;
  const paddingY = 16;

  const svgPoints = linePrices.map((val, idx) => {
    const x = paddingX + (idx / (linePrices.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);
    return { x, y, val, time: candleData[idx].time };
  });

  const pathD = svgPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x},${height} L ${svgPoints[0].x},${height} Z`;

  const activePoint = hoverIndex !== null && svgPoints[hoverIndex] ? svgPoints[hoverIndex] : null;
  const displayPrice = activePoint ? activePoint.val : item.price;

  // Calculate day range slider percentage
  const dayRangeSpan = item.dayHigh - item.dayLow || 1;
  const dayPosPercent = Math.min(Math.max(((item.price - item.dayLow) / dayRangeSpan) * 100, 0), 100);

  // 52-week range percentage
  const yearRangeSpan = item.yearHigh - item.yearLow || 1;
  const yearPosPercent = Math.min(Math.max(((item.price - item.yearLow) / yearRangeSpan) * 100, 0), 100);

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteTrade(item.symbol, orderType, shares, item.price);
    setOrderFeedback(`Order executed: ${orderType} ${shares} ${item.symbol} @ $${item.price.toFixed(2)}`);
    setTimeout(() => {
      setOrderFeedback(null);
      setOrderModalOpen(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className={`relative w-full sm:max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden border transition-colors ${
          isDark ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-[#e0e3eb] text-[#131722]'
        }`}
      >
        {/* Modal Handle for mobile swipe feel */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className={`px-5 pt-3 pb-3 flex items-center justify-between border-b ${
          isDark ? 'border-[#2a2e39]' : 'border-[#f0f3fa]'
        }`}>
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-xs"
              style={{ backgroundColor: item.badgeBgColor }}
            >
              {item.badgeText || item.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className={`font-extrabold text-base tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  {item.symbol}
                </h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  isDark ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-[#f0f3fa] text-[#787b86]'
                }`}>
                  {item.exchange}
                </span>
              </div>
              <p className="text-xs text-[#787b86] truncate max-w-[200px]">{item.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Watchlist toggle button */}
            <button
              onClick={() => onToggleWatchlist(item)}
              aria-label="Add to Watchlist"
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isWatchlisted 
                  ? 'text-[#2962ff] bg-[#2962ff]/10' 
                  : isDark ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]' : 'text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              <svg 
                className="w-5 h-5 stroke-[2]" 
                fill={isWatchlisted ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDark ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]' : 'text-[#787b86] hover:text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 no-scrollbar">
          {/* Live Price Header */}
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  {item.currency === 'USD' ? '$' : ''}{displayPrice.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 4 : 2 })}
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isPositive ? 'bg-[#089981]' : 'bg-[#f23645]'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isPositive ? 'bg-[#089981]' : 'bg-[#f23645]'
                  }`}></span>
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm font-semibold flex items-center ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                  {isPositive ? '+' : ''}{item.change.toFixed(2)} ({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-[#787b86]">Today · Real-time</span>
              </div>
            </div>

            {/* Area vs Candles Toggle */}
            <div className={`flex items-center p-0.5 rounded-lg border text-xs font-semibold ${
              isDark ? 'border-[#2a2e39] bg-[#131722]' : 'border-[#e0e3eb] bg-[#f8f9fd]'
            }`}>
              <button
                onClick={() => setChartType('area')}
                className={`px-2 py-1 rounded cursor-pointer transition-all ${
                  chartType === 'area'
                    ? isDark ? 'bg-[#2a2e39] text-white shadow-xs' : 'bg-white text-[#131722] shadow-xs'
                    : 'text-[#787b86]'
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2 py-1 rounded cursor-pointer transition-all ${
                  chartType === 'candles'
                    ? isDark ? 'bg-[#2a2e39] text-white shadow-xs' : 'bg-white text-[#131722] shadow-xs'
                    : 'text-[#787b86]'
                }`}
              >
                Candles
              </button>
            </div>
          </div>

          {/* Timeframe Bar */}
          <div className="flex items-center justify-between border-b pb-2 pt-1 border-[#e0e3eb]/50">
            {(['1D', '5D', '1M', '6M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`text-xs font-bold py-1 px-2.5 rounded-md transition-colors cursor-pointer ${
                  timeframe === tf
                    ? isDark ? 'bg-white text-[#131722]' : 'bg-[#131722] text-white'
                    : 'text-[#787b86] hover:text-[#131722]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Canvas */}
          <div className={`relative rounded-xl border p-2 overflow-hidden select-none ${
            isDark ? 'bg-[#131722] border-[#2a2e39]' : 'bg-[#fafbfc] border-[#e0e3eb]'
          }`}>
            {activePoint && (
              <div className="absolute top-2 left-3 text-[11px] font-mono font-medium text-[#787b86] pointer-events-none">
                Time: {activePoint.time} | Val: ${activePoint.val.toFixed(2)}
              </div>
            )}

            {chartType === 'area' ? (
              <div 
                className="w-full h-44 relative cursor-crosshair touch-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, x / rect.width));
                  const index = Math.round(ratio * (svgPoints.length - 1));
                  setHoverIndex(index);
                }}
                onMouseLeave={() => setHoverIndex(null)}
                onTouchMove={(e) => {
                  if (e.touches[0]) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const ratio = Math.max(0, Math.min(1, x / rect.width));
                    const index = Math.round(ratio * (svgPoints.length - 1));
                    setHoverIndex(index);
                  }
                }}
                onTouchEnd={() => setHoverIndex(null)}
              >
                <svg 
                  className="w-full h-full overflow-visible" 
                  viewBox={`0 0 ${width} ${height}`} 
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="modalGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.32" />
                      <stop offset="100%" stopColor={isPositive ? '#089981' : '#f23645'} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path d={areaD} fill="url(#modalGrad)" />

                  {/* Main Line */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke={isPositive ? '#089981' : '#f23645'} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {/* Crosshair indicator */}
                  {activePoint && (
                    <g>
                      <line 
                        x1={activePoint.x} 
                        y1="0" 
                        x2={activePoint.x} 
                        y2={height} 
                        stroke="#787b86" 
                        strokeWidth="1" 
                        strokeDasharray="3 3" 
                      />
                      <line 
                        x1="0" 
                        y1={activePoint.y} 
                        x2={width} 
                        y2={activePoint.y} 
                        stroke="#787b86" 
                        strokeWidth="1" 
                        strokeDasharray="3 3" 
                      />
                      <circle 
                        cx={activePoint.x} 
                        cy={activePoint.y} 
                        r="4.5" 
                        fill={isPositive ? '#089981' : '#f23645'} 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                      />
                    </g>
                  )}
                </svg>
              </div>
            ) : (
              /* Candlestick visualization */
              <div className="w-full h-44 flex items-center justify-between px-1 overflow-x-auto no-scrollbar">
                {candleData.slice(-26).map((c, i) => {
                  const isUp = c.close >= c.open;
                  const cHeight = Math.max(Math.abs(c.close - c.open) * 2.5, 4);
                  const wickHeight = (c.high - c.low) * 2.5;
                  return (
                    <div key={i} className="flex flex-col items-center justify-center h-full w-2 shrink-0 group relative">
                      {/* High-Low Wick */}
                      <div 
                        className={`w-[1.5px] ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                        style={{ height: `${Math.min(wickHeight, 130)}px` }}
                      />
                      {/* Body */}
                      <div 
                        className={`w-1.5 rounded-[1px] absolute ${isUp ? 'bg-[#089981]' : 'bg-[#f23645]'}`}
                        style={{ height: `${Math.min(cHeight, 100)}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Key Range Bars */}
          <div className="space-y-3 pt-1">
            {/* Day's Range */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#787b86] font-medium">Day's Range</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  ${item.dayLow.toFixed(2)} - ${item.dayHigh.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-[#2962ff] rounded-full transition-all"
                  style={{ width: `${dayPosPercent}%` }}
                />
              </div>
            </div>

            {/* 52 Week Range */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#787b86] font-medium">52-Week Range</span>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                  ${item.yearLow.toFixed(2)} - ${item.yearHigh.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-[#7c3aed] rounded-full transition-all"
                  style={{ width: `${yearPosPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl border ${
            isDark ? 'bg-[#131722]/60 border-[#2a2e39]' : 'bg-[#f8f9fd] border-[#e0e3eb]'
          }`}>
            <div>
              <div className="text-[11px] text-[#787b86]">Market Cap</div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                {item.marketCap || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#787b86]">Volume</div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                {item.volume}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#787b86]">P/E Ratio</div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                {item.peRatio ? item.peRatio.toFixed(1) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#787b86]">Exchange</div>
              <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                {item.exchange}
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="pt-1">
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-[#131722]'}`}>
                About {item.name}
              </h4>
              <p className="text-xs text-[#787b86] leading-relaxed">
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* Paper Trading Action Bar Footer */}
        <div className={`p-4 border-t flex items-center space-x-3 ${
          isDark ? 'border-[#2a2e39] bg-[#1e222d]' : 'border-[#e0e3eb] bg-white'
        }`}>
          <button
            onClick={() => {
              setOrderType('SELL');
              setOrderModalOpen(true);
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#f23645] hover:bg-[#d82a39] active:scale-98 transition-all cursor-pointer shadow-sm text-center"
          >
            Sell @ ${item.price.toFixed(2)}
          </button>
          <button
            onClick={() => {
              setOrderType('BUY');
              setOrderModalOpen(true);
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#089981] hover:bg-[#078570] active:scale-98 transition-all cursor-pointer shadow-sm text-center"
          >
            Buy @ ${item.price.toFixed(2)}
          </button>
        </div>

        {/* Trade Simulation Sub-Modal */}
        {orderModalOpen && (
          <div className="absolute inset-0 z-20 bg-black/70 flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className={`w-full max-w-sm rounded-2xl p-5 border shadow-2xl ${
              isDark ? 'bg-[#1e222d] border-[#2a2e39] text-white' : 'bg-white border-[#e0e3eb] text-[#131722]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-base">
                  Paper Trade {item.symbol}
                </h4>
                <button
                  onClick={() => setOrderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {orderFeedback ? (
                <div className="p-4 bg-[#089981]/15 text-[#089981] rounded-xl text-center font-bold text-sm">
                  {orderFeedback}
                </div>
              ) : (
                <form onSubmit={handleTradeSubmit} className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-[#787b86]">
                    <span>Order Side: <strong className={orderType === 'BUY' ? 'text-[#089981]' : 'text-[#f23645]'}>{orderType}</strong></span>
                    <span>Market: ${item.price.toFixed(2)}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[#787b86]">
                      Shares / Units
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={shares}
                      onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-full px-3 py-2 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-[#2962ff] ${
                        isDark ? 'bg-[#131722] border-[#2a2e39] text-white' : 'bg-gray-50 border-[#e0e3eb]'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-t border-b border-[#e0e3eb]/40 font-semibold">
                    <span>Estimated Total:</span>
                    <span>${(shares * item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-xl font-bold text-white transition-all cursor-pointer ${
                      orderType === 'BUY' ? 'bg-[#089981] hover:bg-[#078570]' : 'bg-[#f23645] hover:bg-[#d82a39]'
                    }`}
                  >
                    Confirm {orderType} Order
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
