"use server";
import { AddPatientActionState } from "@/utils/type";
import { patientAPI } from "@/utils/api";
import { revalidatePath } from "next/cache";


export async function addPatient(
  prevState: AddPatientActionState,
  formData: FormData,
) {
    const name = formData.get("name") as string;
    const age = parseInt(formData.get("age") as string);
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const gender = formData.get("gender") as string;
    const guardian = formData.get("guardian") as string;
    const occupation = formData.get("occupation") as string;
    const medicalHistory = formData.get("medicalHistory") as string;

    if (!name || !phone || !address || !gender || Number.isNaN(age)) {
        return {
            status: "error" as const,
            message: "Please fill in all required fields before saving.",
        };
    }

    await patientAPI.post("/add", {
        name,
        age,
        phone,
        address,
        gender,
        guardian,
        occupation,
        medicalHistory
    })

    revalidatePath("/patients");
    return {
        status: "success" as const,
        message: "Patient added successfully",
    };
}


export const deletePatient = async (patientId: string) => {
    try {
        await patientAPI.delete(`/${patientId}`);
        revalidatePath("/patients");
        return {
            status: "success" as const,
            message: "Patient deleted successfully",
        };
    } catch (err: unknown) {
        const message =
            typeof err === "object" && err !== null && "response" in err
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (err as any).response?.data?.message
                : null;
        return {
            status: "error" as const,
            message: message || "Failed to delete patient",
        };
    }
}


