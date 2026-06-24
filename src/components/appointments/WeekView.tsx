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
    <div className="grid grid-cols-7 gap-px bg-(--border-secondary) rounded-lg overflow-hidden border border-(--border-secondary)">
      {weekDays.map(({ date, label, day }) => {
        const dayAppts = byDate.get(date) ?? [];
        const isToday = date === today;
        const isSelected = date === currentDate;

        return (
          <div
            key={date}
            className="bg-(--bg-primary) min-h-[200px]"
          >
            {/* Day header */}
            <button
              onClick={() => onDayClick?.(date)}
              className={`w-full px-2 py-2.5 text-center border-b border-(--border-secondary) hover:bg-(--bg-secondary) transition-colors ${
                isSelected ? "bg-(--info-bg)" : ""
              }`}
            >
              <p className="text-xs text-(--text-tertiary) uppercase tracking-wider font-semibold">
                {label}
              </p>
              <p
                className={`text-sm font-bold mt-0.5 w-7 h-7 flex items-center justify-center mx-auto rounded-full ${
                  isToday
                    ? "bg-(--info-text) text-white"
                    : "text-(--text-primary)"
                }`}
              >
                {day}
              </p>
            </button>

            {/* Appointments for this day */}
            <div className="p-1.5 space-y-1">
              {dayAppts.length === 0 ? (
                <p className="text-xs text-(--text-tertiary) text-center py-4 opacity-50">
                  —
                </p>
              ) : (
                dayAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="px-2 py-1.5 rounded-md bg-(--bg-secondary) hover:bg-(--border-secondary) cursor-pointer transition-colors"
                    title={`${appt.patient.name} · ${appt.time} · ${appt.reason ?? ""}`}
                  >
                    <p className="text-xs font-medium text-(--text-primary) truncate">
                      {appt.time} {appt.patient.name}
                    </p>
                    <div className="mt-0.5">
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