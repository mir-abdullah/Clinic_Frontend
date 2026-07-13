import { StatsCard } from "@/components/dashboard/StatsCard";
import { ReportButton } from "@/components/visits/ReportButton";
import { VisitTable } from "@/components/visits/VisitTable";
import { visitAPI } from "@/utils/api";
import { VisitPagination } from "@/components/visits/VisitsPagination";
import { VisitFilters } from "@/components/visits/VisitFilters";
import { Suspense } from "react";

export const metadata = {
  title: "Visits | Mehreen Dental Clinic",
};

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; dateFilter?: string }>;
}) {
  const { page, search, dateFilter } = await searchParams;
  const currentPage = Number(page) || 1;

  const params = new URLSearchParams();
  params.set("page", String(currentPage));
  params.set("limit", "10");
  if (search) params.set("search", search);
  if (dateFilter) params.set("dateFilter", dateFilter);

  const [monthlyStats, visitsResponse] = await Promise.all([
    visitAPI.get("/MonthlyStats"),
    visitAPI.get(`/all?${params.toString()}`),
  ]);

  const visitsList = visitsResponse?.data?.visits || [];
  const pagination = visitsResponse?.data?.pagination;

  const monthlyRevenue = monthlyStats?.data?.totalRevenue || 0;
  const collectedRevenue = monthlyStats?.data?.revenueCollected || 0;
  const pendingRevenue = monthlyStats?.data?.dueAmount || 0;
  const visitCount = monthlyStats?.data?.totalVisits || 0;

  return (
    <>
      <div className="flex gap-4 flex-start">
        <div className="text-3xl font-semibold text-(--text-primary) mb-1">
          <h1>Visits</h1>
          <p className="text-[16px] text-(--text-secondary)">
            Manage your visits and keep track of patient interactions.
          </p>
        </div>
        {/* <ReportButton /> */}
      </div>

      <div className="mt-10 flex lg:grid-cols-4 gap-6 justify-between">
        <StatsCard title="Total Revenue(Month)" value={`Rs.${monthlyRevenue/1000}K`} icon="💰" description="Revenue generated this month" />
        <StatsCard title="Collected Revenue" value={`Rs.${collectedRevenue/1000}K`} icon="💵" description={`${((collectedRevenue / monthlyRevenue) * 100).toFixed(2) || 0}% of monthly revenue`} />
        <StatsCard title="Pending Revenue" value={`Rs.${pendingRevenue/1000}K`} icon="⏳" description={`${((pendingRevenue / monthlyRevenue) * 100).toFixed(2) || 0}% of monthly revenue`} />
        <StatsCard title="Total Visits" value={visitCount} icon="👥" description="Total number of visits this month" />
      </div>

      <div className="mt-10">
        <Suspense fallback={null}>
          <VisitFilters />
      
        </Suspense>
        <VisitTable visitsList={visitsList} />
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4">
            <Suspense fallback={null}>
              <VisitPagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
              />
            </Suspense>
          </div>
        )}
      
      </div>
    </>
  );
}