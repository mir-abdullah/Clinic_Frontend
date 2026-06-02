import { Buttons } from "@/components/dashboard/Buttons";
import { RecentVisits } from "@/components/dashboard/RecentVisits";
import { API } from "@/utils/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ScheduleSection } from "@/components/dashboard/ScheduleSection";
import { quickActions } from "@/utils/data";
import { QuickActionsClient } from "./quickActions";
import { patientAPI } from "@/utils/api";
import { appointmentAPI } from "@/utils/api";
import { visitAPI } from "@/utils/api";

export default async function DashboardPage() {

    //api calls
    const appointmentsToday = await appointmentAPI.get("/today")
    const numberOfpatientsMonth = await patientAPI.get("/total/count/month")
    const monthlyRevenue = await visitAPI.get("/monthly/revenue")
    const last5Visits = await visitAPI.get("/recent/5")

    


 
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
    return (
      <>
        <div className="flex  gap-4 flex-start">
          <div className="text-3xl font-semibold text-(--text-primary) mb-1 ">
            <h1>Dashboard</h1>
            <p className="text-lg text-(--text-secondary)">
              Welcome back, Dr. Maryam • {formattedDate}
            </p>
          </div>
          <Buttons />
        </div>
        <div className="flex flex-col gap-3">
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatsCard title="Today's Appointments" value={appointmentsToday?.data?.total || 0} icon="📅" description="Number of visits today"/>
                <StatsCard title="Patients This Month" value={numberOfpatientsMonth?.data?.totalPatientsThisMonth} icon="👥" description="Number of patients this month"/>
                <StatsCard title="Monthly Revenue" value={`Rs.${monthlyRevenue?.data?.totalRevenue /1000 || 0}K`} icon="💰" description="Revenue generated this month"/>
                <StatsCard title="Pending Payments" value={`Rs.${monthlyRevenue?.data?.pendingRevenue /1000 || 0}K`} icon="⏳" description="Total pending payments"/>

            </div>
            <div className=" flex gap-3 ">
                <ScheduleSection  appointments={appointmentsToday?.data?.appointments} />
                <QuickActionsClient actions={quickActions} />
            </div>
            <div className="lg:mr-3 ">
                <RecentVisits visits={last5Visits?.data || []} />
                {/* <WeeklyPatientCount /> */}
            </div>
        </div>
      </>
    );
}