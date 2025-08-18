import React, { useState, useCallback } from 'react';
import { Account } from '@aptos-labs/ts-sdk';
import { SubmissionForm, FileUploadState, WalletState } from '../types';
import FormattingUtils from '../utils/formatting';

interface SubmitResearchProps {
  wallet: WalletState;
  form: SubmissionForm;
  fileUpload: FileUploadState;
  isProcessing: boolean;
  isSubmitting: boolean;
  error: string | null;
  onFormUpdate: (updates: Partial<SubmissionForm>) => void;
  onFileUpload: (file: File) => Promise<void>;
  onSubmit: (account: Account, description: string, dataHash: string) => Promise<boolean>;
  onClearFile: () => void;
  onReset: () => void;
}

const SubmitResearch: React.FC<SubmitResearchProps> = ({
  wallet,
  form,
  fileUpload,
  isProcessing,
  isSubmitting,
  error,
  onFormUpdate,
  onFileUpload,
  onSubmit,
  onClearFile,
  onReset
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  }, [onFileUpload]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!form.description.trim()) {
      errors.push('Description is required');
    } else if (form.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!form.dataHash) {
      errors.push('Data hash is required');
    }

    if (!wallet.connected) {
      errors.push('Please connect your wallet to submit research');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Mock account for demo (in real app, this would come from wallet)
    const mockAccount = { 
      accountAddress: { toString: () => wallet.address } 
    } as Account;

    const success = await onSubmit(mockAccount, form.description, form.dataHash);

    if (success) {
      onReset();
      setValidationErrors([]);
    }
  };

  const isFormValid = form.description.trim().length >= 10 && form.dataHash && wallet.connected;

  return (
    <div className="submit-research">
      <div className="page-header">
        <h1>Submit Research Data</h1>
        <p>
          Timestamp your research data on the Aptos blockchain to establish 
          immutable proof of when your work was conducted.
        </p>
      </div>

      {!wallet.connected && (
        <div className="warning-banner">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <div className="warning-title">Wallet Not Connected</div>
            <div className="warning-text">
              You need to connect your wallet to submit research data.
            </div>
          </div>
        </div>
      )}

      <div className="submit-form-container">
        <form onSubmit={handleSubmit} className="submit-form">
          {/* File Upload Section */}
          <div className="form-section">
            <h2>Research Data File</h2>
            <p className="section-description">
              Upload your research file to generate a cryptographic hash for blockchain verification.
            </p>

            <div 
              className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${fileUpload.file ? 'has-file' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {fileUpload.file ? (
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <div className="file-name">{fileUpload.file.name}</div>
                    <div className="file-meta">
                      {FormattingUtils.formatFileSize(fileUpload.file.size)} • 
                      {fileUpload.file.type || 'Unknown type'}
                    </div>
                    {fileUpload.uploading && (
                      <div className="upload-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${fileUpload.progress}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">{fileUpload.progress}%</div>
                      </div>
                    )}
                    {fileUpload.hash && (
                      <div className="file-hash">
                        <strong>Hash:</strong> 
                        <code>{FormattingUtils.formatTxHash(fileUpload.hash, 16)}</code>
                      </div>
                    )}
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline"
                    onClick={onClearFile}
                    disabled={fileUpload.uploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="upload-prompt">
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    <strong>Click to upload</strong> or drag and drop your research file
                  </div>
                  <div className="upload-hint">
                    Supports any file type • Max 100MB
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                    disabled={isProcessing}
                  />
                </div>
              )}
            </div>

            {fileUpload.error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {fileUpload.error}
              </div>
            )}
          </div>

          {/* Manual Hash Input */}
          <div className="form-section">
            <h2>Data Hash</h2>
            <p className="section-description">
              The cryptographic hash of your research data. This will be automatically 
              generated from your uploaded file, or you can enter it manually.
            </p>

            <div className="input-group">
              <input
                type="text"
                value={form.dataHash}
                onChange={(e) => onFormUpdate({ dataHash: e.target.value })}
                placeholder="0x1234567890abcdef..."
                className="hash-input"
                disabled={isProcessing}
              />
              {form.dataHash && (
                <div className="input-validation">
                  {form.dataHash.match(/^0x[a-fA-F0-9]{64}$/) ? (
                    <span className="validation-success">✅ Valid hash format</span>
                  ) : (
                    <span className="validation-error">❌ Invalid hash format</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <h2>Research Description</h2>
            <p className="section-description">
              Provide a detailed description of your research. This will be stored 
              on the blockchain along with the timestamp.
            </p>

            <div className="textarea-group">
              <textarea
                value={form.description}
                onChange={(e) => onFormUpdate({ description: e.target.value })}
                placeholder="Describe your research project, methodology, key findings, or experimental procedures..."
                className="description-textarea"
                rows={6}
                maxLength={500}
                disabled={isProcessing}
              />
              <div className="character-count">
                {form.description.length}/500 characters
              </div>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <div className="error-title">Please fix the following errors:</div>
              <ul className="error-list">
                {validationErrors.map((error, index) => (
                  <li key={index} className="error-item">
                    <span className="error-bullet">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Global Error */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">❌</span>
              <div className="error-content">
                <div className="error-title">Submission Failed</div>
                <div className="error-text">{error}</div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onReset}
              disabled={isProcessing || isSubmitting}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isFormValid || isProcessing || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Submitting to Blockchain...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Submit Research
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Panel */}
        <div className="info-panel">
          <h3>How It Works</h3>

          <div className="info-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-title">Upload File</div>
                <div className="step-text">
                  Upload your research file to generate a cryptographic hash
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-title">Add Description</div>
                <div className="step-text">
                  Provide details about your research and methodology
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-title">Submit to Blockchain</div>
                <div className="step-text">
                  Create an immutable timestamp record on Aptos blockchain
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <div className="step-title">Get Proof</div>
                <div className="step-text">
                  Receive cryptographic proof of your research timing
                </div>
              </div>
            </div>
          </div>

          <div className="info-benefits">
            <h4>Benefits</h4>
            <ul className="benefits-list">
              <li>✅ Immutable proof of research timing</li>
              <li>✅ Protection of intellectual property</li>
              <li>✅ Transparent verification process</li>
              <li>✅ Global accessibility and trust</li>
            </ul>
          </div>

          {wallet.connected && (
            <div className="wallet-info">
              <h4>Connected Wallet</h4>
              <div className="wallet-details">
                <div className="wallet-address">
                  {FormattingUtils.formatAddress(wallet.address || '')}
                </div>
                <div className="wallet-balance">
                  Balance: {FormattingUtils.formatAptBalance(wallet.balance)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .submit-research {
          max-width: 1200px;
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

        .warning-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.75rem;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
        }

        .warning-icon {
          font-size: 1.5rem;
        }

        .warning-title {
          font-weight: 600;
          color: #92400e;
        }

        .warning-text {
          color: #b45309;
          font-size: 0.875rem;
        }

        .submit-form-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .submit-form {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .section-description {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .file-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 0.75rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.2s;
          position: relative;
          cursor: pointer;
        }

        .file-upload-area:hover {
          border-color: #3b82f6;
          background: #f8fafc;
        }

        .file-upload-area.drag-active {
          border-color: #3b82f6;
          background: #dbeafe;
        }

        .file-upload-area.has-file {
          border-color: #10b981;
          background: #ecfdf5;
        }

        .file-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-prompt {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-text {
          font-size: 1.125rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .upload-hint {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-details {
          flex: 1;
        }

        .file-name {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .file-meta {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .upload-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          flex: 1;
          height: 0.5rem;
          background: #e5e7eb;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #3b82f6;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #3b82f6;
          min-width: 3rem;
        }

        .file-hash {
          font-size: 0.875rem;
          padding: 0.5rem;
          background: #f3f4f6;
          border-radius: 0.375rem;
          word-break: break-all;
        }

        .file-hash code {
          font-family: 'Monaco', 'Menlo', monospace;
          color: #1f2937;
        }

        .input-group, .textarea-group {
          position: relative;
        }

        .hash-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
        }

        .hash-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-validation {
          margin-top: 0.5rem;
          font-size: 0.875rem;
        }

        .validation-success {
          color: #10b981;
        }

        .validation-error {
          color: #ef4444;
        }

        .description-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 0.875rem;
          line-height: 1.5;
          resize: vertical;
        }

        .description-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .character-count {
          text-align: right;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .validation-errors {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .error-title {
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 0.5rem;
        }

        .error-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .error-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: #b91c1c;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .error-bullet {
          color: #ef4444;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
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

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
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
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-outline {
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f9fafb;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .info-panel {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .info-panel h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .info-steps {
          margin-bottom: 2rem;
        }

        .step {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .step-number {
          width: 2rem;
          height: 2rem;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .step-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .step-text {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.4;
        }

        .info-benefits {
          margin-bottom: 2rem;
        }

        .info-benefits h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-list li {
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .wallet-info h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .wallet-details {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .wallet-address {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .wallet-balance {
          font-size: 0.875rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .submit-form-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .file-info {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmitResearch;