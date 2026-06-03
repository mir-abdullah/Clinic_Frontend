
export type Patient = {
  id?: string;
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
  visits?: Visit[];
  appointments?: Appointment[];
};

export type Appointment = {
  id: string;
  patientId: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
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
