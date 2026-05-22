import { patientAPI } from "@/utils/api"
export default async function TestingPage(){
    const patients = await patientAPI.get("/all")
    console.log(patients)
    return (
        <div>
            <h1>Testing Page</h1>
               
        </div>
    )   
}