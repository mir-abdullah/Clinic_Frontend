"use server";
import { addAppointmentDTO ,addAppointmentActionState} from "@/utils/type";
import { appointmentAPI } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function addAppointment(
  prevState: addAppointmentActionState,
  formData: FormData,
) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const gender = formData.get("gender") as string;
    const age = parseInt(formData.get("age") as string);
    const patientId = formData.get("patientId") as string;
    const status = formData.get("status") as "SCHEDULED" | "COMPLETED" | "CANCELED";
    const doctorName = formData.get("doctorName") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const reason = formData.get("reason") as string;
    const notes = formData.get("notes") as string;

    const appointmentData: addAppointmentDTO = {
        name,
        phone,
        address,
        gender,
        age,
        patientId,
        status,
        doctorName,
        date,
        time,
        reason,
        notes
    }
    await appointmentAPI.post("/add", appointmentData)

    revalidatePath("/appointments");
    return {
        status: "success" as const,
        message: "Appointment added successfully",

    };
}