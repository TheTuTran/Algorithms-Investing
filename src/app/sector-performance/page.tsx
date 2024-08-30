"use client";

// Import necessary components
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChartData } from "@/hooks/useChartData";
import { snp_array } from "@/lib/data/nasdaq_100";
import { getFormattedDates } from "@/lib/utils";

// Register ChartJS elements
ChartJS.register(ArcElement, Tooltip, Legend);

const SectorPerformance = () => {
  const { fetchChartData } = useChartData();
  const { formattedToday } = getFormattedDates();
  const [timeFrame, setTimeFrame] = useState<string>("Yesterday");
  const [progress, setProgress] = useState(0);
  const [sectorCharts, setSectorCharts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setProgress(0);
      const sectorData: { [key: string]: { profit: number; loss: number; unchanged: number } } = {};
      const days = timeFrame === "Yesterday" ? 1 : timeFrame === "Last Week" ? 7 : timeFrame === "Last Month" ? 30 : timeFrame === "Last 6 Months" ? 180 : 365;
      const period1Date = new Date();
      period1Date.setDate(period1Date.getDate() - days);

      for (const ticker of snp_array) {
        const { Symbol: symbol, Security: security, "GICS Sector": sector } = ticker;

        try {
          const data = await fetchChartData(symbol, period1Date.toISOString().split("T")[0], formattedToday, "1d");
          if (data) {
            const { close: firstClose } = data[0];
            const { close: lastClose } = data[data.length - 1];

            if (!sectorData[sector]) sectorData[sector] = { profit: 0, loss: 0, unchanged: 0 };
            if (lastClose > firstClose) {
              sectorData[sector].profit++;
            } else if (lastClose < firstClose) {
              sectorData[sector].loss++;
            } else {
              sectorData[sector].unchanged++;
            }
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}: ${error}`);
        }
        setProgress((prev) => prev + 1);
        if (progress == 503) break;
      }

      const charts = Object.keys(sectorData).map((sector) => ({
        sector,
        data: {
          labels: ["Profit", "Loss", "Unchanged"],
          datasets: [
            {
              data: [sectorData[sector].profit, sectorData[sector].loss, sectorData[sector].unchanged],
              backgroundColor: ["#4CAF50", "#F44336", "#9E9E9E"],
              hoverBackgroundColor: ["#66BB6A", "#EF5350", "#BDBDBD"],
            },
          ],
        },
      }));

      setSectorCharts(charts);
    };

    fetchData();
  }, [timeFrame]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sector Performance (testing)</h1>
      <hr className="mb-4" />
      <div className="flex gap-4 items-center mb-4">
        <p className="text-sm text-muted-foreground">Searched through {progress} out of 503</p>
        <Select onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={timeFrame} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yesterday">Yesterday</SelectItem>
            <SelectItem value="Last Week">Last Week</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="Last Year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sectorCharts.map((chart) => (
        <div key={chart.sector} className="p-4 border rounded shadow-sm bg-foreground/5">
          <h3 className="text-center font-bold">{chart.sector}</h3>
          <div style={{ height: "200px" }}>
            <Pie data={chart.data} options={chart.options} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectorPerformance;
