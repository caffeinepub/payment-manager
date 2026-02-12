import { LocalData, Person, Vendor, Transaction, SCHEMA_VERSION } from './schema';

const DB_NAME = 'PaymentsManagerDB';
const STORE_NAME = 'appData';

export class IndexedDBStorage {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, SCHEMA_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
    });
  }

  async getData(): Promise<LocalData> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('data');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result || { people: [], vendors: [], transactions: [] };
        resolve(data);
      };
    });
  }

  async setData(data: LocalData): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, 'data');

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async addPerson(person: Person): Promise<void> {
    const data = await this.getData();
    data.people.push(person);
    await this.setData(data);
  }

  async updatePerson(person: Person): Promise<void> {
    const data = await this.getData();
    const index = data.people.findIndex(p => p.id === person.id);
    if (index !== -1) {
      data.people[index] = person;
      await this.setData(data);
    }
  }

  async deletePerson(id: string): Promise<void> {
    const data = await this.getData();
    data.people = data.people.filter(p => p.id !== id);
    await this.setData(data);
  }

  async addVendor(vendor: Vendor): Promise<void> {
    const data = await this.getData();
    data.vendors.push(vendor);
    await this.setData(data);
  }

  async updateVendor(vendor: Vendor): Promise<void> {
    const data = await this.getData();
    const index = data.vendors.findIndex(v => v.id === vendor.id);
    if (index !== -1) {
      data.vendors[index] = vendor;
      await this.setData(data);
    }
  }

  async deleteVendor(id: string): Promise<void> {
    const data = await this.getData();
    data.vendors = data.vendors.filter(v => v.id !== id);
    await this.setData(data);
  }

  async addTransaction(transaction: Transaction): Promise<void> {
    const data = await this.getData();
    data.transactions.push(transaction);
    await this.setData(data);
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    const data = await this.getData();
    const index = data.transactions.findIndex(t => t.id === transaction.id);
    if (index !== -1) {
      data.transactions[index] = transaction;
      await this.setData(data);
    }
  }

  async deleteTransaction(id: string): Promise<void> {
    const data = await this.getData();
    data.transactions = data.transactions.filter(t => t.id !== id);
    await this.setData(data);
  }
}

export const storage = new IndexedDBStorage();
