// app/appointments/_components/DayAgendaView.tsx
"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import AppointmentCard from "./AppointmentsCard";
import type { AppointmentWithPatient } from "@/utils/type";

// Clinic hours: 2pm – 6pm in 30-min slots
const SLOTS = Array.from({ length: 22 }, (_, i) => {
  const totalMinutes = 12 * 60 + i * 30;  // start at 14:00
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});
// produces: ["14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00"]

interface Props {
  appointments: AppointmentWithPatient[];
  onBookSlot?: (time: string) => void;
  onEditAppointment?: (appointment: AppointmentWithPatient) => void;
}

export default function DayAgendaView({
  appointments,
  onBookSlot,
  onEditAppointment,
}: Props) {
  // Map time → appointments (multiple can share a slot)
 const bySlot = useMemo(() => {
  const map = new Map<string, AppointmentWithPatient[]>();

  for (const appt of appointments) {
    // Parse "14:15" → 855 minutes → round down to nearest 30 → "14:00"
    const [h, m] = appt.time.split(":").map(Number);
    const totalMins = h * 60 + m;
    const bucketMins = Math.floor(totalMins / 30) * 30;
    const bh = Math.floor(bucketMins / 60);
    const bm = bucketMins % 60;
    const bucket = `${String(bh).padStart(2, "0")}:${String(bm).padStart(2, "0")}`;

    // Only include if within clinic hours
    if (bucketMins >= 12 * 60 && bucketMins < 22 * 60 + 30) {
      map.set(bucket, [...(map.get(bucket) ?? []), appt]);
    }
  }

  return map;
}, [appointments]); 

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-(--bg-secondary) flex items-center justify-center mb-3">
          <span className="text-2xl">📅</span>
        </div>
        <p className="text-sm font-medium text-(--text-secondary)">
          No appointments for this day
        </p>
        <p className="text-xs text-(--text-tertiary) mt-1">
          Use the New appointment button to book one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {SLOTS.map((slot, idx) => {
        const slotAppts = bySlot.get(slot) ?? [];
        const hasAppts = slotAppts.length > 0;

        // Only show hour label on the hour
        const showHour = idx % 2 === 0;

        return (
          <div
            key={slot}
            className="grid"
            style={{ gridTemplateColumns: "52px 1fr", minHeight: "52px" }}
          >
            {/* Time label */}
            <div className="pt-3 pr-3 text-right">
              {showHour && (
                <span className="text-xs text-(--text-tertiary) font-medium">
                  {slot}
                </span>
              )}
            </div>

            {/* Slot content */}
            <div
              className={`border-t border-(--border-tertiary) pt-2 pb-2 ${
                !showHour ? "border-dashed" : ""
              }`}
            >
              {hasAppts ? (
                <div className="space-y-2">
                  {slotAppts.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      onEdit={onEditAppointment}
                    />
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => onBookSlot?.(slot)}
                  className="w-full group/slot h-8 flex items-center gap-1.5 px-3 rounded-md text-xs text-(--text-tertiary) hover:bg-(--bg-secondary) hover:text-(--info-text) transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
                >
                  <Plus size={13} />
                  Book {slot}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}