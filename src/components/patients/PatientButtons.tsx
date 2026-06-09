"use client";
import { useState } from "react";

import { redirect } from "next/navigation";
import { toast } from "sonner";

import { AddPatient } from "../modals/AddPatient";
export const PatientButtons = () => {
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

    const handleAddPatient = () => {
        setIsAddPatientOpen(true);
    }
        
    return (
        <div className="flex gap-3 ml-auto items-center">
            <div className="relative w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-secondary)">🔍</span>
                <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full border border-border rounded-md h-9 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-(--text-primary)"
                />
            </div>
            <button className="rounded-md bg-primary text-white px-4 h-9 inline-flex items-center gap-2 hover:bg-(--primary-dark) transition shadow-sm"
             onClick={handleAddPatient}>
                <span className="text-sm">➕</span>
                Add Patient
            </button >
                        {isAddPatientOpen && (
                                <div
                                    className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-200/40 p-4 transition-opacity ${
                                        isAddPatientOpen
                                            ? "opacity-100 pointer-events-auto"
                                            : "opacity-0 pointer-events-none"
                                    }`}
                                    onClick={(event) => {
                                        if (event.target === event.currentTarget) {
                                            setIsAddPatientOpen(false);
                                        }
                                    }}
                                >
                                    <AddPatient
                                        open={isAddPatientOpen}
                                        onClose={() => setIsAddPatientOpen(false)}
                                        onSuccess={(message) => {
                                            toast.success(message);
                                            // redirect("/patients");
                                        }}
                                    />
                                </div>
                        )}
        </div>

    );
}