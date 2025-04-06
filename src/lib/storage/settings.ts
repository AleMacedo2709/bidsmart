
/**
 * User settings management
 */
import { updateData, retrieveData } from './crud';

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
