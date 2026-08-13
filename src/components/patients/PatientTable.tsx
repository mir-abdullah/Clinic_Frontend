import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateWithOrdinal } from "@/utils/helpers";
import { Card, CardContent } from "@/components/ui/card";
import { TableButtons } from "./TableButtons";
import { Patient } from "@/utils/type";

export const PatientTable = ({
  patientsList = [],
}: {
  patientsList?: Patient[];
}) => {
  const safePatientsList = Array.isArray(patientsList) ? patientsList : [];

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 hover:bg-gray-100 border-none">
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                #
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Address
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Visits
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Last Visit
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Upcoming Appointment
              </TableHead>
              <TableHead className="font-semibold text-gray-500 uppercase text-xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {safePatientsList.map((patient, index) => {
              const lastVisit = patient?.visits?.[0]?.date;
              const upcomingVisit = patient?.appointments?.[0]?.date;

              return (
                <TableRow
                  key={patient.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4 font-medium text-gray-500">
                    {index + 1}
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="font-semibold text-gray-900">{patient.name}</div>
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    {patient.phone || "N/A"}
                  </TableCell>

                  <TableCell className="py-4 text-gray-700 max-w-[220px] truncate">
                    {patient.address || "N/A"}
                  </TableCell>

                  <TableCell className="py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                      {patient?._count?.visits || 0}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-gray-700">
                    {lastVisit ? formatDateWithOrdinal(lastVisit) : "N/A"}
                  </TableCell>

                  <TableCell className="py-4">
                    {upcomingVisit ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                        {formatDateWithOrdinal(upcomingVisit)}
                      </span>
                    ) : (
                      <span className="text-gray-400">No Appointment</span>
                    )}
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <TableButtons patient={patient} />
                    </div>
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