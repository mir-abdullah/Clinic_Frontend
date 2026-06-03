import { Patient } from "@/utils/type";
export async function addPatient(prevData:Patient ,formData:FormData){
    const name = formData.get("fullName") as string;
    const age = formData.get("age") as string;
    const guardianName = formData.get("guardianName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const address = formData.get("address") as string;
    const occupation = formData.get("occupation") as string;
    const medicalHistory = formData.get("notes") as string;
    
    const newPatient: Patient = {
        name,
        age: parseInt(age),
        guardian: guardianName,
        phone: phoneNumber,
        address,
        occupation,
        medicalHistory,
        
    };
    
    

}