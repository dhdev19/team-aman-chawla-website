"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  defaultValue = "",
  className,
}: SearchBarProps) {
  const [value, setValue] = React.useState(defaultValue);

  // Debounce search to avoid too many calls
  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => onSearch(query), 300),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="pl-10"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
