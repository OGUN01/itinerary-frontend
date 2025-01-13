/** @jest-environment jsdom */
import * as React from 'react';
import { ReactElement } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useEvents, useAddEvent, useRemoveEvent } from '../useEvents';
import { useEventsStore } from '../../store/events';
import { LocalEvent } from '../../types/events';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return function TestWrapper({ children }: { children: React.ReactNode }): ReactElement {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('Events Hooks', () => {
  const mockEvent: LocalEvent = {
    id: '1',
    name: 'Summer Music Festival',
    date: new Date('2025-01-10T18:00:00'),
    venue: 'City Park',
    category: 'Music',
    price_range: '$20 - $50',
    description: 'Annual summer music festival'
  };

  beforeEach(() => {
    const store = useEventsStore.getState();
    store.setEvents([]);
    store.clearSelectedEvents();
    store.resetFilters();
    store.setError(null);
    store.setLoading(false);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('useEvents', () => {
    it('should fetch events and update store', async () => {
      const mockEvents = [mockEvent];
      mockedAxios.get.mockResolvedValueOnce({ data: { events: mockEvents } });

      const { result } = renderHook(
        () => useEvents({ startDate: new Date('2025-01-10') }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const store = useEventsStore.getState();
      expect(store.events).toEqual(mockEvents);
      expect(store.error).toBeNull();
      expect(store.isLoading).toBe(false);
    });

    it('should handle fetch error', async () => {
      const error = new Error('Failed to fetch events');
      mockedAxios.get.mockRejectedValueOnce(error);

      const { result } = renderHook(
        () => useEvents({ startDate: new Date('2025-01-10') }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      const store = useEventsStore.getState();
      expect(store.error).toEqual(error);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('useAddEvent', () => {
    it('should add event and update store', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockEvent });

      const { result } = renderHook(() => useAddEvent(), {
        wrapper: createWrapper(),
      });

      // Add event
      result.current.mutate({
        name: mockEvent.name,
        date: mockEvent.date,
        venue: mockEvent.venue,
        category: mockEvent.category,
        price_range: mockEvent.price_range,
        description: mockEvent.description,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const store = useEventsStore.getState();
      expect(store.events).toContainEqual(mockEvent);
    });

    it('should handle add error', async () => {
      const error = new Error('Failed to add event');
      mockedAxios.post.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAddEvent(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        name: mockEvent.name,
        date: mockEvent.date,
        venue: mockEvent.venue,
        category: mockEvent.category,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useRemoveEvent', () => {
    it('should remove event and update store', async () => {
      mockedAxios.delete.mockResolvedValueOnce({});
      const store = useEventsStore.getState();
      store.setEvents([mockEvent]);

      const { result } = renderHook(() => useRemoveEvent(), {
        wrapper: createWrapper(),
      });

      // Remove event
      result.current.mutate(mockEvent.id);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(store.events).not.toContainEqual(mockEvent);
    });

    it('should handle remove error', async () => {
      const error = new Error('Failed to remove event');
      mockedAxios.delete.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRemoveEvent(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockEvent.id);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
}); 