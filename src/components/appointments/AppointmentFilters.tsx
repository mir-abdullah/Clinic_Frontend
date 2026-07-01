// app/appointments/_components/AppointmentFilters.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { format, addDays, subDays, parseISO } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
} from "lucide-react";
import { AppointmentStatus } from "@/utils/type";

const STATUS_CHIPS: { value: AppointmentStatus | "ALL"; label: string }[] = [
  { value: "ALL",        label: "All" },
  { value: "SCHEDULED",  label: "Scheduled" },
  { value: "CHECKED_IN", label: "Checked in" },
  { value: "IN_PROGRESS",label: "In progress" },
  { value: "COMPLETED",  label: "Completed" },
  { value: "CANCELLED",  label: "Cancelled" },
  { value: "NO_SHOW",    label: "No show" },
];

interface Props {
  currentDate: string;   // "yyyy-MM-dd"
  currentStatus: string; // comma-separated or ""
  currentSearch: string;
  today: string;
}

export default function AppointmentFilters({
  currentDate,
  currentStatus,
  currentSearch,
  today,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── URL helper ──────────────────────────────────────────────────────────
  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // ── Date nav ────────────────────────────────────────────────────────────
  const parsed = parseISO(currentDate);
  const prevDate = format(subDays(parsed, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(parsed, 1), "yyyy-MM-dd");
  const tomorrow = format(addDays(parseISO(today), 1), "yyyy-MM-dd");
  const dayAfterTomorrow = format(addDays(parseISO(today), 2), "yyyy-MM-dd");

  const friendlyDate = () => {
    if (currentDate === today) return "Today";
    if (currentDate === tomorrow) return "Tomorrow";
    if (currentDate === dayAfterTomorrow) return "Day after tomorrow";
    return format(parsed, "EEE, MMM d, yyyy");
  };

  // ── Status toggle (multi-select) ────────────────────────────────────────
  const activeStatuses = currentStatus
    ? currentStatus.split(",").filter(Boolean)
    : [];

  const toggleStatus = (value: string) => {
    if (value === "ALL") {
      push({ status: "", page: "" });
      return;
    }
    const next = activeStatuses.includes(value)
      ? activeStatuses.filter((s) => s !== value)
      : [...activeStatuses, value];
    push({ status: next.join(","), page: "" });
  };

  const isStatusActive = (value: string) => {
    if (value === "ALL") return activeStatuses.length === 0;
    return activeStatuses.includes(value);
  };

  // ── Search debounce ─────────────────────────────────────────────────────
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      push({ search: e.target.value, page: "" });
    }, 350);
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Date nav + quick date chips */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-(--border-secondary) bg-(--bg-secondary) p-3">
        {/* Prev/Next arrows */}
        <button
          onClick={() => push({ date: prevDate })}
          className="p-1.5 rounded-md border border-(--border-secondary) bg-(--bg-primary) hover:bg-(--bg-secondary) transition-colors"
          aria-label="Previous day"
        >
          <ChevronLeft size={16} className="text-(--text-secondary)" />
        </button>

        <button
          onClick={() => push({ date: nextDate })}
          className="p-1.5 rounded-md border border-(--border-secondary) bg-(--bg-primary) hover:bg-(--bg-secondary) transition-colors"
          aria-label="Next day"
        >
          <ChevronRight size={16} className="text-(--text-secondary)" />
        </button>

        {/* Current date label */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-(--text-primary)">
          <CalendarDays size={15} className="text-(--text-tertiary)" />
          <span>{friendlyDate()}</span>
        </div>

        <div className="w-px h-4 bg-(--border-secondary) mx-1" />

        {/* Quick date chips */}
        {[
          { label: "Today",              date: today },
          { label: "Tomorrow",           date: tomorrow },
          { label: "Day after tomorrow", date: dayAfterTomorrow },
        ].map((chip) => (
          <button
            key={chip.date}
            onClick={() => push({ date: chip.date })}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
              currentDate === chip.date
                ? "bg-(--info-text) text-white shadow-sm"
                : "bg-(--bg-primary) text-(--text-secondary) hover:bg-(--border-secondary)"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Row 2: Search + status chips */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-(--border-secondary) bg-(--bg-primary) p-3 shadow-sm">
        {/* Search */}
        <div className="relative" style={{ minWidth: 200 }}>
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-tertiary)"
          />
          <input
            type="text"
            placeholder="Patient name or phone…"
            defaultValue={currentSearch}
            onChange={handleSearch}
            className="pl-8 pr-3 py-2 text-sm w-full rounded-md border border-(--border-secondary) bg-(--bg-secondary) text-(--text-primary) placeholder:text-(--text-tertiary) focus:outline-none focus:ring-1 focus:ring-(--info-text)"
          />
        </div>

        <div className="w-px h-4 bg-(--border-secondary)" />

        {/* Status chips */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_CHIPS.map((chip) => (
            <button
              key={chip.value}
              onClick={() => toggleStatus(chip.value)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                isStatusActive(chip.value)
                  ? "bg-(--info-text) text-white shadow-sm"
                  : "bg-(--bg-secondary) text-(--text-secondary) hover:bg-(--border-secondary)"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}