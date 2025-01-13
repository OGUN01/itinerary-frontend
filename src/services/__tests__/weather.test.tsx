import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeatherAndEvents } from '../weather';
import { apiClient } from '../api';
import { TravelInput, WeatherResponse } from '../../types/api';

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

const mockWeatherResponse: WeatherResponse = {
  weather_forecast: [
    {
      date: '2024-02-01',
      temperature_celsius: 15,
      condition: 'Partly Cloudy',
      precipitation_chance: 20,
      humidity: 65
    }
  ],
  local_events: [
    {
      name: 'Test Event',
      date: '2024-02-01',
      venue: 'Test Venue',
      category: 'Entertainment',
      price_range: '$50-100',
      description: 'A test event'
    }
  ]
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Weather Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch weather and events successfully', async () => {
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockWeatherResponse);

    const { result } = renderHook(() => useWeatherAndEvents(mockTravelInput), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockWeatherResponse);
    expect(apiClient.post).toHaveBeenCalledWith('/api/weather', mockTravelInput);
  });

  it('should not fetch when required fields are missing', async () => {
    const incompleteTravelInput = {
      origin: 'New York',
      destination: '',
      start_date: '',
      return_date: ''
    };

    const { result } = renderHook(
      () => useWeatherAndEvents(incompleteTravelInput as TravelInput),
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

    const { result } = renderHook(() => useWeatherAndEvents(mockTravelInput), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
}); 