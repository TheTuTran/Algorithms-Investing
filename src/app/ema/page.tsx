"use client";
import {
  analyzeMovingAveragePerformance,
  getFormattedDates,
} from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useChartData } from "@/hooks/useChartData";
import { Tickers_dict } from "@/lib/data/tickers_dict";
import StockSearchForm from "@/components/stock-search-form";
import { Input } from "@/components/ui/input";
import { MA_AnalysisResult, StrategyType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const ExponentialMovingAverage = ({}) => {
  const { formattedToday, formattedLastYear } = getFormattedDates();
  const { fetchChartData } = useChartData();
  const [period1, setPeriod1] = useState(formattedLastYear);
  const [period2, setPeriod2] = useState(formattedToday);
  const [symbol, setSymbol] = useState("");
  const [curName, setCurName] = useState("");
  const [shortTermWindow, setShortTermWindow] = useState("");
  const [longTermWindow, setLongTermWindow] = useState("");
  const [smaData, setSmaData] = useState<MA_AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [considerLongEntries, setConsiderLongEntries] = useState(true);
  const [considerShortEntries, setConsiderShortEntries] = useState(false);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsLoading(true);

    if (symbol === "" || shortTermWindow === "" || longTermWindow === "") {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

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
      const fetchedData = await fetchChartData(symbol, period1, period2, "1d");
      localStorage.setItem("fetchedData", JSON.stringify(fetchedData));
      if (fetchedData) {
        const dates = fetchedData.map((entry) => entry.date);
        const closingPrices = fetchedData.map((entry) => entry.close);
        let strategyType;

        if (considerLongEntries && !considerShortEntries) {
          strategyType = StrategyType.Buying;
        } else if (!considerLongEntries && considerShortEntries) {
          strategyType = StrategyType.Shorting;
        } else if (considerLongEntries && considerShortEntries) {
          strategyType = StrategyType.Both;
        }
        if (!strategyType) {
          toast({
            title: "Error",
            description:
              "Please check one of the boxes for calculating profits based on buying, selling, or both.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        localStorage.setItem(
          "considerLongEntries",
          JSON.stringify(considerLongEntries)
        );
        localStorage.setItem(
          "considerShortEntries",
          JSON.stringify(considerShortEntries)
        );
        const analysisResults = analyzeMovingAveragePerformance(
          dates,
          closingPrices,
          shortTermWindow,
          longTermWindow,
          false,
          strategyType
        );
        setSmaData(analysisResults);
        setCurName(Tickers_dict[symbol] || symbol);
      } else {
        setSmaData([]);
      }
    } catch (error) {
      console.error("Error fetching stock data: ", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Find Best Exponential Moving Average Crossovers
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Spot trends and pinpoint trade opportunities with this Exponential
        Moving Average Crossover tool. Just choose a stock (some symbols may be
        missing from autofill), set your windows, choose your dates, and click
        &apos;Fetch&apos; to get started. Click on a row for more insights on
        when to buy and sell stock based on crossovers.
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        When the short term EMA crosses above the long term EMA, this is a sign
        of an uptrend, which indicates a buy. Vise versa, when the short term
        EMA crosses below the long term EMA, this is a sign of a downtrend,
        which indicates a sell.
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
        <div>
          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="considerLongEntries"
              checked={considerLongEntries}
              onCheckedChange={() => {
                setConsiderLongEntries(!considerLongEntries);
              }}
            />
            <label
              htmlFor="considerLongEntries"
              className="text-sm font-medium leading-none"
            >
              Consider Long Positions
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="considerShortEntries"
              checked={considerShortEntries}
              onCheckedChange={() => {
                setConsiderShortEntries(!considerShortEntries);
              }}
            />
            <label
              htmlFor="considerShortEntries"
              className="text-sm font-medium leading-none"
            >
              Consider Short Positions
            </label>
          </div>
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

export default ExponentialMovingAverage;
