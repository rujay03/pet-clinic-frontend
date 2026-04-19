// types/doctor.ts

export type DoctorAppointmentTab = "ALL" | "TODAY" | "UPCOMING" | "COMPLETED";

export type DoctorAppointmentUiStatus = "Upcoming" | "Completed" | "Cancelled";

export interface DoctorAppointment {
  id: number;
  ownerId: number;
  ownerName: string;
  phoneNumber: string;
  petId: number;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  notes?: string | null;
  status: DoctorAppointmentUiStatus;
  statusCode: string;
}

export interface DoctorAppointmentsPageResponse {
  content: DoctorAppointment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface DoctorTimeSlot {
  slotStart: string;
  slotEnd: string;
}

export interface DoctorProfile {
  name: string;
  email: string;
  description?: string;
}

export interface DoctorSummary {
  id: number;
  name: string;
}
