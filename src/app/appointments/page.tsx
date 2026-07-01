// app/appointments/page.tsx  — Server Component
import { appointmentAPI } from "@/utils/api";
import type { AppointmentWithPatient, PaginatedAppointments } from "@/utils/type";
import AppointmentsClient from "@/components/appointments/AppointmentsClient";
import { format } from "date-fns";

interface PageProps {
  searchParams: Promise<{
    date?: string;
    view?: string;
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "Appointments | Mehreen Dental Clinic",
};

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const today   = format(new Date(), "yyyy-MM-dd");
  const date    = params.date   ?? today;
  const view    = (params.view  ?? "day") as "day" | "week" | "list";
  const status  = params.status ?? "";
  const search  = params.search ?? "";
  const page    = params.page ? Number(params.page) : 1;

  // Build query params for the backend
  const dayParams = { date, ...(status && { status }), ...(search && { search }) };
  const listParams = { page, pageSize: 15, ...(status && { status }), ...(search && { search }) };

  // Fetch server-side — parallel where possible
  const [dayRes, listRes] = await Promise.all([
    view !== "list"
      ? appointmentAPI.get<AppointmentWithPatient[]>("/all", { params: dayParams })
          .then((r) => r.data)
          .catch(() => [] as AppointmentWithPatient[])
      : Promise.resolve([] as AppointmentWithPatient[]),

    view === "list"
      ? appointmentAPI.get<PaginatedAppointments>("/paginated", { params: listParams })
          .then((r) => r.data)
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-border bg-(--bg-primary) p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--text-secondary)">
              Scheduling
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-(--text-primary)">
              Appointments
            </h1>
            <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
              Manage the clinic calendar, review the day at a glance, and keep follow-ups organized in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-(--border-secondary) bg-(--bg-secondary) px-4 py-3 text-sm text-(--text-secondary) shadow-sm">
            <p className="font-medium text-(--text-primary)">Today</p>
            <p className="mt-1">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
          </div>
        </div>
      </div>

      <section className="rounded-[24px] border border-border bg-(--bg-primary) p-4 shadow-sm sm:p-6">
        <AppointmentsClient
          initialDayData={dayRes}
          initialListData={listRes}
          initialDate={date}
          initialView={view}
          initialStatus={status}
          initialSearch={search}
          today={today}
        />
      </section>
    </div>
  );
}