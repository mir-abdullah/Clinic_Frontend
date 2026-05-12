import { PatientButtons } from "@/components/patients/PatientButtons"
import { PatientTable } from "@/components/patients/PatientTable"
import { API } from "@/utils/api"
import { Patient } from "@/utils/data"
export default async function PatientsPage() {
    
    const patients =await API.get("/patient/all")
    console.log("patient",patients.data.patients)
    return (
        <div>
            <div className="flex  gap-4 flex-start">
                      <div className="text-3xl font-semibold text-(--text-primary) mb-1 ">
                        <h1>Patients</h1>
                        <p className="text-[16px] text-(--text-secondary)">
                            Manage your patients, view their details, and keep track of their dental history all in one place.
                        </p>
                      </div>
                      <PatientButtons />
                    </div>
            <div className="mt-6">
                <PatientTable patientsList={patients?.data?.patients} />
            </div>
        </div>
    )
}