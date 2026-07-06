// app/appointments/_components/AppointmentCard.tsx
"use client";

import { useState, useTransition } from "react";
import { AppointmentStatus } from "@/utils/type";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  ChevronDown,
  Pencil,
  X,
  User,
  Clock,
  FileText,
} from "lucide-react";
import AppointmentStatusBadge, { BORDER_COLOR } from "./AppointmentStatusBadge";
import {
  updateAppointmentStatus,
  cancelAppointment,
} from "../../actions/appointments";
import type { AppointmentWithPatient } from "@/utils/type";
import {sendAppointmentReminder} from "@/utils/helpers";

const NEXT_STATUSES: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
  SCHEDULED:   ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  // CHECKED_IN:  ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
  // IN_PROGRESS: ["COMPLETED"],
  // COMPLETED:   [],
  // CANCELLED:   [],
  // NO_SHOW:     [],
};

interface Props {
  appointment: AppointmentWithPatient;
  onEdit?: (appointment: AppointmentWithPatient) => void;
}

export default function AppointmentCard({ appointment: initial, onEdit }: Props) {
  const [appt, setAppt] = useState(initial);
  const [showActions, setShowActions] = useState(false);
  const [isPending, startTransition] = useTransition();

  const nextStatuses = NEXT_STATUSES[appt.status] ?? [];

  // ── Status update ────────────────────────────────────────────────────────
  const handleStatusChange = (status: AppointmentStatus) => {
    setShowActions(false);
    startTransition(async () => {
      const res = await updateAppointmentStatus(appt.id, status);
      if (res.status === "success") {
        setAppt((prev) => ({ ...prev, status }));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  // ── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelAppointment(appt.id);
      if (res.status === "success") {
        setAppt((prev) => ({ ...prev, status: "CANCELLED" }));
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  // ── Reminder ─────────────────────────────────────────────────────────────


  const isCancelledOrDone =
    appt.status === "CANCELLED" ||
    appt.status === "NO_SHOW" ||
    appt.status === "COMPLETED";

  const toneClass =
    appt.status === "SCHEDULED"
      ? "from-(--info-bg) via-(--bg-primary) to-(--bg-primary)"
      : appt.status === "CHECKED_IN"
        ? "from-(--success-bg) via-(--bg-primary) to-(--bg-primary)"
        : appt.status === "IN_PROGRESS"
          ? "from-(--warning-bg) via-(--bg-primary) to-(--bg-primary)"
          : appt.status === "COMPLETED"
            ? "from-(--success-bg) via-(--bg-primary) to-(--bg-primary)"
            : "from-(--danger-bg) via-(--bg-primary) to-(--bg-primary)";

return (
  <div
    className={`group relative rounded-2xl border border-(--border-secondary) shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
      isCancelledOrDone ? "opacity-60" : ""
    } ${isPending ? "opacity-50 pointer-events-none" : ""} ${showActions ? "z-30" : "z-0"}`}
  >
    {/* background gradient + left status strip, clipped to rounded corners */}
    <div className={`absolute inset-0 overflow-hidden rounded-2xl bg-linear-to-r ${toneClass}`}>
      <div className={`absolute inset-y-0 left-0 w-1.5 ${BORDER_COLOR[appt.status]}`} />
    </div>

    {/* actual content, not clipped so dropdowns can overflow */}
    <div className="relative z-10 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        {/* Left: patient info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/80 text-sm font-semibold text-(--text-primary) shadow-sm`}>
              {appt.patient.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`text-sm font-semibold text-(--text-primary) ${
                    isCancelledOrDone ? "line-through" : ""
                  }`}
                >
                  {appt.patient.name}
                </p>
                <AppointmentStatusBadge status={appt.status} />
                {appt.reminderSent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] font-medium text-(--text-secondary)">
                    <BellOff size={11} />
                    Reminded
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/75 text-black px-2.5 py-1 text-xs font-medium  shadow-sm">
                  <Clock size={12} />
                  {appt.time}
                </span>
                {appt.reason && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/75 text-black px-2.5 py-1 text-xs font-medium  shadow-sm">
                    <FileText size={12} />
                    {appt.reason}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/75 text-black px-2.5 py-1 text-xs font-medium  shadow-sm">
                  <User size={12} />
                  {appt.patient.phone}
                </span>
              </div>

              {appt.notes && (
                <p className="mt-2 max-w-3xl rounded-xl border border-white/60 bg-white/65 px-3 py-2 text-xs italic text-(--text-secondary) line-clamp-2 shadow-sm">
                  {appt.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: actions */}
        {!isCancelledOrDone && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Send reminder */}
            <button
              onClick={() => sendAppointmentReminder(appt)}
              disabled={appt.reminderSent || isPending}
              title={appt.reminderSent ? "Reminder already sent" : "Send reminder"}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-all cursor-pointer hover:text-blue-700  ${
                appt.reminderSent
                  ? "border-white/60 bg-white/50 text-(--text-tertiary) cursor-not-allowed"
                  : "border-white/70 bg-white/80 text-(--info-text) hover:bg-white"
              }`}
            >
              <Bell size={13} />
              {appt.reminderSent ? "Sent" : "Remind"}
            </button>

            {onEdit && (
              <button
                onClick={() => onEdit(appt)}
                title="Edit appointment"
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-xs font-medium text-(--text-primary) transition-all hover:border-(--info-text) hover:text-(--info-text)"
              >
                <Pencil size={13} />
                Edit
              </button>
            )}

            {/* Status progression dropdown */}
            {nextStatuses.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowActions((p) => !p)}
                  className="flex cursor-pointer items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-(--primary-dark)"
                >
                  Move to
                  <ChevronDown size={13} />
                </button>

                {showActions && (
                  <div
                    className="absolute right-0 top-full z-40 mt-2 overflow-visible rounded-2xl border border-(--border-secondary) bg-(--bg-primary) shadow-xl"
                    style={{ minWidth: 140 }}
                  >
                    {nextStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-xs text-(--text-primary) transition-colors hover:bg-(--bg-secondary)"
                      >
                        <AppointmentStatusBadge status={s} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cancel */}
            {appt.status !== "CANCELLED" && (
              <button
                onClick={handleCancel}
                title="Cancel appointment"
                className="rounded-xl border cursor-pointer border-white/70 bg-white/80 p-2 text-(--text-tertiary) transition-colors hover:border-(--danger-text) hover:text-(--danger-text)"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
}