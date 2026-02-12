import { createContext, useContext, ReactNode } from 'react';
import { useLocalData } from './useLocalData';
import { LocalData, Person, Vendor, Transaction } from './schema';

interface LocalDataContextValue {
  data: LocalData;
  isLoading: boolean;
  addPerson: (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePerson: (person: Person) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVendor: (vendor: Vendor) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const LocalDataContext = createContext<LocalDataContextValue | undefined>(undefined);

export function LocalDataProvider({ children }: { children: ReactNode }) {
  const localData = useLocalData();

  return (
    <LocalDataContext.Provider value={localData}>
      {children}
    </LocalDataContext.Provider>
  );
}

export function useLocalDataContext() {
  const context = useContext(LocalDataContext);
  if (!context) {
    throw new Error('useLocalDataContext must be used within LocalDataProvider');
  }
  return context;
}
