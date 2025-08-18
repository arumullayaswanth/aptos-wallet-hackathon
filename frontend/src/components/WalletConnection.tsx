import React from 'react';
import { WalletState } from '../types';
import FormattingUtils from '../utils/formatting';

interface WalletConnectionProps {
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onFund: () => Promise<boolean>;
  isConnecting: boolean;
  error: string | null;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  wallet,
  onConnect,
  onDisconnect,
  onFund,
  isConnecting,
  error
}) => {
  const [isFunding, setIsFunding] = React.useState(false);

  const handleFund = async () => {
    setIsFunding(true);
    try {
      await onFund();
    } finally {
      setIsFunding(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="wallet-connection">
        <div className="connection-card">
          <div className="connection-header">
            <div className="wallet-icon">👛</div>
            <h2>Connect Your Wallet</h2>
            <p>
              Connect your Aptos wallet to interact with the Research Data Timestamping system.
              Your wallet is required to submit research data and manage your records.
            </p>
          </div>

          {error && (
            <div className="error-banner">
              <span className="error-icon">❌</span>
              <div className="error-content">
                <div className="error-title">Connection Failed</div>
                <div className="error-text">{error}</div>
              </div>
            </div>
          )}

          <div className="connection-actions">
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="btn btn-primary btn-large"
            >
              {isConnecting ? (
                <>
                  <span className="loading-spinner"></span>
                  Connecting Wallet...
                </>
              ) : (
                <>
                  <span className="connect-icon">🔗</span>
                  Connect Wallet
                </>
              )}
            </button>
          </div>

          <div className="connection-info">
            <div className="info-section">
              <h3>What happens when you connect?</h3>
              <ul className="info-list">
                <li>
                  <span className="info-icon">🔒</span>
                  Your wallet remains secure and under your control
                </li>
                <li>
                  <span className="info-icon">📝</span>
                  You can submit research data for timestamping
                </li>
                <li>
                  <span className="info-icon">🔍</span>
                  Access to your personal research records
                </li>
                <li>
                  <span className="info-icon">⛽</span>
                  Pay small gas fees for blockchain transactions
                </li>
              </ul>
            </div>

            <div className="supported-wallets">
              <h3>Supported Wallets</h3>
              <div className="wallet-list">
                <div className="wallet-item">
                  <span className="wallet-logo">🟠</span>
                  <span className="wallet-name">Aptos Wallet</span>
                </div>
                <div className="wallet-item">
                  <span className="wallet-logo">🔵</span>
                  <span className="wallet-name">Petra Wallet</span>
                </div>
                <div className="wallet-item">
                  <span className="wallet-logo">⚫</span>
                  <span className="wallet-name">Pontem Wallet</span>
                </div>
                <div className="wallet-item">
                  <span className="wallet-logo">🟢</span>
                  <span className="wallet-name">Martian Wallet</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .wallet-connection {
            max-width: 600px;
            margin: 2rem auto;
            padding: 0 1rem;
          }

          .connection-card {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .connection-header {
            text-align: center;
            padding: 3rem 2rem 2rem;
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          }

          .wallet-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .connection-header h2 {
            font-size: 2rem;
            font-weight: 800;
            color: #1e40af;
            margin-bottom: 1rem;
          }

          .connection-header p {
            color: #1e40af;
            font-size: 1.125rem;
            line-height: 1.6;
            opacity: 0.8;
          }

          .error-banner {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: #fee2e2;
            border: 1px solid #fecaca;
            margin: 1rem 2rem;
            padding: 1rem;
            border-radius: 0.5rem;
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

          .connection-actions {
            padding: 2rem;
            text-align: center;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            border: none;
            border-radius: 0.75rem;
            font-weight: 700;
            font-size: 1.125rem;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
          }

          .btn-primary {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          }

          .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .btn-large {
            padding: 1.25rem 2.5rem;
            font-size: 1.25rem;
          }

          .loading-spinner {
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .connect-icon {
            font-size: 1.375rem;
          }

          .connection-info {
            padding: 2rem;
            border-top: 1px solid #e5e7eb;
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

          .info-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .info-list li {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 1rem;
            padding: 0.75rem;
            background: #f8fafc;
            border-radius: 0.5rem;
          }

          .info-icon {
            font-size: 1.25rem;
            margin-top: 0.125rem;
            flex-shrink: 0;
          }

          .info-list li span:last-child {
            color: #374151;
            line-height: 1.5;
          }

          .supported-wallets h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 1rem;
          }

          .wallet-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .wallet-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            transition: all 0.2s;
          }

          .wallet-item:hover {
            background: #e2e8f0;
            border-color: #cbd5e1;
          }

          .wallet-logo {
            font-size: 1.5rem;
          }

          .wallet-name {
            font-weight: 500;
            color: #374151;
          }

          @media (max-width: 640px) {
            .connection-header {
              padding: 2rem 1rem 1rem;
            }

            .connection-header h2 {
              font-size: 1.75rem;
            }

            .connection-header p {
              font-size: 1rem;
            }

            .connection-actions {
              padding: 1.5rem 1rem;
            }

            .connection-info {
              padding: 1.5rem 1rem;
            }

            .wallet-list {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wallet-connected">
      <div className="wallet-card">
        <div className="wallet-header">
          <div className="status-indicator">
            <span className="status-dot connected"></span>
            <span className="status-text">Wallet Connected</span>
          </div>

          <div className="wallet-details">
            <div className="wallet-address">
              <span className="address-label">Address:</span>
              <code className="address-value">{wallet.address}</code>
            </div>

            <div className="wallet-balance">
              <span className="balance-label">Balance:</span>
              <span className="balance-value">{FormattingUtils.formatAptBalance(wallet.balance)}</span>
            </div>

            <div className="wallet-network">
              <span className="network-label">Network:</span>
              <span className="network-value">
                <span className="network-dot"></span>
                {wallet.network}
              </span>
            </div>
          </div>
        </div>

        <div className="wallet-actions">
          {wallet.balance < 0.01 && (
            <button
              onClick={handleFund}
              disabled={isFunding}
              className="btn btn-secondary"
            >
              {isFunding ? (
                <>
                  <span className="loading-spinner"></span>
                  Funding Account...
                </>
              ) : (
                <>
                  <span>💰</span>
                  Fund Account
                </>
              )}
            </button>
          )}

          <button
            onClick={onDisconnect}
            className="btn btn-outline"
          >
            <span>🔌</span>
            Disconnect
          </button>
        </div>

        {wallet.balance < 0.01 && (
          <div className="low-balance-warning">
            <span className="warning-icon">⚠️</span>
            <div className="warning-content">
              <div className="warning-title">Low Balance</div>
              <div className="warning-text">
                You need APT tokens to submit research data. Click "Fund Account" to get testnet tokens.
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .wallet-connected {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .wallet-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-bottom: 1px solid #e5e7eb;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .status-dot {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
        }

        .status-dot.connected {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
        }

        .status-text {
          font-weight: 600;
          color: #065f46;
        }

        .wallet-details {
          display: grid;
          gap: 0.75rem;
        }

        .wallet-address, .wallet-balance, .wallet-network {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .address-label, .balance-label, .network-label {
          font-weight: 500;
          color: #374151;
        }

        .address-value {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          background: rgba(0, 0, 0, 0.05);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .balance-value {
          font-weight: 600;
          color: #059669;
        }

        .network-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .network-dot {
          width: 0.5rem;
          height: 0.5rem;
          background: #10b981;
          border-radius: 50%;
        }

        .wallet-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
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

        .btn-secondary {
          background: #f59e0b;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #d97706;
        }

        .btn-outline {
          background: transparent;
          color: #6b7280;
          border: 1px solid #d1d5db;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .low-balance-warning {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fef3c7;
          border-top: 1px solid #fbbf24;
          padding: 1rem 1.5rem;
        }

        .warning-icon {
          font-size: 1.25rem;
        }

        .warning-title {
          font-weight: 600;
          color: #92400e;
        }

        .warning-text {
          color: #b45309;
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

        @media (max-width: 640px) {
          .wallet-details {
            gap: 0.5rem;
          }

          .wallet-address, .wallet-balance, .wallet-network {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }

          .wallet-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletConnection;