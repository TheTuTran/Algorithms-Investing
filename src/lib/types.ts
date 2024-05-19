interface TradingPeriod {
  timezone: string;
  start: Date;
  end: Date;
  gmtoffset: number;
}

interface CurrentTradingPeriod {
  pre: TradingPeriod;
  regular: TradingPeriod;
  post: TradingPeriod;
}

interface Meta {
  chartPreviousClose: number;
  currency: string;
  currentTradingPeriod: CurrentTradingPeriod;
  instrumentType: string;
  firstTradeDate: Date;
  regularMarketTime: Date;
  gmtoffset: number;
  timezone: string;
  exchangeTimezoneName: string;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketPrice: number;
  regularMarketVolume: number;
  priceHint: number;
  dataGranularity: string;
  range: string;
  validRanges: string[];
}

export interface Quote {
  date: Date;
  high: number;
  volume: number;
  open?: number;
  low: number;
  close: number;
  adjclose?: number;
}

interface DividendEvent {
  amount: number;
  date: Date;
}

interface SplitEvent {
  date: Date;
  numerator: number;
  denominator: number;
  splitRatio: string;
}

interface Events {
  dividends: DividendEvent[];
  splits: SplitEvent[];
}

export interface StockData {
  meta: Meta;
  quotes: Quote[];
  events: Events;
}

export interface MA_Signal {
  date: Date;
  price: number;
  fastMA: number | null;
  slowMA: number | null;
  holding: number;
  positions: number | null;
  signalProfit: number | null;
  cumulativeProfit: number;
}

export interface MA_AnalysisResult {
  fastMA: number;
  slowMA: number;
  cumulativeProfit: number;
  winPercentage: number;
  numberOfTrades: number;
}

export interface Stoch_Signal {
  date: Date;
  price: number;
  stochastic: number | null;
  holding: number;
  positions: number | null;
  signalProfit: number | null;
  cumulativeProfit: number;
}

export interface Stoch_AnalysisResult {
  oversoldStoch: number;
  overboughtStoch: number;
  cumulativeProfit: number;
  winPercentage: number;
  numberOfTrades: number;
}

export enum StrategyType {
  Buying = "buying",
  Shorting = "shorting",
  Both = "both",
}

export interface StockSecuritySectorFormat {
  Symbol: string;
  Security: string;
  "GICS Sector": string;
}

export interface MACDResult {
  macdLine: (number | null)[];
  signalLine: (number | null)[];
  histogram: (number | null)[];
}
