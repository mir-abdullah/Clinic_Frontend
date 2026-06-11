import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReportButton } from "@/components/visits/ReportButton";
import { VisitTable } from "@/components/visits/VisitTable";
import { API, visitAPI } from "@/utils/api";

export default async function VisitsPage() {

      const monthlyStats = await visitAPI.get("/MonthlyStats")
      const visitsList = await visitAPI.get("/all")

      const monthlyRevenue = monthlyStats?.data?.totalRevenue || 0; 
      const collectedRevenue = monthlyStats?.data?.revenueCollected || 0;
      const pendingRevenue = monthlyStats?.data?.dueAmount || 0;
      const visitCount = monthlyStats?.data?.totalVisits || 0;
  
   
  return (
    <>
      <div className="flex  gap-4 flex-start">
        <div className="text-3xl font-semibold text-(--text-primary) mb-1 ">
          <h1>Visits</h1>
          <p className="text-[16px] text-(--text-secondary)">
            Manage your visits and keep track of patient interactions.
          </p>
        </div>
        <ReportButton />
      </div>
      <div className="mt-10 flex  lg:grid-cols-4 gap-6 justify-between">
        <StatsCard title="Total Revenue(Month)" value={`Rs.${monthlyRevenue}`} icon="💰" description="Revenue generated this month"/>
        <StatsCard title="Collected Revenue" value={`Rs.${collectedRevenue}`} icon="💵" description={`${(collectedRevenue / monthlyRevenue * 100).toFixed(2) || 0}% of monthly revenue`}/>
        <StatsCard title="Pending Revenue" value={`Rs.${pendingRevenue}`} icon="⏳" description={`${(pendingRevenue / monthlyRevenue * 100).toFixed(2) || 0}% of monthly revenue`}/>
        <StatsCard title="Total Visits" value={visitCount} icon="👥" description="Total number of visits this month"/>

      </div>
      <div className="mt-10">
        <VisitTable visitsList={visitsList.data} />
      </div>

    </>
  );
}
