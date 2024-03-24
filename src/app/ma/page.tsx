"use client";
import {
  analyzeMovingAveragePerformance,
  getFormattedDates,
} from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStockData } from "@/hooks/useStockData";
import { Tickers_dict } from "@/lib/data/nasdaq_tickers_dict";
import StockSearchForm from "@/components/stock-search-form";
import { Input } from "@/components/ui/input";
import { MA_AnalysisResult } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

const MovingAverage = ({}) => {
  const { formattedToday, formattedLastYear } = getFormattedDates();
  const { fetchStockData } = useStockData();
  const [period1, setPeriod1] = useState(formattedLastYear);
  const [period2, setPeriod2] = useState(formattedToday);
  const [symbol, setSymbol] = useState("");
  const [curName, setCurName] = useState("");
  const [shortTermWindow, setShortTermWindow] = useState("");
  const [longTermWindow, setLongTermWindow] = useState("");
  const [smaData, setSmaData] = useState<MA_AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsLoading(true);
    // Validate input contents
    if (symbol === "" || shortTermWindow === "" || longTermWindow === "") {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate shortTermWindow and longTermWindow format ("number-number")
    const windowFormatRegex = /^\d+-\d+$/;
    if (
      !windowFormatRegex.test(shortTermWindow) ||
      !windowFormatRegex.test(longTermWindow)
    ) {
      toast({
        title: "Error",
        description:
          "The window format is incorrect. Please use the 'number-number' format.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const fetchedData = await fetchStockData(symbol, period1, period2);
      localStorage.setItem("fetchedData", JSON.stringify(fetchedData));
      if (fetchedData) {
        const dates = fetchedData.map((entry) => entry.date);
        const closingPrices = fetchedData.map((entry) => entry.close);
        const analysisResults = analyzeMovingAveragePerformance(
          dates,
          closingPrices,
          shortTermWindow,
          longTermWindow,
          true
        );
        setSmaData(analysisResults);
        setCurName(Tickers_dict[symbol] || symbol);
      } else {
        setSmaData([]);
        console.log("No data fetched or data is empty.");
      }
    } catch (error) {
      console.error("Error fetching stock data: ", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Find Best Moving Average Crossovers
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Spot trends and pinpoint trade opportunities with this Moving Average
        Crossover tool. Just choose a stock (some symbols may be missing from
        autofill), set your windows, choose your dates, and click
        &apos;Fetch&apos; to get started. Click on a row for more insights on
        when to buy and sell stock based on crossovers.
      </p>
      <hr className="mb-4" />
      <div className="w-full flex gap-4 mb-4">
        <StockSearchForm
          curName={curName}
          setSymbol={setSymbol}
          period1={period1}
          setPeriod1={setPeriod1}
          period2={period2}
          setPeriod2={setPeriod2}
        />
      </div>
      <div className="w-full mb-4 flex items-center gap-4 justify-between">
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-md font-semibold">
            Short Term Window:
          </span>
          <Input
            type="text"
            placeholder="Fast (e.g. 1-10)"
            value={shortTermWindow}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setShortTermWindow(value);
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-md font-semibold">
            Long Term Window:
          </span>
          <Input
            type="text"
            placeholder="Slow (e.g., 10-50)"
            value={longTermWindow}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              setLongTermWindow(value);
            }}
            className="hover:border-blue-500 max-w-[180px]"
          />
        </div>
        <Button onClick={handleSubmit} className="btn btn-primary self-start">
          Fetch
        </Button>
      </div>
      <div className="w-full">
        <DataTable isLoading={isLoading} columns={columns} data={smaData} />
      </div>
    </div>
  );
};

export default MovingAverage;
