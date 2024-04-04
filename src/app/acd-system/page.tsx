"use client";

import { Button } from "@/components/ui/button";
import { FC } from "react";
import { useChartData } from "@/hooks/useChartData";

interface ACDSystemProps {}

const ACDSystem: FC<ACDSystemProps> = ({}) => {
  const { fetchChartData } = useChartData();
  const handleSubmit = async () => {
    const symbol = "AAPL";
    const period1 = "2024-03-16";
    const period2 = "2024-03-22";
    const fetchedData = await fetchChartData(symbol, period1, period2, "1m");
    console.log(fetchedData);
  };
  return (
    <div>
      <Button onClick={handleSubmit}>Query</Button>
    </div>
  );
};

export default ACDSystem;
