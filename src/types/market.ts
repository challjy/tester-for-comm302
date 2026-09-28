export type AssetCategory = 
  | 'Indices' 
  | 'Futures' 
  | 'Forex' 
  | 'Government bonds' 
  | 'Crypto' 
  | 'US stocks' 
  | 'World stocks';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface MarketItem {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  badgeText: string;
  badgeBgColor: string;
  badgeTextColor?: string;
  logoType?: 'number' | 'text' | 'nvidia' | 'apple' | 'microsoft' | 'bitcoin' | 'custom';
  currency?: string;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  sparkline: number[];
  candles?: CandlePoint[];
  description?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Breaking' | 'Stocks' | 'Crypto' | 'Macro' | 'Earnings';
  readTime: string;
  summary: string;
  imageUrl?: string;
  relatedSymbol?: string;
}

export interface TradingIdea {
  id: string;
  symbol: string;
  author: string;
  authorAvatar: string;
  title: string;
  timeframe: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  likes: number;
  comments: number;
  timeAgo: string;
  content: string;
  targetPrice?: number;
  stopLoss?: number;
}
