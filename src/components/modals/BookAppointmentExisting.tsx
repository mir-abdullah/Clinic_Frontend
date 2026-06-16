"use client";

import { Calendar, Clock, FileText, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { addAppointment } from "@/actions/appointments";
import { addAppointmentActionState } from "@/utils/type";
import { visitReasons } from "@/utils/data";

export const BookAppointmentExisting = ({
  open = true,
  onClose = () => {},
  onSuccess = () => {},
  patientId,
}: {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
  patientId: string;
}) => {
  const [state, action, isPending] = useActionState<
    addAppointmentActionState,
    FormData
  >(addAppointment, {
    status: "idle",
    message: "",
  });


  const [selectedReason, setSelectedReason] = useState("");
  const isCustom = selectedReason === "Other · Custom Reason" || selectedReason === "Other · Not Listed";
  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      onSuccess(state.message);
      onClose();
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state.status, state.message, onClose, onSuccess]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
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
            <h2 className="text-xl font-bold">Book Appointment</h2>
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
        <div className="flex-1 overflow-y-auto p-8">
          <form action={action} className="space-y-6">
            {state.status === "error" && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm font-medium text-red-700">
                {state.message}
              </div>
            )}

            <input type="hidden" name="status" value="SCHEDULED" />
            <input type="hidden" name="patientId" value={patientId} />

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
                  onChange={(e) => setSelectedReason(e.target.value)}
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
                onClick={onClose}
                className="px-6 py-2 rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition-all font-medium text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all font-medium"
              >
                {isPending ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};