import React from 'react';
import { ViewType, WalletState } from '../types';
import FormattingUtils from '../utils/formatting';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  isConnecting: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  wallet,
  onConnect,
  onDisconnect,
  isConnecting
}) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: '📊' },
    { id: 'submit' as ViewType, label: 'Submit Research', icon: '📤' },
    { id: 'verify' as ViewType, label: 'Verify Records', icon: '🔍' },
    { id: 'profile' as ViewType, label: 'My Records', icon: '👤' }
  ];

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <div className="logo-text">
              <h1>Research Data Timestamp Registry</h1>
              <p>Secure Academic Research Verification</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Wallet Section */}
          <div className="wallet-section">
            {wallet.connected ? (
              <div className="wallet-connected">
                <div className="wallet-info">
                  <div className="wallet-address">
                    {FormattingUtils.formatAddress(wallet.address || '')}
                  </div>
                  <div className="wallet-balance">
                    {FormattingUtils.formatAptBalance(wallet.balance)}
                  </div>
                  <div className="wallet-network">
                    <span className="network-indicator"></span>
                    {wallet.network}
                  </div>
                </div>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={onDisconnect}
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={onConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <span className="wallet-icon">👛</span>
                    Connect Wallet
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 2.5rem;
        }

        .logo-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
        }

        .logo-text p {
          font-size: 0.875rem;
          opacity: 0.8;
          margin: 0;
        }

        .nav {
          display: flex;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .nav-icon {
          font-size: 1.1rem;
        }

        .nav-label {
          font-weight: 500;
        }

        .wallet-section {
          display: flex;
          align-items: center;
        }

        .wallet-connected {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .wallet-info {
          text-align: right;
        }

        .wallet-address {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .wallet-balance {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 0.125rem;
        }

        .wallet-network {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 0.125rem;
        }

        .network-indicator {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          backdrop-filter: blur(10px);
        }

        .btn-primary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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

        .wallet-icon {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .logo-text h1 {
            font-size: 1.25rem;
          }

          .nav {
            flex-wrap: wrap;
            justify-content: center;
          }

          .nav-item {
            padding: 0.5rem 0.75rem;
            font-size: 0.8125rem;
          }

          .wallet-info {
            text-align: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;