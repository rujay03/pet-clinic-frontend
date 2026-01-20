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
