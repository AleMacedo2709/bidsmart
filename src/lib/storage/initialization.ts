
/**
 * Initialization utilities for local storage with mock data
 */
import { initDB } from './db';
import { storeData } from './crud';
import { generateTempKey } from '../encryption/keys';
import { mockProperties, mockFinancialData, mockAuctions } from '@/data/mockData';

// Initialize the database with mock data for first-time users
export const initializeWithMockData = async (): Promise<void> => {
  try {
    // Generate a temporary encryption key
    const key = await generateTempKey();
    
    // Check if data already exists
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['properties'], 'readonly');
      const store = transaction.objectStore('properties');
      
      const countRequest = store.count();
      
      countRequest.onsuccess = async () => {
        try {
          // Only initialize with mock data if no data exists yet
          if (countRequest.result === 0) {
            console.log("Initializing with mock data...");
            
            // Store properties
            for (const property of mockProperties) {
              await storeData('properties', property, key);
            }
            
            // Store financial settings
            await storeData('settings', { 
              id: 'financial-settings',
              ...mockFinancialData 
            }, key);
            
            // Store auctions
            for (const auction of mockAuctions) {
              await storeData('auctions', auction, key);
            }
            
            console.log("Mock data initialized successfully");
          } else {
            console.log("Data already exists, skipping mock data initialization");
          }
          
          resolve();
        } catch (error) {
          console.error("Error initializing mock data:", error);
          reject(error);
        }
      };
      
      countRequest.onerror = (event) => {
        console.error("Error checking database:", event);
        reject(new Error("Failed to check database"));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};

// Check if this is the first time the app is being used
export const isFirstTimeUser = async (): Promise<boolean> => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['properties'], 'readonly');
      const store = transaction.objectStore('properties');
      
      const countRequest = store.count();
      
      countRequest.onsuccess = () => {
        resolve(countRequest.result === 0);
      };
      
      countRequest.onerror = () => {
        reject(new Error("Failed to check if first time user"));
      };
      
      transaction.oncomplete = () => db.close();
    });
  } catch (error) {
    console.error("Error checking first time user:", error);
    // If there's an error, assume it's a first time user
    return true;
  }
};
