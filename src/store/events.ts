import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { LocalEvent } from '../types/events';
import { isSameDay } from 'date-fns';

interface EventFilters {
  categories: string[];
  maxPrice: number | null;
  searchQuery: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface EventsState {
  events: LocalEvent[];
  selectedEvents: LocalEvent[];
  isLoading: boolean;
  error: Error | null;
  filters: EventFilters;
  setEvents: (events: LocalEvent[]) => void;
  addEvent: (event: LocalEvent) => void;
  removeEvent: (eventId: string) => void;
  toggleEventSelection: (event: LocalEvent) => void;
  clearSelectedEvents: () => void;
  setFilters: (filters: Partial<EventFilters>) => void;
  resetFilters: () => void;
  getFilteredEvents: () => LocalEvent[];
  getEventsByDate: (date: Date) => LocalEvent[];
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

const initialFilters: EventFilters = {
  categories: [],
  maxPrice: null,
  searchQuery: '',
  dateRange: {
    start: null,
    end: null,
  },
};

export const useEventsStore = create<EventsState>()(
  immer((set, get) => ({
    events: [],
    selectedEvents: [],
    isLoading: false,
    error: null,
    filters: initialFilters,

    setEvents: (events) => set((state) => {
      state.events = events;
    }),

    addEvent: (event) => set((state) => {
      state.events.push(event);
    }),

    removeEvent: (eventId) => set((state: EventsState) => {
      state.events = state.events.filter((e: LocalEvent) => e.id !== eventId);
      state.selectedEvents = state.selectedEvents.filter((e: LocalEvent) => e.id !== eventId);
    }),

    toggleEventSelection: (event) => set((state: EventsState) => {
      const isSelected = state.selectedEvents.some((e: LocalEvent) => e.id === event.id);
      if (isSelected) {
        state.selectedEvents = state.selectedEvents.filter((e: LocalEvent) => e.id !== event.id);
      } else {
        state.selectedEvents.push(event);
      }
    }),

    clearSelectedEvents: () => set((state) => {
      state.selectedEvents = [];
    }),

    setFilters: (filters) => set((state) => {
      state.filters = { ...state.filters, ...filters };
    }),

    resetFilters: () => set((state) => {
      state.filters = initialFilters;
    }),

    getFilteredEvents: () => {
      const state = get();
      const { categories, maxPrice, searchQuery, dateRange } = state.filters;

      return state.events.filter((event: LocalEvent) => {
        // Category filter
        if (categories.length > 0 && !categories.includes(event.category)) {
          return false;
        }

        // Price filter
        if (maxPrice !== null) {
          const eventPrice = event.price_range
            ? parseFloat(event.price_range.replace(/[^0-9.]/g, ''))
            : 0;
          if (eventPrice > maxPrice) {
            return false;
          }
        }

        // Search query
        if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Date range
        if (dateRange.start && event.date < dateRange.start) {
          return false;
        }
        if (dateRange.end && event.date > dateRange.end) {
          return false;
        }

        return true;
      });
    },

    getEventsByDate: (date) => {
      const state = get();
      return state.events.filter((event: LocalEvent) => isSameDay(event.date, date));
    },

    setLoading: (loading) => set((state) => {
      state.isLoading = loading;
    }),

    setError: (error) => set((state) => {
      state.error = error;
    })
  }))
); 