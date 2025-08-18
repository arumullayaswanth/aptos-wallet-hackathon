export class FormattingUtils {
  /**
   * Format timestamp to human readable date
   */
  static formatTimestamp(timestamp: number, includeTime: boolean = true): string {
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.second = '2-digit';
    }

    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Format timestamp to relative time (e.g., "2 hours ago")
   */
  static formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - (timestamp * 1000);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;

    return 'Just now';
  }

  /**
   * Format file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${size.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
  }

  /**
   * Format Aptos address for display
   */
  static formatAddress(
    address: string,
    startChars: number = 6,
    endChars: number = 4
  ): string {
    if (!address) return '';
    if (address.length <= startChars + endChars) return address;

    return `${address.slice(0, startChars + 2)}...${address.slice(-endChars)}`;
  }

  /**
   * Format transaction hash for display
   */
  static formatTxHash(hash: string, chars: number = 12): string {
    if (!hash) return '';
    if (hash.length <= chars * 2) return hash;

    return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
  }

  /**
   * Format APT balance with proper decimal places
   */
  static formatAptBalance(balance: number): string {
    if (balance === 0) return '0 APT';
    if (balance < 0.000001) return '<0.000001 APT';
    if (balance < 1) return `${balance.toFixed(6)} APT`;
    if (balance < 1000) return `${balance.toFixed(3)} APT`;

    return `${balance.toLocaleString('en-US', { maximumFractionDigits: 2 })} APT`;
  }

  /**
   * Format percentage with appropriate decimal places
   */
  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Format large numbers with appropriate suffixes
   */
  static formatNumber(num: number): string {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Truncate text with ellipsis
   */
  static truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength - 3) + '...';
  }

  /**
   * Format research category for display
   */
  static formatResearchCategory(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Format verification status with appropriate styling
   */
  static formatVerificationStatus(isVerified: boolean): {
    text: string;
    className: string;
    color: string;
  } {
    if (isVerified) {
      return {
        text: 'Verified',
        className: 'status-verified',
        color: '#22c55e'
      };
    } else {
      return {
        text: 'Pending',
        className: 'status-pending',
        color: '#f59e0b'
      };
    }
  }

  /**
   * Format duration in a human readable way
   */
  static formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  /**
   * Format gas used in transaction
   */
  static formatGasUsed(gasUsed: string | number): string {
    const gas = typeof gasUsed === 'string' ? parseInt(gasUsed) : gasUsed;
    return this.formatNumber(gas) + ' gas';
  }

  /**
   * Validate and format email address
   */
  static formatEmail(email: string): string | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return null;
    return email.toLowerCase().trim();
  }

  /**
   * Format ORCID ID
   */
  static formatOrcidId(orcid: string): string | null {
    const cleanOrcid = orcid.replace(/[^\dX]/g, '');
    if (cleanOrcid.length !== 16) return null;

    return `${cleanOrcid.slice(0, 4)}-${cleanOrcid.slice(4, 8)}-${cleanOrcid.slice(8, 12)}-${cleanOrcid.slice(12, 16)}`;
  }

  /**
   * Format JSON data for display
   */
  static formatJson(data: any, indent: number = 2): string {
    try {
      return JSON.stringify(data, null, indent);
    } catch (error) {
      return 'Invalid JSON data';
    }
  }

  /**
   * Generate a color from string (for consistent avatar colors)
   */
  static stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
  }

  /**
   * Format search query for display
   */
  static formatSearchQuery(query: string): string {
    return query.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  /**
   * Format URL for display (remove protocol, truncate domain)
   */
  static formatUrl(url: string, maxLength: number = 50): string {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const path = urlObj.pathname;

      let formatted = domain + path;

      if (formatted.length > maxLength) {
        formatted = formatted.slice(0, maxLength - 3) + '...';
      }

      return formatted;
    } catch {
      return this.truncateText(url, maxLength);
    }
  }

  /**
   * Format error messages for user display
   */
  static formatErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.toString) return error.toString();
    return 'An unexpected error occurred';
  }
}

export default FormattingUtils;