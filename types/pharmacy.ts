// types/pharmacy.ts

export interface Medicine {
  id: string;
  name: string;
  medicineId: string;
  groupName: string;
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
