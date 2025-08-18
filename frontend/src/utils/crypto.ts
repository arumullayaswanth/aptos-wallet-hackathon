import { sha256 } from 'crypto-js';

export class CryptoUtils {
  /**
   * Calculate SHA-256 hash of a file
   */
  static async hashFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const wordArray = sha256(arrayBuffer.toString());
          const hash = '0x' + wordArray.toString();
          resolve(hash);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Calculate SHA-256 hash of a string
   */
  static hashString(input: string): string {
    const hash = sha256(input);
    return '0x' + hash.toString();
  }

  /**
   * Calculate SHA-256 hash of binary data
   */
  static hashBytes(data: Uint8Array): string {
    const hash = sha256(data.toString());
    return '0x' + hash.toString();
  }

  /**
   * Generate a random salt for hashing
   */
  static generateSalt(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate if a string is a valid hash
   */
  static isValidHash(hash: string): boolean {
    // Check if it's a valid 64-character hex string with 0x prefix
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }

  /**
   * Generate a content hash from file metadata and content
   */
  static async generateContentHash(file: File, metadata?: any): Promise<{
    contentHash: string;
    metadataHash: string;
    combinedHash: string;
  }> {
    const contentHash = await this.hashFile(file);

    const fileMetadata = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      ...metadata
    };

    const metadataHash = this.hashString(JSON.stringify(fileMetadata));
    const combinedHash = this.hashString(contentHash + metadataHash);

    return {
      contentHash,
      metadataHash,
      combinedHash
    };
  }

  /**
   * Verify file integrity by comparing hashes
   */
  static async verifyFileIntegrity(
    file: File,
    expectedHash: string,
    includeMetadata: boolean = false
  ): Promise<boolean> {
    try {
      let actualHash: string;

      if (includeMetadata) {
        const hashes = await this.generateContentHash(file);
        actualHash = hashes.combinedHash;
      } else {
        actualHash = await this.hashFile(file);
      }

      return actualHash.toLowerCase() === expectedHash.toLowerCase();
    } catch (error) {
      console.error('Error verifying file integrity:', error);
      return false;
    }
  }

  /**
   * Create a deterministic hash from multiple inputs
   */
  static createDeterministicHash(...inputs: string[]): string {
    const combined = inputs.sort().join('|'); // Sort to ensure deterministic order
    return this.hashString(combined);
  }

  /**
   * Generate a time-based hash with timestamp
   */
  static generateTimebasedHash(data: string, timestamp?: number): string {
    const ts = timestamp || Date.now();
    const combined = `${data}|${ts}`;
    return this.hashString(combined);
  }

  /**
   * Extract file information for hashing
   */
  static getFileInfo(file: File): {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    extension: string;
  } {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      extension
    };
  }

  /**
   * Create a research data fingerprint
   */
  static async createResearchFingerprint(
    file: File,
    description: string,
    researcher: string,
    timestamp?: number
  ): Promise<{
    fileHash: string;
    metadataHash: string;
    researcherHash: string;
    timestampHash: string;
    fingerprint: string;
  }> {
    const fileHash = await this.hashFile(file);
    const metadataHash = this.hashString(description);
    const researcherHash = this.hashString(researcher);
    const timestampHash = this.hashString((timestamp || Date.now()).toString());

    const fingerprint = this.createDeterministicHash(
      fileHash,
      metadataHash,
      researcherHash,
      timestampHash
    );

    return {
      fileHash,
      metadataHash,
      researcherHash,
      timestampHash,
      fingerprint
    };
  }

  /**
   * Utility to convert string to bytes for blockchain
   */
  static stringToBytes(str: string): number[] {
    return Array.from(new TextEncoder().encode(str));
  }

  /**
   * Utility to convert bytes to string
   */
  static bytesToString(bytes: number[]): string {
    return new TextDecoder().decode(new Uint8Array(bytes));
  }

  /**
   * Format hash for display
   */
  static formatHash(hash: string, chars: number = 16): string {
    if (!hash) return '';
    if (hash.length <= chars) return hash;

    return `${hash.slice(0, chars)}...${hash.slice(-8)}`;
  }
}

export default CryptoUtils;