"use client";

import { useActionState, useEffect, useState } from "react";
import { addVisit } from "@/actions/visits";
import { actionState } from "@/utils/type";
import { X, Stethoscope, Receipt } from "lucide-react";
import { visitReasons } from "@/utils/data";

const initialState: actionState = {
  status: "idle",
  message: "",
};

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

export const AddVisitModal = ({
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
  const addVisitWithPatient = addVisit.bind(null, patientId);
  const [state, formAction, pending] = useActionState(
    addVisitWithPatient,
    initialState,
  );
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const isCustomReason =
    selectedReason === "Other||Not Listed" ||
    selectedReason === "Other||Custom Reason";

  const finalReason = (() => {
    if (!selectedReason) return "";
    const [category, reason] = selectedReason.split("||");
    if (isCustomReason) {
      return customReason ? `${category} - ${customReason}` : "";
    }
    return `${category} - ${reason}`;
  })();

  const dueAmount = Math.max(totalAmount - paidAmount, 0);

  const paymentStatus: "PAID" | "PENDING" | "PARTIAL" =
    paidAmount <= 0
      ? "PENDING"
      : paidAmount >= totalAmount && totalAmount > 0
        ? "PAID"
        : "PARTIAL";

  useEffect(() => {
    if (state.status === "success") {
      onSuccess(state.message);
      onClose();
    }
  }, [state, onClose, onSuccess]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-border bg-(--bg-primary) px-3 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "text-sm font-medium text-(--text-primary)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-xl bg-(--bg-secondary) shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-(--bg-primary) shrink-0">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="text-(--text-primary)" />
            <h2 className="text-base font-semibold text-(--text-primary)">
              Add Visit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          action={formAction}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="px-6 py-5 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              {/* LEFT COLUMN — Visit Details */}
              <div className="rounded-xl border border-border bg-(--bg-primary) p-5 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
                  Visit Details
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={`${labelClass} block`}>
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={getCurrentDate()}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`${labelClass} block`}>
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="time"
                      defaultValue={getCurrentTime()}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>Doctor Name</label>
                  <select
                    name="doctorName"
                    required
                    className={inputClass}
                    defaultValue={"Dr. Maryam"}
                  >
                    <option value="">Select Doctor</option>
                    <option value="Dr. Maryam">Dr. Maryam</option>
                    <option value="Dr. Zahid">Dr. Zahid</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>
                    Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedReason}
                    onChange={(e) => {
                      setSelectedReason(e.target.value);
                      setCustomReason("");
                    }}
                    className={inputClass}
                    required
                  >
                    <option value="">Select a reason</option>
                    {visitReasons.map((group) => (
                      <optgroup key={group.category} label={group.category}>
                        {group.reasons.map((reason) => (
                          <option
                            key={`${group.category}||${reason}`}
                            value={`${group.category}||${reason}`}
                          >
                            {reason}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {isCustomReason && (
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Enter custom reason"
                      className={`${inputClass} mt-1`}
                      required
                    />
                  )}

                  <input type="hidden" name="reason" value={finalReason} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>Diagnosis</label>
                  <textarea
                    name="diagnosis"
                    rows={2}
                    placeholder="Enter diagnosis (optional)"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>Prescription</label>
                  <textarea
                    name="prescription"
                    rows={2}
                    placeholder="Enter prescription (optional)"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Additional notes (optional)"
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN — Billing */}
              <div className="rounded-xl border border-border bg-(--bg-primary) p-5 space-y-4 sticky top-0">
                <div className="flex items-center gap-2">
                  <Receipt size={15} className="text-(--text-secondary)" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
                    Billing
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>
                    Total Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-secondary)">
                      Rs
                    </span>
                    <input
                      type="number"
                      name="totalAmount"
                      placeholder="0"
                      min={0}
                      step={100}
                      value={totalAmount || ""}
                      onChange={(e) =>
                        setTotalAmount(Number(e.target.value) || 0)
                      }
                      className={`${inputClass} pl-9`}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={`${labelClass} block`}>Paid Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-secondary)">
                      Rs
                    </span>
                    <input
                      type="number"
                      name="paidAmount"
                      placeholder="0"
                      min={0}
                      max={totalAmount}
                      step={100}
                      value={paidAmount || ""}
                      onChange={(e) => {
                    const value = e.target.value;

                    if (Number(value) <= totalAmount || value === "") {
                      setPaidAmount(Number(value) || 0);
                    }
                  }}
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </div>

                {/* Premium summary card */}
                <div className="rounded-xl bg-gradient-to-br from-(--bg-secondary) to-(--bg-primary) border border-border p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-(--text-secondary)">
                      Due Amount
                    </span>
                    <span className="text-xl font-bold text-amber-500">
                      Rs{dueAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-(--text-secondary)">
                      Payment Status
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : paymentStatus === "PARTIAL"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error message */}
            {state.message && state.status === "error" && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {state.message}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-(--bg-primary) shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--bg-secondary) transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
            >
              <Stethoscope size={15} />
              {pending ? "Saving..." : "Add Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
