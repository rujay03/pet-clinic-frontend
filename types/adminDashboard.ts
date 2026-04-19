export interface AdminDashboardStats {
  totalUsers: number;
  petOwners: number;
  doctors: number;
  pharmacyStaff: number;
}

export interface AdminDashboardUserItem {
  id: number;
  email: string;
  displayName: string;
  role: string;
  status: string;
}

export interface AdminDashboardAppointmentItem {
  id: number;
  petName: string;
  ownerName: string;
  doctorName: string;
  time: string;
  status: string;
}

export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  recentUsers: AdminDashboardUserItem[];
  todayAppointments: AdminDashboardAppointmentItem[];
}

