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
  currency: string;
  symbol: string;
  exchangeName: string;
  instrumentType: string;
  firstTradeDate: Date;
  regularMarketTime: Date;
  gmtoffset: number;
  timezone: string;
  exchangeTimezoneName: string;
  regularMarketPrice: number;
  chartPreviousClose: number;
  priceHint: number;
  currentTradingPeriod: CurrentTradingPeriod;
  dataGranularity: string;
  range: string;
  validRanges: string[];
}

export interface Quote {
  date: Date;
  high: number;
  volume: number;
  open: number;
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

export enum StrategyType {
  Buying = "buying",
  Shorting = "shorting",
  Both = "both",
}
