"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DeletePatient } from "@/components/modals/DeletePatient";
import { AddVisitModal } from "@/components/modals/AddVisit";
import { toast } from "sonner";
import { BookAppointmentExisting } from "../modals/BookAppointmentExisting";
import {Patient} from "../../utils/type";   
import {ViewPatientModal} from "../modals/ViewPatientDetails";

export const TableButtons = ({ patient }: { patient: Patient }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [addVisitModalOpen, setAddVisitModalOpen] = useState(false);
   const [bookAppointmentOpen, setBookAppointmentOpen] = useState(false);
    const [viewPatientOpen, setViewPatientOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="View"
          onClick={() => setViewPatientOpen(true)}
        >
          👁️
        </button>
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-green-100 transition cursor-pointer"
          title="Add Appointment"
          onClick={() => setBookAppointmentOpen(true)}
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
          patientId={patient.id}
          onClose={() => setIsDeleteOpen(false)}
          onDeleted={() => {
            toast.success("Patient removed successfully");
            setIsDeleteOpen(false);
            router.refresh();
          }}
        />
      )}
      {
        addVisitModalOpen && (
          <AddVisitModal 
            open={addVisitModalOpen}
            patientId={patient.id}
            onClose={()=> setAddVisitModalOpen(false)}
            onSuccess={()=>{
              toast.success("Visit added successfully");
              setAddVisitModalOpen(false);
              router.refresh();
            }}
          />
        )
      }
      {
        bookAppointmentOpen && (
          <BookAppointmentExisting
            open={bookAppointmentOpen}
            patientId={patient.id}
            onClose={() => setBookAppointmentOpen(false)}
            onSuccess={() => {
              toast.success("Appointment booked successfully");
              setBookAppointmentOpen(false);
              router.refresh();
            }}
          />
        )
      }

      {viewPatientOpen && (
        <ViewPatientModal
          open={viewPatientOpen}
          patient={patient}
          onClose={() => setViewPatientOpen(false)}
          onEdit={()=>{}}
        />
      )}

    </>
  );
};
