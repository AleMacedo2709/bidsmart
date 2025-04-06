
/**
 * Data integrity verification functions
 */
import { retrieveAllData } from './crud';
import { recordSecurityEvent } from './security';

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

// Import from crud.ts and settings.ts
import { updateData } from './crud';
import { storeSettings, retrieveSettings } from './settings';
