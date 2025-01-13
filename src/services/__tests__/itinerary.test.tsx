import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useItinerary } from '../itinerary';
import { apiClient } from '../api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APIError } from '@/types/api';

jest.mock('../api');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('Itinerary Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  describe('useItinerary', () => {
    it('should fetch itinerary successfully', async () => {
      const mockItinerary = {
        id: '123',
        trip_summary: { title: 'Test Trip' },
        daily_itineraries: [],
        total_cost: 1000,
        recommendations: []
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce(mockItinerary);

      const { result } = renderHook(() => useItinerary('123'), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockItinerary);
        expect(result.current.isSuccess).toBe(true);
      });

      expect(apiClient.get).toHaveBeenCalledWith('/api/itinerary/123');
    });

    it('should handle error response', async () => {
      const mockError: APIError = {
        type: 'SERVER_ERROR',
        message: 'Failed to fetch itinerary. Please try again.',
        code: 'SRV_001',
        details: {
          message: 'Itinerary not found',
          type: 'API_ERROR'
        }
      };

      (apiClient.get as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useItinerary('invalid-id'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(mockError);
      });

      expect(apiClient.get).toHaveBeenCalledWith('/api/itinerary/invalid-id');
    });
  });
}); 