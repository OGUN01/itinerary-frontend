import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTransportOptions } from '../transport';
import { apiClient } from '../api';
import { TravelInput, TransportResponse } from '../../types/api';

// Mock API client
jest.mock('../api', () => ({
  apiClient: {
    post: jest.fn()
  }
}));

const mockTravelInput: TravelInput = {
  origin: 'New York',
  destination: 'London',
  start_date: '2024-02-01',
  return_date: '2024-02-07'
};

const mockTransportResponse: TransportResponse = {
  options: [
    {
      mode: 'flight',
      provider: 'Test Airlines',
      departure_time: '2024-02-01T10:00:00',
      arrival_time: '2024-02-01T22:00:00',
      price: 500,
      duration_minutes: 720,
      details: {
        flight_number: 'TA123',
        class: 'economy'
      }
    }
  ]
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Transport Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transport options successfully', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockTransportResponse);

    const { result } = renderHook(() => useTransportOptions(mockTravelInput), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTransportResponse);
    expect(apiClient.post).toHaveBeenCalledWith('/api/transport', mockTravelInput);
  });

  it('should not fetch when required fields are missing', async () => {
    const incompleteTravelInput = {
      origin: 'New York',
      destination: '',
      start_date: '',
      return_date: ''
    };

    const { result } = renderHook(
      () => useTransportOptions(incompleteTravelInput as TravelInput),
      { wrapper: createWrapper() }
    );

    expect(result.current.isFetched).toBe(false);
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should handle error response', async () => {
    const error = {
      type: 'VALIDATION_ERROR',
      message: 'Invalid dates',
      code: 'VAL_001'
    };

    (apiClient.post as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTransportOptions(mockTravelInput), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
}); 