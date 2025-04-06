
/**
 * IndexedDB initialization and management
 */

// Database version - increase when schema changes
export const DB_VERSION = 2;

// Initialize IndexedDB with improved security schema
export const initDB = (): Promise<IDBDatabase> => {
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
