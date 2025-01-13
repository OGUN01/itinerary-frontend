import { useEventsStore } from '../events';
import { LocalEvent } from '@/types/events';

describe('Events Store', () => {
  const mockEvent1: LocalEvent = {
    id: '1',
    name: 'Summer Music Festival',
    date: new Date('2025-01-10T18:00:00'),
    venue: 'City Park',
    category: 'Music',
    price_range: '$20 - $50',
    description: 'Annual summer music festival'
  };

  const mockEvent2: LocalEvent = {
    id: '2',
    name: 'Local Art Exhibition',
    date: new Date('2025-01-10T10:00:00'),
    venue: 'Art Gallery',
    category: 'Arts',
    price_range: '$10',
    description: 'Local artists showcase'
  };

  beforeEach(() => {
    const store = useEventsStore.getState();
    store.setEvents([]);
    store.clearSelectedEvents();
    store.resetFilters();
    store.setError(null);
    store.setLoading(false);
  });

  it('should initialize with default state', () => {
    const state = useEventsStore.getState();
    expect(state.events).toEqual([]);
    expect(state.selectedEvents).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.filters).toEqual({
      categories: [],
      maxPrice: null,
      searchQuery: '',
      dateRange: {
        start: null,
        end: null,
      },
    });
  });

  it('should set events', () => {
    const store = useEventsStore.getState();
    store.setEvents([mockEvent1, mockEvent2]);
    expect(store.events).toHaveLength(2);
    expect(store.events[0]).toEqual(mockEvent1);
    expect(store.events[1]).toEqual(mockEvent2);
  });

  it('should add and remove events', () => {
    const store = useEventsStore.getState();
    
    // Add event
    store.addEvent(mockEvent1);
    expect(store.events).toHaveLength(1);
    expect(store.events[0]).toEqual(mockEvent1);
    
    // Remove event
    store.removeEvent(mockEvent1.id);
    expect(store.events).toHaveLength(0);
  });

  it('should toggle event selection', () => {
    const store = useEventsStore.getState();
    store.setEvents([mockEvent1, mockEvent2]);
    
    // Select event
    store.toggleEventSelection(mockEvent1);
    expect(store.selectedEvents).toHaveLength(1);
    expect(store.selectedEvents[0]).toEqual(mockEvent1);
    
    // Deselect event
    store.toggleEventSelection(mockEvent1);
    expect(store.selectedEvents).toHaveLength(0);
  });

  it('should filter events by category', () => {
    const store = useEventsStore.getState();
    store.setEvents([mockEvent1, mockEvent2]);
    store.setFilters({ categories: ['Music'] });
    
    const filteredEvents = store.getFilteredEvents();
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0]).toEqual(mockEvent1);
  });

  it('should filter events by search query', () => {
    const store = useEventsStore.getState();
    store.setEvents([mockEvent1, mockEvent2]);
    store.setFilters({ searchQuery: 'art' });
    
    const filteredEvents = store.getFilteredEvents();
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0]).toEqual(mockEvent2);
  });

  it('should filter events by date range', () => {
    const store = useEventsStore.getState();
    store.setEvents([mockEvent1, mockEvent2]);
    store.setFilters({
      dateRange: {
        start: new Date('2025-01-10T00:00:00'),
        end: new Date('2025-01-10T12:00:00'),
      },
    });
    
    const filteredEvents = store.getFilteredEvents();
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0]).toEqual(mockEvent2);
  });

  it('should get events by date', () => {
    const store = useEventsStore.getState();
    store.setEvents([mockEvent1, mockEvent2]);
    
    const events = store.getEventsByDate(new Date('2025-01-10'));
    expect(events).toHaveLength(2);
  });

  it('should handle loading state', () => {
    const store = useEventsStore.getState();
    store.setLoading(true);
    expect(store.isLoading).toBe(true);
    
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });

  it('should handle error state', () => {
    const store = useEventsStore.getState();
    const error = new Error('Test error');
    store.setError(error);
    expect(store.error).toEqual(error);
    
    store.setError(null);
    expect(store.error).toBeNull();
  });
}); 