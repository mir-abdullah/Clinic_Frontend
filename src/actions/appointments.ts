"use server";
import { addAppointmentDTO ,addAppointmentActionState} from "@/utils/type";
import { appointmentAPI } from "@/utils/api";
import { revalidatePath } from "next/cache";
import {  AppointmentActionState, AppointmentStatus } from "@/utils/type";


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
        message: "Appointment booked successfully",

    };
}




// ─── Helper: extract error message from axios error (same as your patient actions) ──
function getErrorMessage(err: unknown, fallback: string): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err
  ) {
    return (err as any).response?.data?.message || fallback;
  }
  return fallback;
}


// ─── Update Status ────────────────────────────────────────────────────────────
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<AppointmentActionState> {
  try {
    await appointmentAPI.patch(`/${appointmentId}/status`, { status });
    revalidatePath("/appointments");
    return { status: "success", message: "Status updated." };
  } catch (err) {
    return { status: "error", message: getErrorMessage(err, "Failed to update status.") };
  }
}

// ─── Send Reminder (stub — wire SMS/WhatsApp here later) ─────────────────────
export async function sendAppointmentReminder(
  appointmentId: string,
): Promise<AppointmentActionState> {
  try {
    // When your backend has a reminder endpoint, replace with:
    // await appointmentAPI.post(`/${appointmentId}/remind`);
    //
    // For now: just mark reminderSent = true via a patch
    await appointmentAPI.patch(`/${appointmentId}/remind`);

    revalidatePath("/appointments");
    return { status: "success", message: "Reminder sent successfully." };
  } catch (err) {
    return { status: "error", message: getErrorMessage(err, "Failed to send reminder.") };
  }
}

// ─── Cancel Appointment ───────────────────────────────────────────────────────
export async function cancelAppointment(
  appointmentId: string,
): Promise<AppointmentActionState> {
  try {
    await appointmentAPI.patch(`/${appointmentId}/status`);
    revalidatePath("/appointments");
    return { status: "success", message: "Appointment cancelled." };
  } catch (err) {
    return { status: "error", message: getErrorMessage(err, "Failed to cancel appointment.") };
  }
}

// ─── Edit Appointment ─────────────────────────────────────────────────────────
export async function editAppointment(
  appointmentId: string,
  prevState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const date       = formData.get("date") as string;
  const time       = formData.get("time") as string;
  const reason     = formData.get("reason") as string;
  const notes      = formData.get("notes") as string;
  const doctorName = formData.get("doctorName") as string;

  if (!date || !time) {
    return { status: "error", message: "Date and time are required." };
  }

  try {
    const { data } = await appointmentAPI.put(`/${appointmentId}`, {
      date,
      time,
      reason,
      notes,
      doctorName,
    });

    revalidatePath("/appointments");
    return { status: "success", message: data.message ?? "Appointment updated." };
  } catch (err) {
    return { status: "error", message: getErrorMessage(err, "Failed to update appointment.") };
  }
}

// ─── Delete Appointment ───────────────────────────────────────────────────────
export async function deleteAppointment(
  appointmentId: string,
): Promise<AppointmentActionState> {
  try {
    const { data } = await appointmentAPI.delete(`/${appointmentId}`);
    revalidatePath("/appointments");
    return { status: "success", message: data.message ?? "Appointment deleted." };
  } catch (err) {
    return { status: "error", message: getErrorMessage(err, "Failed to delete appointment.") };
  }
}



