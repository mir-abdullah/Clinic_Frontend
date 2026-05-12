import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Appointment, formatDateWithOrdinal } from "@/utils/data";
import Link from "next/link";


export const ScheduleSection = ({appointments}: {appointments: Appointment[]}) => {
  return (
    <Card className="lg:w-255">
        <CardContent>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-(--text-primary)">Today&apos;s Schedule</h2>
                <Link href="/appointments" className="text-sm text-blue-500 font-medium hover:underline">
                    View All
                </Link>
            </div>

            <hr className="border-border mb-4"/>
            {appointments.length === 0 ? (
                <div>
                    <div className="flex flex-col text-center px-12 py-6 text-(--text-secondary) gap-2 items-center">
                        <span className="text-5xl opacity-30 mb-3">📅</span>
                        <span className="text-lg">No appointments scheduled for today.</span>
                    </div>

                </div>
            ) : 
            (
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Name</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Phone</TableHead> 
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Appointment Date</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Time</TableHead>
                            <TableHead className="text-(--text-primary) font-semibold bg-(--bg-secondary)">Purpose</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id} className="border-border hover:bg-(--bg-secondary) transition-colors">
                                <TableCell className="text-(--text-primary) font-medium">{appointment.patient.name}</TableCell>
                                <TableCell className="text-(--text-secondary)">{appointment.patient.phone || "N/A"}</TableCell>
                                <TableCell className="text-(--text-secondary)">{formatDateWithOrdinal(appointment.appointmentDate)}</TableCell>
                                <TableCell className="text-(--text-secondary)">{appointment.appointmentTime}</TableCell>
                                <TableCell className="text-(--text-secondary)">{appointment.purpose}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                        
            )}
        </CardContent>
            
    </Card>
    

  );
}