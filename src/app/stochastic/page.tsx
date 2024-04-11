"use client";
import {
  analyzeStochasticPerformance,
  calculateStochastic,
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
import { Stoch_AnalysisResult, StrategyType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const Stochastic = ({}) => {
  const { formattedToday, formattedLastYear } = getFormattedDates();
  const { fetchChartData } = useChartData();
  const [period1, setPeriod1] = useState(formattedLastYear);
  const [period2, setPeriod2] = useState(formattedToday);
  const [symbol, setSymbol] = useState("");
  const [curName, setCurName] = useState("");
  const [stochasticData, setStochasticData] = useState<Stoch_AnalysisResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [considerLongEntries, setConsiderLongEntries] = useState(true);
  const [considerShortEntries, setConsiderShortEntries] = useState(false);
  const [stochasticPeriod, setStochasticPeriod] = useState<number | null>(null);
  const [oversoldStochastic, setOversoldStochastic] = useState<number | null>(
    null
  );
  const [overboughtStochastic, setOverboughtStochastic] = useState<
    number | null
  >(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setIsLoading(true);
    // Validate input contents
    if (
      symbol === "" ||
      stochasticPeriod === null ||
      oversoldStochastic === null ||
      overboughtStochastic === null
    ) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate stochastic
    if (
      oversoldStochastic < 0 ||
      oversoldStochastic > 100 ||
      overboughtStochastic < 0 ||
      overboughtStochastic > 100 ||
      stochasticPeriod <= 0
    ) {
      toast({
        title: "Error",
        description:
          "One or some of the Stochastic inputs are out of acceptable range. Make sure your stochastic is within 0-100 and the period is greater than 0",
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

        const highPrices = fetchedData.map((entry) => entry.high);
        const lowPrices = fetchedData.map((entry) => entry.low);
        const stochastic = calculateStochastic(
          closingPrices,
          highPrices,
          lowPrices,
          stochasticPeriod
        );
        localStorage.setItem(
          "stochasticPeriod",
          JSON.stringify(stochasticPeriod)
        );
        const analysisResults = analyzeStochasticPerformance(
          dates,
          closingPrices,
          stochastic,
          oversoldStochastic,
          overboughtStochastic,
          strategyType
        );

        setStochasticData(analysisResults);
        setCurName(Tickers_dict[symbol] || symbol);
      } else {
        setStochasticData([]);
      }
    } catch (error) {
      console.error("Error fetching stock data: ", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Find Indicators Based on a Stochastic crossover
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        When the stochastic crosses above the oversold level and back down,
        it'll indicate a buy signal. When the stochastic crosses below the
        oversold level and back up, it'll indicate a sell signal.
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
      <div className="w-full mb-4 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="h-10 py-2 text-sm font-semibold">
            Oversold Stoch. Level :
          </span>
          <Input
            type="text"
            placeholder="% (e.g., 20, 30, ...)"
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
        <div className="mr-auto flex items-center gap-2 ml-4">
          <span className="h-10 py-2 text-sm font-semibold">
            Overbought Stoch. Level :
          </span>
          <Input
            type="text"
            placeholder="% (e.g., 80, 70, ...)"
            value={overboughtStochastic ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              if (value === "") {
                setOverboughtStochastic(null);
              } else {
                const numValue = Number(value);
                if (!isNaN(numValue)) {
                  setOverboughtStochastic(numValue);
                }
              }
            }}
            className="hover:border-blue-500 max-w-[163px]"
          />
        </div>
        <div className="mr-auto flex items-center gap-2 ml-4">
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
      <div className="w-full mb-4 flex items-center gap-2 justify-between">
        <div className="ml-auto mr-4">
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
        <DataTable
          isLoading={isLoading}
          columns={columns}
          data={stochasticData}
        />
      </div>
    </div>
  );
};

export default Stochastic;
