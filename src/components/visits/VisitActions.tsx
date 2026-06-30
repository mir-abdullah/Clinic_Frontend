"use client";
import React from 'react'
import { Visit} from "@/utils/type";
import { useState } from 'react';
import { toast } from "sonner";
import { RecordPaymentModal } from "@/components/modals/RecordPayment";
import { ViewVisitModal } from '../modals/ViewVisitDetails';
import { sendReceipt } from '@/utils/helpers';

const VisitActions = ({ visit }: { visit: Visit }) => {
      const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
      const [viewVisitOpen, setViewVisitOpen] = useState(false);
  

  return (
    <div className="flex flex-row gap-2">
         <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="View"
          onClick={() => setViewVisitOpen(true)}
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
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="Send Receipt"
          onClick={() => sendReceipt(visit)}
        >
            📤
        </button>
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
        {
          viewVisitOpen && (
            <ViewVisitModal 
              visit={visit}
              onClose={() => setViewVisitOpen(false)}
              open={viewVisitOpen}
            />
          )
        }

      
    </div>
  )
}

export default VisitActions
