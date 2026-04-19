export interface LoginRequest {
  email: string;
  password: string;
}

export interface MeResponse {
  email: string;
  roles: string[];
  fullName?: string | null;
  contactNo?: string | null;
  address?: string | null;
}

export interface UpdateMyProfileRequest {
  fullName: string;
  contactNo?: string | null;
  address?: string | null;
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

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}
