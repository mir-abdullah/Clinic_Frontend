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
  BadgeCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { patientAPI } from "@/utils/api";
import { Patient } from "@/utils/type";

type Tab = "visits" | "appointments";

type Visit = {
  id: string;
  date: string;
  reason: string;
  doctorName?: string;
  totalAmount: number;
  amountPaid: number;
  status: string;
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  reason?: string;
  doctorName?: string;
  status: string;
  notes?: string;
};

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  CANCELLED: "bg-red-50 text-red-700 border border-red-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border border-blue-200",
  NO_SHOW: "bg-slate-100 text-slate-600 border border-slate-200",
};

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

  const fetchData = async (patientId: string) => {
    setActiveTab("visits");
    setVisits([]);
    setAppointments([]);
    setError("");
    setLoading(true);
    try {
      const [visitsRes, appointmentsRes] = await Promise.all([
        patientAPI.get(`/${patientId}/visits`),
        patientAPI.get(`/${patientId}/appointments`),
      ]);
      setVisits(visitsRes.data?.visits || []);
      setAppointments(appointmentsRes.data?.appointments || []);
    } catch {
      setError("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !patient) return;
    fetchData(patient.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, patient]);

  if (!open || !patient) return null;

  const balance = visits.reduce(
    (acc, v) => acc + (v.totalAmount - v.amountPaid),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 px-8 py-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <p className="text-slate-300 text-sm">Patient Record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(patient)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Patient Info */}
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{patient.gender ?? "—"} {patient.age ? `· ${patient.age} yrs` : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{patient.address ?? "—"}</span>
              </div>
            </div>

            {/* Summary Pills */}
            <div className="flex gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-sm">
                <ClipboardList className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">{visits.length}</span>
                <span className="text-slate-500">Visits</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-sm">
                <CalendarDays className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">{appointments.length}</span>
                <span className="text-slate-500">Appointments</span>
              </div>
              {balance > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200 text-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="font-semibold text-red-700">Rs. {balance.toLocaleString()}</span>
                  <span className="text-red-500">Balance Due</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 pt-5">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("visits")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "visits"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Visits
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("appointments")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "appointments"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Appointments
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-8 py-5">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-red-500 text-sm gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            ) : activeTab === "visits" ? (
              visits.length === 0 ? (
                <EmptyState icon={<ClipboardList className="w-8 h-8" />} label="No visits recorded yet" />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Reason</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-600">Doctor</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">Total</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-600">Paid</th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                            {new Date(visit.date).toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-3 text-slate-700 max-w-45 truncate">
                            {visit.reason || "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {visit.doctorName || "—"}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 font-medium">
                            Rs. {visit.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                            Rs. {visit.amountPaid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[visit.status] ?? STATUS_STYLES["PENDING"]}`}>
                              {visit.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              appointments.length === 0 ? (
                <EmptyState icon={<CalendarDays className="w-8 h-8" />} label="No appointments scheduled yet" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="rounded-xl border border-slate-200 p-4 bg-white hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {appt.reason || "General Appointment"}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {appt.doctorName || "No doctor assigned"}
                          </p>
                        </div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.status] ?? STATUS_STYLES["SCHEDULED"]}`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(appt.date).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.time}
                        </span>
                      </div>
                      {appt.notes && (
                        <p className="mt-2 text-xs text-slate-400 border-t border-slate-100 pt-2 line-clamp-2">
                          {appt.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
      {icon}
    </div>
    <p className="text-sm">{label}</p>
  </div>
);