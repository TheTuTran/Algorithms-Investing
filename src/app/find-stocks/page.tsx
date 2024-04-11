"use client";

import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  calculateSma,
  calculateStochastic,
  getFormattedDates,
} from "@/lib/utils";
import { snp_array } from "@/lib/data/snp_500";
import { useChartData } from "@/hooks/useChartData";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { toast } from "@/components/ui/use-toast";

const FindStocks = () => {
  const [loading, setLoading] = useState(false);
  const { fetchChartData } = useChartData();
  const { formattedToday } = getFormattedDates();
  const [stochasticPeriod, setStochasticPeriod] = useState<number | null>(null);
  const [oversoldStochastic, setOversoldStochastic] = useState<number | null>(
    null
  );

  const [fastMA, setFastMA] = useState<number | null>(null);
  const [slowMA, setSlowMA] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [matchingStock, setMatchingStock] = useState<
    { symbol: string; security: string; industry: string; date: Date }[]
  >([]);

  const handleFetch = async () => {
    setLoading(true);
    setProgress(0);

    const results = [];
    const larger_period =
      Math.max(slowMA ?? 0, oversoldStochastic ?? 0, stochasticPeriod ?? 0) + 1;
    const period1Date = new Date();
    period1Date.setDate(period1Date.getDate() - larger_period);
    console.log(period1Date);

    if (!slowMA || !fastMA || !stochasticPeriod || !oversoldStochastic) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    for (let ticker of snp_array) {
      const symbol = ticker.Symbol;
      const security = ticker.Security;
      const industry = ticker["GICS Sector"];

      try {
        const data = await fetchChartData(
          symbol,
          period1Date.toISOString().split("T")[0],
          formattedToday,
          "1d"
        );

        if (data && data.length) {
          const closes = data.map((d) => d.close);
          const highs = data.map((d) => d.high);
          const lows = data.map((d) => d.low);

          const fastSmaValues = calculateSma(closes, fastMA);
          const slowSmaValues = calculateSma(closes, slowMA);
          const stochasticValues = calculateStochastic(
            closes,
            highs,
            lows,
            stochasticPeriod
          );

          for (
            let i = Math.max(fastMA, slowMA, stochasticPeriod);
            i < closes.length;
            i++
          ) {
            if (
              fastSmaValues[i] !== null &&
              slowSmaValues[i] !== null &&
              stochasticValues[i] !== null
            ) {
              if (
                fastSmaValues[i]! > slowSmaValues[i]! &&
                stochasticValues[i]! > oversoldStochastic &&
                stochasticValues[i - 1]! < oversoldStochastic
              ) {
                console.log(symbol);
                results.push({
                  symbol,
                  security,
                  industry,
                  date: data[i].date,
                });
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data for symbol:", symbol, error);
      }
      setProgress((prevProgress) => prevProgress + 1);
    }

    setMatchingStock(results);
    setLoading(false);
  };

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Find Stocks based on the following indicators
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Searched through {progress} out of 503
      </p>
      <hr className="mb-4" />

      <div className="w-full mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-sm font-semibold">
            Oversold Stoch. Level :
          </span>
          <Input
            type="text"
            placeholder="% (e.g., 10, 20, 30, ...)"
            value={oversoldStochastic ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setOversoldStochastic(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setOversoldStochastic(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[163px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-sm font-semibold">
            Stoch. Period :
          </span>
          <Input
            type="text"
            placeholder="Days (e.g. 10, 14, ...)"
            value={stochasticPeriod ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setStochasticPeriod(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setStochasticPeriod(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[163px]"
          />
        </div>
      </div>
      <div className="w-full mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2 ">
          <span className="h-10 py-2 text-sm font-semibold ">
            Fast SMA Window:
          </span>
          <Input
            type="text"
            placeholder="Fast (e.g. 5, 10, 20, ...)"
            value={fastMA ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setFastMA(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setFastMA(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-sm font-semibold">
            Slow SMA Window:
          </span>
          <Input
            type="text"
            placeholder="Slow (e.g., 10, 20, 50, ...)"
            value={slowMA ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setSlowMA(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setSlowMA(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <Button
          onClick={handleFetch}
          disabled={loading}
          className="btn btn-primary self-start ml-auto"
        >
          Fetch
        </Button>
      </div>
      <div className="w-full">
        <DataTable isLoading={loading} columns={columns} data={matchingStock} />
      </div>
    </div>
  );
};

export default FindStocks;
