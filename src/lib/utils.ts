import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import yahooFinance from "yahoo-finance2";
import { SMA_Signal, SmaAnalysisResult, StockData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchHistoricalData(
  query: string,
  queryOptions: { period1: string; period2: string }
): Promise<StockData[]> {
  try {
    const results = await yahooFinance.historical(query, queryOptions);
    return results;
  } catch (error) {
    console.error("Failed to fetch historical data:", error);
    throw new Error("Failed to fetch historical data");
  }
}

export function getFormattedDates() {
  const today = new Date();
  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

  return {
    formattedToday: today.toISOString().split("T")[0],
    formattedLastYear: lastYear.toISOString().split("T")[0],
  };
}

function calculateSma(data: number[], period: number) {
  let sma: (number | null)[] = new Array(data.length).fill(null);

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    sma[i] = sum / period;
  }

  return sma;
}

export function generateSmaSignals(
  date_data: Date[],
  data: number[],
  fastSignal: number,
  slowSignal: number
): SMA_Signal[] {
  const signals: SMA_Signal[] = data.map((price, index) => ({
    date: date_data[index],
    price,
    shortSma: null,
    longSma: null,
    holding: 0,
    positions: null,
    signalProfit: null,
    cumulativeProfit: 0,
  }));

  const shortSmas = calculateSma(data, fastSignal);
  const longSmas = calculateSma(data, slowSignal);

  signals.forEach((signal, index) => {
    signal.shortSma = shortSmas[index];
    signal.longSma = longSmas[index];

    if (signal.shortSma !== null && signal.longSma !== null) {
      signal.holding = signal.shortSma > signal.longSma ? 1 : 0;
    }
  });

  for (let i = 1; i < signals.length; i++) {
    if (
      signals[i].holding !== undefined &&
      signals[i - 1].holding !== undefined
    ) {
      signals[i].positions = signals[i].holding - signals[i - 1].holding;
    }
  }

  let cumulativeProfit = 0;
  let buyPrice: number | null = null;
  signals.forEach((signal, index) => {
    if (signal.positions === 1) {
      buyPrice = signal.price;
    } else if (signal.positions === -1 && buyPrice !== null) {
      const sellPrice = signal.price;
      const profit = sellPrice - buyPrice;
      signal.signalProfit = profit;
      buyPrice = null;
      cumulativeProfit += profit;
    }
    signal.cumulativeProfit = cumulativeProfit;
  });

  return signals;
}

export function analyzeSmaPerformance(
  date_data: Date[],
  data: number[],
  shortRange: string,
  longRange: string
): SmaAnalysisResult[] {
  const parseRange = (range: string) => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  };

  const shortRangeParsed = parseRange(shortRange);
  const longRangeParsed = parseRange(longRange);

  const results: SmaAnalysisResult[] = [];

  for (
    let short = shortRangeParsed.start;
    short <= shortRangeParsed.end;
    short++
  ) {
    for (
      let long = longRangeParsed.start;
      long <= longRangeParsed.end;
      long++
    ) {
      if (short >= long) continue;

      const signals = generateSmaSignals(date_data, data, short, long);
      const positions = signals
        .map((signal) => signal.positions)
        .filter((pos) => pos !== null);
      const numberOfTrades = positions.filter((pos) => pos === 1).length;
      const profitableTrades = signals.filter(
        (signal) => signal.signalProfit !== null && signal.signalProfit > 0
      ).length;
      const winPercentage =
        numberOfTrades > 0 ? (profitableTrades / numberOfTrades) * 100 : 0;
      const cumulativeProfit = signals[signals.length - 1].cumulativeProfit;

      results.push({
        shortSma: short,
        longSma: long,
        cumulativeProfit,
        winPercentage,
        numberOfTrades,
      });
    }
  }
  return results;
}
