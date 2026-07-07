"use client";
import React from 'react'
import { Visit} from "@/utils/type";
import { useState } from 'react';
import { toast } from "sonner";
import { RecordPaymentModal } from "@/components/modals/RecordPayment";
import { AddVisitModal } from "@/components/modals/AddVisit";
import { ViewVisitModal } from '../modals/ViewVisitDetails';
import { sendReceipt } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const VisitActions = ({ visit }: { visit: Visit }) => {
      const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
      const [viewVisitOpen, setViewVisitOpen] = useState(false);
  const [editVisitOpen, setEditVisitOpen] = useState(false);
  const router = useRouter();

  const totalCollected = visit.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
  const isPaid = totalCollected >= visit.totalAmount;
  

  return (
    <div className="flex flex-row gap-2">
         <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-(--bg-secondary) transition cursor-pointer"
          title="View"
          onClick={() => setViewVisitOpen(true)}
        >
          👁️
        </button>
        <button
          className="h-8 w-8 rounded-md border border-border bg-(--bg-primary) hover:bg-blue-100 transition cursor-pointer"
          title="Edit Visit"
          onClick={() => setEditVisitOpen(true)}
        >
          ✏️
        </button>
        {isPaid === false && (
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
        {
          editVisitOpen && (
            <AddVisitModal
              key={visit.id}
              open={editVisitOpen}
              visit={visit}
              onClose={() => setEditVisitOpen(false)}
              onSuccess={() => {
                toast.success("Visit updated successfully");
                setEditVisitOpen(false);
                router.refresh();
              }}
            />
          )
        }
    </div>
  )
}

export default VisitActions
