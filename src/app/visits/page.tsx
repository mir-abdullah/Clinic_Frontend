

import { StatsCard } from "@/components/dashboard/StatsCard"
import { ScheduleSection } from "@/components/dashboard/ScheduleSection"
import { Action, Appointment, Visit } from "@/utils/data"
import { quickActions } from "@/utils/data";
import { QuickActionsClient } from "./quickActions";
import { RecentVisits } from "@/components/dashboard/RecentVisits";
import { WeeklyPatientCount } from "@/components/dashboard/WeeklyPaitentCount";
export default function VisitsPage() {
    // const appointments = [
    //     {
    //       id: "1",
    //       appointmentDate: new Date("2024-06-20"),
    //       appointmentTime: "10:00 AM",
    //       purpose: "Routine Checkup",
    //       notes: "Patient has been experiencing mild tooth sensitivity.",
    //       createdAt: new Date("2024-06-15"),
    //       patient: {
    //         id: "p1",
    //         name: "John Doe",
    //         email: "",
    //         phone: ""
    //         }
    //     },
    //     {
    //       id: "2",
    //       appointmentDate: new Date("2024-06-21"),
    //       appointmentTime: "2:00 PM",
    //       purpose: "Cavity Filling",
    //       notes: "Patient has a cavity in the upper left molar.",
    //       createdAt: new Date("2024-06-16"),
    //       patient: {
    //         id: "p2",
    //         name: "Jane Smith",
    //         email: "",
    //         phone: ""
    //         }
    //     },
    // ]
    const appointments: Appointment[] = [];

    const actions :Action[] = [
        {
            title: "Add New Visit",
            description: "Schedule a new patient visit and manage appointments.",
            icon: "➕",
            link: "/visits"
        },
        {
            title: "View Visit History",
            description: "Access detailed records of past patient visits and treatments.",
            icon: "📜",
            link: "/visits/history"
        }
    ];
    const visits: Visit[] = [
        {
            visitDate: new Date("2024-06-20"),
            visitTime: "10:00 AM",
            serviceRendered: "Routine Checkup",
            totalBill: 100,
            creditAmount: 20,
            balanceAmount: 80,
            patient: {
                id: "p1",
                name: "John Doe",
                email: "",
                phone: ""
            }
        },
        {
            visitDate: new Date("2024-06-21"),
            visitTime: "2:00 PM",
            serviceRendered: "Cavity Filling",
            totalBill: 200,
            creditAmount: 50,
            balanceAmount: 150,
            patient: {
                id: "p2",
                name: "Jane Smith",
                email: "",
                phone: ""
            }
        }
    ];

    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-(--text-primary) mb-4">
          Visits
        </h1>
        <p className="text-(--text-secondary)">
          This is the Visits page. Here you can manage all your patient visits,
          schedule appointments, and keep track of visit history.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Todays Appointments"
            value="5"
            icon="📅"
            description="Number of visits this month"
          />
        </div>
        <div className="mt-8">
          <ScheduleSection appointments={appointments} />
        </div>
        <div className="mt-8">
                    <QuickActionsClient actions={quickActions} />   
                    
        </div>
        <div className="mt-8">
                    <RecentVisits visits={visits} />
        </div>
        <div className="mt-8">
                    <WeeklyPatientCount />
        </div>


      </div>
    );
  }