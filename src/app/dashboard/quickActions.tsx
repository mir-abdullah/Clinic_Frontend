"use client";

import { useEffect, useState } from "react";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Action } from "@/utils/type";
import { AddPatient } from "@/components/modals/AddPatient";
import { toast } from "sonner";
import { redirect } from "next/navigation";

type Props = {
  actions: Action[];
};

export function QuickActionsClient({ actions }: Props) {
  const [activeModal, setActiveModal] = useState<null | "addPatient">(null);
  const isAddPatientOpen = activeModal === "addPatient";

  useEffect(() => {
    if (!isAddPatientOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isAddPatientOpen]);

  return (
    <>
      <QuickActions
        actions={actions}
        onActionClick={(action) => {
          if (action.title === "Add Patient") {
            setActiveModal("addPatient");
          }
        }}
      />

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-200/40 p-4 transition-opacity ${
          isAddPatientOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setActiveModal(null)}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <AddPatient
            open={isAddPatientOpen}
            onClose={() => setActiveModal(null)}
            onSuccess={(message) => {
              toast.success(message)
              redirect("/patients");
            }}
          />
        </div>
      </div>
    </>
  );
}