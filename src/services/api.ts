import axios, { 
  AxiosError, 
  InternalAxiosRequestConfig, 
  AxiosResponse,
  CancelToken
} from 'axios';
import { APIError } from '@/types/api';

// Create a source for cancellation
let cancelTokenSource = axios.CancelToken.source();

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000, // Default timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000, // 1 second
    statusCodes: [408, 429, 500, 502, 503, 504]
  },
  validateStatus: (status: number) => {
    return status >= 200 && status < 300;
  }
};

// Add itinerary specific config
const ITINERARY_CONFIG = {
  ...API_CONFIG,
  timeout: 120000, // 2 minutes for itinerary requests
  retry: {
    attempts: 2,
    delay: 2000, // 2 seconds
    statusCodes: [408, 429, 500, 502, 503, 504]
  }
};

interface ErrorResponse {
  message?: string;
  type?: string;
  code?: string;
  details?: unknown;
}

// Custom config type that includes retry count
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: number;
  retry?: {
    attempts: number;
    delay: number;
    statusCodes: number[];
  };
}

// Create axios instance with retry logic
export const api = axios.create(API_CONFIG);

// Add request interceptor to handle itinerary requests differently
api.interceptors.request.use((config: RetryConfig) => {
  // Apply itinerary specific config for itinerary endpoints
  if (config.url?.includes('/api/itinerary')) {
    config = {
      ...config,
      timeout: ITINERARY_CONFIG.timeout,
      retry: ITINERARY_CONFIG.retry
    };
  }
  
  // Only cancel requests for itinerary generation
  if (config.url?.includes('/api/itinerary') && config.method === 'post') {
    cancelTokenSource.cancel('Operation cancelled due to new request.');
    cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
  }
  return config;
});

// Add response interceptor to handle cancellations
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      // Handle cancelled request
      throw {
        type: 'CANCELLED',
        message: 'Request was cancelled',
        code: 'REQ_001',
        details: { reason: error.message }
      };
    }

    // Handle method not allowed error
    if (error.response?.status === 405) {
      throw {
        type: 'VALIDATION_ERROR',
        message: 'Invalid request method',
        code: 'VAL_002',
        details: { method: error.config?.method }
      };
    }

    throw error;
  }
);

// Export the cancel function
export const cancelRequest = () => {
  cancelTokenSource.cancel('Operation cancelled by user.');
};

// Error handler
export const handleError = (error: unknown): APIError => {
  if (axios.isCancel(error)) {
    return {
      type: 'CANCELLED',
      message: 'Request was cancelled',
      code: 'REQ_001',
      details: { reason: (error as any).message }
    };
  }
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    
    // Method not allowed error
    if (axiosError.response?.status === 405) {
      return {
        type: 'VALIDATION_ERROR',
        message: 'Invalid request method',
        code: 'VAL_002',
        details: { method: axiosError.config?.method }
      };
    }
    
    // Server errors (including 503)
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return {
        type: 'SERVER_ERROR',
        message: axiosError.response.data?.message || 'Server error occurred',
        code: 'SRV_001',
        details: axiosError.response.data
      };
    }

    // Network errors
    if (!axiosError.response) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Network connection error',
        code: 'NET_001',
        details: error
      };
    }
  }
  
  return {
    type: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred',
    code: 'UNK_001',
    details: error
  };
};

// API client with typed methods
export const apiClient = {
  async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async post<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async put<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};