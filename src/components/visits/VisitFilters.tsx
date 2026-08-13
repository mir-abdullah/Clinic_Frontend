"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DATE_OPTIONS = [
  { label: "All Time", value: "all" },  // <-- change this
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "week" },
  { label: "This Month", value: "month" },
];


export function VisitFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        updateParams({ search: value });
      }, 400);
    },
    [updateParams]
  );

 const handleDateFilter = (value: string) => {
  updateParams({ dateFilter: value === "all" ? "" : value });
};



  return (
    <div className="flex gap-3 mb-6 justify-end">
      <Input
        placeholder="Search patient name or phone..."
        defaultValue={searchParams.get("search") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm bg-white h-10 border-black border-2"
      />
      <Select
        defaultValue={searchParams.get("dateFilter") ?? ""}
        onValueChange={handleDateFilter}
      >
        <SelectTrigger className="w-44 bg-white text-bold h-15 border-black border-2">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent >
          {DATE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
    </div>
  );
}