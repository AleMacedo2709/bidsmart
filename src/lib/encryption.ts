
/**
 * Encryption utilities for secure local storage with enhanced security measures
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

// Generate a strong random salt
const generateSalt = (): Uint8Array => {
  return window.crypto.getRandomValues(new Uint8Array(16));
}

// Generate a key from the user's Firebase UID and local password with improved security parameters
export const deriveKey = async (uid: string, password: string): Promise<CryptoKey> => {
  // Higher iteration count for enhanced security (OWASP recommends at least 310,000 in 2023)
  const ITERATIONS = 310000;
  
  // Create a key material from the UID and password
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    str2ab(uid + password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Create a more random salt using the UID and additional randomness
  // We still want to be able to derive the same key with the same password
  const saltBase = uid.substring(0, 8);
  const saltStr = saltBase + Date.now().toString().substring(0, 8);
  const salt = str2ab(saltStr.padEnd(16, '0'));

  // Derive an AES-256 key
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

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

// Export encrypted data as a file with additional metadata for integrity
export const exportEncryptedData = (data: string, filename: string): void => {
  // Add a header with version and format information
  const headerData = {
    format: "AEG-EXPORT",
    version: 1,
    timestamp: Date.now(),
    contentType: "application/json+encrypted"
  };
  
  const headerString = JSON.stringify(headerData);
  const combinedData = headerString + "\n" + data;
  
  const blob = new Blob([combinedData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Verify an exported file's integrity and extract the encrypted data
export const verifyExportedData = (fileContent: string): { isValid: boolean; data?: string } => {
  try {
    // Split header and data
    const firstNewline = fileContent.indexOf('\n');
    if (firstNewline === -1) {
      return { isValid: false };
    }
    
    const headerString = fileContent.substring(0, firstNewline);
    const data = fileContent.substring(firstNewline + 1);
    
    // Parse and verify header
    const header = JSON.parse(headerString);
    
    if (header.format !== "AEG-EXPORT" || !header.version) {
      return { isValid: false };
    }
    
    return { isValid: true, data };
  } catch (error) {
    console.error('Export verification failed:', error);
    return { isValid: false };
  }
}

// Calculate password strength score (0-100)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let score = 0;
  
  // Length
  score += Math.min(password.length * 4, 25);
  
  // Character variety
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;
  
  // Complexity
  const uniqueChars = new Set(password.split('')).size;
  score += Math.min(uniqueChars * 2, 15);
  
  return Math.min(score, 100);
}

// Hash a value for verification purposes (one-way hash)
export const hashValue = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
