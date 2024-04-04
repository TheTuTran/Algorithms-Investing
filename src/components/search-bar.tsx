import React, { useState, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Tickers_dict } from "@/lib/data/tickers_dict";

interface SearchBarProps {
  setSymbol: (symbol: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSymbol }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSymbol(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const matchedSuggestions = Object.keys(Tickers_dict)
      .filter((symbol) => symbol.toLowerCase().startsWith(value.toLowerCase()))
      .slice(0, 5); // Limiting to first 5 matches

    setSuggestions(matchedSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSymbol(suggestion);
    setSymbol(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <div className="flex">
        <div className="h-10 py-2 text-sm font-semibold ml-auto">Symbol:</div>
        <Input
          type="text"
          placeholder="(e.g., AAPL, TSLA, ..)"
          onChange={handleChange}
          className="hover:border-blue-500 max-w-[180px] ml-auto"
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
