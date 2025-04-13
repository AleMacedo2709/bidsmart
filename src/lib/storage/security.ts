
/**
 * Security related storage functionality
 */
import { initDB } from './db';

// Authentication attempts tracking for brute force protection
export const AUTH_ATTEMPTS = {
  count: 0,
  lastAttempt: 0,
  lockedUntil: 0
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
