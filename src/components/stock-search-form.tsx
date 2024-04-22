import React from "react";
import SearchBar from "@/components/search-bar";
import { Input } from "@/components/ui/input";

interface StockSearchFormProps {
  curName: string;
  setSymbol: React.Dispatch<React.SetStateAction<string>>;
  period1: string;
  setPeriod1: React.Dispatch<React.SetStateAction<string>>;
  period2: string;
  setPeriod2: React.Dispatch<React.SetStateAction<string>>;
}

const StockSearchForm: React.FC<StockSearchFormProps> = ({ curName, setSymbol, period1, setPeriod1, period2, setPeriod2 }) => {
  return (
    <>
      <div className="h-10 w-full pr-3 py-2 text-sm font-semibold mr-auto">Showing: {curName?.length > 19 ? `${curName.substring(0, 19)}...` : curName}</div>

      <SearchBar setSymbol={setSymbol} />
      <div className="h-10 py-2 text-sm font-semibold ml-auto">From:</div>
      <Input type="date" value={period1} onChange={(e) => setPeriod1(e.target.value)} className="max-w-[160px]" />
      <div className="h-10 py-2 text-sm font-semibold ml-auto">To:</div>
      <Input type="date" value={period2} onChange={(e) => setPeriod2(e.target.value)} className="max-w-[160px]" />
    </>
  );
};

export default StockSearchForm;
