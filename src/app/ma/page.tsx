"use client";
import { getFormattedDates } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useStockData } from "@/hooks/useStockData";
import { Tickers_dict } from "@/lib/data/nasdaq_tickers_dict";
import StockSearchForm from "@/components/stock-search-form";
import { Input } from "@/components/ui/input";

const MovingAverage = ({}) => {
  const { formattedToday, formattedLastYear } = getFormattedDates();
  const { historicalData, fetchStockData } = useStockData();
  const [period1, setPeriod1] = useState(formattedLastYear);
  const [period2, setPeriod2] = useState(formattedToday);
  const [symbol, setSymbol] = useState("");
  const [curName, setCurName] = useState("");
  const [shortTermWindow, setShortTermWindow] = useState("");
  const [longTermWindow, setLongTermWindow] = useState("");

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await fetchStockData(symbol, period1, period2);
    setCurName(Tickers_dict[symbol]);
  };

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Find Best Moving Average Crossovers
      </h1>
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
        {historicalData && (
          <DataTable columns={columns} data={historicalData} />
        )}
      </div>
    </div>
  );
};

export default MovingAverage;
