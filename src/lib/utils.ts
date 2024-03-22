import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import yahooFinance from "yahoo-finance2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StockData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose?: number | undefined;
  volume: number;
}

interface QueryOptions {
  period1: string;
  period2: string;
}

export async function fetchHistoricalData(
  query: string,
  queryOptions: QueryOptions
): Promise<StockData[]> {
  try {
    const results = await yahooFinance.historical(query, queryOptions);
    return results;
  } catch (error) {
    console.error("Failed to fetch historical data:", error);
    throw new Error("Failed to fetch historical data");
  }
}

export const getFormattedDates = () => {
  const today = new Date();
  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));

  return {
    formattedToday: today.toISOString().split("T")[0],
    formattedLastYear: lastYear.toISOString().split("T")[0],
  };
};

interface SMA_Signal {
  price: number;
  shortSma: number | null;
  longSma: number | null;
  signal: number;
  positions: number | null;
  signalProfit: number | null;
  cumulativeProfit: number;
}

function calculateSma(data: number[], window: number): (number | null)[] {
  let sma: (number | null)[] = new Array(data.length).fill(null);

  for (let i = window - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < window; j++) {
      sum += data[i - j];
    }
    sma[i] = sum / window;
  }

  return sma;
}

function generateSignals(
  data: number[],
  shortWindow: number,
  longWindow: number
): SMA_Signal[] {
  let signals: SMA_Signal[] = data.map((price, index) => ({
    price,
    shortSma: null,
    longSma: null,
    signal: 0,
    positions: null,
    signalProfit: null,
    cumulativeProfit: 0,
  }));

  signals.forEach((_, index) => {
    signals[index].shortSma = calculateSma(data, shortWindow)[index];
    signals[index].longSma = calculateSma(data, longWindow)[index];
    if (index >= shortWindow) {
      signals[index].signal =
        signals[index].shortSma! > signals[index].longSma! ? 1 : 0;
    }
  });

  for (let i = 1; i < signals.length; i++) {
    signals[i].positions = signals[i].signal - signals[i - 1].signal;
  }

  let buyPrice: number | null = null;
  signals.forEach((signal, index) => {
    if (signal.positions === 1) {
      buyPrice = signal.price;
    } else if (signal.positions === -1 && buyPrice !== null) {
      let sellPrice = signal.price;
      let profit = sellPrice - buyPrice;
      signals[index].signalProfit = profit;
      buyPrice = null;
    }
  });

  let cumulativeProfit = 0;
  signals.forEach((signal, index) => {
    if (signal.signalProfit !== null) {
      cumulativeProfit += signal.signalProfit;
    }
    signals[index].cumulativeProfit = cumulativeProfit;
  });

  return signals;
}

function testSmaCombinations(
  data: number[],
  shortWindowRange: [number, number],
  longWindowRange: [number, number]
): [any[], [number, number], number] {
  let bestProfit = -Infinity;
  let bestCombination: [number, number] = [0, 0];
  let results: any[] = [];

  for (
    let shortWindow = shortWindowRange[0];
    shortWindow <= shortWindowRange[1];
    shortWindow++
  ) {
    for (
      let longWindow = longWindowRange[0];
      longWindow <= longWindowRange[1];
      longWindow++
    ) {
      if (shortWindow >= longWindow) continue; // Skip invalid combinations

      let signals = generateSignals(data, shortWindow, longWindow);
      let cumulativeProfit = signals[signals.length - 1].cumulativeProfit;
      let profitableSignals = signals
        .filter((s) => s.signalProfit !== null)
        .map((s) => s.signalProfit!);
      let profitPercentage =
        (profitableSignals.filter((p) => p > 0).length /
          profitableSignals.length) *
        100;
      let numberOfTrades = profitableSignals.length;

      results.push({
        shortWindow,
        longWindow,
        cumulativeProfit,
        profitPercentage,
        numberOfTrades,
      });

      if (cumulativeProfit > bestProfit) {
        bestProfit = cumulativeProfit;
        bestCombination = [shortWindow, longWindow];
      }
    }
  }

  return [results, bestCombination, bestProfit];
}
