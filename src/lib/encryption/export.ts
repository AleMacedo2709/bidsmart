
/**
 * Utilities for exporting and importing encrypted data
 */
import { ab2str } from './utils';

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
