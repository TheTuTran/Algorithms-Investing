import { useState } from "react";
import { StockData } from "@/lib/utils";

export const useStockData = () => {
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchStockData = async (
    symbol: string,
    period1: string,
    period2: string
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          period1,
          period2,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data: StockData[] = await response.json();
      setHistoricalData(data.reverse());
    } catch (error: any) {
      setError(error.message || "Failed to fetch historical data");
    } finally {
      setIsLoading(false);
    }
  };

  return { historicalData, fetchStockData, isLoading, error };
};
