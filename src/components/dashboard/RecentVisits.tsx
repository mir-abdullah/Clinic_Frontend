import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Visit } from "@/utils/type";
import Link from "next/link";
import { formatDateWithOrdinal } from "@/utils/helpers";

export const RecentVisits = ({ visits }: { visits: Visit[] }) => {
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Visits
          </h2>

          <Link
            href="/visits"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View All
          </Link>
        </div>

        {visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="mb-3 text-5xl opacity-30">🩺</span>
            <p className="text-gray-500">No Recent Visits</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 border-none">
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Patient
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Time
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Service
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Billed
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Collected
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Balance
                </TableHead>
                <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visits.map((visit) => {
                    const totalCollected = visit.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
              const dueAmount = visit.totalAmount - totalCollected;
              const paymentStatus = dueAmount === 0 ? "PAID" : (totalCollected > 0 ? "PARTIAL" : "PENDING");
              return (
                <TableRow
                  key={visit.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4 font-semibold text-gray-900">
                    {visit.patient?.name || "N/A"}
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    {visit.patient?.phone || "N/A"}
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    {formatDateWithOrdinal(visit.date)}
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    {visit.time}
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    {visit.reason}
                  </TableCell>

                  <TableCell className="py-4 font-medium text-gray-900">
                    Rs{visit.totalAmount.toLocaleString()}
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    Rs{totalCollected.toLocaleString()}
                  </TableCell>

                  <TableCell
                    className={`py-4 font-semibold ${
                      dueAmount > 0
                        ? "text-amber-500"
                        : "text-green-500"
                    }`}
                  >
                    Rs{dueAmount.toLocaleString()}
                  </TableCell>

                  <TableCell className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        paymentStatus === "PAID"
                          ? "bg-green-100 text-green-600"
                          : paymentStatus === "PARTIAL"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {paymentStatus || "N/A"}
                    </span>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};