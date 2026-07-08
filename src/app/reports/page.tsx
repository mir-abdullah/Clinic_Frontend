import { Stethoscope, Receipt, CalendarClock, Users } from "lucide-react";
import ReportCard from "@/components/reports/ReportCard";

export default function ReportsPage() {
  const reportCards = [
    {
      title: "Monthly visits report",
      description: "Every visit in the selected month, with patient, reason and status.",
      icon: <Stethoscope size={20} color="#1D4ED8" />,
      iconBg: "#DBEAFE",
      endpoint: "visits",
      reportName: "Visits",
    },
    {
      title: "Monthly payments report",
      description: "Every payment received in the month, with amount charged, paid and due.",
      icon: <Receipt size={20} color="#15803D" />,
      iconBg: "#DCFCE7",
      endpoint: "/payments",
      reportName: "Payments",
    },
    {
      title: "Monthly appointments report",
      description: "Every appointment scheduled in the month, with time, patient and outcome.",
      icon: <CalendarClock size={20} color="#B45309" />,
      iconBg: "#FEF3C7",
      endpoint: "/appointments",
      reportName: "Appointments",
    },
    {
      title: "Patients report",
      description: "Full patient roster with visit history, lifetime billing and status.",
      icon: <Users size={20} color="#6D28D9" />,
      iconBg: "#EDE9FE",
      endpoint: "/patients",
      showMonthPicker: false,
      reportName: "Patients",
    },
  ];

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-[24px] border border-border bg-(--bg-primary) p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--text-secondary)">
              Reports
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-(--text-primary)">
              Export clinic summaries
            </h1>
            <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
              Download month-based reports for visits, payments, and appointments,
              or export the full patient list when you need a current roster.
            </p>
          </div>
          <div className="rounded-2xl border border-(--border-secondary) bg-(--bg-secondary) px-4 py-3 text-sm text-(--text-secondary) shadow-sm">
            <p className="font-medium text-(--text-primary)">Export type</p>
            <p className="mt-1">Excel files generated on demand</p>
          </div>
        </div>
      </div>

      <section className="rounded-[24px] border border-border bg-(--bg-primary) p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold text-(--text-primary)">Available reports</h2>
          <p className="text-sm text-(--text-secondary)">
            Select a month where needed, then download the file.
          </p>
        </div>

        <div className="grid gap-3">
          {reportCards.map((card) => (
            <ReportCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
