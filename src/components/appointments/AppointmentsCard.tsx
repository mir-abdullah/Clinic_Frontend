// app/appointments/_components/AppointmentCard.tsx
"use client";

import { useState, useTransition } from "react";
import { AppointmentStatus } from "@/utils/type";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  ChevronDown,
  X,
  User,
  Clock,
  FileText,
} from "lucide-react";
import AppointmentStatusBadge, { BORDER_COLOR } from "./AppointmentStatusBadge";
import {
  updateAppointmentStatus,
  sendAppointmentReminder,
  cancelAppointment,
} from "../../actions/appointments";
import type { AppointmentWithPatient } from "@/utils/type";

const NEXT_STATUSES: Partial<Record<AppointmentStatus, AppointmentStatus[]>> = {
  SCHEDULED:   ["CHECKED_IN", "CANCELLED", "NO_SHOW"],
  CHECKED_IN:  ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED:   [],
  CANCELLED:   [],
  NO_SHOW:     [],
};

interface Props {
  appointment: AppointmentWithPatient;
}

export default function AppointmentCard({ appointment: initial }: Props) {
  const [appt, setAppt] = useState(initial);
  const [showActions, setShowActions] = useState(false);
  const [isPending, startTransition] = useTransition();

  const nextStatuses = NEXT_STATUSES[appt.status] ?? [];
  const isTerminal = nextStatuses.length === 0;

  // ── Status update ────────────────────────────────────────────────────────
  const handleStatusChange = (status: AppointmentStatus) => {
    setShowActions(false);
    startTransition(async () => {
      const res = await updateAppointmentStatus(appt.id, status);
      if (res.success) {
        setAppt((prev) => ({ ...prev, status }));
        toast.success("Status updated");
      } else {
        toast.error(res.error ?? "Failed to update status");
      }
    });
  };

  // ── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelAppointment(appt.id);
      if (res.success) {
        setAppt((prev) => ({ ...prev, status: "CANCELLED" }));
        toast.success("Appointment cancelled");
      } else {
        toast.error(res.error ?? "Failed to cancel");
      }
    });
  };

  // ── Reminder ─────────────────────────────────────────────────────────────
  const handleReminder = () => {
    startTransition(async () => {
      const res = await sendAppointmentReminder(appt.id);
      if (res.success) {
        setAppt((prev) => ({ ...prev, reminderSent: true }));
        toast.success(`Reminder sent to ${appt.patient.name}`);
      } else {
        toast.error(res.error ?? "Failed to send reminder");
      }
    });
  };

  const isCancelledOrDone =
    appt.status === "CANCELLED" ||
    appt.status === "NO_SHOW" ||
    appt.status === "COMPLETED";

  return (
    <div
      className={`group relative bg-(--bg-primary) border border-(--border-secondary) border-l-4 ${BORDER_COLOR[appt.status]} rounded-lg px-4 py-3 transition-shadow hover:shadow-sm ${
        isCancelledOrDone ? "opacity-60" : ""
      } ${isPending ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: patient info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`text-sm font-semibold text-(--text-primary) ${
                isCancelledOrDone ? "line-through" : ""
              }`}
            >
              {appt.patient.name}
            </p>
            <AppointmentStatusBadge status={appt.status} />
            {appt.reminderSent && (
              <span className="text-xs text-(--text-tertiary) flex items-center gap-1">
                <BellOff size={11} />
                Reminded
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-(--text-secondary)">
              <Clock size={12} />
              {appt.time}
            </span>
            {appt.reason && (
              <span className="flex items-center gap-1 text-xs text-(--text-secondary)">
                <FileText size={12} />
                {appt.reason}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-(--text-tertiary)">
              <User size={12} />
              {appt.patient.phone}
            </span>
          </div>

          {appt.notes && (
            <p className="mt-1.5 text-xs text-(--text-tertiary) italic line-clamp-1">
              {appt.notes}
            </p>
          )}
        </div>

        {/* Right: actions */}
        {!isCancelledOrDone && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Send reminder */}
            <button
              onClick={handleReminder}
              disabled={appt.reminderSent || isPending}
              title={appt.reminderSent ? "Reminder already sent" : "Send reminder"}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border font-medium transition-colors ${
                appt.reminderSent
                  ? "border-(--border-secondary) text-(--text-tertiary) cursor-not-allowed"
                  : "border-(--info-text) text-(--info-text) hover:bg-(--info-bg)"
              }`}
            >
              <Bell size={13} />
              {appt.reminderSent ? "Sent" : "Remind"}
            </button>

            {/* Status progression dropdown */}
            {nextStatuses.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowActions((p) => !p)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-(--info-text) text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Move to
                  <ChevronDown size={13} />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-(--bg-primary) border border-(--border-secondary) rounded-lg shadow-lg overflow-hidden min-w-[140px]">
                    {nextStatuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-(--bg-secondary) text-(--text-primary) transition-colors"
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
                className="p-1.5 rounded-md border border-(--border-secondary) text-(--text-tertiary) hover:border-(--danger-text) hover:text-(--danger-text) transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}