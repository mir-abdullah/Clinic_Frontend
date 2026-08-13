"use server";
import { AddPatientActionState } from "@/utils/type";
import { getApiErrorMessage, patientAPI } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function addPatient(
  prevState: AddPatientActionState,
  formData: FormData,
) {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const age = Number.parseInt((formData.get("age") as string | null) ?? "", 10);
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const gender = (formData.get("gender") as string | null)?.trim() ?? "";
  const guardian = (formData.get("guardian") as string | null)?.trim() ?? "";
  const occupation = (formData.get("occupation") as string | null)?.trim() ?? "";
  const medicalHistory = (formData.get("medicalHistory") as string | null)?.trim() ?? "";

  if (!name || !phone || !address || !gender || Number.isNaN(age)) {
    return {
      status: "error" as const,
      message: "Please fill in all required fields before saving.",
    };
  }

  try {
    await patientAPI.post("/add", {
      name,
      age,
      phone,
      address,
      gender,
      guardian,
      occupation,
      medicalHistory,
    });

    revalidatePath("/patients");
    return {
      status: "success" as const,
      message: "Patient added successfully",
    };
  } catch (error: unknown) {
    return {
      status: "error" as const,
      message: getApiErrorMessage(error, "Failed to add patient"),
    };
  }
}

export const deletePatient = async (patientId: string) => {
  try {
    const { data } = await patientAPI.patch(`/${patientId}`);

    revalidatePath("/patients");

    return {
      status: "success" as const,
      message: typeof data?.message === "string" ? data.message : "Patient deleted successfully",
    };
  } catch (error: unknown) {
    return {
      status: "error" as const,
      message: getApiErrorMessage(error, "Failed to delete patient"),
    };
  }
};

export const editPatient = async (patientId: string, prevState: AddPatientActionState, formData: FormData) => {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const age = Number.parseInt((formData.get("age") as string | null) ?? "", 10);
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const address = (formData.get("address") as string | null)?.trim() ?? "";
  const gender = (formData.get("gender") as string | null)?.trim() ?? "";
  const guardian = (formData.get("guardian") as string | null)?.trim() ?? "";
  const occupation = (formData.get("occupation") as string | null)?.trim() ?? "";
  const medicalHistory = (formData.get("medicalHistory") as string | null)?.trim() ?? "";

  if (!name || !phone || !address || !gender || Number.isNaN(age)) {
    return {
      status: "error" as const,
      message: "Please fill in all required fields before saving.",
    };
  }

  try {
    const { data } = await patientAPI.put(`/${patientId}`, {
      name,
      age,
      phone,
      address,
      gender,
      guardian,
      occupation,
      medicalHistory,
    });

    revalidatePath("/patients");

    return {
      status: "success" as const,
      message: typeof data?.message === "string" ? data.message : "Patient updated successfully",
    };
  } catch (error: unknown) {
    return {
      status: "error" as const,
      message: getApiErrorMessage(error, "Failed to edit patient"),
    };
  }
};

