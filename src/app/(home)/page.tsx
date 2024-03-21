"use client";
import { StockData } from "@/lib/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";

export default function HomePage() {
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const lastYear = new Date(new Date().setFullYear(today.getFullYear() - 1));
  const formattedLastYear = lastYear.toISOString().split("T")[0];
  const [period1, setPeriod1] = useState(formattedLastYear);
  const [period2, setPeriod2] = useState(formattedToday);
  const [symbol, setSymbol] = useState("");
  const [curSymbol, setCurSymbol] = useState("");
  const [historicalData, setHistoricalData] = useState<StockData[]>([]);

  const handleSubmit = async (ev: { preventDefault: () => void }) => {
    ev.preventDefault();

    try {
      const response = await fetch("/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: symbol,
          period1: period1,
          period2: period2,
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setHistoricalData(data.reverse());
      setCurSymbol(symbol);
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Historical Data</h1>
      <div className="w-full flex gap-4 mb-4">
        <div className="h-10 w-full pr-3 py-2 text-md font-semibold mr-auto">
          Showing: {curSymbol}
        </div>
        <SearchBar setSymbol={setSymbol} />
        <div className="h-10 py-2 text-md font-semibold ml-auto">From:</div>
        <Input
          type="date"
          value={period1}
          onChange={(e) => setPeriod1(e.target.value)}
          className="max-w-[160px]"
        />
        <div className="h-10 py-2 text-md font-semibold ml-auto">To:</div>
        <Input
          type="date"
          value={period2}
          onChange={(e) => setPeriod2(e.target.value)}
          className="max-w-[160px]"
        />
        <Button onClick={handleSubmit} className="btn btn-primary">
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
