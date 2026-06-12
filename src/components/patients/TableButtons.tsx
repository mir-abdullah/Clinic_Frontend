"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeletePatient } from "@/components/modals/DeletePatient";
import { AddVisitModal } from "@/components/modals/AddVisit";

export const TableButtons = ({ patientId }: { patientId?: string }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [addVisitModalOpen, setAddVisitModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="View"
        >
          👁️
        </button>
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-green-100 transition cursor-pointer"
          title="Add Appointment"
        >
          📅
        </button>
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="Add Visit"
          onClick={() => setAddVisitModalOpen(true)}
        >
          🩺
        </button>
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-red-100 transition cursor-pointer"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      {isDeleteOpen && (
        <DeletePatient
          open={isDeleteOpen}
          patientId={patientId}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={() => {
            setIsDeleteOpen(false);
            router.refresh();
          }}
        />
      )}
      {
        addVisitModalOpen && (
          <AddVisitModal 
            open={addVisitModalOpen}
            patientId={patientId}
            onClose={()=> setAddVisitModalOpen(false)}
            onSuccess={()=>{
              setAddVisitModalOpen(false);
              router.refresh();
            }}
          />
        )
      }
    </>
  );
};
