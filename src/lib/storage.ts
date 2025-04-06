
/**
 * Storage utilities for local data persistence with enhanced security
 */
import { encryptData, decryptData, verifyExportedData, hashValue } from './encryption';

// Database version - increase when schema changes
const DB_VERSION = 2;

// Authentication attempts tracking for brute force protection
const AUTH_ATTEMPTS = {
  count: 0,
  lastAttempt: 0,
  lockedUntil: 0
};

// Initialize IndexedDB with improved security schema
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RealEstateAuctionDB', DB_VERSION);

    request.onerror = () => reject(new Error('Failed to open database'));

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      
      // Create object stores
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains('properties')) {
          db.createObjectStore('properties', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('simulations')) {
          db.createObjectStore('simulations', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      }
      
      // Schema upgrade for version 2 - Add metadata store for security
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('security_metadata')) {
          const metadataStore = db.createObjectStore('security_metadata', { keyPath: 'id' });
          metadataStore.createIndex('type', 'type', { unique: false });
          metadataStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Add integrity hashes index to all existing stores
        ['properties', 'simulations', 'settings'].forEach(storeName => {
          if (db.objectStoreNames.contains(storeName)) {
            const store = request.transaction?.objectStore(storeName);
            if (store && !store.indexNames.contains('integrityHash')) {
              store.createIndex('integrityHash', 'integrityHash', { unique: false });
            }
          }
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
  });
};

// Record a security event in the metadata store
export const recordSecurityEvent = async (
  eventType: string,
  details: Record<string, any>
): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['security_metadata'], 'readwrite');
    const store = transaction.objectStore('security_metadata');
    
    const event = {
      id: crypto.randomUUID(),
      type: eventType,
      timestamp: Date.now(),
      details
    };
    
    const request = store.add(event);
    
    request.onerror = () => reject(new Error('Failed to record security event'));
    request.onsuccess = () => resolve();
    
    transaction.oncomplete = () => db.close();
  });
};

// Check for suspicious activity (like brute force attempts)
export const checkSecurityStatus = async (): Promise<{
  locked: boolean;
  reason?: string;
  unlockTime?: number;
}> => {
  // Check if account is currently locked
  const now = Date.now();
  if (AUTH_ATTEMPTS.lockedUntil > now) {
    return {
      locked: true,
      reason: 'Too many failed attempts',
      unlockTime: AUTH_ATTEMPTS.lockedUntil
    };
  }
  
  // Reset counter if last attempt was more than 30 minutes ago
  if (now - AUTH_ATTEMPTS.lastAttempt > 30 * 60 * 1000) {
    AUTH_ATTEMPTS.count = 0;
  }
  
  return { locked: false };
};

// Track authentication attempts for brute force protection
export const trackAuthAttempt = async (
  success: boolean
): Promise<void> => {
  const now = Date.now();
  
  // Reset counter if last attempt was more than 30 minutes ago
  if (now - AUTH_ATTEMPTS.lastAttempt > 30 * 60 * 1000) {
    AUTH_ATTEMPTS.count = 0;
  }
  
  AUTH_ATTEMPTS.lastAttempt = now;
  
  if (!success) {
    AUTH_ATTEMPTS.count++;
    
    // Lock after 5 failed attempts
    if (AUTH_ATTEMPTS.count >= 5) {
      // Lock for 15 minutes
      AUTH_ATTEMPTS.lockedUntil = now + 15 * 60 * 1000;
      
      await recordSecurityEvent('account_locked', {
        reason: 'Too many failed attempts',
        attemptsCount: AUTH_ATTEMPTS.count,
        unlockTime: AUTH_ATTEMPTS.lockedUntil
      });
    }
  } else {
    // Reset on successful auth
    AUTH_ATTEMPTS.count = 0;
  }
};

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

// Export all data from a store with metadata and verification info
export const exportStoreData = async (
  storeName: string,
  key: CryptoKey
): Promise<string> => {
  const data = await retrieveAllData(storeName, key);
  
  // Add export metadata
  const exportData = {
    data,
    metadata: {
      exportTime: Date.now(),
      dataVersion: DB_VERSION,
      itemCount: data.length,
      source: 'Auction Estate Guardian',
      storeName
    }
  };
  
  // Re-encrypt with the same key for export
  return await encryptData(exportData, key);
};

