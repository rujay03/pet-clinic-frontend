export type AdminUserRole = "ADMIN" | "DOCTOR" | "PETOWNER" | "PHARMACIST";
export type AdminUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  contactNo?: string | null;
  joinedDate?: string | null;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: AdminUserRole;
  contactNo?: string | null;
}

export interface UpdateAdminUserRequest {
  name: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  contactNo?: string | null;
}
