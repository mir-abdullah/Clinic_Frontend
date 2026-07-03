// app/appointments/_components/AppointmentsListView.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import type { AppointmentWithPatient } from "@/utils/type";

interface Props {
  appointments: AppointmentWithPatient[];
  total: number;
  totalPages: number;
  page: number;
}

export default function AppointmentsListView({
  appointments,
  total,
  totalPages,
  page,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-(--text-secondary)">
          No appointments found
        </p>
        <p className="text-xs text-(--text-tertiary) mt-1">
          Try adjusting your filters or search
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <p className="text-xs text-(--text-tertiary)">
        Showing {appointments.length} of {total} appointments
      </p>

      {/* Table */}
      <div className="rounded-lg border border-(--border-secondary) overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-(--bg-secondary) border-b border-(--border-secondary)">
              {["#","Patient", "Date & Time", "Reason", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-widest text-(--text-tertiary)"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border-tertiary)">
            {appointments.map((appt, index) => (
              <tr
                key={appt.id}
                className="hover:bg-(--bg-secondary) transition-colors"
              >
                <td className="px-4 py-3 text-(--text-tertiary)">{index + 1}</td>

                <td className="px-4 py-3">
                  <p className="font-medium text-(--text-primary)">
                    {appt.patient.name}
                  </p>
                  <p className="text-xs text-(--text-tertiary)">
                    {appt.patient.phone}
                  </p>
                </td>
                <td className="px-4 py-3 text-(--text-secondary)">
                  <p>{format(new Date(appt.date), "MMM d, yyyy")}</p>
                  <p className="text-xs text-(--text-tertiary)">{appt.time}</p>
                </td>
                <td className="px-4 py-3 text-(--text-secondary) max-w-45 truncate">
                  {appt.reason ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <AppointmentStatusBadge status={appt.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {appt.reminderSent && (
                    <span className="text-xs text-(--text-tertiary)">
                      Reminded ✓
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-(--text-tertiary)">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs cursor-pointer rounded-md border border-(--border-secondary) disabled:opacity-40 hover:bg-(--bg-secondary) transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-3 cursor-pointer py-1.5 text-xs rounded-md border transition-colors ${
                    page === p
                      ? "border-(--info-text) bg-(--info-text) text-white"
                      : "border-(--border-secondary) hover:bg-(--bg-secondary)"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs cursor-pointer rounded-md border border-(--border-secondary) disabled:opacity-40 hover:bg-(--bg-secondary) transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}