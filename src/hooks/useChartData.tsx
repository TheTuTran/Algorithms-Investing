import { useState } from "react";
import { Quote, StockData } from "@/lib/types";

export const useChartData = () => {
  const [chartData, setChartData] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchChartData = async (
    symbol: string,
    period1: string,
    period2: string,
    interval: string
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chartStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol,
          period1,
          period2,
          interval,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data: StockData = await response.json();

      setChartData(data.quotes);
      return data.quotes;
    } catch (error: any) {
      setError(error.message || "Failed to fetch historical data");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { chartData, fetchChartData, isLoading, error };
};
