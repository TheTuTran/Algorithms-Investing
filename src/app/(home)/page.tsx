"use client";
import { getFormattedDates } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStockData } from "@/hooks/useStockData";
import { Tickers_dict } from "@/lib/data/nasdaq_tickers_dict";
import StockSearchForm from "@/components/stock-search-form";

export default function HomePage() {
  const { formattedToday, formattedLastYear } = getFormattedDates();
  const [period1, setPeriod1] = useState(formattedLastYear);
  const [period2, setPeriod2] = useState(formattedToday);
  const [symbol, setSymbol] = useState("");
  const { historicalData, fetchStockData } = useStockData();
  const [curName, setCurName] = useState("");

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    await fetchStockData(symbol, period1, period2);
    setCurName(Tickers_dict[symbol]);
  };

  return (
    <div className="flex flex-col mt-8">
      <h1 className="text-2xl font-bold mb-4">Historical Data</h1>
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
      <div className="w-full mb-4 flex ">
        <Button
          onClick={handleSubmit}
          className="btn btn-primary self-start ml-auto "
        >
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
}
