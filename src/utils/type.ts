export type Patient = {
  name: string;
  age?: number;
  phone?: string;
  address?: string;
  gender?: string;

  guardianName?: string;
  occupation?: string;
  medicalHistory?: string;
  
  visits: Visit[];
  appointments: Appointment[];
};
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

