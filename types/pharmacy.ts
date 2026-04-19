// types/pharmacy.ts

export interface Medicine {
  id: number;
  name: string;
  genericName: string | null;
  form: string | null;
  strength: string | null;
  isActive: boolean;
}

export interface CreateMedicineRequest {
  name: string;
  genericName?: string;
  form?: string;
  strength?: string;
  isActive?: boolean;
}

export interface UpdateMedicineRequest {
  name: string;
  genericName?: string;
  form?: string;
  strength?: string;
  isActive?: boolean;
}

export interface InventoryMedicine {
  id: string;
  name: string;
  medicineId: string;
  groupName: string;
  stockQuantity: number;
  reorderLevel?: number;
  lastUpdated?: string;
}

export interface MedicineGroup {
  id: string;
  name: string;
}

export interface POSProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export interface CartItem {
  product: POSProduct;
  quantity: number;
}
