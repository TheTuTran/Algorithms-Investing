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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const FindStocks = () => {
  const [loading, setLoading] = useState(false);
  const { fetchChartData } = useChartData();
  const { formattedToday } = getFormattedDates();
  const [stochasticPeriod, setStochasticPeriod] = useState<number | null>(null);
  const [stochasticLevel, setStochasticLevel] = useState<number | null>(null);
  const [stochasticDirection, setStochasticDirection] =
    useState<string>("above");
  const [smaValue, setSmaValue] = useState<number | null>(null);
  const [smaDirection, setSmaDirection] = useState<string>("above");
  const [interval, setInterval] = useState<string>("1d");
  const [progress, setProgress] = useState(0);
  const [matchingStock, setMatchingStock] = useState<
    { symbol: string; security: string; industry: string; date: Date }[]
  >([]);

  const handleFetch = async () => {
    setMatchingStock([]);
    setLoading(true);
    setProgress(0);

    if (
      !smaValue ||
      !stochasticPeriod ||
      !stochasticLevel ||
      !stochasticDirection ||
      !smaDirection
    ) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    const results = [];
    const days =
      interval == "1d" || interval == "5d"
        ? 365
        : interval == "1mo" || interval == "3mo"
        ? (stochasticPeriod + 1) * 90
        : (stochasticPeriod + 1) * 365;
    const larger_period = Math.max(smaValue, stochasticPeriod, days);
    const period1Date = new Date();
    period1Date.setDate(period1Date.getDate() - larger_period);

    for (const ticker of snp_array) {
      const symbol = ticker.Symbol;
      const security = ticker.Security;
      const industry = ticker["GICS Sector"];

      try {
        const data = await fetchChartData(
          symbol,
          period1Date.toISOString().split("T")[0],
          formattedToday,
          interval
        );

        if (data && data.length) {
          const closes = data.map((d) => d.close);
          const highs = data.map((d) => d.high);
          const lows = data.map((d) => d.low);
          const smaValues = calculateSma(closes, smaValue);
          const stochasticValues = calculateStochastic(
            closes,
            highs,
            lows,
            stochasticPeriod
          );

          for (
            let i = closes.length;
            i > Math.max(smaValue, stochasticPeriod);
            i--
          ) {
            if (
              smaValues[i] !== null &&
              smaValues[i - 1] &&
              stochasticValues[i] !== null &&
              stochasticValues[i - 1]
            ) {
              const smaCondition =
                smaDirection === "above"
                  ? closes[i] > smaValues[i]!
                  : closes[i] < smaValues[i]!;
              const stochasticCondition =
                stochasticDirection === "above"
                  ? stochasticValues[i]! > stochasticLevel &&
                    stochasticValues[i - 1]! < stochasticLevel
                  : stochasticValues[i]! < stochasticLevel &&
                    stochasticValues[i - 1]! > stochasticLevel;

              if (smaCondition && stochasticCondition) {
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
        Symbol, Stock Name, and Sector is self explanatory. The date is the most
        recent date of the oscillator crossing above the inputted stochastic
        level. The stochastic oscillator is the derivative of the derivative of
        the oscillator with a 3 day sma period for each derivative. If a stock
        appears to have matched the following indicators, then it will appear
        below with the date that it happened. The indicator is when the
        oscillator crosses above/below the stochastic level with the closing
        price above/below the inputted sma
      </p>

      <hr className="mb-4" />

      <div className="w-full mb-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-sm font-semibold">
            Get signal when oscillator
          </span>
          <Select onValueChange={(value) => setStochasticDirection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Crosses Above" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Crosses Above </SelectItem>
              <SelectItem value="below">Crosses Below </SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Stochastic (e.g. 20, 30, 70, ...)"
            value={stochasticLevel ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setStochasticLevel(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setStochasticLevel(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-sm font-semibold">
            Stochastic Period
          </span>
          <Input
            type="text"
            placeholder="# of Intervals (e.g. 10, 14, ...)"
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
      <div className="w-full mb-4 flex gap-6">
        <div className="flex gap-2 ">
          <span className="h-10 py-2 text-sm font-semibold pr-[4.34px]">
            When the closing price is
          </span>
          <Select onValueChange={(value) => setSmaDirection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Above" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above </SelectItem>
              <SelectItem value="below">Below </SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="SMA (e.g. 5, 10, 20, ...)"
            value={smaValue ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setSmaValue(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setSmaValue(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <div className="flex items-center gap-2 ">
          <span className="h-10 py-2 text-sm font-semibold pr-[31.02px] ">
            Time Interval
          </span>
          <Select onValueChange={(value) => setInterval(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="1 Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="5d">5 Day </SelectItem>
              <SelectItem value="1mo">1 Month </SelectItem>
              <SelectItem value="3mo">3 Month </SelectItem>
              <SelectItem value="1y">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full mb-4 flex gap-6">
        <div className="flex gap-2 ">
          <span className="h-10 py-2 text-sm font-semibold pr-[48.11px]">
            When the MACD is
          </span>
          <Select onValueChange={(value) => setSmaDirection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Above" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above </SelectItem>
              <SelectItem value="below">Below </SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="(WORK IN PROGRESS) Base line (e.g. -10, 0, 10, ...)"
            value={smaValue ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setSmaValue(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setSmaValue(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
      </div>
      <div className="w-full mb-4 flex gap-6">
        <div className="flex gap-2">
          <span className="h-10 py-2 text-sm font-semibold pr-[68.96px]">
            When the RSI is
          </span>
          <Select onValueChange={(value) => setSmaDirection(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Above" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above </SelectItem>
              <SelectItem value="below">Below </SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="(WORK IN PROGRESS) RSI level (e.g. 30, 70, ...)"
            value={smaValue ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setSmaValue(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setSmaValue(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <p className="text-sm text-muted-foreground pt-[12px]">
          Searched through {progress} out of 503 Symbols
        </p>

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
