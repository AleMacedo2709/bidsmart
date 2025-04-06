
/**
 * Core encryption and decryption functions
 */
import { str2ab, ab2str } from './utils';

// Encrypt data using AES-256-GCM with additional authentication data for integrity protection
export const encryptData = async (data: any, key: CryptoKey): Promise<string> => {
  // Create an initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Add a timestamp to the data for freshness
  const dataWithTimestamp = {
    ...data,
    _encryptedAt: Date.now()
  };
  
  // Convert data to JSON and then to ArrayBuffer
  const encodedData = str2ab(JSON.stringify(dataWithTimestamp));
  
  // Create authentication data to verify data integrity
  const authData = str2ab(JSON.stringify({
    type: 'AEG-encrypted',
    version: 1
  }));
  
  // Encrypt the data with authentication
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      additionalData: authData
    },
    key,
    encodedData
  );
  
  // Combine the IV and encrypted data and convert to base64
  const combined = new Uint8Array(iv.length + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  return btoa(ab2str(combined));
}

// Decrypt data using AES-256-GCM with added integrity verification
export const decryptData = async (encryptedData: string, key: CryptoKey): Promise<any> => {
  try {
    // Convert from base64 to ArrayBuffer
    const combined = str2ab(atob(encryptedData));
    
    // Extract the IV and the encrypted data
    const iv = new Uint8Array(combined.slice(0, 12));
    const data = combined.slice(12);
    
    // Authentication data for integrity verification
    const authData = str2ab(JSON.stringify({
      type: 'AEG-encrypted',
      version: 1
    }));
    
    // Decrypt the data with authentication verification
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData: authData
      },
      key,
      data
    );
    
    // Parse the decrypted data
    const parsedData = JSON.parse(ab2str(decryptedData));
    
    // Remove the internal timestamp before returning
    const { _encryptedAt, ...cleanData } = parsedData;
    
    return cleanData;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data. The key might be incorrect or data may have been tampered with.');
  }
}
