"use client";
import React from 'react'
import { Visit} from "@/utils/type";
import { useState } from 'react';
import { toast } from "sonner";
import { RecordPaymentModal } from "@/components/modals/RecordPayment";

const VisitActions = ({ visit }: { visit: Visit }) => {
      const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  return (
    <div className="flex flex-row gap-2">
         <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="View"
        >
          👁️
        </button>
        {visit.paymentStatus !== "PAID" && (
          <button
            className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-green-100 transition cursor-pointer"
            title="Add Payment"
            onClick={() => setRecordPaymentOpen(true)}
          >
            💳
          </button>
        )}
        {
          recordPaymentOpen && (
            <RecordPaymentModal 
              visit={visit}
              onClose={() => setRecordPaymentOpen(false)}
              onSuccess={()=> {setRecordPaymentOpen(false)
                toast.success("Payment Recorded Successfully", { position: "top-right" })
              }}
              open={recordPaymentOpen}
            />
            
          )
        }

      
    </div>
  )
}

export default VisitActions
