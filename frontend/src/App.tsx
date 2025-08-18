import React, { useState, useEffect } from 'react';
import { Account } from '@aptos-labs/ts-sdk';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SubmitResearch from './components/SubmitResearch';
import VerifyRecords from './components/VerifyRecords';
import WalletConnection from './components/WalletConnection';
import { ViewType } from './types';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { useResearchData } from './hooks/useResearchData';
import AptosService from './utils/aptos';

const APTOS_CONFIG = {
  nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
  faucetUrl: 'https://faucet.testnet.aptoslabs.com',
  network: 'testnet' as const
};

const MODULE_ADDRESS = process.env.VITE_MODULE_ADDRESS || '0x1';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [aptosService] = useState(() => new AptosService(APTOS_CONFIG));

  const wallet = useWallet(aptosService);
  const contract = useContract(aptosService, MODULE_ADDRESS);
  const researchData = useResearchData();

  // Load statistics on mount
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const total = await contract.getTotalSubmissions();
        researchData.updateStatistics({
          totalSubmissions: total,
          activeResearchers: researchData.records.length,
          verifiedSubmissions: researchData.records.filter(r => r.isVerified).length
        });
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    };

    loadStatistics();
  }, []);

  const handleSubmitResearch = async (
    account: Account, 
    description: string, 
    dataHash: string
  ): Promise<boolean> => {
    const response = await contract.submitResearch(account, description, dataHash);

    if (response?.success) {
      // Add to local records
      const newRecord = {
        id: wallet.wallet.address || '',
        researcherAddress: wallet.wallet.address || '',
        dataHash,
        submissionTime: Math.floor(Date.now() / 1000),
        description,
        isVerified: false
      };

      researchData.addRecord(newRecord);
      return true;
    }

    return false;
  };

  const handleVerifyRecord = async (address: string) => {
    return await contract.getResearchRecord(address);
  };

  const handleRefreshDashboard = async () => {
    const total = await contract.getTotalSubmissions();
    researchData.updateStatistics({
      totalSubmissions: total
    });
  };

  const renderCurrentView = () => {
    if (!wallet.wallet.connected && (currentView === 'submit' || currentView === 'profile')) {
      return <WalletConnection {...wallet} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            statistics={researchData.statistics}
            recentRecords={researchData.records.slice(0, 10)}
            onRefresh={handleRefreshDashboard}
            isLoading={contract.isLoading}
          />
        );

      case 'submit':
        return (
          <SubmitResearch
            wallet={wallet.wallet}
            form={researchData.form}
            fileUpload={researchData.fileUpload}
            isProcessing={researchData.isProcessing}
            isSubmitting={contract.isLoading}
            error={contract.error || researchData.error}
            onFormUpdate={researchData.updateForm}
            onFileUpload={researchData.uploadFile}
            onSubmit={handleSubmitResearch}
            onClearFile={researchData.clearFile}
            onReset={researchData.resetForm}
          />
        );

      case 'verify':
        return (
          <VerifyRecords
            onSearch={handleVerifyRecord}
            isLoading={contract.isLoading}
            error={contract.error}
          />
        );

      case 'profile':
        const userRecord = researchData.records.find(r => r.researcherAddress === wallet.wallet.address);
        return userRecord ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Your Research Record</h1>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '1rem', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              margin: '2rem auto'
            }}>
              <h2>{userRecord.description}</h2>
              <p><strong>Hash:</strong> <code>{userRecord.dataHash}</code></p>
              <p><strong>Submitted:</strong> {new Date(userRecord.submissionTime * 1000).toLocaleString()}</p>
              <p><strong>Status:</strong> {userRecord.isVerified ? '✅ Verified' : '⏳ Pending'}</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>No Research Records</h1>
            <p>You haven't submitted any research data yet.</p>
            <button 
              onClick={() => setCurrentView('submit')}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Submit Research Data
            </button>
          </div>
        );

      default:
        return <Dashboard statistics={researchData.statistics} recentRecords={researchData.records} onRefresh={handleRefreshDashboard} isLoading={false} />;
    }
  };

  return (
    <div className="app">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        wallet={wallet.wallet}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
        isConnecting={wallet.isConnecting}
      />

      <main className="main-content">
        {renderCurrentView()}
      </main>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #f8fafc;
          color: #1f2937;
          line-height: 1.6;
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding: 0 1rem;
        }
      `}</style>
    </div>
  );
};

export default App;