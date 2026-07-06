"use server"
import {addPaymentDTO,actionState} from "@/utils/type";
import { paymentAPI } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function addPayment(
    visitId: string,
  prevState: actionState,
  formData: FormData,
) {
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("paymentMethod") as string;
    const notes = formData.get("notes") as string;

    if (Number.isNaN(amount) || !method || !visitId) {
        return {
            status: "error" as const,
            message: "Please fill in all required fields before saving.",
        };
    }
    
    const paymentData: addPaymentDTO = {
        amount,
        method: method as "CASH" | "CARD" | "ONLINE",
        visitId,
        notes
    }
    await paymentAPI.post("/add", paymentData)
    revalidatePath("/visits")
    return {
        status: "success" as const,
        message: "Payment added successfully",
    };
}

export async function editPayment(
    paymentId: string,
    prevState: actionState,
    formData: FormData,
) {
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("paymentMethod") as string;
    const notes = formData.get("notes") as string;
    const visitId = formData.get("visitId") as string;

    if (Number.isNaN(amount) || !method || !visitId) {
        return {
            status: "error" as const,
            message: "Please fill in all required fields before saving.",
        };
    }

    const paymentData: addPaymentDTO = {
        amount,
        method: method as "CASH" | "CARD" | "ONLINE",
        visitId,
        notes,
    };

    await paymentAPI.put(`/${paymentId}`, paymentData);
    
    revalidatePath("/visits");
    return {
        status: "success" as const,
        message: "Payment updated successfully",
    };
}




