import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import yahooFinance from "yahoo-finance2";
import { MA_Signal, MA_AnalysisResult, StrategyType } from "./types";

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

export function calculateStochastic(
  close: number[],
  high: number[],
  low: number[],
  period: number
): number[] {
  // Initialize the array for %K values
  let percentK: number[] = [];

  // Start the loop from the point where the first calculation is possible
  for (let i = period - 1; i < close.length; i++) {
    // Find the highest high and the lowest low in the last `period` candles
    let periodHighs = high.slice(i - period + 1, i + 1);
    let periodLows = low.slice(i - period + 1, i + 1);
    let highestHigh = Math.max(...periodHighs);
    let lowestLow = Math.min(...periodLows);

    // Calculate %K using the formula
    let currentClose = close[i];

    // Handle the case where highestHigh somehow equals lowestLow to avoid division by zero
    if (highestHigh === lowestLow) {
      percentK.push(0);
    } else {
      let kValue =
        ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
      percentK.push(kValue);
    }
  }

  let initialNulls = new Array(period - 1).fill(null);

  return [...initialNulls, ...percentK];
}

export function generateMovingAverageSignals(
  date_data: Date[],
  data: number[],
  fastSignal: number,
  slowSignal: number,
  isSMA: boolean,
  strategyType: StrategyType,
  stochastic?: number[],
  overboughtLevel?: number,
  oversoldLevel?: number
): MA_Signal[] {
  const signals: MA_Signal[] = data.map((price, index) => ({
    date: date_data[index],
    price,
    fastMA: null,
    slowMA: null,
    holding: 0,
    positions: null,
    signalProfit: null,
    cumulativeProfit: 0,
  }));

  let fastMAs = isSMA
    ? calculateSma(data, fastSignal)
    : calculateEma(data, fastSignal);
  let slowMAs = isSMA
    ? calculateSma(data, slowSignal)
    : calculateEma(data, slowSignal);

  // This is the logic to see if holding long or short position or none
  if (stochastic) {
    signals.forEach((signal, index) => {
      signal.fastMA = fastMAs[index];
      signal.slowMA = slowMAs[index];
      const stochCondition =
        overboughtLevel &&
        oversoldLevel &&
        stochastic &&
        stochastic[index] !== undefined;

      if (signal.fastMA !== null && signal.slowMA !== null && stochCondition) {
        if (
          stochastic[index] > overboughtLevel &&
          signal.fastMA < signal.slowMA
        ) {
          // MA indicates sell, but Stochastic indicates overbought - do nothing or consider selling if your strategy allows
          signal.holding = -1;
        } else if (
          stochastic[index] < oversoldLevel &&
          signal.fastMA > signal.slowMA
        ) {
          // MA indicates buy, but Stochastic indicates oversold - do nothing or consider buying if your strategy allows
          signal.holding = 1;
        } else if (
          stochastic[index] <= overboughtLevel &&
          stochastic[index] >= oversoldLevel
        ) {
          // Stochastic is neutral do nothing
          signal.holding = 0;
        }
      }
    });
  } else {
    console.log("no stochastic exist doing just MA thing");
    signals.forEach((signal, index) => {
      signal.fastMA = fastMAs[index];
      signal.slowMA = slowMAs[index];

      if (signal.fastMA !== null && signal.slowMA !== null) {
        // Stochastic not applicable, follow the MA signal
        signal.holding =
          signal.fastMA > signal.slowMA
            ? 1
            : signal.fastMA < signal.slowMA
            ? -1
            : 0;
      }
    });
  }

  // Position represents buying or selling a stock
  for (let i = 1; i < signals.length; i++) {
    if (signals[i].holding !== signals[i - 1].holding) {
      signals[i].positions = signals[i].holding;
    }
  }

  let cumulativeProfit = 0;
  let positionEntryPrice: number | null = null;

  signals.forEach((signal, index) => {
    const prevSignal = index > 0 ? signals[index - 1] : null;

    switch (strategyType) {
      case StrategyType.Buying:
        if (signal.positions === 1) {
          // Enter buy position
          positionEntryPrice = signal.price;
        } else if (signal.positions === -1 && positionEntryPrice !== null) {
          // Exit buy position
          const sellPrice = signal.price;
          const profit = sellPrice - positionEntryPrice;
          signal.signalProfit = profit;
          positionEntryPrice = null;
          cumulativeProfit += profit;
        }
        break;

      case StrategyType.Shorting:
        if (signal.positions === -1) {
          // Enter short position
          positionEntryPrice = signal.price;
        } else if (signal.positions === 1 && positionEntryPrice !== null) {
          // Exit short position
          const coverPrice = signal.price;
          const profit = positionEntryPrice - coverPrice;
          signal.signalProfit = profit;
          positionEntryPrice = null;
          cumulativeProfit += profit;
        }
        break;

      case StrategyType.Both:
        if (signal.positions === 1) {
          if (
            prevSignal &&
            prevSignal.holding === -1 &&
            positionEntryPrice !== null
          ) {
            // Switching from short to buy
            // Calculate profit from shorting
            const profit = positionEntryPrice - signal.price;
            signal.signalProfit = profit;
            cumulativeProfit += profit;
          }
          // Enter buy position
          positionEntryPrice = signal.price;
        } else if (signal.positions === -1) {
          if (
            prevSignal &&
            prevSignal.holding === 1 &&
            positionEntryPrice !== null
          ) {
            // Switching from buy to short
            // Calculate profit from buying
            const profit = signal.price - positionEntryPrice;
            signal.signalProfit = profit;
            cumulativeProfit += profit;
          }
          // Enter short position
          positionEntryPrice = signal.price;
        } else if (signal.positions === 0 && positionEntryPrice !== null) {
          // Exiting a position to nonne position
          const profit =
            signal.holding === 1
              ? signal.price - positionEntryPrice // Exiting a buy to none position
              : positionEntryPrice - signal.price; // Exiting a short to none position
          signal.signalProfit = profit;
          cumulativeProfit += profit;
          positionEntryPrice = null;
        }
        break;
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
  isSMA: boolean,
  strategyType: StrategyType,
  stochastic?: number[],
  overboughtLevel?: number,
  oversoldLevel?: number
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
        isSMA,
        strategyType,
        stochastic,
        overboughtLevel,
        oversoldLevel
      );
      const positions = signals
        .map((signal) => signal.positions)
        .filter((pos) => pos !== null);

      let numberOfTrades;

      switch (strategyType) {
        case StrategyType.Buying:
          numberOfTrades = positions.filter((pos) => pos === 1).length;
          break;
        case StrategyType.Shorting:
          numberOfTrades = positions.filter((pos) => pos === -1).length;
          break;
        case StrategyType.Both:
          numberOfTrades = positions.filter(
            (pos) => pos === 1 || pos === -1
          ).length;
          break;
      }
      let profitableTrades = signals.filter(
        (signal) => signal.signalProfit !== null && signal.signalProfit > 0
      ).length;
      const winPercentage =
        numberOfTrades > 0 ? (profitableTrades / numberOfTrades) * 100 : 0;
      const cumulativeProfit = signals[signals.length - 1].cumulativeProfit;
      results.push({
        fastMA: short,
        slowMA: long,
        cumulativeProfit,
        winPercentage,
        numberOfTrades,
      });
    }
  }
  return results;
}
