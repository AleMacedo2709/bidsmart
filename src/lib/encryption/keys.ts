
/**
 * Key generation and derivation functions
 */
import { str2ab } from './utils';

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
