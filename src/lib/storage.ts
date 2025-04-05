
/**
 * Storage utilities for local data persistence
 */
import { encryptData, decryptData } from './encryption';

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RealEstateAuctionDB', 1);

    request.onerror = () => reject(new Error('Failed to open database'));

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      if (!db.objectStoreNames.contains('properties')) {
        db.createObjectStore('properties', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('simulations')) {
        db.createObjectStore('simulations', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
  });
};

// Store encrypted data in IndexedDB
export const storeData = async <T>(
  storeName: string,
  data: T,
  key: CryptoKey
): Promise<string> => {
  // Generate a unique ID for the data
  const id = crypto.randomUUID();
  const dataWithId = { ...data, id };
  
  // Encrypt the data
  const encryptedData = await encryptData(dataWithId, key);
  
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.put({
      id,
      data: encryptedData,
      timestamp: Date.now()
    });
    
    request.onerror = () => reject(new Error('Failed to store data'));
    request.onsuccess = () => resolve(id);
    
    transaction.oncomplete = () => db.close();
  });
};

// Update existing encrypted data in IndexedDB
export const updateData = async <T>(
  storeName: string,
  id: string,
  data: T,
  key: CryptoKey
): Promise<void> => {
  const dataWithId = { ...data, id };
  
  // Encrypt the data
  const encryptedData = await encryptData(dataWithId, key);
  
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.put({
      id,
      data: encryptedData,
      timestamp: Date.now()
    });
    
    request.onerror = () => reject(new Error('Failed to update data'));
    request.onsuccess = () => resolve();
    
    transaction.oncomplete = () => db.close();
  });
};

// Retrieve and decrypt data from IndexedDB
export const retrieveData = async <T>(
  storeName: string,
  id: string,
  key: CryptoKey
): Promise<T> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    const request = store.get(id);
    
    request.onerror = () => reject(new Error('Failed to retrieve data'));
    
    request.onsuccess = async () => {
      if (!request.result) {
        reject(new Error('Data not found'));
        return;
      }
      
      try {
        const decryptedData = await decryptData(request.result.data, key);
        resolve(decryptedData as T);
      } catch (error) {
        reject(error);
      }
    };
    
    transaction.oncomplete = () => db.close();
  });
};

// Retrieve all data from a store
export const retrieveAllData = async <T>(
  storeName: string,
  key: CryptoKey
): Promise<T[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    const request = store.getAll();
    
    request.onerror = () => reject(new Error('Failed to retrieve data'));
    
    request.onsuccess = async () => {
      if (!request.result || request.result.length === 0) {
        resolve([]);
        return;
      }
      
      try {
        const decryptedDataPromises = request.result.map(async (item) => {
          return await decryptData(item.data, key);
        });
        
        const decryptedData = await Promise.all(decryptedDataPromises);
        resolve(decryptedData as T[]);
      } catch (error) {
        reject(error);
      }
    };
    
    transaction.oncomplete = () => db.close();
  });
};

// Delete data from IndexedDB
export const deleteData = async (
  storeName: string,
  id: string
): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(id);
    
    request.onerror = () => reject(new Error('Failed to delete data'));
    request.onsuccess = () => resolve();
    
    transaction.oncomplete = () => db.close();
  });
};

// Export all data from a store
export const exportStoreData = async (
  storeName: string,
  key: CryptoKey
): Promise<string> => {
  const data = await retrieveAllData(storeName, key);
  // Re-encrypt with the same key for export
  return await encryptData(data, key);
};

// Import data into a store
export const importStoreData = async <T>(
  storeName: string,
  encryptedData: string,
  key: CryptoKey
): Promise<void> => {
  // Decrypt the imported data
  const data = await decryptData(encryptedData, key) as T[];
  
  const db = await initDB();
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  
  return new Promise((resolve, reject) => {
    // Clear existing data first
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = async () => {
      try {
        // Store each item
        for (const item of data) {
          const encryptedItem = await encryptData(item, key);
          store.put({
            id: (item as any).id,
            data: encryptedItem,
            timestamp: Date.now()
          });
        }
        
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    clearRequest.onerror = () => reject(new Error('Failed to clear existing data'));
    transaction.oncomplete = () => db.close();
  });
};

// Store user settings
export const storeSettings = async (
  settings: Record<string, any>,
  key: CryptoKey
): Promise<void> => {
  await updateData('settings', 'user-settings', settings, key);
};

// Retrieve user settings
export const retrieveSettings = async (
  key: CryptoKey
): Promise<Record<string, any>> => {
  try {
    return await retrieveData('settings', 'user-settings', key);
  } catch (error) {
    // If settings don't exist yet, return an empty object
    return {};
  }
};
