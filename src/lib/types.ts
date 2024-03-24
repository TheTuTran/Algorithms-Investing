export interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number | undefined;
  volume: number;
}

export interface MA_Signal {
  date: Date;
  price: number;
  shortMA: number | null;
  longMA: number | null;
  holding: number;
  positions: number | null;
  signalProfit: number | null;
  cumulativeProfit: number;
}

export interface MA_AnalysisResult {
  shortMA: number;
  longMA: number;
  cumulativeProfit: number;
  winPercentage: number;
  numberOfTrades: number;
}
