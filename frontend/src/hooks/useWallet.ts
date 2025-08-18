import { useState, useEffect, useCallback } from 'react';
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
import { WalletState } from '../types';
import AptosService from '../utils/aptos';

export interface UseWalletReturn {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
  error: string | null;
  fundAccount: () => Promise<boolean>;
}

export const useWallet = (aptosService: AptosService): UseWalletReturn => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    network: 'testnet'
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem('wallet-connection');
    if (savedWallet) {
      try {
        const walletData = JSON.parse(savedWallet);
        if (walletData.address) {
          // Attempt to restore connection
          restoreConnection(walletData.address, walletData.privateKey);
        }
      } catch (error) {
        console.error('Error restoring wallet connection:', error);
        localStorage.removeItem('wallet-connection');
      }
    }
  }, []);

  const restoreConnection = async (address: string, privateKey?: string) => {
    try {
      setIsConnecting(true);

      if (privateKey) {
        const key = new Ed25519PrivateKey(privateKey);
        const restoredAccount = Account.fromPrivateKey({ privateKey: key });
        setAccount(restoredAccount);
      }

      const balance = await aptosService.getAccountBalance(address);

      setWallet({
        connected: true,
        address,
        balance,
        network: 'testnet'
      });

      setError(null);
    } catch (error) {
      console.error('Error restoring wallet:', error);
      setError('Failed to restore wallet connection');
      localStorage.removeItem('wallet-connection');
    } finally {
      setIsConnecting(false);
    }
  };

  const connect = useCallback(async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);

    try {
      // For demo purposes, we'll create a new account or use an existing one
      // In a real app, this would integrate with wallet extensions

      let walletAccount: Account;
      let privateKey: string;

      // Check if we have a saved account
      const savedAccount = localStorage.getItem('demo-account');
      if (savedAccount) {
        const accountData = JSON.parse(savedAccount);
        const key = new Ed25519PrivateKey(accountData.privateKey);
        walletAccount = Account.fromPrivateKey({ privateKey: key });
        privateKey = accountData.privateKey;
      } else {
        // Create new account for demo
        walletAccount = Account.generate();
        privateKey = walletAccount.privateKey.toString();

        // Save for future use
        localStorage.setItem('demo-account', JSON.stringify({
          address: walletAccount.accountAddress.toString(),
          privateKey: privateKey
        }));
      }

      setAccount(walletAccount);
      const address = walletAccount.accountAddress.toString();

      // Get balance
      const balance = await aptosService.getAccountBalance(address);

      const newWallet: WalletState = {
        connected: true,
        address,
        balance,
        network: 'testnet'
      };

      setWallet(newWallet);

      // Save connection info
      localStorage.setItem('wallet-connection', JSON.stringify({
        address,
        privateKey
      }));

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [aptosService]);

  const disconnect = useCallback(async (): Promise<void> => {
    setWallet({
      connected: false,
      address: null,
      balance: 0,
      network: 'testnet'
    });

    setAccount(null);
    setError(null);

    // Clear saved connection
    localStorage.removeItem('wallet-connection');
  }, []);

  const fundAccount = useCallback(async (): Promise<boolean> => {
    if (!wallet.address) {
      setError('No wallet connected');
      return false;
    }

    try {
      const success = await aptosService.fundAccount(wallet.address);

      if (success) {
        // Refresh balance
        const newBalance = await aptosService.getAccountBalance(wallet.address);
        setWallet(prev => ({
          ...prev,
          balance: newBalance
        }));
        setError(null);
      } else {
        setError('Failed to fund account');
      }

      return success;
    } catch (error) {
      console.error('Error funding account:', error);
      setError('Failed to fund account');
      return false;
    }
  }, [wallet.address, aptosService]);

  // Refresh balance periodically when connected
  useEffect(() => {
    if (!wallet.connected || !wallet.address) return;

    const refreshBalance = async () => {
      try {
        const balance = await aptosService.getAccountBalance(wallet.address!);
        setWallet(prev => ({
          ...prev,
          balance
        }));
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
    };

    // Refresh every 30 seconds
    const interval = setInterval(refreshBalance, 30000);
    return () => clearInterval(interval);
  }, [wallet.connected, wallet.address, aptosService]);

  return {
    wallet,
    connect,
    disconnect,
    isConnecting,
    error,
    fundAccount
  };
};

export default useWallet;