import { useState, useCallback, useEffect } from 'react';
import { ResearchRecord, FileUploadState, SubmissionForm, Statistics } from '../types';
import CryptoUtils from '../utils/crypto';

export interface UseResearchDataReturn {
  // File upload state
  fileUpload: FileUploadState;
  uploadFile: (file: File) => Promise<void>;
  clearFile: () => void;

  // Form management
  form: SubmissionForm;
  updateForm: (updates: Partial<SubmissionForm>) => void;
  resetForm: () => void;
  validateForm: () => string[];

  // Research records management
  records: ResearchRecord[];
  addRecord: (record: ResearchRecord) => void;
  updateRecord: (id: string, updates: Partial<ResearchRecord>) => void;
  removeRecord: (id: string) => void;
  getRecord: (id: string) => ResearchRecord | undefined;

  // Statistics
  statistics: Statistics;
  updateStatistics: (stats: Partial<Statistics>) => void;

  // Loading and error states
  isProcessing: boolean;
  error: string | null;
}

const initialForm: SubmissionForm = {
  description: '',
  dataHash: '',
  file: undefined
};

const initialFileUpload: FileUploadState = {
  file: null,
  uploading: false,
  progress: 0,
  hash: null,
  error: null
};

const initialStatistics: Statistics = {
  totalSubmissions: 0,
  verifiedSubmissions: 0,
  activeResearchers: 0,
  averageVerificationTime: '0 hours'
};

export const useResearchData = (): UseResearchDataReturn => {
  const [fileUpload, setFileUpload] = useState<FileUploadState>(initialFileUpload);
  const [form, setForm] = useState<SubmissionForm>(initialForm);
  const [records, setRecords] = useState<ResearchRecord[]>([]);
  const [statistics, setStatistics] = useState<Statistics>(initialStatistics);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem('research-records');
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }

      const savedStats = localStorage.getItem('research-statistics');
      if (savedStats) {
        setStatistics(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save records to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('research-records', JSON.stringify(records));
    } catch (error) {
      console.error('Error saving records:', error);
    }
  }, [records]);

  // Save statistics to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('research-statistics', JSON.stringify(statistics));
    } catch (error) {
      console.error('Error saving statistics:', error);
    }
  }, [statistics]);

  const uploadFile = useCallback(async (file: File): Promise<void> => {
    setFileUpload({
      file,
      uploading: true,
      progress: 0,
      hash: null,
      error: null
    });

    setError(null);
    setIsProcessing(true);

    try {
      // Validate file
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        throw new Error('File size exceeds 100MB limit');
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setFileUpload(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 100);

      // Generate hash
      const hash = await CryptoUtils.hashFile(file);

      clearInterval(progressInterval);

      setFileUpload({
        file,
        uploading: false,
        progress: 100,
        hash,
        error: null
      });

      // Update form with file and hash
      setForm(prev => ({
        ...prev,
        file,
        dataHash: hash
      }));

    } catch (error: any) {
      console.error('Error uploading file:', error);
      setFileUpload({
        file,
        uploading: false,
        progress: 0,
        hash: null,
        error: error.message
      });
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearFile = useCallback(() => {
    setFileUpload(initialFileUpload);
    setForm(prev => ({
      ...prev,
      file: undefined,
      dataHash: ''
    }));
  }, []);

  const updateForm = useCallback((updates: Partial<SubmissionForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setFileUpload(initialFileUpload);
    setError(null);
  }, []);

  const validateForm = useCallback((): string[] => {
    const errors: string[] = [];

    if (!form.description.trim()) {
      errors.push('Description is required');
    } else if (form.description.length < 10) {
      errors.push('Description must be at least 10 characters long');
    } else if (form.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    if (!form.dataHash) {
      errors.push('Data hash is required');
    } else if (!CryptoUtils.isValidHash(form.dataHash)) {
      errors.push('Invalid data hash format');
    }

    return errors;
  }, [form]);

  const addRecord = useCallback((record: ResearchRecord) => {
    setRecords(prev => {
      const exists = prev.find(r => r.id === record.id);
      if (exists) {
        return prev.map(r => r.id === record.id ? record : r);
      }
      return [...prev, record];
    });

    // Update statistics
    setStatistics(prev => ({
      ...prev,
      totalSubmissions: prev.totalSubmissions + 1,
      verifiedSubmissions: record.isVerified 
        ? prev.verifiedSubmissions + 1 
        : prev.verifiedSubmissions
    }));
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<ResearchRecord>) => {
    setRecords(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, ...updates }
          : record
      )
    );
  }, []);

  const removeRecord = useCallback((id: string) => {
    setRecords(prev => {
      const recordToRemove = prev.find(r => r.id === id);
      if (recordToRemove) {
        // Update statistics
        setStatistics(prevStats => ({
          ...prevStats,
          totalSubmissions: Math.max(0, prevStats.totalSubmissions - 1),
          verifiedSubmissions: recordToRemove.isVerified 
            ? Math.max(0, prevStats.verifiedSubmissions - 1)
            : prevStats.verifiedSubmissions
        }));
      }
      return prev.filter(record => record.id !== id);
    });
  }, []);

  const getRecord = useCallback((id: string): ResearchRecord | undefined => {
    return records.find(record => record.id === id);
  }, [records]);

  const updateStatistics = useCallback((stats: Partial<Statistics>) => {
    setStatistics(prev => ({ ...prev, ...stats }));
  }, []);

  return {
    fileUpload,
    uploadFile,
    clearFile,
    form,
    updateForm,
    resetForm,
    validateForm,
    records,
    addRecord,
    updateRecord,
    removeRecord,
    getRecord,
    statistics,
    updateStatistics,
    isProcessing,
    error
  };
};

export default useResearchData;