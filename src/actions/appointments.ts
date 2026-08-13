"use server";
import { addAppointmentDTO, addAppointmentActionState } from "@/utils/type";
import { appointmentAPI, getApiErrorMessage } from "@/utils/api";
import { revalidatePath } from "next/cache";
import { AppointmentActionState, AppointmentStatus } from "@/utils/type";

export async function addAppointment(
  prevState: addAppointmentActionState,
  formData: FormData,
) {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const gender = (formData.get("gender") as string | null)?.trim() ?? "";
  const age = Number.parseInt((formData.get("age") as string | null) ?? "", 10);
  const patientId = (formData.get("patientId") as string | null) ?? "";
  const status = (formData.get("status") as "SCHEDULED" | "COMPLETED" | "CANCELED") || "SCHEDULED";
  const doctorName = (formData.get("doctorName") as string | null)?.trim() ?? "";
  const date = (formData.get("date") as string | null) ?? "";
  const time = (formData.get("time") as string | null) ?? "";
  const reason = (formData.get("reason") as string | null)?.trim() ?? "";
  const notes = (formData.get("notes") as string | null)?.trim() ?? "";

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
    notes,
  };

  try {
    await appointmentAPI.post("/add", appointmentData);
    revalidatePath("/appointments");
    return {
      status: "success" as const,
      message: "Appointment booked successfully",
    };
  } catch (error: unknown) {
    return {
      status: "error" as const,
      message: getApiErrorMessage(error, "Failed to book appointment"),
    };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<AppointmentActionState> {
  try {
    await appointmentAPI.patch(`/${appointmentId}/status`, { status });
    revalidatePath("/appointments");
    return { status: "success", message: "Status updated." };
  } catch (error: unknown) {
    return { status: "error", message: getApiErrorMessage(error, "Failed to update status.") };
  }
}

export async function sendAppointmentReminder(
  appointmentId: string,
): Promise<AppointmentActionState> {
  try {
    await appointmentAPI.patch(`/${appointmentId}/remind`);
    revalidatePath("/appointments");
    return { status: "success", message: "Reminder sent successfully." };
  } catch (error: unknown) {
    return { status: "error", message: getApiErrorMessage(error, "Failed to send reminder.") };
  }
}

export async function cancelAppointment(
  appointmentId: string,
): Promise<AppointmentActionState> {
  try {
    await appointmentAPI.patch(`/${appointmentId}/status`);
    revalidatePath("/appointments");
    return { status: "success", message: "Appointment cancelled." };
  } catch (error: unknown) {
    return { status: "error", message: getApiErrorMessage(error, "Failed to cancel appointment.") };
  }
}

export async function editAppointment(
  appointmentId: string,
  prevState: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const date = (formData.get("date") as string | null) ?? "";
  const time = (formData.get("time") as string | null) ?? "";
  const reason = (formData.get("reason") as string | null)?.trim() ?? "";
  const notes = (formData.get("notes") as string | null)?.trim() ?? "";
  const doctorName = (formData.get("doctorName") as string | null)?.trim() ?? "";

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
  } catch (error: unknown) {
    return { status: "error", message: getApiErrorMessage(error, "Failed to update appointment.") };
  }
}

export async function deleteAppointment(
  appointmentId: string,
): Promise<AppointmentActionState> {
  try {
    const { data } = await appointmentAPI.delete(`/${appointmentId}`);
    revalidatePath("/appointments");
    return { status: "success", message: data.message ?? "Appointment deleted." };
  } catch (error: unknown) {
    return { status: "error", message: getApiErrorMessage(error, "Failed to delete appointment.") };
  }
}

