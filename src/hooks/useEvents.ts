import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { LocalEvent } from '@/types/events';
import { useEventsStore } from '@/store/events';
import axios from 'axios';

interface EventParams {
  startDate?: Date;
  endDate?: Date;
  location?: string;
  radius?: number;
  categories?: string[];
  limit?: number;
}

interface EventsResponse {
  events: LocalEvent[];
}

const fetchEvents = async (params: EventParams): Promise<LocalEvent[]> => {
  const { data } = await axios.get<EventsResponse>('/api/events', { params });
  return data.events;
};

export const useEvents = (
  params: EventParams,
  options?: Omit<UseQueryOptions<LocalEvent[], Error, LocalEvent[], [string, EventParams]>, 'queryKey' | 'queryFn'>
) => {
  const setEvents = useEventsStore((state) => state.setEvents);
  const setLoading = useEventsStore((state) => state.setLoading);
  const setError = useEventsStore((state) => state.setError);

  return useQuery<LocalEvent[], Error, LocalEvent[], [string, EventParams]>({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
    ...options,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    onSuccess: (data: LocalEvent[]) => {
      setEvents(data);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error);
    },
    onSettled: () => {
      setLoading(false);
    }
  } as UseQueryOptions<LocalEvent[], Error, LocalEvent[], [string, EventParams]>);
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  const addEvent = useEventsStore((state) => state.addEvent);

  return useMutation({
    mutationFn: async (event: Omit<LocalEvent, 'id'>) => {
      const { data } = await axios.post<LocalEvent>('/api/events', event);
      return data;
    },
    onSuccess: (data: LocalEvent) => {
      addEvent(data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
};

export const useRemoveEvent = () => {
  const queryClient = useQueryClient();
  const removeEvent = useEventsStore((state) => state.removeEvent);

  return useMutation({
    mutationFn: async (eventId: string) => {
      await axios.delete(`/api/events/${eventId}`);
      return eventId;
    },
    onSuccess: (eventId: string) => {
      removeEvent(eventId);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
};

// Selector hooks
export const useFilteredEvents = () => {
  return useEventsStore((state) => state.getFilteredEvents());
};

export const useEventsByDate = (date: Date) => {
  return useEventsStore((state) => state.getEventsByDate(date));
};

export const useSelectedEvents = () => {
  return useEventsStore((state) => state.selectedEvents);
};

export const useEventFilters = () => {
  return useEventsStore((state) => state.filters);
}; 