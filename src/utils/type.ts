
export type Patient = {
  id: string;
  name: string;
  age?: number;
  phone?: string;
  address?: string;
  gender?: string;

  guardian?: string;
  occupation?: string;
  medicalHistory?: string;
  createdAt?: string;
  updatedAt?: string;
  visits?: {
    date: Date;
  }[];
  appointments?: {
    date: Date;
  }[];
  _count?: {
    visits: number;
    appointments: number;
  };
};

export type createPatientDTO = {
  name: string;
  age: number;
  phone: string;
  address: string;
  gender?: string;
  guardian?: string;
  occupation?: string;
  medicalHistory?: string;
};

export type AddPatientActionState = {
  status: "idle" | "error" | "success";
  message: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED" | "NO_SHOW";
  doctorName?: string;
  date: string;
  time: string;
  reason?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  patient:Patient
};


export type Visit = {
  id: string;
  patientId: string;
  doctorName?: string;
  date: string;
  time: string;
  reason?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "PAID" | "PENDING" | "PARTIAL";
  createdAt: string;
  updatedAt: string;
  patient?: Patient
};

export type Action={
  title: string;
  description: string;
  icon:string;
  link?: string;
}

export type addAppointmentDTO = {
  name?: string;
  phone?: string;
  address?: string;
  gender?: string;
  age?: number;
  patientId?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  doctorName?: string;
  date: string;
  time: string;
  reason?: string;
  notes?: string;
}

export type addAppointmentActionState = {
  status: "idle" | "error" | "success";
  message: string;
}


export type addPaymentDTO = {
  visitId: string;
  amount: number;
  method: "CASH" | "CARD" | "ONLINE";
  notes?: string;
}

export type  actionState = {
  status: "idle" | "error" | "success";
  message: string;
}

export type  addVisitDTO = {
  patientId: string;
  doctorName?: string;
  date: string;
  time: string;
  reason?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "PAID" | "PENDING" | "PARTIAL";
  paymentMethod?: "CASH" | "CARD" | "ONLINE";
}

export type Payment = {
  id: string;
  visitId: string;
  amount: number;
  method: "CASH" | "CARD" | "ONLINE";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}


//apointments

export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";
 
export type AppointmentWithPatient = {
  id: string;
  patientId: string;
  patient: { id: string; name: string; phone: string };
  status: AppointmentStatus;
  doctorName: string | null;
  date: string;   // ISO string from backend e.g. "2026-06-19T00:00:00.000Z"
  time: string;   // "09:00"
  reason: string | null;
  notes: string | null;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
};
 
export type PaginatedAppointments = {
  appointments: AppointmentWithPatient[];
  total: number;
  totalPages: number;
  page: number;
};
 
// ─── Action state types (same shape as your AddPatientActionState) ────────────
 
export type AppointmentActionState = {
  status: "idle" | "success" | "error";
  message: string;
};
 