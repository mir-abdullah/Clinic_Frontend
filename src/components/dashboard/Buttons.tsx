"use client";
import { useState } from "react";
import { BookAppointment } from "../modals/BookAppointment";

export const Buttons = () => {
    const [isBookAppointmentOpen, setIsBookAppointmentOpen] = useState(false);

    return(
         <>
             <div className="flex gap-3 ml-auto">
                <button
                    className={
                        "px-3 h-8 rounded-md text-sm font-medium cursor-pointer inline-flex items-center gap-2 bg-(--bg-primary) text-(--text-primary) border border-border shadow-sm hover:border-primary hover:text-primary transition ease-in-out duration-150 leading-none"
                    }
                >
                    <span className="text-sm">📊</span>
                    Reports
                </button>
                <button 
                    onClick={() => setIsBookAppointmentOpen(true)}
                    className={
                        "px-3 h-8 rounded-md text-sm font-medium cursor-pointer inline-flex items-center gap-2 bg-primary text-white shadow-sm hover:bg-(--primary-dark) hover:shadow-md hover:-translate-y-px transition transform ease-in-out duration-150 leading-none"
                    }
                >
                    <span className="text-sm">➕</span>
                    New Appointment
                </button>
             </div>

             {isBookAppointmentOpen && (
                <BookAppointment 
                    open={isBookAppointmentOpen}
                    onClose={() => setIsBookAppointmentOpen(false)}
                    onSuccess={() => setIsBookAppointmentOpen(false)}
                    
                />
             )}
         </>
    )
}