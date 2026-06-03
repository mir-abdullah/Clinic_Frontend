import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Visit } from "@/utils/type";
import Link from "next/link";
import { formatDateWithOrdinal } from "@/utils/helpers";


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
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Paid Amount</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Due Amount</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Payment Status</TableHead>

                            
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visits.map((visit, index) => (
                            <TableRow key={index} className="border-border hover:bg-(--bg-secondary) transition-colors">
                                <TableCell className="text-(--text-primary) font-medium">{visit.patient?.name ?? "N/A"}</TableCell>
                                <TableCell className="text-(--text-secondary)">{visit.patient?.phone ?? "N/A"}</TableCell>
                                <TableCell className="text-(--text-secondary)">{formatDateWithOrdinal(visit.date)}</TableCell>
                                <TableCell className="text-(--text-secondary)">{visit.time }</TableCell>
                                <TableCell className="text-(--text-secondary)">{visit.reason}</TableCell>
                                <TableCell className="text-(--text-secondary)">Rs.{visit.totalAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-(--text-secondary)">Rs.{visit.paidAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-(--text-secondary)">Rs.{visit.dueAmount.toFixed(2)}</TableCell>
                                
                                <TableCell className="text-(--text-secondary)">
                                    {visit.paymentStatus === "PAID" ? (
                                        <span className="text-green-600 font-medium">Paid</span>
                                    ) : visit.paymentStatus === "PARTIAL" ? (
                                        <span className="text-yellow-600 font-medium">Partial</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Pending</span>
                                    )}
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