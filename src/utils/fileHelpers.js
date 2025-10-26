/**
 * Convert ArrayBuffer to Base64 string without causing stack overflow
 * Processes large files in chunks to avoid "Maximum call stack size exceeded"
 * 
 * @param {ArrayBuffer} buffer - The file data as ArrayBuffer
 * @param {number} chunkSize - Size of chunks to process (default 8KB)
 * @returns {string} Base64 encoded string
 */
export const arrayBufferToBase64 = (buffer, chunkSize = 8192) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  
  // Process file in chunks to avoid stack overflow with large files
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode.apply(null, chunk);
  }
  
  return btoa(binary);
};

/**
 * Convert Base64 string to Blob
 * Useful for downloading files
 * 
 * @param {string} base64 - Base64 encoded string
 * @param {string} contentType - MIME type of the file
 * @returns {Blob} Blob object
 */
export const base64ToBlob = (base64, contentType = 'application/octet-stream') => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: contentType });
};

/**
 * Format file size in human-readable format
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
};
