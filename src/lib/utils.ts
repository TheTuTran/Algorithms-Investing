import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import yahooFinance from "yahoo-finance2";
import { MA_Signal, MA_AnalysisResult } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchHistoricalData(
  query: string,
  queryOptions: { period1: string; period2: string }
): Promise<any[]> {
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

function calculateEma(data: number[], period: number) {
  let ema: (number | null)[] = new Array(data.length).fill(null);
  let sma = calculateSma(data, period);

  for (let i = period; i < data.length; i++) {
    if (i === period) {
      ema[i] = sma[i - 1];
    } else if (ema[i - 1] !== null) {
      // (Last Day SMA * (Period - 1) + Curr Day Close) / Period
      // The 10 day EMA on Day 10 =  (Day 9 SMA x 9 + Day 10 close ) /10....  For clarity, the 10 day EMA on the 25th day is (day 24 SMA X 9 + day 25 close) / 10, etc.
      ema[i] = ((ema[i - 1] as number) * (period - 1) + data[i]) / period;
    }
  }

  return ema;
}

export function generateMovingAverageSignals(
  date_data: Date[],
  data: number[],
  fastSignal: number,
  slowSignal: number,
  isSMA: boolean
): MA_Signal[] {
  const signals: MA_Signal[] = data.map((price, index) => ({
    date: date_data[index],
    price,
    shortMA: null,
    longMA: null,
    holding: 0,
    positions: null,
    signalProfit: null,
    cumulativeProfit: 0,
  }));
  let shortMAs: (number | null)[];
  let longMAs: (number | null)[];

  if (isSMA) {
    shortMAs = calculateEma(data, fastSignal);
    longMAs = calculateEma(data, slowSignal);
  } else {
    shortMAs = calculateSma(data, fastSignal);
    longMAs = calculateSma(data, slowSignal);
  }

  signals.forEach((signal, index) => {
    signal.shortMA = shortMAs[index];
    signal.longMA = longMAs[index];

    if (signal.shortMA !== null && signal.longMA !== null) {
      signal.holding = signal.shortMA > signal.longMA ? 1 : 0;
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

export function analyzeMovingAveragePerformance(
  date_data: Date[],
  data: number[],
  shortRange: string,
  longRange: string,
  isSMA: boolean
): MA_AnalysisResult[] {
  const parseRange = (range: string) => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  };

  const shortRangeParsed = parseRange(shortRange);
  const longRangeParsed = parseRange(longRange);

  const results: MA_AnalysisResult[] = [];

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

      const signals = generateMovingAverageSignals(
        date_data,
        data,
        short,
        long,
        isSMA
      );
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
        shortMA: short,
        longMA: long,
        cumulativeProfit,
        winPercentage,
        numberOfTrades,
      });
    }
  }
  return results;
}
