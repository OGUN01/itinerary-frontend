import { render, screen, fireEvent } from '@testing-library/react';
import { EventsList } from '../EventsList';
import { LocalEvent } from '@/types/events';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('EventsList', () => {
  const mockEvents: LocalEvent[] = [
    {
      id: '1',
      name: 'Summer Music Festival',
      date: new Date('2025-01-10T18:00:00'),
      venue: 'City Park',
      category: 'Music',
      price_range: '$20 - $50',
      description: 'Annual summer music festival'
    },
    {
      id: '2',
      name: 'Local Art Exhibition',
      date: new Date('2025-01-10T10:00:00'),
      venue: 'Art Gallery',
      category: 'Arts',
      price_range: '$10',
      description: 'Local artists showcase'
    },
    {
      id: '3',
      name: 'Food Festival',
      date: new Date('2025-01-11T12:00:00'),
      venue: 'Downtown Square',
      category: 'Food',
      price_range: 'Free',
      description: 'Street food festival'
    }
  ];

  it('renders events list correctly', () => {
    render(
      <EventsList 
        events={mockEvents}
      />
    );
    
    expect(screen.getByText('Summer Music Festival')).toBeInTheDocument();
    expect(screen.getByText('Local Art Exhibition')).toBeInTheDocument();
    expect(screen.getByText('Food Festival')).toBeInTheDocument();
    expect(screen.getByText('3 events found')).toBeInTheDocument();
  });

  it('groups events by date', () => {
    render(
      <EventsList 
        events={mockEvents}
      />
    );
    
    // Check date headers
    expect(screen.getByText('Friday, January 10')).toBeInTheDocument();
    expect(screen.getByText('Saturday, January 11')).toBeInTheDocument();
  });

  it('filters events by category', () => {
    render(
      <EventsList 
        events={mockEvents}
      />
    );
    
    // Select Music category
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Music' }
    });
    
    expect(screen.getByText('Summer Music Festival')).toBeInTheDocument();
    expect(screen.queryByText('Local Art Exhibition')).not.toBeInTheDocument();
    expect(screen.queryByText('Food Festival')).not.toBeInTheDocument();
    expect(screen.getByText('1 events found')).toBeInTheDocument();
  });

  it('filters events by search query', () => {
    render(
      <EventsList 
        events={mockEvents}
      />
    );
    
    // Search for "festival"
    fireEvent.change(screen.getByPlaceholderText('Search events...'), {
      target: { value: 'festival' }
    });
    
    expect(screen.getByText('Summer Music Festival')).toBeInTheDocument();
    expect(screen.getByText('Food Festival')).toBeInTheDocument();
    expect(screen.queryByText('Local Art Exhibition')).not.toBeInTheDocument();
    expect(screen.getByText('2 events found')).toBeInTheDocument();
  });

  it('handles event selection', () => {
    const handleSelect = jest.fn();
    render(
      <EventsList 
        events={mockEvents}
        onEventSelect={handleSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Summer Music Festival'));
    expect(handleSelect).toHaveBeenCalledWith(mockEvents[0]);
  });

  it('highlights selected date events', () => {
    const selectedDate = new Date('2025-01-10');
    render(
      <EventsList
        events={mockEvents}
        selectedDate={selectedDate}
      />
    );

    const musicEvent = screen.getByText('Summer Music Festival').closest('[role="button"]');
    const artEvent = screen.getByText('Local Art Exhibition').closest('[role="button"]');
    const foodEvent = screen.getByText('Food Festival').closest('[role="button"]');

    expect(musicEvent).toHaveAttribute('aria-pressed', 'true');
    expect(artEvent).toHaveAttribute('aria-pressed', 'true');
    expect(foodEvent).toHaveAttribute('aria-pressed', 'false');
  });

  it('displays empty state when no events match filters', () => {
    render(
      <EventsList 
        events={mockEvents}
      />
    );
    
    // Search for non-existent event
    fireEvent.change(screen.getByPlaceholderText('Search events...'), {
      target: { value: 'nonexistent' }
    });
    
    expect(screen.getByText('No events found for the selected filters')).toBeInTheDocument();
    expect(screen.getByText('0 events found')).toBeInTheDocument();
  });
}); 