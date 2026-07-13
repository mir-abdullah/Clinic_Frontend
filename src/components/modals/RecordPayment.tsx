"use client";

import { useActionState, useEffect, useState } from "react";
import { addPayment, editPayment } from "@/actions/payment";
import { Payment, Visit, actionState } from "@/utils/type";
import { X, CreditCard } from "lucide-react";

const initialState: actionState = {
  status: "idle",
  message: "",
};

export const RecordPaymentModal = ({
  open = true,
  onClose = () => {},
  onSuccess = () => {},
  visit,
  payment = null,
}: {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (message: string) => void;
  visit: Visit;
  payment?: Payment | null;
}) => {
  const isEditing = Boolean(payment);
  const addPaymentWithVisit = addPayment.bind(null, visit.id);
  const editPaymentWithId = payment ? editPayment.bind(null, payment.id) : null;
  const submitAction = async (prevState: actionState, formData: FormData) => {
    if (isEditing && editPaymentWithId) {
      return editPaymentWithId(prevState, formData);
    }

    return addPaymentWithVisit(prevState, formData);
  };
  const [state, formAction, pending] = useActionState(submitAction, initialState);
 
  const [amount, setAmount] = useState(payment ? String(payment.amount) : "");
  const [method, setMethod] = useState<string>(payment?.method ?? "");
  const [notes, setNotes] = useState<string>(payment?.notes ?? "");


  const previouslyPaid = visit?.payments?.reduce((sum, payment) => sum + payment.amount, 0) ?? 0;
  const totalBilled = visit?.totalAmount ?? 0;
  const dueAmount = Math.max(totalBilled - previouslyPaid, 0);
  const outstandingBalance = isEditing && payment
    ? Math.max(totalBilled - (previouslyPaid - payment.amount), 0)
    : dueAmount ?? 0;

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-(--bg-primary) shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-(--text-primary)" />
            <h2 className="text-base font-semibold text-(--text-primary)">
              💳 {isEditing ? "Edit Payment" : "Record Payment"}
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

        <form action={formAction}>
          <div className="px-6 py-5 space-y-5">
            {/* SELECT VISIT */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
                Select Visit
              </p>
              <div>
                <label className="text-sm font-medium text-(--text-primary)">
                  Visit / Patient <span className="text-red-500">*</span>
                </label>
                <div className="mt-1.5 w-full rounded-lg border border-border bg-(--bg-secondary) px-3 py-2.5 text-sm text-(--text-primary)">
                  {visit?.patient?.name} · {visit.reason}
                </div>
                <input type="hidden" name="visitId" value={visit.id} />
              </div>
            </div>

            {/* VISIT DETAILS */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
                Visit Details
              </p>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                  <span className="text-sm text-(--text-secondary)">
                    Service
                  </span>
                  <span className="text-sm font-semibold text-(--text-primary)">
                    {visit.reason ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                  <span className="text-sm text-(--text-secondary)">
                    Total Billed
                  </span>
                  <span className="text-sm font-semibold text-(--text-primary)">
                    Rs{totalBilled.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                  <span className="text-sm text-(--text-secondary)">
                    Previously Paid
                  </span>
                  <span className="text-sm font-semibold text-(--text-primary)">
                    Rs{previouslyPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm text-(--text-secondary)">
                    Outstanding Balance
                  </span>
                  <span className="text-sm font-bold text-amber-500">
                    Rs{outstandingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Payment Details
              </p>

              {/* Payment Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Amount <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="amount"
                  value={amount}
                  min={1}
                  max={outstandingBalance}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  required
                  onChange={(e) => {
                    const value = e.target.value;

                    if (Number(value) <= outstandingBalance || value === "") {
                      setAmount(value);
                    }
                  }}
                />

                <p className="text-xs text-amber-600">
                  Maximum allowed: Rs{outstandingBalance.toLocaleString()}
                </p>

                {amount && Number(amount) > outstandingBalance && (
                  <p className="text-xs text-red-500">
                    Amount cannot exceed the outstanding balance.
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method <span className="text-red-500">*</span>
                </label>

                <select
                  name="paymentMethod"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100 cursor-pointer"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="CASH">💵 Cash</option>
                  <option value="ONLINE">🌐 Online</option>
                  <option value="BANK">🏦 Bank</option>
                </select>
              </div>

              {/* Payment Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Notes
                </label>

                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Add any notes about this payment (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Error message */}
            {state.message && state.status === "error" && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {state.message}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg cursor-pointer border border-border px-5 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--bg-secondary) transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-green-500 hover:bg-green-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
            >
              💳
              {pending ? " Recording..." : isEditing ? " Save Payment" : " Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
