"use client";

import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Pencil,
  ClipboardList,
  CalendarDays,
  AlertCircle,
  Loader2,
  Briefcase,
  Users,
  ScrollText,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { appointmentAPI, visitAPI } from "@/utils/api";
import { Patient, Visit, Appointment } from "@/utils/type";
import { AddPatient } from "./AddPatient";
import { toast } from "sonner";

type Tab = "visits" | "appointments";

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  COMPLETED: { bg: "#F0FDF4", text: "#166534", border: "#86EFAC", label: "Completed" },
  PENDING: { bg: "#FFFBEB", text: "#92400E", border: "#FCD34D", label: "Pending" },
  CANCELLED: { bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5", label: "Cancelled" },
  SCHEDULED: { bg: "#EFF6FF", text: "#1E40AF", border: "#93C5FD", label: "Scheduled" },
  NO_SHOW: { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1", label: "No Show" },
};

// Deterministic accent color for the patient avatar, based on name.
const AVATAR_THEMES = [
  { from: "#6366F1", to: "#8B5CF6" }, // indigo -> violet
  { from: "#0EA5E9", to: "#6366F1" }, // sky -> indigo
  { from: "#10B981", to: "#0EA5E9" }, // emerald -> sky
  { from: "#F59E0B", to: "#EF4444" }, // amber -> red
  { from: "#EC4899", to: "#8B5CF6" }, // pink -> violet
  { from: "#14B8A6", to: "#3B82F6" }, // teal -> blue
];

function avatarTheme(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_THEMES.length;
  return AVATAR_THEMES[Math.abs(hash) % AVATAR_THEMES.length];
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["PENDING"];
  return (
    <span
      style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border"
    >
      {style.label}
    </span>
  );
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export const ViewPatientModal = ({
  open = true,
  patient,
  onClose = () => {},
  onEdit = () => {},
}: {
  open?: boolean;
  patient: Patient | null;
  onClose?: () => void;
  onEdit?: (patient: Patient) => void;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("visits");
  const [visits, setVisits] = useState<Visit[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false); // ← controls AddPatient modal
  const [mounted, setMounted] = useState(false); // ← drives entrance transition

  const fetchData = async (patientId: string) => {
    setActiveTab("visits");
    setVisits([]);
    setAppointments([]);
    setError("");
    setLoading(true);
    setHistoryExpanded(false);
    try {
      const [visitsRes, appointmentsRes] = await Promise.all([
        visitAPI.get(`/patient/${patientId}`),
        appointmentAPI.get(`/patient/${patientId}`),
      ]);
      setVisits(visitsRes.data || []);
      setAppointments(appointmentsRes.data?.appointments || []);
    } catch {
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !patient) return;
    void (async () => {
      await fetchData(patient.id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, patient]);

  useEffect(() => {
    // schedule mount/unmount state changes on the next animation frame
    // to avoid synchronous setState inside the effect which can cause
    // cascading renders.
    const raf = requestAnimationFrame(() => setMounted(!!open));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open || !patient) return null;

  const balance = visits.reduce(
    (acc, v) =>
      acc + (v.totalAmount - (v.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0)),
    0
  );

  const hasGuardian = !!patient.guardian;
  const hasOccupation = !!patient.occupation;
  const hasHistory = !!patient.medicalHistory;
  const hasExtras = hasGuardian || hasOccupation;
  const theme = avatarTheme(patient.name || "P");

  return (
    <>
      {/* ── Edit Patient Modal ── */}
      {editOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <AddPatient
            key={patient.id}
            mode="edit"
            patient={patient}
            open={editOpen}
            onClose={() => setEditOpen(false)}
            onSuccess={(message) => {
              setEditOpen(false);
              onEdit(patient); // notify parent so it can refresh the patient list
              toast.success("Patient updated successfully");
            }}
          />
        </div>
      )}

      {/* ── View Patient Modal ── */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 transition-opacity duration-200 ease-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={`w-full max-w-5xl bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 overflow-hidden flex flex-col max-h-[92vh] transition-all duration-200 ease-out ${
            mounted ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0 bg-white">
            <div className="flex items-center gap-4">
              <div
                style={{ backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-white shrink-0 shadow-md shadow-slate-200"
              >
                {initials(patient.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 leading-tight">{patient.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 font-medium tracking-wide uppercase">
                  Patient Record
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)} // ← simply open the edit modal
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* ── Balance due banner ── */}
            {balance > 0 && (
              <div className="flex items-center gap-3 px-8 py-3 bg-linear-to-r from-red-50 to-orange-50 border-b border-red-100">
                <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </span>
                <p className="text-sm text-red-800">
                  Outstanding balance of{" "}
                  <strong className="font-semibold">Rs. {balance.toLocaleString()}</strong> across all
                  visits
                </p>
              </div>
            )}

            {/* ── Patient info strip ── */}
            <div className="px-8 py-4 bg-slate-50/70 border-b border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InfoChip icon={<Phone className="w-4 h-4" />} text={patient.phone} />
                <InfoChip
                  icon={<User className="w-4 h-4" />}
                  text={
                    [patient.gender, patient.age ? `${patient.age} yrs` : null]
                      .filter(Boolean)
                      .join(" · ") || "—"
                  }
                />
                {patient.address && (
                  <InfoChip icon={<MapPin className="w-4 h-4" />} text={patient.address} truncate />
                )}
                <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
                  <Pill icon={<ClipboardList className="w-4 h-4" />} value={visits.length} label="visits" />
                  <Pill icon={<CalendarDays className="w-4 h-4" />} value={appointments.length} label="appts" />
                </div>
              </div>

              {hasExtras && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-slate-200">
                  {hasGuardian && (
                    <InfoChip icon={<Users className="w-4 h-4" />} label="Guardian" text={patient.guardian!} />
                  )}
                  {hasOccupation && (
                    <InfoChip
                      icon={<Briefcase className="w-4 h-4" />}
                      label="Occupation"
                      text={patient.occupation!}
                    />
                  )}
                </div>
              )}

              {hasHistory && (
                <div className="pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setHistoryExpanded((p) => !p)}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors group"
                  >
                    <ScrollText className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    <span className="font-medium">Medical History</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        historyExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {historyExpanded && (
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                      {patient.medicalHistory}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Tabs (segmented control) ── */}
            <div className="px-8 pt-5 pb-1">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                {(["visits", "appointments"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-white text-slate-900 font-semibold shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "visits" ? (
                      <ClipboardList className="w-4 h-4" />
                    ) : (
                      <CalendarDays className="w-4 h-4" />
                    )}
                    {tab === "visits" ? "Visits" : "Appointments"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Tab content ── */}
            <div className="px-8 py-6">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-slate-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading…</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20 text-red-500 text-sm gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              ) : activeTab === "visits" ? (
                visits.length === 0 ? (
                  <EmptyState icon={<ClipboardList className="w-7 h-7" />} label="No visits recorded yet" />
                ) : (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm table-fixed">
                      <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[30%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                      </colgroup>
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                          {["Date", "Reason", "Doctor", "Total", "Paid"].map((h, i) => (
                            <th
                              key={h}
                              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400 ${
                                i >= 3 ? "text-right" : "text-left"
                              }`}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visits.map((visit) => {
                          const paidAmount =
                            visit.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
                          const due = visit.totalAmount - paidAmount;
                          return (
                            <tr key={visit.id} className="odd:bg-slate-50/40 hover:bg-indigo-50/40 transition-colors">
                              <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                {new Date(visit.date).toLocaleDateString("en-PK", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3.5 text-slate-700 truncate font-medium">
                                {visit.reason || "—"}
                              </td>
                              <td className="px-4 py-3.5 text-slate-500 truncate">{visit.doctorName || "—"}</td>
                              <td className="px-4 py-3.5 text-right text-slate-700 tabular-nums">
                                {visit.totalAmount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5 text-right tabular-nums">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                                    due > 0
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  {paidAmount.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : appointments.length === 0 ? (
                <EmptyState icon={<CalendarDays className="w-7 h-7" />} label="No appointments scheduled yet" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((appt) => {
                    const style = STATUS_STYLES[appt.status] ?? STATUS_STYLES["PENDING"];
                    return (
                      <div
                        key={appt.id}
                        style={{ borderLeftColor: style.border }}
                        className="rounded-xl border border-slate-200 border-l-4 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {appt.reason || "General Appointment"}
                            </p>
                            <p className="text-sm text-slate-400 mt-0.5 truncate">
                              {appt.doctorName || "No doctor assigned"}
                            </p>
                          </div>
                          <StatusBadge status={appt.status} />
                        </div>
                        <div className="flex items-center gap-5 text-sm text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(appt.date).toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {appt.time}
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="mt-3 text-sm text-slate-400 border-t border-slate-100 pt-3 line-clamp-2">
                            {appt.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ── Small helpers ──────────────────────────────────────────────

function InfoChip({
  icon,
  text,
  label,
  truncate,
}: {
  icon: React.ReactNode;
  text?: string;
  label?: string;
  truncate?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2 text-sm text-slate-500 ${truncate ? "truncate max-w-xs" : ""}`}>
      <span className="text-slate-400 shrink-0">{icon}</span>
      {label && <span className="text-slate-400">{label}:</span>}
      <span className={truncate ? "truncate" : "font-medium text-slate-600"}>{text || "—"}</span>
    </span>
  );
}

function Pill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-500 shadow-sm">
      {icon}
      <strong className="font-semibold text-slate-700">{value}</strong> {label}
    </span>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 ring-1 ring-slate-100">
        {icon}
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}