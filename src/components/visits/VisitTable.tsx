import { Visit } from "@/utils/type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";

export const VisitTable = ({ visitsList }: { visitsList: Visit[] }) => {
  return (
    <Card className=" rounded-xl shadow-sm bg-(--bg-primary)">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent bg-(--bg-secondary)">
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                #
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Name
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Visit Date
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Visit Time
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Service Rendered
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Total Bill
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Credit Amount
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Balance Amount
              </TableHead>
              <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitsList.map((visit, index) => {
              return (
                <TableRow
                  key={visit.id}
                  className="border-border/80 hover:bg-(--bg-secondary) transition-colors "
                >
                  <TableCell className="text-(--text-primary) font-medium py-2">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-(--text-primary) font-semibold py-2">
                    {visit.patient?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-(--text-primary) py-2">
                    {visit?.date || "N/A"}
                  </TableCell>
                  <TableCell className="text-(--text-primary) py-2">
                    {visit.time || "N/A"}
                  </TableCell>
                  <TableCell className="text-(--text-primary) py-2">
                    {visit.reason || "N/A"}
                  </TableCell>

                  <TableCell className="text-(--text-primary) py-2">
                    {visit.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-(--text-primary) py-2">
                    {visit.paidAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-(--text-primary) py-2">
                    {visit.dueAmount.toFixed(2)}
                  </TableCell>
                    <TableCell className={`py-2 font-medium ${visit.dueAmount > 0 ? "text-red-500" : "text-green-500"}`}>
                    {visit.dueAmount > 0 ? "Pending" : "Paid"}
                  </TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
