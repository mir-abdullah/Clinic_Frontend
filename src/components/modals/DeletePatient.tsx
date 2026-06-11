"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { patientAPI } from "@/utils/api";
import { toast } from "sonner";
import { deletePatient } from "@/actions/patients";

export const DeletePatient = ({
  open = true,
  patientId,
  onClose = () => {},
  onDeleted = () => {},
}: {
  open?: boolean;
  patientId?: string;
  onClose?: () => void;
  onDeleted?: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [patientName, setPatientName] = useState<string | null>(null);

  useEffect(() => {
    if (!patientId) return;
    let mounted = true;
    patientAPI
      .get(`/${patientId}`)
      .then((res) => {
        if (mounted) setPatientName(res.data?.name || null);
      })
      .catch(() => {
        if (mounted) setPatientName(null);
      });
    return () => {
      mounted = false;
    };
  }, [patientId]);

  if (!open) return null;

  const handleDelete = async () => {
    if (!patientId) return;
    setIsDeleting(true);
    try {
      await deletePatient(patientId);
      toast.success("Patient deleted successfully");
      onDeleted();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err as any).response?.data?.message
          : null;
      toast.error(message || "Failed to delete patient");
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/40 p-4 overflow-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className=" w-fit bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Delete Patient</h3>
          <button
            className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-700 mb-4 ">
            Are you sure you want to delete {patientName || "this patient"}?
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50 cursor-pointer hover:bg-red-800"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
