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
