// app/appointments/_components/AppointmentStatusBadge.tsx
"use client";

import { AppointmentStatus } from "@/utils/type";

const CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string; dot: string }
> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-(--info-bg) text-(--info-text) ring-1 ring-(--info-text)/10",
    dot: "bg-(--info-text)",
  },
  CHECKED_IN: {
    label: "Checked in",
    className: "bg-(--success-bg) text-(--success-text) ring-1 ring-(--success-text)/10",
    dot: "bg-(--success-text)",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-(--warning-bg) text-(--warning-text) ring-1 ring-(--warning-text)/10",
    dot: "bg-(--warning-text)",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-(--success-bg) text-(--success-text) ring-1 ring-(--success-text)/10",
    dot: "bg-(--success-text)",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-(--bg-secondary) text-(--text-tertiary) ring-1 ring-(--border-secondary)/60",
    dot: "bg-(--text-tertiary)",
  },
  NO_SHOW: {
    label: "No show",
    className: "bg-(--danger-bg) text-(--danger-text) ring-1 ring-(--danger-text)/10",
    dot: "bg-(--danger-text)",
  },
};

export const BORDER_COLOR: Record<AppointmentStatus, string> = {
  SCHEDULED:   "border-l-[var(--info-text)]",
  CHECKED_IN:  "border-l-[var(--success-text)]",
  IN_PROGRESS: "border-l-[var(--warning-text)]",
  COMPLETED:   "border-l-[var(--success-text)]",
  CANCELLED:   "border-l-[var(--border-secondary)]",
  NO_SHOW:     "border-l-[var(--danger-text)]",
};

export default function AppointmentStatusBadge({
  status,
}: {
  status: AppointmentStatus;
}) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export { CONFIG as STATUS_CONFIG };