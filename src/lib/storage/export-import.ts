
/**
 * Data export and import functionality
 */
import { retrieveAllData, storeData } from './crud';
import { encryptData, decryptData, verifyExportedData, hashValue } from '../encryption';
import { recordSecurityEvent } from './security';
import { initDB } from './db';

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
      dataVersion: 2, // DB_VERSION from db.ts
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
