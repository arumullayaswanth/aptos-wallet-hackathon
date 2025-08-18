import { useState, useCallback } from 'react';
import { Account } from '@aptos-labs/ts-sdk';
import { ResearchRecord, TransactionResponse } from '../types';
import AptosService from '../utils/aptos';
import CryptoUtils from '../utils/crypto';

export interface UseContractReturn {
  submitResearch: (
    account: Account,
    description: string,
    dataHash: string
  ) => Promise<TransactionResponse | null>;

  getResearchRecord: (
    address: string
  ) => Promise<ResearchRecord | null>;

  getTotalSubmissions: () => Promise<number>;

  isLoading: boolean;
  error: string | null;
  lastTransaction: TransactionResponse | null;
}

export const useContract = (
  aptosService: AptosService,
  moduleAddress: string
): UseContractReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<TransactionResponse | null>(null);

  const submitResearch = useCallback(async (
    account: Account,
    description: string,
    dataHash: string
  ): Promise<TransactionResponse | null> => {
    if (!account) {
      setError('No account provided');
      return null;
    }

    if (!description.trim()) {
      setError('Description is required');
      return null;
    }

    if (!CryptoUtils.isValidHash(dataHash)) {
      setError('Invalid data hash format');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await aptosService.timestampResearch(
        account,
        dataHash,
        description,
        moduleAddress
      );

      setLastTransaction(response);

      if (response.success) {
        setError(null);
        return response;
      } else {
        setError(`Transaction failed: ${response.vmStatus}`);
        return null;
      }
    } catch (error: any) {
      console.error('Error submitting research:', error);

      // Parse specific error messages
      if (error.message?.includes('RESEARCH_ALREADY_EXISTS')) {
        setError('You have already submitted research data. Each researcher can only submit once.');
      } else if (error.message?.includes('INVALID_DATA_HASH')) {
        setError('The provided data hash is invalid.');
      } else if (error.message?.includes('insufficient funds')) {
        setError('Insufficient funds to complete the transaction. Please fund your account.');
      } else {
        setError(error.message || 'Failed to submit research');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [aptosService, moduleAddress]);

  const getResearchRecord = useCallback(async (
    address: string
  ): Promise<ResearchRecord | null> => {
    if (!AptosService.isValidAddress(address)) {
      setError('Invalid address format');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const record = await aptosService.getResearchRecord(address, moduleAddress);
      setError(null);
      return record;
    } catch (error: any) {
      console.error('Error getting research record:', error);

      if (error.message?.includes('RESEARCH_NOT_FOUND')) {
        setError('No research record found for this address');
      } else {
        setError(error.message || 'Failed to retrieve research record');
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [aptosService, moduleAddress]);

  const getTotalSubmissions = useCallback(async (): Promise<number> => {
    setIsLoading(true);
    setError(null);

    try {
      const total = await aptosService.getTotalSubmissions(moduleAddress);
      setError(null);
      return total;
    } catch (error: any) {
      console.error('Error getting total submissions:', error);
      setError(error.message || 'Failed to get total submissions');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [aptosService, moduleAddress]);

  return {
    submitResearch,
    getResearchRecord,
    getTotalSubmissions,
    isLoading,
    error,
    lastTransaction
  };
};

export default useContract;