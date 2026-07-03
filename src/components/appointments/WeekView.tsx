// app/appointments/_components/WeekView.tsx
"use client";

import { useMemo } from "react";
import { format, parseISO, addDays, startOfWeek } from "date-fns";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import type { AppointmentWithPatient } from "@/utils/type";

interface Props {
  appointments: AppointmentWithPatient[];
  currentDate: string; // "yyyy-MM-dd" — used to derive the week
  onDayClick?: (date: string) => void;
}

export default function WeekView({ appointments, currentDate, onDayClick }: Props) {
  const weekDays = useMemo(() => {
    const base = startOfWeek(parseISO(currentDate), { weekStartsOn: 1 }); // Mon
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(base, i);
      return {
        date: format(d, "yyyy-MM-dd"),
        label: format(d, "EEE"),
        day: format(d, "d"),
      };
    });
  }, [currentDate]);

  // Group appointments by date string
  const byDate = useMemo(() => {
    const map = new Map<string, AppointmentWithPatient[]>();
    for (const appt of appointments) {
      const key = format(new Date(appt.date), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), appt]);
    }
    return map;
  }, [appointments]);

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-(--border-secondary) bg-(--border-secondary) shadow-sm">
      {weekDays.map(({ date, label, day }) => {
        const dayAppts = byDate.get(date) ?? [];
        const isToday = date === today;

        return (
          <div
            key={date}
            className={`bg-(--bg-primary) ${isToday ? "ring-2 ring-inset ring-(--info-text)/20" : ""}`}
            style={{ minHeight: 220 }}
          >
            {/* Day header */}
            <button
              onClick={() => onDayClick?.(date)}
              className={`w-full px-2 py-3 text-center border-b border-(--border-secondary) transition-colors ${
                isToday ? "bg-(--primary-light)" : "hover:bg-(--bg-secondary)"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--text-tertiary)">
                    {label}
                  </p>
                  <p
                    className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                      isToday
                        ? "bg-primary text-white shadow-sm"
                        : "text-(--text-primary)"
                    }`}
                  >
                    {day}
                  </p>
                </div>

                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--info-bg) px-2 text-[11px] font-semibold text-(--info-text)">
                  {dayAppts.length}
                </span>
              </div>
            </button>

            {/* Appointments for this day */}
            <div className="space-y-2 p-2">
              {dayAppts.length === 0 ? (
                <p className="py-5 text-center text-xs text-(--text-tertiary) opacity-50">
                  —
                </p>
              ) : (
                dayAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="cursor-pointer rounded-xl border border-(--border-secondary) bg-(--bg-secondary) px-2.5 py-2 transition-all hover:-translate-y-0.5 hover:bg-(--primary-light) hover:shadow-sm"
                    title={`${appt.patient.name} · ${appt.time} · ${appt.reason ?? ""}`}
                  >
                    <p className="truncate text-xs font-semibold text-(--text-primary)">
                      {appt.time} {appt.patient.name}
                    </p>
                    <p className="truncate text-xs text-black)">
                      {appt.reason ?? "—"}
                    </p>
                    <div className="mt-1">
                      <AppointmentStatusBadge status={appt.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}