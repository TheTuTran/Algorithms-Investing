"use client";

import { Button } from "@/components/ui/button";
import { FC } from "react";
import { useStockData } from "@/hooks/useStockChartData";

interface ACDSystemProps {}

const ACDSystem: FC<ACDSystemProps> = ({}) => {
  const { chartData, fetchStockChartData } = useStockData();
  const handleSubmit = async () => {
    const symbol = "AAPL";
    const period1 = "2024-03-16";
    const period2 = "2024-03-22";
    fetchStockChartData(symbol, period1, period2).then((result) => {
      console.log("pg result", result);
      console.log("chartData", chartData);
    });
  };
  return (
    <div>
      <Button onClick={handleSubmit}>Query</Button>
    </div>
  );
};

export default ACDSystem;
