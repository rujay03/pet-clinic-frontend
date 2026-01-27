export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  sex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  dateOfBirth?: string;
  age?: number;
  notes?: string;
  createdAt: string;
}

export interface CreatePetRequest {
  name: string;
  species: string;
  breed?: string;
  sex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  dateOfBirth?: string;
  notes?: string;
}

export interface UpdatePetRequest {
  name: string;
  species: string;
  breed?: string;
  sex: 'MALE' | 'FEMALE' | 'UNKNOWN';
  dateOfBirth?: string;
  notes?: string;
}

