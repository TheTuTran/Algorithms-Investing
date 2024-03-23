export interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number | undefined;
  volume: number;
}

export interface SMA_Signal {
  date: Date;
  price: number;
  shortSma: number | null;
  longSma: number | null;
  holding: number;
  positions: number | null;
  signalProfit: number | null;
  cumulativeProfit: number;
}

export interface SmaAnalysisResult {
  shortSma: number;
  longSma: number;
  cumulativeProfit: number;
  winPercentage: number;
  numberOfTrades: number;
}
