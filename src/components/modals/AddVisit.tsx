"use client";

import { useActionState, useEffect, useState, type ChangeEvent } from "react";
import { addVisit, editVisit } from "@/actions/visits";
import type { Visit, actionState } from "@/utils/type";
import { X, Stethoscope, Receipt } from "lucide-react";
import { visitReasons } from "@/utils/data";

const initialState: actionState = {
  status: "idle",
  message: "",
};

const getCurrentDate = () => new Date().toISOString().split("T")[0];
const getCurrentTime = () => new Date().toTimeString().slice(0, 5);

const OTHER_REASON_VALUE = "Other||Not Listed";
const CUSTOM_REASON_VALUE = "Other||Custom Reason";

const getReasonValue = (reason?: string | null) => {
  if (!reason) return "";

  for (const group of visitReasons) {
    for (const item of group.reasons) {
      if (`${group.category} - ${item}` === reason) {
        return `${group.category}||${item}`;
      }
    }
  }

  return CUSTOM_REASON_VALUE;
};

export const AddVisitModal = ({
  open = true,
  onClose = () => {},
  onSuccess = () => {},
  patientId,
  visit = null,
}: {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
  patientId?: string;
  visit?: Visit | null;
}) => {
  const isEditing = Boolean(visit);
  const addVisitWithPatient = patientId ? addVisit.bind(null, patientId) : null;
  const editVisitWithId = visit ? editVisit.bind(null, visit.id) : null;

  const submitAction = async (prevState: actionState, formData: FormData) => {
    if (isEditing && editVisitWithId) {
      return editVisitWithId(prevState, formData);
    }

    if (!isEditing && addVisitWithPatient) {
      return addVisitWithPatient(prevState, formData);
    }

    return {
      status: "error" as const,
      message: "Missing visit context.",
    };
  };

  const [state, formAction, pending] = useActionState(submitAction, initialState);
  const [totalAmount, setTotalAmount] = useState<number>(visit?.totalAmount ?? 0);
  const [paidAmount, setPaidAmount] = useState<number>(visit?.payments?.reduce((sum, payment) => sum + payment.amount, 0) ?? 0);
  const [selectedReason, setSelectedReason] = useState<string>(getReasonValue(visit?.reason));
  const [customReason, setCustomReason] = useState<string>(() => {
    const reason = visit?.reason ?? "";
    return getReasonValue(reason) === CUSTOM_REASON_VALUE
      ? reason.split(" - ").slice(1).join(" - ")
      : "";
  });
  const [date, setDate] = useState<string>(visit?.date?.slice(0, 10) ?? getCurrentDate());
  const [time, setTime] = useState<string>(visit?.time ?? getCurrentTime());
  const [doctorName, setDoctorName] = useState<string>(visit?.doctorName ?? "Dr. Maryam");
  const [paymentMethod, setPaymentMethod] = useState<string>(visit?.paymentMethod ?? "CASH");

  const isCustomReason =
    selectedReason === OTHER_REASON_VALUE || selectedReason === CUSTOM_REASON_VALUE;

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-(--bg-primary) shrink-0">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="text-(--text-primary)" />
            <h2 className="text-base font-semibold text-(--text-primary)">
              {isEditing ? "Edit Visit" : "Add Visit"}
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

        <form action={formAction} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
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
                      value={date}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
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
                      value={time}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
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
                    value={doctorName}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setDoctorName(e.target.value)}
                  >
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
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      setSelectedReason(e.target.value);
                      if (
                        e.target.value !== CUSTOM_REASON_VALUE &&
                        e.target.value !== OTHER_REASON_VALUE
                      ) {
                        setCustomReason("");
                      }
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomReason(e.target.value)}
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
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                      readOnly={isEditing}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (isEditing) return;

                        const value = e.target.value;
                        if (Number(value) <= totalAmount || value === "") {
                          setPaidAmount(Number(value) || 0);
                        }
                      }}
                      className={`${inputClass} pl-9 ${isEditing ? "bg-gray-100 text-(--text-secondary) cursor-not-allowed" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100"
                    required
                    disabled={isEditing}
                  >
                    <option value="">Select payment method</option>
                    <option value="CASH">💵 Cash</option>
                    <option value="ONLINE">🌐 Online</option>
                    <option value="BANK">🏦 Bank</option>
                  </select>
                  {isEditing && <input type="hidden" name="paymentMethod" value={paymentMethod} />}
                </div>

                <div className="rounded-xl bg-linear-to-br from-(--bg-secondary) to-(--bg-primary) border border-border p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-(--text-secondary)">Due Amount</span>
                    <span className="text-xl font-bold text-amber-500">
                      Rs{dueAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-(--text-secondary)">Payment Status</span>
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

            {state.message && state.status === "error" && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {state.message}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-(--bg-primary) shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--bg-secondary) transition-colors cursor-pointer"
            >
              {isEditing ? "Close" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
            >
              <Stethoscope size={15} />
              {pending ? "Saving..." : isEditing ? "Save Changes" : "Add Visit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
