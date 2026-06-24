// app/appointments/_components/AppointmentsClient.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarDays, List, LayoutGrid, Plus } from "lucide-react";
import AppointmentFilters from "./AppointmentFilters";
import DayAgendaView from "./DayAgendaView";
import WeekView from "./WeekView";
import AppointmentsListView from "./AppointmentsListView";
import type { AppointmentWithPatient } from "@/utils/type";

type View = "day" | "week" | "list";

interface Props {
  initialDayData: AppointmentWithPatient[];
  initialListData: {
    appointments: AppointmentWithPatient[];
    total: number;
    totalPages: number;
    page: number;
  } | null;
  initialDate: string;
  initialView: View;
  initialStatus: string;
  initialSearch: string;
  today: string;
}

const VIEW_TABS: { key: View; label: string; Icon: React.ElementType }[] = [
  { key: "day",  label: "Day",  Icon: CalendarDays },
  { key: "week", label: "Week", Icon: LayoutGrid },
  { key: "list", label: "List", Icon: List },
];

export default function AppointmentsClient({
  initialDayData,
  initialListData,
  initialDate,
  initialView,
  initialStatus,
  initialSearch,
  today,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // View toggle is URL-driven so refresh/share preserves it
  const switchView = (view: View) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  // "New appointment" modal — reuse your existing BookAppointmentExisting modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [prefilledTime, setPrefilledTime] = useState<string | undefined>();

  const handleBookSlot = (time: string) => {
    setPrefilledTime(time);
    setShowBookModal(true);
  };

  // Stats for the summary bar
  const appointments = initialDayData;
  const scheduled   = appointments.filter((a) => a.status === "SCHEDULED").length;
  const checkedIn   = appointments.filter((a) => a.status === "CHECKED_IN").length;
  const completed   = appointments.filter((a) => a.status === "COMPLETED").length;
  const total       = appointments.length;

  return (
    <>
      {/* Top bar: view toggle + new appointment button */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        {/* View tabs */}
        <div className="flex items-center border border-(--border-secondary) rounded-lg overflow-hidden">
          {VIEW_TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => switchView(key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                initialView === key
                  ? "bg-(--info-text) text-white"
                  : "bg-(--bg-primary) text-(--text-secondary) hover:bg-(--bg-secondary)"
              } ${key !== "day" ? "border-l border-(--border-secondary)" : ""}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* New appointment */}
        <button
          onClick={() => { setPrefilledTime(undefined); setShowBookModal(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-(--info-text) text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New appointment
        </button>
      </div>

      {/* Day summary bar — only in day view */}
      {initialView === "day" && total > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total",      value: total,      color: "text-(--text-primary)" },
            { label: "Scheduled",  value: scheduled,  color: "text-(--info-text)" },
            { label: "Checked in", value: checkedIn,  color: "text-(--success-text)" },
            { label: "Completed",  value: completed,  color: "text-(--success-text)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-(--bg-secondary) rounded-lg px-4 py-3 border border-(--border-secondary)"
            >
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-(--text-tertiary) mt-0.5 font-medium uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <AppointmentFilters
        currentDate={initialDate}
        currentStatus={initialStatus}
        currentSearch={initialSearch}
        today={today}
      />

      {/* View content */}
      {initialView === "day" && (
        <DayAgendaView
          appointments={initialDayData}
          onBookSlot={handleBookSlot}
        />
      )}

      {initialView === "week" && (
        <WeekView
          appointments={initialDayData}
          currentDate={initialDate}
          onDayClick={(date) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("date", date);
            params.set("view", "day");
            router.push(`${pathname}?${params.toString()}`);
          }}
        />
      )}

      {initialView === "list" && initialListData && (
        <AppointmentsListView
          appointments={initialListData.appointments}
          total={initialListData.total}
          totalPages={initialListData.totalPages}
          page={initialListData.page}
        />
      )}

      {/* Book appointment modal — reuse your existing component */}
      {showBookModal && (
        // Replace with your actual BookAppointmentExisting modal:
        // <BookAppointmentExisting
        //   open={showBookModal}
        //   onClose={() => setShowBookModal(false)}
        //   prefilledTime={prefilledTime}
        //   prefilledDate={initialDate}
        // />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-(--bg-primary) border border-(--border-secondary) rounded-xl p-6 w-full max-w-md shadow-xl">
            <p className="text-sm font-medium text-(--text-primary) mb-4">
              Book Appointment
              {prefilledTime && (
                <span className="ml-2 text-(--text-tertiary)">@ {prefilledTime}</span>
              )}
            </p>
            <p className="text-xs text-(--text-tertiary) mb-4">
              Replace this placeholder with your{" "}
              <code className="font-mono bg-(--bg-secondary) px-1 py-0.5 rounded">
                BookAppointmentExisting
              </code>{" "}
              modal.
            </p>
            <button
              onClick={() => setShowBookModal(false)}
              className="text-xs px-3 py-1.5 border border-(--border-secondary) rounded-md hover:bg-(--bg-secondary)"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}