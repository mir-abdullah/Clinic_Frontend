import { Buttons } from "@/components/dashboard/Buttons";
import { RecentVisits } from "@/components/dashboard/RecentVisits";
import { API } from "@/utils/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ScheduleSection } from "@/components/dashboard/ScheduleSection";
import { quickActions } from "@/utils/data";
import { QuickActionsClient } from "./quickActions";

export default async function DashboardPage() {

    //api calls
    const numberOfAppointmentsToday = await API.get("/appointment/today/count")
    const numberOfpatientsMonth = await API.get("/patient/total-count")
    const monthlyRevenue = await API.get("/visit/revenue/monthly")
    const totalPendingPayments = await API.get("/visit/pending/payments/total")
    const appointmentsForToday = await API.get("/appointment/today")
    const last5Visits = await API.get("/visit/last-5")


 
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
                <StatsCard title="Today's Appointments" value={numberOfAppointmentsToday.data} icon="📅" description="Number of visits today"/>
                <StatsCard title="Patients This Month" value={numberOfpatientsMonth.data} icon="👥" description="Number of patients this month"/>
                <StatsCard title="Monthly Revenue" value={`Rs.${monthlyRevenue.data}`} icon="💰" description="Revenue generated this month"/>
                <StatsCard title="Pending Payments" value={`Rs.${totalPendingPayments.data}`} icon="⏳" description="Total pending payments"/>

            </div>
            <div className=" flex gap-3 ">
                <ScheduleSection  appointments={appointmentsForToday.data } />
                <QuickActionsClient actions={quickActions} />
            </div>
            <div className="lg:mr-3 ">
                <RecentVisits visits={last5Visits.data} />
                {/* <WeeklyPatientCount /> */}
            </div>
        </div>
      </>
    );
}