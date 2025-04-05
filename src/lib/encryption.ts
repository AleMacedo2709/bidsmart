
/**
 * Encryption utilities for secure local storage
 */

// Convert a string to an ArrayBuffer
const str2ab = (str: string): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert an ArrayBuffer to a string
const ab2str = (buf: ArrayBuffer): string => {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

// Generate a key from the user's Firebase UID and local password
export const deriveKey = async (uid: string, password: string): Promise<CryptoKey> => {
  // Create a key material from the UID and password
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    str2ab(uid + password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Salt value (using part of the UID)
  const salt = str2ab(uid.substring(0, 16).padEnd(16, '0'));

  // Derive an AES-256 key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data using AES-256-GCM
export const encryptData = async (data: any, key: CryptoKey): Promise<string> => {
  // Create an initialization vector
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert data to JSON and then to ArrayBuffer
  const encodedData = str2ab(JSON.stringify(data));
  
  // Encrypt the data
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
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

// Decrypt data using AES-256-GCM
export const decryptData = async (encryptedData: string, key: CryptoKey): Promise<any> => {
  try {
    // Convert from base64 to ArrayBuffer
    const combined = str2ab(atob(encryptedData));
    
    // Extract the IV and the encrypted data
    const iv = new Uint8Array(combined.slice(0, 12));
    const data = combined.slice(12);
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      data
    );
    
    // Parse the decrypted data
    return JSON.parse(ab2str(decryptedData));
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data. The key might be incorrect.');
  }
}

// Generate a random encryption key for anonymous users
export const generateTempKey = async (): Promise<CryptoKey> => {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

// Export encrypted data as a file
export const exportEncryptedData = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
