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

export interface InventoryMedicineApi {
  medicineId: number;
  medicineName: string;
  genericName: string | null;
  form: string | null;
  strength: string | null;
  active: boolean;
  availableQuantity: number;
  unitSellPrice: number | null;
}

export interface InventoryMedicine {
  id: string;
  name: string;
  medicineId: string;
  groupName: string;
  stockQuantity: number;
  genericName?: string | null;
  form?: string | null;
  strength?: string | null;
  active?: boolean;
  unitSellPrice?: number | null;
  reorderLevel?: number;
  lastUpdated?: string;
}

export interface MedicineGroup {
  id: string;
  name: string;
}

export type PosItemType = "PRODUCT" | "SERVICE";

export interface POSProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  itemType: PosItemType;
  description?: string;
}

export interface CartItem {
  product: POSProduct;
  quantity: number;
}

export interface CreatePosBillItemRequest {
  itemType: PosItemType;
  medicineId?: number;
  itemName?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePosBillRequest {
  items: CreatePosBillItemRequest[];
  discountAmount?: number;
  taxAmount?: number;
  paymentMethod: string;
  notes?: string;
}

export interface PosBillItemResponse {
  billItemId: number;
  itemType: PosItemType;
  medicineId: number | null;
  itemName: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PosBillResponse {
  billId: number;
  billNo: string;
  billedAt: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  notes: string | null;
  createdByStaffId: number;
  createdByStaffName: string;
  createdAt: string;
  items: PosBillItemResponse[];
}
