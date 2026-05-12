import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Visit } from "@/utils/data";
import Link from "next/link";
import { formatDateWithOrdinal } from "@/utils/data";


export const RecentVisits = ({visits}:{visits:Visit[]}) => {

  return (
    <Card>
        <CardContent>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-(--text-primary)">Recent Visits</h2>
                <Link href="/visits" className="text-sm text-blue-500 font-medium hover:underline">
                    View All
                </Link>
            </div>

            <hr className="border-border mb-4"/>
            {visits.length === 0 ? (
                <div>
                    <div className="flex flex-col text-center px-12 py-6 text-(--text-secondary) gap-2 items-center">
                        <span className="text-5xl opacity-30 mb-3">🩺</span>
                        <span className="text-lg">No Recent Visits.</span>
                    </div>

                </div>
            ) : 
            (
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Name</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Phone</TableHead> 
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Visit Date</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Time</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Service Rendered</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Total Bill</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Credit Amount</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Balance Amount</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Payment Status</TableHead>

                            
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visits.map((visit, index) => (
                            <TableRow key={index} className="border-border hover:bg-(--bg-secondary) transition-colors">
                                <TableCell className="text-(--text-primary) font-medium">{visit.patient?.name ?? "N/A"}</TableCell>
                                <TableCell className="text-(--text-secondary)">{visit.patient?.phone ?? "N/A"}</TableCell>
                                <TableCell className="text-(--text-secondary)">{formatDateWithOrdinal(visit.visitDate)}</TableCell>
                                <TableCell className="text-(--text-secondary)">{visit.visitTime }</TableCell>
                                <TableCell className="text-(--text-secondary)">{visit.serviceRendered}</TableCell>
                                <TableCell className="text-(--text-secondary)">Rs.{visit.totalBill.toFixed(2)}</TableCell>
                                <TableCell className="text-(--text-secondary)">Rs.{visit.creditAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-(--text-secondary)">Rs.{visit.balanceAmount.toFixed(2)}</TableCell>
                                
                                <TableCell className={visit.balanceAmount === 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                                    {visit.balanceAmount === 0 ? "Paid" : "Pending"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                        
            )}
        </CardContent>
            
    </Card>
    

  );
}