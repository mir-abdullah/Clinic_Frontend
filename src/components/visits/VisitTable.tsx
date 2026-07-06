import { Visit } from "@/utils/type";
import { formatDateWithOrdinal } from "@/utils/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";
import VisitActions from "./VisitActions";

export const VisitTable = ({ visitsList }: { visitsList: Visit[] }) => {

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <CardContent className="p-6">
        
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-none">
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Patient
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
                Billed Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Collected
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Balance
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Payment Status
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visitsList.map((visit, index) => {
              const totalCollected = visit.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
              const dueAmount = visit.totalAmount - totalCollected;
              const paymentStatus = dueAmount === 0 ? "PAID" : (totalCollected > 0 ? "PARTIAL" : "PENDING");

              return (
                <TableRow
                  key={visit.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <TableCell className="py-5 font-medium text-gray-700">
                  {index + 1}
                </TableCell>

                <TableCell className="py-5 font-semibold text-gray-900">
                  {visit.patient?.name || "N/A"}
                </TableCell>

                <TableCell className="py-5 text-gray-700">
                  {formatDateWithOrdinal(visit.date)}
                </TableCell>

                <TableCell className="py-5 text-gray-700">
                  {visit.time || "N/A"}
                </TableCell>

                <TableCell className="py-5 text-gray-700">
                  {visit.reason || "N/A"}
                </TableCell>

                <TableCell className="py-5 font-medium text-gray-900">
                  Rs{visit.totalAmount.toLocaleString()}
                </TableCell>

                <TableCell className="py-5 text-gray-700">
                  Rs{totalCollected.toLocaleString()}
                </TableCell>

                <TableCell
                  className={`py-5 font-semibold ${
                    dueAmount > 0
                      ? "text-amber-500"
                      : "text-green-500"
                  }`}
                >
                  Rs{dueAmount.toLocaleString()}
                </TableCell>

                <TableCell className="py-5">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      paymentStatus === "PAID"
                        ? "bg-green-100 text-green-600"
                        : paymentStatus === "PARTIAL"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </TableCell>

                <TableCell className="py-5">
                  <div className="flex items-center gap-2">
                    <VisitActions visit={visit} />
                  </div>
                </TableCell>
              </TableRow>

            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};