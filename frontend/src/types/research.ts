export interface ResearchSubmission {
  id: string;
  researcherAddress: string;
  title: string;
  description: string;
  dataHash: string;
  originalFilename?: string;
  fileSize?: number;
  mimeType?: string;
  submissionTimestamp: number;
  blockTimestamp: number;
  transactionHash: string;
  isVerified: boolean;
  verificationTimestamp?: number;
  tags: string[];
  category: ResearchCategory;
  collaborators?: string[];
  institutionId?: string;
  grantId?: string;
}

export enum ResearchCategory {
  LIFE_SCIENCES = 'life_sciences',
  COMPUTER_SCIENCE = 'computer_science',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  MATHEMATICS = 'mathematics',
  ENGINEERING = 'engineering',
  SOCIAL_SCIENCES = 'social_sciences',
  HUMANITIES = 'humanities',
  INTERDISCIPLINARY = 'interdisciplinary',
  OTHER = 'other'
}

export interface ResearchVerification {
  recordId: string;
  verifierAddress: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verificationTimestamp: number;
  evidenceHash?: string;
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  DISPUTED = 'disputed',
  REJECTED = 'rejected'
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  contactEmail: string;
  website?: string;
  verifiedDomains: string[];
  registrationTimestamp: number;
}

export interface Researcher {
  address: string;
  name?: string;
  email?: string;
  institution?: string;
  orcidId?: string;
  publicKey: string;
  registrationTimestamp: number;
  totalSubmissions: number;
  verifiedSubmissions: number;
  reputation: number;
}

export interface ResearchAnalytics {
  totalSubmissions: number;
  submissionsByCategory: Record<ResearchCategory, number>;
  submissionsByMonth: Array<{
    month: string;
    count: number;
  }>;
  topInstitutions: Array<{
    name: string;
    submissionCount: number;
  }>;
  verificationRate: number;
  averageVerificationTime: number; // in hours
}

export interface SearchFilters {
  category?: ResearchCategory;
  institution?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  verified?: boolean;
  researcher?: string;
  keywords?: string[];
}

export interface FileUploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  hash: string | null;
  error: string | null;
}