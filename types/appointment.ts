// types/appointment.ts

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export interface Appointment {
  id: number;
  petId: number;
  petName: string;
  petBreed?: string;
  petImageUrl?: string;
  petSpecies?: string;
  doctorName: string;
  doctorImageUrl?: string;
  appointmentDate: string; // e.g. "2024-04-25"
  appointmentTime: string; // e.g. "10:00"
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  price?: number;
}

