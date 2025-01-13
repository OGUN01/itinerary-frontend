export type ErrorType = 
  | 'API_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = 'UNKNOWN_ERROR',
    public statusCode?: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static fromApiError(error: any): AppError {
    if (error?.response) {
      return new AppError(
        error.response.data?.message || 'API request failed',
        error.response.data?.type || 'API_ERROR',
        error.response.status,
        error.response.data
      );
    }
    if (error?.request) {
      return new AppError(
        'Network request failed',
        'NETWORK_ERROR',
        0
      );
    }
    return new AppError(
      error?.message || 'An unknown error occurred',
      'UNKNOWN_ERROR'
    );
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export function getErrorMessage(error: unknown): string {
  if (AppError.isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

export function getErrorType(error: unknown): ErrorType {
  if (AppError.isAppError(error)) {
    return error.type;
  }
  return 'UNKNOWN_ERROR';
} 