// Import data into a store with validation
export const importStoreData = async <T>(
  storeName: string,
  encryptedData: string,
  key: CryptoKey
): Promise<void> => {
  // Validate the import file format
  const validationResult = verifyExportedData(encryptedData);
  if (!validationResult.isValid || !validationResult.data) {
    throw new Error('Invalid import file format');
  }
  
  // Decrypt the imported data
  const decryptedRawData = await decryptData(validationResult.data, key);
  
  // Check if the import has the expected format
  if (!decryptedRawData.data || !decryptedRawData.metadata) {
    throw new Error('Import file is missing required metadata');
  }
  
  const data = decryptedRawData.data as T[];
  
  // Audit the import operation
  await recordSecurityEvent('data_import', {
    store: storeName,
    items: data.length,
    importTime: Date.now(),
    sourceMetadata: decryptedRawData.metadata
  });
  
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
          // Generate integrity hash
          const integrityHash = await hashValue(JSON.stringify(item));
          
          // Encrypt the item
          const encryptedItem = await encryptData(item, key);
          
          // Store with integrity information
          store.put({
            id: (item as any).id,
            data: encryptedItem,
            timestamp: Date.now(),
            integrityHash
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

// Store user settings with key rotation support
export const storeSettings = async (
  settings: Record<string, any>,
  key: CryptoKey
): Promise<void> => {
  // Add key creation timestamp to settings for key rotation policies
  const settingsWithMeta = {
    ...settings,
    _securityMeta: {
      keyCreatedAt: Date.now(),
      lastRotationCheck: Date.now()
    }
  };
  
  await updateData('settings', 'user-settings', settingsWithMeta, key);
};

// Retrieve user settings
export const retrieveSettings = async (
  key: CryptoKey
): Promise<Record<string, any>> => {
  try {
    const settings = await retrieveData<Record<string, any>>('settings', 'user-settings', key);
    
    // Check if key rotation is needed (e.g., key is older than 90 days)
    const securityMeta = settings._securityMeta || {};
    const keyAge = Date.now() - (securityMeta.keyCreatedAt || Date.now());
    const keyAgeDays = keyAge / (1000 * 60 * 60 * 24);
    
    // Remove metadata before returning
    const { _securityMeta, ...cleanSettings } = settings;
    
    // If key is old, flag for rotation
    if (keyAgeDays > 90) {
      return {
        ...cleanSettings,
        _keyRotationRecommended: true
      };
    }
    
    return cleanSettings;
  } catch (error) {
    // If settings don't exist yet, return an empty object
    return {};
  }
};

// Rotate encryption key (re-encrypt all data with a new key)
export const rotateEncryptionKey = async (
  oldKey: CryptoKey,
  newKey: CryptoKey
): Promise<void> => {
  const stores = ['properties', 'simulations', 'settings'];
  
  for (const storeName of stores) {
    // Get all data with the old key
    const allData = await retrieveAllData(storeName, oldKey);
    
    // Re-encrypt with the new key
    for (const item of allData) {
      await updateData(storeName, (item as any).id, item, newKey);
    }
  }
  
  // Record the key rotation
  await recordSecurityEvent('key_rotation', {
    timestamp: Date.now(),
    stores
  });
  
  // Update settings with new key creation time
  const settings = await retrieveSettings(newKey);
  await storeSettings({
    ...settings,
    _securityMeta: {
      keyCreatedAt: Date.now(),
      lastRotationCheck: Date.now()
    }
  }, newKey);
};

// Verify the database integrity (scan all records)
export const verifyDatabaseIntegrity = async (
  key: CryptoKey
): Promise<{ valid: boolean; issues: any[] }> => {
  const stores = ['properties', 'simulations', 'settings'];
  const issues: any[] = [];
  
  for (const storeName of stores) {
    try {
      // This will verify integrity as it retrieves
      await retrieveAllData(storeName, key);
    } catch (error) {
      issues.push({
        store: storeName,
        error: (error as Error).message
      });
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};
