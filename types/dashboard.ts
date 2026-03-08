// types/dashboard.ts

export interface DashboardStats {
  totalPets: number;
  upcomingAppointments: number;
  pendingPayments: number;
  activePrescriptions: number;
  upcomingVaccinations: number;
}

export interface DashboardPet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  lastVisit?: string;
  vaccinationStatus: 'Valid' | 'Due Soon' | 'Overdue';
  rabiesStatus?: 'Valid' | 'Due Soon' | 'Overdue';
  imageUrl?: string;
}

export interface DashboardAppointment {
  id: number;
  petId: number;
  petName: string;
  petImageUrl?: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  price?: number;
}

export interface DashboardPrescription {
  id: number;
  petId: number;
  petName: string;
  medication: string;
  dosage: string;
  frequency: string;
  status: 'Active' | 'Completed' | 'Expired';
}

export interface DashboardNotification {
  id: number;
  type: 'vaccination' | 'appointment' | 'prescription' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface BillingHistoryItem {
  id: number;
  date: string;
  petName: string;
  services: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

