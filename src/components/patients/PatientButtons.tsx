"use client";
import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { AddPatient } from "../modals/AddPatient";

export const PatientButtons = () => {
     const router = useRouter();
      const pathname = usePathname();
      const searchParams = useSearchParams();
      const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    
        const updateParams = useCallback(
          (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
              if (value) params.set(key, value);
              else params.delete(key);
            });
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
          },
          [pathname, router, searchParams]
        );
      
        const handleSearch = useCallback(
          (value: string) => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
            searchTimeout.current = setTimeout(() => {
              updateParams({ search: value });
            }, 400);
          },
          [updateParams]
        );
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

    const handleAddPatient = () => {
        setIsAddPatientOpen(true);
    }
        
    return (
        <div className="flex gap-3 ml-auto items-center">
            <div className="relative w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--text-secondary)">🔍</span>
                <input
                     onChange={(e) => handleSearch(e.target.value)}
                    type="text"
                    placeholder="Search patients..."
                    className="w-full border border-border rounded-md h-9 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-(--text-primary)"
                />
            </div>
            <button className="rounded-md cursor-pointer bg-primary text-white px-4 h-9 inline-flex items-center gap-2 hover:bg-(--primary-dark) transition shadow-sm"
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
                                        key={"add"}
                                        mode="add"
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