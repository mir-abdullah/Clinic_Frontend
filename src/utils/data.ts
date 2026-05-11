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

export type Appointment = {
  id: string;
  appointmentDate: Date;
  appointmentTime: string;
  purpose?: string;
  notes?: string;
  createdAt: Date;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
}

export type Visit = {
  visitDate :Date;
  visitTime: string;
   serviceRendered: string;
   totalBill: number;
    creditAmount: number;
    balanceAmount: number;
    patient: {
      id: string;
      name: string;
      email: string;
      phone: string;
    }

}


export type Action={
  title: string;
  description: string;
  icon:string;
  link?: string;
}



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