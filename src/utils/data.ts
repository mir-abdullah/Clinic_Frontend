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
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  purpose?: string;
  doctorName?: string;
  patientId: number;
  notes?: string;
  createdAt: string;
  patient:{
    id: number;
    name: string;
    email?: string;
    phone?: string;
  }

};



export type Visit = {
  id: number;
  visitId?: number;
  visitDate: string;
  visitTime: string;
  serviceRendered: string;
  totalBill: number;
  creditAmount: number;
  balanceAmount: number;
  patientId: number;
  patient?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
};

export type Patient = {
  id?: number;
  name: string;
  dateOfBirth?: string;
  age?: number;
  guardianName?: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
  occupation?: string;
  doctorName?: string;
  referredBy?: string;
  registrationDate: string;
  visits: Visit[];
  appointments: Appointment[];
};


export type Action={
  title: string;
  description: string;
  icon:string;
  link?: string;
}

//functions
    const getOrdinal = (n: number) => {
        const s = n % 100;
        if (s >= 11 && s <= 13) return "th";
        switch (n % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

  export   const formatDateWithOrdinal = (value: Date | string | null | undefined) => {
        if (!value) return "";
        const d = typeof value === "string" ? new Date(value) : value;
        if (Number.isNaN(d.getTime())) return "Invalid date";
        const day = d.getDate();
        const month = d.toLocaleString(undefined, { month: "long" });
        const year = d.getFullYear();
        return `${day}${getOrdinal(day)} ${month} ${year}`;
    };


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

// API response raw types (dates as strings)