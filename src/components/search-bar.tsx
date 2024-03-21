import React, { useState, ChangeEvent } from "react";
import { Tickers } from "@/lib/data/nasdaq_tickers";
import { Input } from "./ui/input";

interface SearchBarProps {
  setSymbol: (symbol: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSymbol }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const matchedSuggestions = Tickers.filter(
      (ticker) =>
        ticker.Symbol &&
        ticker.Symbol.toLowerCase().startsWith(value.toLowerCase())
    ).map((ticker) => ticker.Symbol as string);

    setSuggestions(matchedSuggestions.slice(0, 5));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSymbol(suggestion);
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Symbol (e.g., TSLA)"
        value={inputValue}
        onChange={handleChange}
        className="hover:border-blue-500 max-w-[180px]"
      />
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
