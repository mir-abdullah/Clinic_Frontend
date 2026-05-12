import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { formatDateWithOrdinal, Patient as PatientType } from "@/utils/data"
import { getUpcomingAppointment } from "@/utils/helpers"
import { Card, CardContent } from "@/components/ui/card"
import { TableButtons } from "./TableButtons"

export const PatientTable = ({ patientsList }: { patientsList: PatientType[] }) => {
    return (
        <Card className=" rounded-xl shadow-sm bg-(--bg-primary)">
            <CardContent className="p-6">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent bg-(--bg-secondary)">
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">#</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">Name</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">Phone</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">Address</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">No Of Visits</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">Last Visit</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">Upcoming Appointment</TableHead>
                            <TableHead className="text-(--text-secondary) font-semibold uppercase tracking-wide text-xs">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patientsList.map((patient, index) => {
                            const numberOfVisits = patient.visits ? patient.visits.length : 0;
                            const lastVisit = patient.visits && patient.visits.length > 0
                                ? patient.visits.reduce((latest, visit) => {
                                        const visitDate = new Date(visit.visitDate);
                                        return visitDate > new Date(latest.visitDate) ? visit : latest;
                                    })
                                : null;

                            const upcomingVisit = patient.appointments && patient.appointments.length > 0 ? getUpcomingAppointment(patient.appointments) : null;

                            return (
                                <TableRow key={patient.id} className="border-border/80 hover:bg-(--bg-secondary) transition-colors ">
                                    <TableCell className="text-(--text-primary) font-medium py-2">{index + 1}</TableCell>
                                    <TableCell className="text-(--text-primary) font-semibold py-2">{patient.name}</TableCell>
                                    <TableCell className="text-(--text-primary) py-2">{patient?.phoneNumber || "N/A"}</TableCell>
                                    <TableCell className="text-(--text-primary) py-2">{patient.address}</TableCell>
                                    <TableCell className="text-(--text-primary) py-2">{numberOfVisits}</TableCell>
                                    <TableCell className="text-(--text-primary) py-2">{lastVisit ? formatDateWithOrdinal(lastVisit.visitDate) : "N/A"}</TableCell>
                                    <TableCell className="text-(--text-primary) py-2">{upcomingVisit ? formatDateWithOrdinal(upcomingVisit.appointmentDate) : "N/A"}</TableCell>
                                    <TableCell className="py-2">
                                        <TableButtons />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
          