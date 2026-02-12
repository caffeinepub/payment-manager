import { useState, useEffect, useCallback } from 'react';
import { storage } from './indexedDb';
import { LocalData, Person, Vendor, Transaction } from './schema';

export function useLocalData() {
  const [data, setData] = useState<LocalData>({ people: [], vendors: [], transactions: [] });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const loadedData = await storage.getData();
      setData(loadedData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addPerson = useCallback(async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPerson: Person = {
      ...person,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await storage.addPerson(newPerson);
    await loadData();
  }, [loadData]);

  const updatePerson = useCallback(async (person: Person) => {
    const updated = { ...person, updatedAt: Date.now() };
    await storage.updatePerson(updated);
    await loadData();
  }, [loadData]);

  const deletePerson = useCallback(async (id: string) => {
    await storage.deletePerson(id);
    await loadData();
  }, [loadData]);

  const addVendor = useCallback(async (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await storage.addVendor(newVendor);
    await loadData();
  }, [loadData]);

  const updateVendor = useCallback(async (vendor: Vendor) => {
    const updated = { ...vendor, updatedAt: Date.now() };
    await storage.updateVendor(updated);
    await loadData();
  }, [loadData]);

  const deleteVendor = useCallback(async (id: string) => {
    await storage.deleteVendor(id);
    await loadData();
  }, [loadData]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await storage.addTransaction(newTransaction);
    await loadData();
  }, [loadData]);

  const updateTransaction = useCallback(async (transaction: Transaction) => {
    const updated = { ...transaction, updatedAt: Date.now() };
    await storage.updateTransaction(updated);
    await loadData();
  }, [loadData]);

  const deleteTransaction = useCallback(async (id: string) => {
    await storage.deleteTransaction(id);
    await loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    addPerson,
    updatePerson,
    deletePerson,
    addVendor,
    updateVendor,
    deleteVendor,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
