"use client";

import * as React from "react";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDropdownProps {
  label?: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: FilterDropdownProps) {
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">{label}</label>
      )}
      <Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
