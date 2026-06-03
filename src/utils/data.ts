import { Action } from "./type";

export const sidebarItems = [
  {
    value: "Dashboard",
    icon: "📊",
    route: "/dashboard"
  },
  {
    value: "Patients",
    icon: "👥",
    route: "/patients"
  },
  {
    value: "Appointments",
    icon: "📅",
    route: "/appointments"
  },
  {
    value: "Visits",
    icon: "🩺",
    route: "/visits"
  },
  {
    value :"Reports",
    icon: "📈",
    route: "/reports"
  }
];

export const quickActions : Action[] = [
  {
      title: "Add Patient",
      description:"Register new patient",
      icon: "👤",
  },
  {
    title:"Book Appointment",
    description:"Schedule new Appointment",
    icon: "📅",
  },
  {
    title:"Record Visit",
    description:"Log details of a patient visit",
    icon: "💳",
    link: "/patients"
  }
]

