export interface LoginRequest {
  email: string;
  password: string;
}

export interface MeResponse {
  email: string;
  roles: string[];
  // add more fields later if your backend returns them
}
