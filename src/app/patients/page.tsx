import { PatientButtons } from "@/components/patients/PatientButtons"
import { PatientTable } from "@/components/patients/PatientTable"
import { patientAPI } from "@/utils/api"
import { VisitPagination } from "@/components/visits/VisitsPagination";
import { Suspense } from "react";

export default async function PatientsPage({searchParams}: {searchParams: Promise<{page?: string; search?: string}>}) {
    const { page, search } = await searchParams;
  const currentPage = Number(page) || 1;
    const params = new URLSearchParams();
    params.set("page", String(currentPage));
    params.set("limit", "10");
    if (search) params.set("search", search);
    
    const patients =await patientAPI.get(`/all?${params.toString()}`)
    const totalPages = patients?.data?.pagination?.totalPages || 1; 


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
            <div className="mt-10">
                <PatientTable patientsList={patients?.data?.patients} />
                {totalPages > 1 && (
                    <div className="mt-4">
                        <Suspense fallback={null}>
                            <VisitPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                            />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    )
}