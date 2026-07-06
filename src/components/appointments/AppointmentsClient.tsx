// app/appointments/_components/AppointmentsClient.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarDays, List, LayoutGrid, Plus } from "lucide-react";
import { BookAppointment } from "@/components/modals/BookAppointment";
import AppointmentFilters from "./AppointmentFilters";
import DayAgendaView from "./DayAgendaView";
import WeekView from "./WeekView";
import AppointmentsListView from "./AppointmentsListView";
import type { AppointmentWithPatient } from "@/utils/type";

type View = "day" | "week" | "list";

interface Props {
  initialDayData: AppointmentWithPatient[];
  initialWeekData: AppointmentWithPatient[];
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
  initialWeekData,
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

  // New appointment modal is shared with the dashboard booking flow
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithPatient | null>(null);
  const handleBookSlot = () => setShowBookModal(true);
  const handleEditAppointment = (appointment: AppointmentWithPatient) => {
    setEditingAppointment(appointment);
    setShowBookModal(true);
  };
  const handleCloseModal = () => {
    setShowBookModal(false);
    setEditingAppointment(null);
  };

  const appointments = initialDayData;
  const total       = appointments.length;

  return (
    <>
      <div className="space-y-5 flex flex-row">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-(--border-secondary) bg-(--bg-secondary) p-1.5 shadow-sm">
            {VIEW_TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => switchView(key)}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  initialView === key
                    ? "bg-(--bg-primary) text-(--text-primary) shadow-sm"
                    : "text-(--text-secondary) hover:bg-(--bg-primary) hover:text-(--text-primary)"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}

            <div className="flex items-center gap-2 text-sm text-(--text-secondary)">
              <CalendarDays size={16} className="text-(--info-text)" />
              <span>
                {initialView === "day"
                  ? "Day agenda"
                  : initialView === "week"
                    ? "Weekly overview"
                    : "Appointment list"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="inline-flex ml-auto items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 h-10 cursor-pointer text-sm font-medium text-white shadow-sm transition hover:bg-(--primary-dark) hover:shadow-md"
        >
          <Plus size={16} />
          New appointment
        </button>
      </div>

      {/* Day summary bar — only in day view */}
      {initialView === "day" && total > 0 && (
        <div className="grid gap-3 mb-4">
          <div className="relative overflow-hidden rounded-[22px] border border-(--border-secondary) bg-linear-to-br from-(--primary-light) via-(--bg-primary) to-(--bg-secondary) px-5 py-5 shadow-sm sm:px-6">
            <div className="absolute  right-0 top-0 h-24 w-24 mt-5 translate-x-8 -translate-y-8 rounded-full bg-(--info-text)/10 blur-2xl" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--text-secondary)">
                  Today&apos;s total appointments
                </p>
                <h2 className="mt-2 text-4xl font-semibold text-(--text-primary)">
                  {total}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-(--border-secondary) bg-(--bg-primary) px-3 py-1 text-xs font-medium text-(--text-secondary)">
                  Day view
                </span>
                <span className="rounded-full bg-(--info-bg) px-3 py-1 text-xs font-medium text-(--info-text)">
                  Scheduled flow
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-(--border-secondary) bg-(--bg-primary) p-4 shadow-sm sm:p-5">
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
            onEditAppointment={handleEditAppointment}
          />
        )}

        {initialView === "week" && (
          <WeekView
            appointments={initialWeekData}
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
            onEditAppointment={handleEditAppointment}
          />
        )}
      </div>

      {showBookModal && (
        <BookAppointment
          key={editingAppointment?.id ?? "new-appointment"}
          open={showBookModal}
          appointment={editingAppointment}
          onClose={handleCloseModal}
          onSuccess={handleCloseModal}
        />
      )}
    </>
  );
}