import axios from 'axios';
import { api, handleError, apiClient } from '../api';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Instance', () => {
    it('should create an axios instance with correct config', () => {
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        },
        retry: {
          attempts: 3,
          delay: 1000,
          statusCodes: [408, 429, 500, 502, 503, 504]
        },
        validateStatus: expect.any(Function)
      });
    });

    it('should validate status codes correctly', () => {
      const config = mockAxios.create.mock.calls[0]?.[0];
      const validateStatus = config?.validateStatus as (status: number) => boolean;

      expect(validateStatus(200)).toBe(true);
      expect(validateStatus(299)).toBe(true);
      expect(validateStatus(300)).toBe(false);
      expect(validateStatus(400)).toBe(false);
      expect(validateStatus(500)).toBe(false);
    });
  });

  describe('API Client Methods', () => {
    const mockResponse = { data: { id: 1, name: 'Test' } };

    beforeEach(() => {
      mockAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        post: jest.fn().mockResolvedValue(mockResponse),
        put: jest.fn().mockResolvedValue(mockResponse),
        delete: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      } as any);
    });

    it('should make GET requests correctly', async () => {
      const api = mockAxios.create();
      await apiClient.get('/test');
      expect(api.get).toHaveBeenCalledWith('/test', {});
    });

    it('should make POST requests correctly', async () => {
      const api = mockAxios.create();
      const data = { name: 'Test' };
      await apiClient.post('/test', data);
      expect(api.post).toHaveBeenCalledWith('/test', data, {});
    });

    it('should make PUT requests correctly', async () => {
      const api = mockAxios.create();
      const data = { name: 'Test' };
      await apiClient.put('/test', data);
      expect(api.put).toHaveBeenCalledWith('/test', data, {});
    });

    it('should make DELETE requests correctly', async () => {
      const api = mockAxios.create();
      await apiClient.delete('/test');
      expect(api.delete).toHaveBeenCalledWith('/test', {});
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const networkError = new Error('Network error occurred');
      (networkError as any).isAxiosError = true;
      (networkError as any).code = 'ERR_NETWORK';

      const error = handleError(networkError);

      expect(error).toEqual({
        type: 'NETWORK_ERROR',
        message: 'Network error occurred',
        code: 'NET_001'
      });
    });

    it('should handle timeout errors', () => {
      const timeoutError = new Error('Request timed out');
      (timeoutError as any).isAxiosError = true;
      (timeoutError as any).code = 'ECONNABORTED';

      const error = handleError(timeoutError);

      expect(error).toEqual({
        type: 'TIMEOUT_ERROR',
        message: 'Request timed out',
        code: 'TMT_001'
      });
    });

    it('should handle validation errors', () => {
      const validationError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            message: 'Invalid request data',
            errors: [
              { field: 'email', message: 'Invalid email format' }
            ]
          }
        }
      };

      const error = handleError(validationError);

      expect(error).toEqual({
        type: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        code: 'VAL_001',
        details: validationError.response.data
      });
    });

    it('should handle server errors', () => {
      const serverError = {
        isAxiosError: true,
        response: {
          status: 500,
          data: {
            message: 'Server error occurred'
          }
        }
      };

      const error = handleError(serverError);

      expect(error).toEqual({
        type: 'SERVER_ERROR',
        message: 'Server error occurred',
        code: 'SRV_001',
        details: serverError.response.data
      });
    });

    it('should handle unknown errors', () => {
      const unknownError = new Error('Unknown error');

      const error = handleError(unknownError);

      expect(error).toEqual({
        type: 'SERVER_ERROR',
        message: 'An unexpected error occurred',
        code: 'UNK_001'
      });
    });
  });

  describe('Interceptors', () => {
    it('should handle request errors', async () => {
      const api = mockAxios.create();
      const requestError = new Error('Request error');
      const interceptor = api.interceptors.request.use as jest.Mock;
      const errorHandler = interceptor.mock.calls[0][1];

      await expect(errorHandler(requestError)).rejects.toEqual({
        type: 'SERVER_ERROR',
        message: 'An unexpected error occurred',
        code: 'UNK_001'
      });
    });

    it('should handle response errors', async () => {
      const api = mockAxios.create();
      const responseError = new Error('Response error');
      const interceptor = api.interceptors.response.use as jest.Mock;
      const errorHandler = interceptor.mock.calls[0][1];

      await expect(errorHandler(responseError)).rejects.toEqual({
        type: 'SERVER_ERROR',
        message: 'An unexpected error occurred',
        code: 'UNK_001'
      });
    });
  });
});