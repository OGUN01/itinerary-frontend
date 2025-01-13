import { render, screen, fireEvent } from '@testing-library/react';
import { EventsCard } from '../../events/EventsCard';
import { AppError } from '@/utils/errors';
import { EventInfo } from '@/types/api';

const mockEvent: EventInfo = {
  id: '1',
  title: 'Concert in the Park',
  description: 'An evening of live music',
  start_time: '2024-02-20T19:00:00Z',
  end_time: '2024-02-20T22:00:00Z',
  location: 'Central Park',
  category: 'music',
  price: 25,
  currency: 'USD',
  availability: 'available'
};

describe('EventsCard', () => {
  it('renders event information correctly', () => {
    render(<EventsCard event={mockEvent} isSelected={false} onSelect={() => {}} />);

    expect(screen.getByText('Concert in the Park')).toBeInTheDocument();
    expect(screen.getByText('An evening of live music')).toBeInTheDocument();
    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
  });

  it('handles missing event data with error state', () => {
    render(<EventsCard event={undefined} isSelected={false} onSelect={() => {}} />);

    expect(screen.getByText('Event data unavailable')).toBeInTheDocument();
  });

  it('displays error state when error prop is provided', () => {
    const error = new AppError('Failed to fetch event data', 'API_ERROR');
    render(<EventsCard event={undefined} isSelected={false} onSelect={() => {}} error={error} />);

    expect(screen.getByText('Event data unavailable')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch event data')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked in error state', () => {
    const onRetry = jest.fn();
    const error = new AppError('Failed to fetch event data', 'API_ERROR');
    render(
      <EventsCard 
        event={undefined} 
        isSelected={false} 
        onSelect={() => {}} 
        error={error} 
        onRetry={onRetry} 
      />
    );

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when isSelected is true', () => {
    render(<EventsCard event={mockEvent} isSelected={true} onSelect={() => {}} />);

    const card = screen.getByRole('button', { pressed: true });
    expect(card).toHaveClass('border-primary', 'bg-primary/5');
  });

  it('calls onSelect when card is clicked', () => {
    const onSelect = jest.fn();
    render(<EventsCard event={mockEvent} isSelected={false} onSelect={onSelect} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
}); 