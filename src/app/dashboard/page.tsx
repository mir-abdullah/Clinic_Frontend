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

    const [appointmentsToday, numberOfpatientsMonth, monthlyRevenue, last5Visits, todayCount] = await Promise.all([
        appointmentAPI.get("/today"),
        patientAPI.get("/total/count/month"),
        visitAPI.get("/monthly/revenue"),
        visitAPI.get("/recent/5"),
        visitAPI.get("/today/count"),

    ]);

   
 
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
                <StatsCard title="Today's Appointments" value={appointmentsToday?.data?.total || 0} icon="📅" description="Number of appointments today"/>
                <StatsCard title="Number Of Visits Today" value={todayCount?.data?.count || 0} icon="📊" description="Total visits today"/>
                <StatsCard title="Patients This Month" value={numberOfpatientsMonth?.data?.totalPatientsThisMonth} icon="👥" description="Number of patients this month"/>
                <StatsCard title="Monthly Revenue" value={`Rs.${monthlyRevenue?.data?.totalRevenue /1000 || 0}K`} icon="💰" description="Revenue generated this month"/>

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