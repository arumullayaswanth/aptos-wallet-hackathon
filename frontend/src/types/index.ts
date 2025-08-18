export interface ResearchRecord {
  id: string;
  researcherAddress: string;
  dataHash: string;
  submissionTime: number;
  description: string;
  isVerified: boolean;
}

export interface ResearchRegistry {
  records: Record<string, ResearchRecord>;
  totalSubmissions: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
}

export interface SubmissionForm {
  description: string;
  dataHash: string;
  file?: File;
}

export interface Statistics {
  totalSubmissions: number;
  verifiedSubmissions: number;
  activeResearchers: number;
  averageVerificationTime: string;
}

export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ContractConfig {
  moduleAddress: string;
  moduleName: string;
  network: 'testnet' | 'mainnet';
}

export type ViewType = 'dashboard' | 'submit' | 'verify' | 'profile';

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}