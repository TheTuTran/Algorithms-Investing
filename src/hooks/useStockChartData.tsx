import { useState } from "react";
import { StockData } from "@/lib/types";

export const useStockData = () => {
  const [chartData, setChartData] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchStockChartData = async (
    symbol: string,
    period1: string,
    period2: string
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
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      await response.json().then((data) => {
        console.log(data);
        setChartData(data);
        return data;
      });
    } catch (error: any) {
      setError(error.message || "Failed to fetch historical data");
    } finally {
      setIsLoading(false);
    }
  };

  return { chartData, fetchStockChartData, isLoading, error };
};
