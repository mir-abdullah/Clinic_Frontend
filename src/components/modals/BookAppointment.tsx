"use client";

import {
  Calendar,
  Clock,
  FileText,
  Phone,
  Search,
  User,
  X,
  MapPin,
} from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { addAppointment, editAppointment } from "@/actions/appointments";
import { patientAPI } from "@/utils/api";
import type {
  AppointmentActionState,
  AppointmentWithPatient,
  Patient,
} from "@/utils/type";
import { visitReasons } from "@/utils/data";

type Step = "choice" | "search" | "new-patient" | "appointment";

const CUSTOM_REASON_VALUE = "Other · Custom Reason";
const OTHER_REASON_VALUE = "Other · Not Listed";
const REASON_VALUES = new Set(
  visitReasons.flatMap((group) =>
    group.reasons.map((reason) => `${group.category} · ${reason}`),
  ),
);

export const BookAppointment = ({
  open = true,
  onClose = () => {},
  onSuccess = () => {},
  appointment = null,
}: {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
  appointment?: AppointmentWithPatient | null;
}) => {
  const isEditing = Boolean(appointment);
  const [step, setStep] = useState<Step>(isEditing ? "appointment" : "choice");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    appointment ? ({ ...appointment.patient, address: "" } as Patient) : null,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [selectedReason, setSelectedReason] = useState(() => {
    const reason = appointment?.reason ?? "";
    return reason && !REASON_VALUES.has(reason) ? CUSTOM_REASON_VALUE : reason;
  });
  const [customReason, setCustomReason] = useState(() => {
    const reason = appointment?.reason ?? "";
    return reason && !REASON_VALUES.has(reason) ? reason : "";
  });

  const isCustom =
    selectedReason === CUSTOM_REASON_VALUE || selectedReason === OTHER_REASON_VALUE;

  const [state, action, isPending] = useActionState<
    AppointmentActionState,
    FormData
  >(appointment ? editAppointment.bind(null, appointment.id) : addAppointment, {
    status: "idle",
    message: "",
  });

  // Handle success/error messages
  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      onSuccess(state.message);
      onClose();
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state.status, state.message, onClose, onSuccess]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await patientAPI.get("/all", {
        params: { page: 1, limit: 1000 },
      });
      const patients = res.data?.patients || [];
      const normalizedQuery = query.trim().toLowerCase();

      setSearchResults(
        patients.filter((patient: Patient) => {
          const name = patient.name?.toLowerCase() || "";
          const phone = patient.phone?.toLowerCase() || "";
          return (
            name.includes(normalizedQuery) || phone.includes(normalizedQuery)
          );
        }),
      );
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setStep("appointment");
    setSearchQuery("");
    setSearchResults([]);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/40 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-slate-900 to-slate-800 px-8 py-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEditing && step === "appointment"
                ? "Edit Appointment"
                : step === "choice"
                  ? "Book Appointment"
                  : step === "search"
                    ? "Select Patient"
                    : step === "new-patient"
                      ? "New Patient Registration"
                      : "Appointment Details"}
            </h2>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Choice Step */}
          {!isEditing && step === "choice" && (
            <div className="space-y-4">
              <p className="text-slate-600 mb-6">
                How would you like to book an appointment?
              </p>
              <button
                type="button"
                onClick={() => setStep("search")}
                className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-slate-700 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Search className="w-5 h-5 text-slate-700" />
                  <h3 className="font-semibold text-slate-900">
                    Existing Patient
                  </h3>
                </div>
                <p className="text-sm text-slate-600 ml-8">
                  Search for a registered patient
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStep("new-patient")}
                className="w-full p-6 rounded-xl border-2 border-slate-200 hover:border-slate-700 hover:bg-slate-50 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-slate-700" />
                  <h3 className="font-semibold text-slate-900">New Patient</h3>
                </div>
                <p className="text-sm text-slate-600 ml-8">
                  Register and book appointment
                </p>
              </button>
            </div>
          )}

          {/* Search Step */}
          {!isEditing && step === "search" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Find Patient
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {isSearching && (
                <div className="text-center py-8 text-slate-500">
                  Searching...
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2 border-2 border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handleSelectPatient(patient)}
                      className="w-full text-left p-3 rounded-lg hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all"
                    >
                      <div className="font-semibold text-slate-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-slate-600">
                        {patient.phone} • {patient.address}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                  <div className="text-slate-600">Patient not found.</div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setStep("choice");
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="w-full px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              >
                Back
              </button>
            </div>
          )}

          {/* New Patient + Appointment Step */}
          {!isEditing && step === "new-patient" && (
            <form action={action} className="space-y-6">
              {state.status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">
                  {state.message}
                </div>
              )}

              {/* Patient Info Section */}
              <section className="space-y-4">
                <h3 className="font-semibold text-slate-900 text-lg">
                  Patient Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Enter patient's full name"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="03XX-XXXXXXX"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter age"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="address"
                        required
                        placeholder="Street address, city, postal code"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Appointment Info Section */}
              <section className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 text-lg">
                  Appointment Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="date"
                        name="date"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                      value={appointment?.time}
                        type="time"
                        name="time"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* Doctor Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Doctor Name
                    </label>
                    <select
                      name="doctorName"
                      defaultValue="Dr. Maryam"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    >
                      <option value="Dr. Maryam">Dr. Maryam</option>
                      <option value="Dr. Zahid">Dr. Zahid</option>
                    </select>
                  </div>

                  {/* Reason */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Reason for Visit
                    </label>
                    <select
                      name={isCustom ? undefined : "reason"}
                      value={selectedReason}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedReason(value);
                        if (value !== CUSTOM_REASON_VALUE && value !== OTHER_REASON_VALUE) {
                          setCustomReason("");
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    >
                      <option value="">Select a reason</option>
                      {visitReasons.map((group) => (
                        <optgroup key={group.category} label={group.category}>
                          {group.reasons.map((reason) => {
                            const value = `${group.category} · ${reason}`;
                            return (
                              <option key={value} value={value}>
                                {reason}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Custom reason input shown only for "Other" options */}
                  {isCustom && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Describe Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="reason"
                        required
                        placeholder="Enter custom reason..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                      />
                    </div>
                  )}
                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Any additional notes..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Hidden Status */}
                <input type="hidden" name="status" value="SCHEDULED" />
              </section>

              {/* Footer */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep("choice")}
                  className="px-6 py-2 rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-900"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all font-medium"
                >
                  {isPending ? "Booking..." : "Register & Book"}
                </button>
              </div>
            </form>
          )}

          {/* Appointment Only Step */}
          {(step === "appointment" || isEditing) && selectedPatient && (
            <form action={action} className="space-y-6">
              {state.status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">
                  {state.message}
                </div>
              )}

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="font-semibold text-slate-900">
                  {selectedPatient.name}
                </div>
                <div className="text-sm text-slate-600">
                  {selectedPatient.phone}
                  {selectedPatient.address ? ` • ${selectedPatient.address}` : ""}
                </div>
              </div>

              <input
                type="hidden"
                name="patientId"
                value={selectedPatient.id}
              />
              <input type="hidden" name="status" value="SCHEDULED" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="time"
                      name="time"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Doctor Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Doctor Name
                  </label>
                  <select
                    name="doctorName"
                    defaultValue="Dr. Maryam"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                  >
                    <option value="Dr. Maryam">Dr. Maryam</option>
                    <option value="Dr. Zahid">Dr. Zahid</option>
                  </select>
                </div>

                {/* Reason */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Reason for Visit
                  </label>
                  <select
                    name={isCustom ? undefined : "reason"}
                    value={selectedReason}
                    required
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedReason(value);
                        if (value !== CUSTOM_REASON_VALUE && value !== OTHER_REASON_VALUE) {
                          setCustomReason("");
                        }
                      }}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                  >
                    <option value="">Select a reason</option>
                    {visitReasons.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.reasons.map((reason) => {
                          const value = `${group.category} · ${reason}`;
                          return (
                            <option key={value} value={value}>
                              {reason}
                            </option>
                          );
                        })}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Custom reason input shown only for "Other" options */}
                {isCustom && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Describe Reason <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="reason"
                      required
                      placeholder="Enter custom reason..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Additional Notes
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Any additional notes..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-700 focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      onClose();
                      return;
                    }

                    setSelectedPatient(null);
                    setStep("search");
                  }}
                  className="px-6 py-2 rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-900"
                >
                  {isEditing ? "Cancel" : "Back"}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all font-medium"
                >
                  {isPending
                    ? isEditing
                      ? "Saving..."
                      : "Booking..."
                    : isEditing
                      ? "Save Changes"
                      : "Book Appointment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
