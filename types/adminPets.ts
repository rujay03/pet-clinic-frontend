export interface AdminPetTypeResponse {
  id: number;
  name: string;
  petCount: number;
}

export interface CreatePetTypeRequest {
  name: string;
}

