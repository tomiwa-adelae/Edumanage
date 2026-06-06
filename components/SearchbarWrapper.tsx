"use client";

import { Suspense } from "react";
import { SearchBar } from "./Searchbar";

interface Props {
  placeholder?: string;
  label?: string;
}

function SearchBarFallback({ placeholder, label }: Props) {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium">{label}</label>}
      <div className="flex items-center relative justify-between bg-muted rounded-md">
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ps-9 pe-9 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          placeholder={placeholder || "Search..."}
          disabled
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export const SearchBarWrapper = ({ placeholder, label }: Props) => {
  return (
    <Suspense fallback={<SearchBarFallback placeholder={placeholder} label={label} />}>
      <SearchBar placeholder={placeholder} label={label} />
    </Suspense>
  );
};
