// types/doctor.ts

export interface Appointment {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Open' | 'Booked' | 'Completed';
}

export interface DoctorProfile {
  name: string;
  email: string;
  description?: string;
}
