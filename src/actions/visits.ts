"use server";
import { addVisitDTO,actionState } from "@/utils/type";
import { visitAPI } from "@/utils/api";
import { revalidatePath } from "next/cache";    

export const addVisit = async (
    patientId: string,
    prevState: actionState,
    formData: FormData,
)=>{
    const doctorName = formData.get("doctorName") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const reason = formData.get("reason") as string;
    const diagnosis = formData.get("diagnosis") as string;
    const prescription = formData.get("prescription") as string;
    const notes = formData.get("notes") as string;
    const totalAmount = parseFloat(formData.get("totalAmount") as string);
    const paidAmount = parseFloat(formData.get("paidAmount") as string);
    const dueAmount = Math.max(totalAmount - paidAmount, 0); 
    const paymentStatus: "PAID" | "PENDING" | "PARTIAL" =
    paidAmount == 0 ? "PENDING" : paidAmount == totalAmount  ? "PAID" : "PARTIAL";

    const visitData: addVisitDTO = {
        patientId,
        doctorName,
        date,
        time,
        reason,
        diagnosis,
        prescription,
        notes,
        totalAmount,
        paidAmount,
        dueAmount,
        paymentStatus
    }   
    await visitAPI.post("/add", visitData)

    revalidatePath("/visits");
    return {
        status: "success" as const,
        message: "Visit added successfully",

    };
}