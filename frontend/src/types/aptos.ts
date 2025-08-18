import { Types } from '@aptos-labs/ts-sdk';

export interface AptosConfig {
  nodeUrl: string;
  faucetUrl: string;
  network: 'testnet' | 'mainnet' | 'devnet';
}

export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  account(): Promise<AccountInfo | null>;
  signAndSubmitTransaction(transaction: Types.TransactionPayload): Promise<Types.PendingTransaction>;
  signMessage(message: string): Promise<string>;
}

export interface AccountInfo {
  address: string;
  publicKey: string;
  authKey: string;
}

export interface TransactionResponse {
  hash: string;
  success: boolean;
  vmStatus?: string;
  gasUsed?: string;
  events?: Array<{
    key: string;
    sequenceNumber: string;
    type: string;
    data: any;
  }>;
}

export interface ModuleFunction {
  functionId: string;
  typeArguments: string[];
  arguments: any[];
}

export interface ViewFunction {
  function: string;
  typeArguments: string[];
  arguments: any[];
}

export interface ResearchEvent {
  version: string;
  key: string;
  sequenceNumber: string;
  type: string;
  data: {
    researcher_address: string;
    data_hash: string;
    submission_time: string;
    description: string;
  };
}

export interface AccountResource {
  type: string;
  data: {
    [key: string]: any;
  };
}

export interface ContractError {
  errorCode: number;
  errorMessage: string;
  vmErrorCode?: number;
}