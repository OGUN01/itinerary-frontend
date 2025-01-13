import { useQuery } from '@tanstack/react-query';
import { apiClient } from './api';
import { TravelInput, WeatherResponse, APIError } from '@/types/api';

/**
 * Fetches weather and local events for the given travel parameters
 */
const getWeatherAndEvents = async (params: TravelInput): Promise<WeatherResponse> => {
  return apiClient.post<WeatherResponse>('/api/weather', params);
};

/**
 * React Query hook for fetching weather and events data
 */
export const useWeatherAndEvents = (params: TravelInput) => {
  return useQuery({
    queryKey: ['weather', params],
    queryFn: () => getWeatherAndEvents(params),
    enabled: Boolean(
      params.destination && 
      params.start_date && 
      params.return_date
    ),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000,    // 1 hour
    retry: (failureCount, error: APIError) => {
      // Don't retry on validation errors
      if (error.type === 'VALIDATION_ERROR') return false;
      // Retry up to 3 times for other errors
      return failureCount < 3;
    }
  });
}; 