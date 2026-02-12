export interface Person {
  id: string;
  name: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Vendor {
  id: string;
  name: string;
  category?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface SplitEntry {
  personId: string;
  amount: number;
}

export interface Transaction {
  id: string;
  date: number;
  vendorId: string;
  totalAmount: number;
  notes?: string;
  type: 'solo' | 'split';
  splits?: SplitEntry[];
  receiptImages?: string[]; // data URLs
  createdAt: number;
  updatedAt: number;
}

export interface LocalData {
  people: Person[];
  vendors: Vendor[];
  transactions: Transaction[];
}

export const SCHEMA_VERSION = 1;
