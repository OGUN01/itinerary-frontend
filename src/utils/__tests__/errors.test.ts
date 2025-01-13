import { AppError, getErrorMessage, getErrorType } from '../errors';

describe('AppError', () => {
  it('creates error with default type', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.type).toBe('UNKNOWN_ERROR');
  });

  it('creates error with custom type and status code', () => {
    const error = new AppError('API error', 'API_ERROR', 404);
    expect(error.message).toBe('API error');
    expect(error.type).toBe('API_ERROR');
    expect(error.statusCode).toBe(404);
  });

  it('creates error with details', () => {
    const details = { field: 'username', code: 'required' };
    const error = new AppError('Validation error', 'VALIDATION_ERROR', 400, details);
    expect(error.details).toEqual(details);
  });

  it('converts to JSON correctly', () => {
    const error = new AppError('Test error', 'API_ERROR', 404, { test: true });
    const json = error.toJSON();
    expect(json).toEqual({
      name: 'AppError',
      message: 'Test error',
      type: 'API_ERROR',
      statusCode: 404,
      details: { test: true }
    });
  });

  describe('fromApiError', () => {
    it('handles axios error with response', () => {
      const axiosError = {
        response: {
          data: {
            message: 'Not found',
            type: 'NOT_FOUND'
          },
          status: 404
        }
      };

      const error = AppError.fromApiError(axiosError);
      expect(error.message).toBe('Not found');
      expect(error.type).toBe('NOT_FOUND');
      expect(error.statusCode).toBe(404);
    });

    it('handles network error', () => {
      const networkError = {
        request: {},
        message: 'Network Error'
      };

      const error = AppError.fromApiError(networkError);
      expect(error.message).toBe('Network request failed');
      expect(error.type).toBe('NETWORK_ERROR');
    });

    it('handles unknown error', () => {
      const error = AppError.fromApiError({});
      expect(error.message).toBe('An unknown error occurred');
      expect(error.type).toBe('UNKNOWN_ERROR');
    });
  });
});

describe('getErrorMessage', () => {
  it('gets message from AppError', () => {
    const error = new AppError('Test error');
    expect(getErrorMessage(error)).toBe('Test error');
  });

  it('gets message from standard Error', () => {
    const error = new Error('Standard error');
    expect(getErrorMessage(error)).toBe('Standard error');
  });

  it('handles non-error values', () => {
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
    expect(getErrorMessage('string error')).toBe('An unknown error occurred');
  });
});

describe('getErrorType', () => {
  it('gets type from AppError', () => {
    const error = new AppError('Test error', 'API_ERROR');
    expect(getErrorType(error)).toBe('API_ERROR');
  });

  it('returns UNKNOWN_ERROR for non-AppError values', () => {
    expect(getErrorType(new Error())).toBe('UNKNOWN_ERROR');
    expect(getErrorType(null)).toBe('UNKNOWN_ERROR');
    expect(getErrorType('error')).toBe('UNKNOWN_ERROR');
  });
}); 