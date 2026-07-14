"use client";
 
import { useState, ReactNode } from "react";
import { Download } from "lucide-react";
import axios from "axios";
import { reportAPI } from "@/utils/api"; // adjust path to match where your other *API.ts files live
 
interface ReportCardProps {
  title: string;
  description: string;
  icon: ReactNode; // pass a rendered element, e.g. <Stethoscope size={20} />, not the component itself
  iconBg: string; // hex — Tailwind CSS vars don't resolve at runtime, so pass hex directly
  endpoint: string; // e.g. "/api/reports/visits"
  showMonthPicker?: boolean; // false for reports that aren't month-scoped, e.g. patients roster
  reportName: string; // short name used for the downloaded filename, e.g. "Appointments", "Patients"

}
 
// Generates the last 12 months as { label, month, year } for the dropdown
function getRecentMonths() {
  const months: { label: string; month: number; year: number }[] = [];
  const now = new Date();
 
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("en-US", { month: "long", year: "numeric" }),
      month: d.getMonth() + 1, // Prisma/date-fns expects 1-12
      year: d.getFullYear(),
    });
  }
  return months;
}
 
export default function ReportCard({
  title,
  description,
  icon,
  iconBg,
  endpoint,
  showMonthPicker = true,
  reportName,
}: ReportCardProps) {
  const months = getRecentMonths();
  const [selected, setSelected] = useState(months[0]);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  async function handleDownload() {
    setDownloading(true);
    setError(null);
 
    try {
      const res = await reportAPI.get(
        showMonthPicker ? `${endpoint}?month=${selected.month}&year=${selected.year}` : endpoint,
        { responseType: "blob" }
      );
 
      // Build a friendly filename from the report title, e.g. "Appointments July 2026.xlsx"
      // or "Patients.xlsx" for reports without a month picker.
      const disposition = res.headers["content-disposition"];
      const serverMatch = disposition?.match(/filename="(.+)"/);
      const builtName = showMonthPicker
        ? `${reportName} ${selected.label}.xlsx`
        : `${reportName}.xlsx`;
      const filename = serverMatch?.[1] ?? builtName;
 
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Axios throws on non-2xx, and since responseType is "blob" the error
      // body also comes back as a Blob — read it as text and parse it to
      // get the real error message the server sent.
      if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const body = JSON.parse(text);
          setError(body?.error ?? "Failed to generate report");
        } catch {
          setError("Failed to generate report");
        }
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      setDownloading(false);
    }
  }
 
  return (
    <div
      className="rounded-2xl border border-(--border-secondary) bg-(--bg-secondary) p-4 shadow-sm"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>
          <div className="max-w-xl">
            <p className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {title}
            </p>
            <p className="mt-1 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
              {description}
            </p>
          </div>
        </div>
 
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {showMonthPicker && (
            <select
              className="h-10 rounded-lg border px-3 text-sm outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-(--primary-dark) sm:w-52"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
              value={`${selected.month}-${selected.year}`}
              onChange={(e) => {
                const found = months.find(
                  (m) => `${m.month}-${m.year}` === e.target.value
                );
                if (found) setSelected(found);
              }}
            >
              {months.map((m) => (
                <option key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>
                  {m.label}
                </option>
              ))}
            </select>
          )}
 
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex h-10 items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 hover:bg-(--primary-dark) hover:text-black"
            style={{
              borderColor: "var(--primary-dark)",
              backgroundColor: "var(--primary-dark)",
              color: "white",
            }}
          >
            <Download size={16} />
            {downloading ? "Preparing…" : "Download"}
          </button>
        </div>
      </div>
 
      {error && (
        <p
          className="mt-3 rounded-lg border border-(--danger-bg) bg-(--danger-bg) px-3 py-2 text-sm leading-5"
          style={{ color: "var(--danger-text)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
 

 