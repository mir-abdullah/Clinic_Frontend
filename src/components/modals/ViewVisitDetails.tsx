"use client";

import { useEffect, useState } from "react";
import { Visit, Payment } from "@/utils/type";
import { paymentAPI } from "@/utils/api";
import { formatDateWithOrdinal } from "@/utils/helpers";
import { X, Eye, CreditCard, Banknote, Landmark, FileText, Globe, MoreHorizontal, Loader2 } from "lucide-react";

const paymentMethodConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  CASH: { label: "CASH", icon: Banknote, className: "bg-green-100 text-green-700" },
  BANK: { label: "BANK", icon: Landmark, className: "bg-purple-100 text-purple-700" },
  ONLINE: { label: "ONLINE", icon: Globe, className: "bg-cyan-100 text-cyan-700" },
};

export const ViewVisitModal = ({
  open = true,
  onClose = () => {},
  onAddPayment = () => {},
  visit,
}: {
  open?: boolean;
  onClose?: () => void;
  onAddPayment?: () => void;
  visit: Visit;
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setError(null);

    paymentAPI
      .get(`visit/${visit.id}`)
      .then((res) => {
        console.log("Payment History:", res?.data);
        if (active) setPayments(res?.data?.payments ?? []);
      })
      .catch(() => {
        if (active) setError("Failed to load payment history.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, visit.id]);

  const totalBilled = visit.totalAmount ?? 0;
  const totalCollected = visit.paidAmount ?? 0;
  const balance = visit.dueAmount ?? 0;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-(--bg-primary) shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-(--text-primary)" />
            <h2 className="text-base font-semibold text-(--text-primary)">Visit Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto space-y-6">

          {/* VISIT INFORMATION */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
              Visit Information
            </p>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                <span className="text-sm text-(--text-secondary)">Patient</span>
                <span className="text-sm font-semibold text-(--text-primary)">
                  {visit?.patient?.name}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                <span className="text-sm text-(--text-secondary)">Service</span>
                <span className="text-sm font-semibold text-(--text-primary)">
                  {visit.reason ?? "—"}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm text-(--text-secondary)">Date &amp; Time</span>
                <span className="text-sm font-semibold text-(--text-primary)">
                  {formatDateWithOrdinal(visit.date)} • {visit.time}
                </span>
              </div>
            </div>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
              Financial Summary
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-border p-3 text-center space-y-1">
                <p className="text-xs text-(--text-secondary)">Billed</p>
                <p className="text-sm font-bold text-(--text-primary)">
                  Rs{totalBilled.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center space-y-1">
                <p className="text-xs text-(--text-secondary)">Collected</p>
                <p className="text-sm font-bold text-green-600">
                  {loading ? "—" : `Rs${totalCollected.toLocaleString()}`}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center space-y-1">
                <p className="text-xs text-(--text-secondary)">Balance</p>
                <p className="text-sm font-bold text-amber-500">
                  {loading ? "—" : `Rs${balance.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT HISTORY */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-(--text-secondary)">
              Payment History
            </p>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-(--text-secondary)">
                <Loader2 size={16} className="animate-spin" />
                Loading payments...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-dashed border-red-300 px-4 py-6 text-center">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : payments.length > 0 ? (
              <div className="space-y-2">
                {payments.map((payment) => {
                  const config =
                    paymentMethodConfig[payment.method] ?? paymentMethodConfig.OTHER;
                  const Icon = config.icon;

                  return (
                    <div
                      key={payment.id}
                      className="rounded-lg bg-(--bg-secondary) border border-border px-4 py-3 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${config.className}`}
                        >
                          <Icon size={11} />
                          {config.label}
                        </span>
                        <p className="text-xs text-(--text-secondary)">
                          {formatDateWithOrdinal(payment.createdAt)} •{" "}
                          {new Date(payment.createdAt).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                        {payment.notes && (
                          <p className="text-xs text-(--text-secondary)">{payment.notes}</p>
                        )}
                      </div>
                      <span className="text-base font-bold text-green-600">
                        Rs{payment.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-6 text-center">
                <p className="text-sm text-(--text-secondary)">No payments recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-(--text-primary) hover:bg-(--bg-secondary) transition-colors"
          >
            Close
          </button>
         
        </div>
      </div>
    </div>
  );
};