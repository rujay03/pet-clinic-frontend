export interface LoginRequest {
  email: string;
  password: string;
}

export interface MeResponse {
  email: string;
  roles: string[];
  // add more fields later if your backend returns them
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupForm extends SignupRequest {
  confirmPassword: string;
}

export interface PetOwnerSignupRequest {
  email: string;
  password: string;
  fullName: string;
  contactNo: string;
  address?: string;
}

export interface PetOwnerSignupForm extends PetOwnerSignupRequest {
  confirmPassword: string;
}

export interface StaffSignupRequest {
  email: string;
  password: string;
  fullName: string;
  contactNo?: string;
  role: string; // DOCTOR, PHARMACIST, ADMIN
}

export interface StaffSignupForm extends StaffSignupRequest {
  confirmPassword: string;
}

