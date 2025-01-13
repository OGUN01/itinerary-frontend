import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { TravelInput, TransportResponse, APIError } from '@/types/api';

/**
 * Fetches transport options for the given travel parameters
 */
const getTransportOptions = async (params: TravelInput): Promise<TransportResponse> => {
  return apiClient.post<TransportResponse>('/api/transport', params);
};

/**
 * React Query hook for fetching transport options
 */
export const useTransportOptions = (params: TravelInput) => {
  return useQuery({
    queryKey: ['transport', params],
    queryFn: () => getTransportOptions(params),
    enabled: Boolean(
      params.origin && 
      params.destination && 
      params.start_date && 
      params.return_date
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    retry: (failureCount, error: APIError) => {
      // Don't retry on validation errors
      if (error.type === 'VALIDATION_ERROR') return false;
      // Retry up to 3 times for other errors
      return failureCount < 3;
    }
  });
}; 