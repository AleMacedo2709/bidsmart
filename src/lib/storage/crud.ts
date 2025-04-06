
/**
 * CRUD operations for encrypted data storage
 */
import { initDB } from './db';
import { recordSecurityEvent } from './security';
import { encryptData, decryptData, hashValue } from '../encryption';

// Store encrypted data in IndexedDB with integrity protection
export const storeData = async <T>(
  storeName: string,
  data: T,
  key: CryptoKey
): Promise<string> => {
  // Generate a unique ID for the data
  const id = crypto.randomUUID();
  const dataWithId = { ...data, id };
  
  // Create integrity hash
  const integrityHash = await hashValue(JSON.stringify(dataWithId));
  
  // Encrypt the data
  const encryptedData = await encryptData(dataWithId, key);
  
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName, 'security_metadata'], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const record = {
      id,
      data: encryptedData,
      timestamp: Date.now(),
      integrityHash
    };
    
    const request = store.put(record);
    
    request.onerror = () => reject(new Error('Failed to store data'));
    
    request.onsuccess = async () => {
      // Record the write operation for audit purposes
      const metadataStore = transaction.objectStore('security_metadata');
      await metadataStore.add({
        id: crypto.randomUUID(),
        type: 'data_write',
        timestamp: Date.now(),
        details: {
          store: storeName,
          recordId: id,
          operation: 'create'
        }
      });
      
      resolve(id);
    };
    
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
  
  // Create integrity hash
  const integrityHash = await hashValue(JSON.stringify(dataWithId));
  
  // Encrypt the data
  const encryptedData = await encryptData(dataWithId, key);
  
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName, 'security_metadata'], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Get the existing record to verify its existence
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      if (!getRequest.result) {
        reject(new Error('Record not found, cannot update'));
        return;
      }
      
      const record = {
        id,
        data: encryptedData,
        timestamp: Date.now(),
        integrityHash
      };
      
      const putRequest = store.put(record);
      
      putRequest.onerror = () => reject(new Error('Failed to update data'));
      
      putRequest.onsuccess = async () => {
        // Record the update operation for audit purposes
        const metadataStore = transaction.objectStore('security_metadata');
        await metadataStore.add({
          id: crypto.randomUUID(),
          type: 'data_write',
          timestamp: Date.now(),
          details: {
            store: storeName,
            recordId: id,
            operation: 'update'
          }
        });
        
        resolve();
      };
    };
    
    getRequest.onerror = () => reject(new Error('Failed to get existing record'));
    
    transaction.oncomplete = () => db.close();
  });
};

// Retrieve and decrypt data from IndexedDB with integrity verification
export const retrieveData = async <T>(
  storeName: string,
  id: string,
  key: CryptoKey
): Promise<T> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName, 'security_metadata'], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.get(id);
    
    request.onerror = () => reject(new Error('Failed to retrieve data'));
    
    request.onsuccess = async () => {
      if (!request.result) {
        reject(new Error('Data not found'));
        return;
      }
      
      try {
        // Record access for audit
        const metadataStore = transaction.objectStore('security_metadata');
        await metadataStore.add({
          id: crypto.randomUUID(),
          type: 'data_access',
          timestamp: Date.now(),
          details: {
            store: storeName,
            recordId: id
          }
        });
        
        const decryptedData = await decryptData(request.result.data, key);
        
        // Verify data integrity
        const calculatedHash = await hashValue(JSON.stringify(decryptedData));
        if (calculatedHash !== request.result.integrityHash) {
          await recordSecurityEvent('data_integrity_violation', {
            store: storeName,
            recordId: id
          });
          reject(new Error('Data integrity check failed. The data may have been tampered with.'));
          return;
        }
        
        resolve(decryptedData as T);
      } catch (error) {
        await recordSecurityEvent('decryption_failure', {
          store: storeName,
          recordId: id,
          error: (error as Error).message
        });
        reject(error);
      }
    };
    
    transaction.oncomplete = () => db.close();
  });
};

// Retrieve all data from a store with integrity verification
export const retrieveAllData = async <T>(
  storeName: string,
  key: CryptoKey
): Promise<T[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName, 'security_metadata'], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.getAll();
    
    request.onerror = () => reject(new Error('Failed to retrieve data'));
    
    request.onsuccess = async () => {
      if (!request.result || request.result.length === 0) {
        resolve([]);
        return;
      }
      
      try {
        // Record batch access for audit
        const metadataStore = transaction.objectStore('security_metadata');
        await metadataStore.add({
          id: crypto.randomUUID(),
          type: 'data_access',
          timestamp: Date.now(),
          details: {
            store: storeName,
            operation: 'retrieve_all',
            count: request.result.length
          }
        });
        
        const decryptedDataPromises = request.result.map(async (item) => {
          const decryptedData = await decryptData(item.data, key);
          
          // Verify data integrity
          const calculatedHash = await hashValue(JSON.stringify(decryptedData));
          if (calculatedHash !== item.integrityHash) {
            await recordSecurityEvent('data_integrity_violation', {
              store: storeName,
              recordId: item.id
            });
            throw new Error('Data integrity check failed for item ' + item.id);
          }
          
          return decryptedData;
        });
        
        const decryptedData = await Promise.all(decryptedDataPromises);
        resolve(decryptedData as T[]);
      } catch (error) {
        await recordSecurityEvent('batch_operation_failure', {
          store: storeName,
          error: (error as Error).message
        });
        reject(error);
      }
    };
    
    transaction.oncomplete = () => db.close();
  });
};

// Delete data from IndexedDB with audit logging
export const deleteData = async (
  storeName: string,
  id: string
): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName, 'security_metadata'], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const request = store.delete(id);
    
    request.onerror = () => reject(new Error('Failed to delete data'));
    
    request.onsuccess = async () => {
      // Record deletion for audit
      const metadataStore = transaction.objectStore('security_metadata');
      await metadataStore.add({
        id: crypto.randomUUID(),
        type: 'data_deletion',
        timestamp: Date.now(),
        details: {
          store: storeName,
          recordId: id
        }
      });
      
      resolve();
    };
    
    transaction.oncomplete = () => db.close();
  });
};
