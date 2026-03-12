export interface KpiCard {
  title: string;
  subtitle: string;
  value: string | number;
  change?: string;
  changeLabel?: string;
  icon: "calendar" | "stethoscope" | "syringe" | "patients";
  iconColor: string;
  iconBg: string;
}

export interface AppointmentTrendData {
  day: string;
  appointments: number;
  trend: number;
}

export interface VaccinationTypeData {
  name: string;
  value: number;
  color: string;
}

export interface PatientVisitData {
  day: string;
  visits: number;
}

export interface AppointmentOverviewData {
  day: string;
  scheduled: number;
  pending: number;
  cancelled: number;
}

export interface TreatmentType {
  name: string;
  percentage: number;
  color: string;
}

export interface UpcomingPatient {
  petName: string;
  ownerName: string;
  avatar: string;
}

