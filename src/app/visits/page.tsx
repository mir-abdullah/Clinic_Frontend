import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReportButton } from "@/components/visits/ReportButton";
import { VisitTable } from "@/components/visits/VisitTable";
import { API } from "@/utils/api";

export default async function VisitsPage() {

      const monthlyStats = await API.get("/visit/revenue/monthly")
      const visitsList = await API.get("/visit/all")

      const monthlyRevenue = monthlyStats?.data?.total || 0;
      const collectedRevenue = monthlyStats?.data?.collected || 0;
      const pendingRevenue = monthlyStats?.data?.pending || 0;
      const visitCount = monthlyStats?.data?.visitCount || 0;
  
   
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
        <StatsCard title="Collected Revenue" value={`Rs.${collectedRevenue}`} icon="💵" description={`${collectedRevenue / monthlyRevenue * 100 || 0}% of monthly revenue`}/>
        <StatsCard title="Pending Revenue" value={`Rs.${pendingRevenue}`} icon="⏳" description={`${pendingRevenue / monthlyRevenue * 100 || 0}% of monthly revenue`}/>
        <StatsCard title="Total Visits" value={visitCount} icon="👥" description="Total number of visits this month"/>

      </div>
      <div className="mt-10">
        <VisitTable visitsList={visitsList.data} />
      </div>

    </>
  );
}
