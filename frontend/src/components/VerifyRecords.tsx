import React, { useState, useCallback } from 'react';
import { ResearchRecord } from '../types';
import FormattingUtils from '../utils/formatting';
import AptosService from '../utils/aptos';

interface VerifyRecordsProps {
  onSearch: (address: string) => Promise<ResearchRecord | null>;
  isLoading: boolean;
  error: string | null;
}

const VerifyRecords: React.FC<VerifyRecordsProps> = ({
  onSearch,
  isLoading,
  error
}) => {
  const [searchAddress, setSearchAddress] = useState('');
  const [searchResult, setSearchResult] = useState<ResearchRecord | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [validationError, setValidationError] = useState('');

  const validateAddress = (address: string): boolean => {
    if (!address.trim()) {
      setValidationError('Please enter an address');
      return false;
    }

    if (!AptosService.isValidAddress(address)) {
      setValidationError('Invalid address format. Address should be 66 characters long and start with 0x');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleSearch = useCallback(async () => {
    if (!validateAddress(searchAddress)) {
      return;
    }

    try {
      const result = await onSearch(searchAddress);
      setSearchResult(result);

      // Add to search history if not already present
      if (result && !searchHistory.includes(searchAddress)) {
        setSearchHistory(prev => [searchAddress, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      setSearchResult(null);
    }
  }, [searchAddress, onSearch, searchHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // In a real app, you'd show a toast notification here
      console.log(`${type} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const clearSearch = () => {
    setSearchAddress('');
    setSearchResult(null);
    setValidationError('');
  };

  return (
    <div className="verify-records">
      <div className="page-header">
        <h1>Verify Research Records</h1>
        <p>
          Search for any researcher's address to verify their timestamped research data 
          and confirm the authenticity of their submissions.
        </p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-card">
          <h2>Search Research Records</h2>
          <p className="search-description">
            Enter a researcher's Aptos address to view their verified research record.
          </p>

          <div className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter researcher address (0x...)"
                className={`search-input ${validationError ? 'error' : ''}`}
                disabled={isLoading}
              />
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchAddress.trim()}
                className="search-button"
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Search
                  </>
                )}
              </button>
              {searchAddress && (
                <button
                  onClick={clearSearch}
                  className="clear-button"
                  disabled={isLoading}
                >
                  ✕
                </button>
              )}
            </div>

            {validationError && (
              <div className="validation-error">
                <span className="error-icon">⚠️</span>
                {validationError}
              </div>
            )}
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="search-history">
              <h3>Recent Searches</h3>
              <div className="history-items">
                {searchHistory.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchAddress(address)}
                    className="history-item"
                    disabled={isLoading}
                  >
                    <span className="history-icon">🕒</span>
                    {FormattingUtils.formatAddress(address)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {error && (
          <div className="error-banner">
            <span className="error-icon">❌</span>
            <div className="error-content">
              <div className="error-title">Search Failed</div>
              <div className="error-text">{error}</div>
            </div>
          </div>
        )}

        {searchResult ? (
          <div className="result-card success">
            <div className="result-header">
              <div className="result-title">
                <span className="success-icon">✅</span>
                Research Record Found
              </div>
              <div className="result-subtitle">
                Verified research data for this address
              </div>
            </div>

            <div className="result-content">
              {/* Researcher Info */}
              <div className="info-section">
                <h3>Researcher Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-label">Address</div>
                    <div className="info-value address-value">
                      <span className="address-text">{searchResult.researcherAddress}</span>
                      <button
                        onClick={() => copyToClipboard(searchResult.researcherAddress, 'Address')}
                        className="copy-button"
                        title="Copy address"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Data */}
              <div className="info-section">
                <h3>Research Data</h3>
                <div className="info-grid">
                  <div className="info-item full-width">
                    <div className="info-label">Description</div>
                    <div className="info-value">
                      <div className="description-text">{searchResult.description}</div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Data Hash</div>
                    <div className="info-value hash-value">
                      <code className="hash-code">{searchResult.dataHash}</code>
                      <button
                        onClick={() => copyToClipboard(searchResult.dataHash, 'Hash')}
                        className="copy-button"
                        title="Copy hash"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Submission Time</div>
                    <div className="info-value">
                      <div className="timestamp-primary">
                        {FormattingUtils.formatTimestamp(searchResult.submissionTime)}
                      </div>
                      <div className="timestamp-relative">
                        {FormattingUtils.formatRelativeTime(searchResult.submissionTime)} 
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-label">Verification Status</div>
                    <div className="info-value">
                      <span className={`status-badge ${searchResult.isVerified ? 'verified' : 'pending'}`}>
                        {searchResult.isVerified ? '✅ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Details */}
              <div className="verification-panel">
                <h3>Blockchain Verification</h3>
                <div className="verification-items">
                  <div className="verification-item">
                    <span className="verification-icon">🛡️</span>
                    <div className="verification-text">
                      <strong>Immutable Record:</strong> This data is permanently stored on the Aptos blockchain
                    </div>
                  </div>
                  <div className="verification-item">
                    <span className="verification-icon">⏰</span>
                    <div className="verification-text">
                      <strong>Timestamp Proof:</strong> Cryptographic evidence of when this research was submitted
                    </div>
                  </div>
                  <div className="verification-item">
                    <span className="verification-icon">🔍</span>
                    <div className="verification-text">
                      <strong>Public Verification:</strong> Anyone can independently verify this record
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="result-actions">
                <button
                  onClick={() => window.open(`https://explorer.aptoslabs.com/account/${searchResult.researcherAddress}?network=testnet`, '_blank')}
                  className="btn btn-outline"
                >
                  <span>🔗</span>
                  View on Explorer
                </button>
                <button
                  onClick={() => {
                    const verificationText = `Research Verification\n\nResearcher: ${searchResult.researcherAddress}\nDescription: ${searchResult.description}\nData Hash: ${searchResult.dataHash}\nTimestamp: ${FormattingUtils.formatTimestamp(searchResult.submissionTime)}\nStatus: ${searchResult.isVerified ? 'Verified' : 'Pending'}`;
                    copyToClipboard(verificationText, 'Verification details');
                  }}
                  className="btn btn-primary"
                >
                  <span>📋</span>
                  Copy Verification
                </button>
              </div>
            </div>
          </div>
        ) : searchAddress && !isLoading && !error ? (
          <div className="result-card not-found">
            <div className="result-header">
              <div className="result-title">
                <span className="not-found-icon">❌</span>
                No Record Found
              </div>
              <div className="result-subtitle">
                No research record exists for this address
              </div>
            </div>
            <div className="not-found-content">
              <p>
                The address <code>{FormattingUtils.formatAddress(searchAddress)}</code> has not 
                submitted any research data for timestamping.
              </p>
              <div className="suggestions">
                <h4>Suggestions:</h4>
                <ul>
                  <li>Double-check the address format</li>
                  <li>Ensure the researcher has submitted data</li>
                  <li>Try searching for a different address</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .verify-records {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .page-header p {
          font-size: 1.125rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .search-section {
          margin-bottom: 3rem;
        }

        .search-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .search-card h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .search-description {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .search-input-group {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.875rem 1rem;
          border: 2px solid #d1d5db;
          border-radius: 0.5rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-input.error {
          border-color: #ef4444;
        }

        .search-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .search-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .search-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .clear-button:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .validation-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ef4444;
          font-size: 0.875rem;
        }

        .search-history {
          margin-top: 1.5rem;
        }

        .search-history h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .history-items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          color: #475569;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .history-item:hover:not(:disabled) {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .result-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .result-card.success {
          border-top: 4px solid #10b981;
        }

        .result-card.not-found {
          border-top: 4px solid #ef4444;
        }

        .result-header {
          padding: 2rem 2rem 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .result-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .result-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .success-icon {
          font-size: 1.75rem;
        }

        .not-found-icon {
          font-size: 1.75rem;
        }

        .result-content {
          padding: 2rem;
        }

        .info-section {
          margin-bottom: 2rem;
        }

        .info-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .info-value {
          color: #1f2937;
        }

        .address-value, .hash-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .address-text {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          word-break: break-all;
        }

        .hash-code {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.75rem;
          background: #f3f4f6;
          padding: 0.375rem 0.5rem;
          border-radius: 0.25rem;
          word-break: break-all;
          flex: 1;
        }

        .copy-button {
          background: #f3f4f6;
          border: none;
          border-radius: 0.25rem;
          padding: 0.375rem 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .copy-button:hover {
          background: #e5e7eb;
        }

        .description-text {
          line-height: 1.6;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          border-left: 4px solid #3b82f6;
        }

        .timestamp-primary {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .timestamp-relative {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-badge.verified {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .verification-panel {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .verification-panel h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .verification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .verification-item:last-child {
          margin-bottom: 0;
        }

        .verification-icon {
          font-size: 1.25rem;
          margin-top: 0.125rem;
        }

        .verification-text {
          color: #374151;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .result-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-outline {
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover {
          background: #f9fafb;
        }

        .not-found-content {
          padding: 2rem;
          text-align: center;
        }

        .not-found-content p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .not-found-content code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .suggestions {
          text-align: left;
          max-width: 400px;
          margin: 0 auto;
        }

        .suggestions h4 {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .suggestions ul {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .suggestions li {
          margin-bottom: 0.25rem;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 0.75rem;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
        }

        .error-banner .error-icon {
          font-size: 1.25rem;
        }

        .error-banner .error-title {
          font-weight: 600;
          color: #991b1b;
        }

        .error-banner .error-text {
          color: #b91c1c;
          font-size: 0.875rem;
        }

        .loading-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .search-input-group {
            flex-direction: column;
          }

          .history-items {
            flex-direction: column;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .result-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyRecords;