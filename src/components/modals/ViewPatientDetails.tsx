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
import {  appointmentAPI, visitAPI } from "@/utils/api";
import { Patient, Visit, Appointment } from "@/utils/type";
import { AddPatient } from "./AddPatient";
import { toast } from "sonner";
import { sendReceipt } from "@/utils/helpers";

type Tab = "visits" | "appointments";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: "#F0FDF4", text: "#166534", label: "Completed" },
  PENDING:   { bg: "#FFFBEB", text: "#92400E", label: "Pending" },
  CANCELLED: { bg: "#FEF2F2", text: "#991B1B", label: "Cancelled" },
  SCHEDULED: { bg: "#EFF6FF", text: "#1E40AF", label: "Scheduled" },
  NO_SHOW:   { bg: "#F8FAFC", text: "#475569", label: "No Show" },
};

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES["PENDING"];
  return (
    <span
      style={{ backgroundColor: style.bg, color: style.text }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-current/20"
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
    void (async () => { await fetchData(patient.id); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, patient]);

  if (!open || !patient) return null;

  const balance = visits.reduce((acc, v) => acc + (v.totalAmount - v.paidAmount), 0);

  const hasGuardian   = !!patient.guardian;
  const hasOccupation = !!patient.occupation;
  const hasHistory    = !!patient.medicalHistory;
  const hasExtras     = hasGuardian || hasOccupation;

  return (
    <>
      {/* ── Edit Patient Modal ── */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div
          className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-base font-semibold text-slate-600 shrink-0">
                {initials(patient.name)}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 leading-tight">{patient.name}</p>
                <p className="text-sm text-slate-400 mt-0.5">Patient Record</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)} // ← simply open the edit modal
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* ── Patient info strip ── */}
            <div className="px-8 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InfoChip icon={<Phone className="w-4 h-4" />} text={patient.phone} />
                <InfoChip
                  icon={<User className="w-4 h-4" />}
                  text={[patient.gender, patient.age ? `${patient.age} yrs` : null].filter(Boolean).join(" · ") || "—"}
                />
                {patient.address && (
                  <InfoChip icon={<MapPin className="w-4 h-4" />} text={patient.address} truncate />
                )}
                <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
                  <Pill icon={<ClipboardList className="w-4 h-4" />} value={visits.length} label="visits" />
                  <Pill icon={<CalendarDays className="w-4 h-4" />} value={appointments.length} label="appts" />
                  {balance > 0 && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4" />
                      <strong className="font-semibold">Rs. {balance.toLocaleString()}</strong> due
                    </span>
                  )}
                </div>
              </div>

              {hasExtras && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-slate-200">
                  {hasGuardian && (
                    <InfoChip icon={<Users className="w-4 h-4" />} label="Guardian" text={patient.guardian!} />
                  )}
                  {hasOccupation && (
                    <InfoChip icon={<Briefcase className="w-4 h-4" />} label="Occupation" text={patient.occupation!} />
                  )}
                </div>
              )}

              {hasHistory && (
                <div className="pt-1 border-t border-slate-200">
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
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed bg-white rounded-lg border border-slate-200 px-4 py-3">
                      {patient.medicalHistory}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex border-b border-slate-100 px-8">
              {(["visits", "appointments"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 py-4 mr-8 text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-slate-900 text-slate-900 font-medium"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "visits" ? <ClipboardList className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                  {tab === "visits" ? "Visits" : "Appointments"}
                </button>
              ))}
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
                  <EmptyState icon={<ClipboardList className="w-8 h-8" />} label="No visits recorded yet" />
                ) : (
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm table-fixed">
                      <colgroup>
                        <col className="w-[20%]" />
                        <col className="w-[30%]" />
                        <col className="w-[20%]" />
                        <col className="w-[15%]" />
                        <col className="w-[15%]" />
                      </colgroup>
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          {["Date", "Reason", "Doctor", "Total", "Paid "].map((h, i) => (
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
                          const due = visit.totalAmount - visit.paidAmount;
                          return (
                            <tr key={visit.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                                {new Date(visit.date).toLocaleDateString("en-PK", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3.5 text-slate-700 truncate">{visit.reason || "—"}</td>
                              <td className="px-4 py-3.5 text-slate-500 truncate">{visit.doctorName || "—"}</td>
                              <td className="px-4 py-3.5 text-right text-slate-700 tabular-nums">
                                {visit.totalAmount.toLocaleString()}
                              </td>
                              <td className="px-4 py-3.5 text-right tabular-nums">
                                <span className={due > 0 ? "text-amber-600" : "text-emerald-600"}>
                                  {visit.paidAmount.toLocaleString()}
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
                <EmptyState icon={<CalendarDays className="w-8 h-8" />} label="No appointments scheduled yet" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors"
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
                            day: "numeric", month: "short", year: "numeric",
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
                  ))}
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
  icon, text, label, truncate,
}: {
  icon: React.ReactNode;
  text: string;
  label?: string;
  truncate?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2 text-sm text-slate-500 ${truncate ? "truncate max-w-xs" : ""}`}>
      <span className="text-slate-400 shrink-0">{icon}</span>
      {label && <span className="text-slate-400">{label}:</span>}
      <span className={truncate ? "truncate" : ""}>{text}</span>
    </span>
  );
}

function Pill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-sm text-slate-500">
      {icon}
      <strong className="font-semibold text-slate-700">{value}</strong> {label}
    </span>
  );
}

function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">{icon}</div>
      <p className="text-sm">{label}</p>
    </div>
  );
}