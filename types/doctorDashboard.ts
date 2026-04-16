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

export interface DoctorDashboardKpis {
  totalAppointments: number;
  consultations: number;
  vaccinations: number;
  totalPatients: number;
}

export interface DoctorDashboardStatusSummary {
  scheduled: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export interface DoctorDashboardTrendPoint {
  label: string;
  appointments: number;
  trend: number;
}

export interface DoctorDashboardDistributionItem {
  name: string;
  value: number;
}

export interface DoctorDashboardVisitPoint {
  day: string;
  visits: number;
}

export interface DoctorDashboardOverviewPoint {
  day: string;
  scheduled: number;
  pending: number;
  cancelled: number;
}

export interface DoctorDashboardUpcomingPatient {
  petName: string;
  ownerName: string;
}

export interface DoctorDashboardResponse {
  kpis: DoctorDashboardKpis;
  appointmentStatusSummary: DoctorDashboardStatusSummary;
  appointmentTrendsLast30Days: DoctorDashboardTrendPoint[];
  appointmentTrendsThisYear: DoctorDashboardTrendPoint[];
  vaccinationTypes: DoctorDashboardDistributionItem[];
  patientVisitsThisMonth: DoctorDashboardVisitPoint[];
  appointmentOverviewThisMonth: DoctorDashboardOverviewPoint[];
  topTreatmentTypes: DoctorDashboardDistributionItem[];
  upcomingPatients: DoctorDashboardUpcomingPatient[];
}
