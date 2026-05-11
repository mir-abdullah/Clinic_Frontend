"use client";

import { useState } from "react";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Action } from "@/utils/data";

type Props = {
  actions: Action[];
};

export function QuickActionsClient({ actions }: Props) {
  const [activeModal, setActiveModal] = useState<null | "addVisit" | "other">(null);

  return (
    <>
      <QuickActions
        actions={actions}
        onActionClick={(action) => {
          if (action.title === "Add New Visit") {
            setActiveModal("addVisit");
          } else {
            setActiveModal("other");
          }
        }}
      />

      {activeModal === "addVisit" && (
        <div className="mt-4 rounded-md border p-4">
          <div className="font-medium">Add Visit Modal</div>
          <button
            type="button"
            className="mt-2 rounded border px-3 py-1"
            onClick={() => setActiveModal(null)}
          >
            Close
          </button>
        </div>
      )}

      {activeModal === "other" && (
        <div className="mt-4 rounded-md border p-4">
          <div className="font-medium">Other Modal</div>
          <button
            type="button"
            className="mt-2 rounded border px-3 py-1"
            onClick={() => setActiveModal(null)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}