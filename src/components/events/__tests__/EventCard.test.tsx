import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '../EventCard';
import { AppError } from '@/utils/errors';
import { LocalEvent } from '@/types/events';

const mockEvent: LocalEvent = {
  id: '1',
  name: 'Concert in the Park',
  date: new Date('2024-02-20T19:00:00Z'),
  venue: 'Central Park',
  category: 'Music',
  price_range: '$25',
  description: 'An evening of live music'
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} isHighlighted={false} />);

    expect(screen.getByText('Concert in the Park')).toBeInTheDocument();
    expect(screen.getByText('An evening of live music')).toBeInTheDocument();
    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
  });

  it('handles missing event data with error state', () => {
    render(<EventCard event={undefined} isHighlighted={false} />);

    expect(screen.getByRole('heading', { name: 'Events unavailable' })).toBeInTheDocument();
  });

  it('displays error state when error prop is provided', () => {
    const error = new AppError('Failed to fetch event data', 'API_ERROR');
    render(<EventCard event={undefined} isHighlighted={false} error={error} />);

    expect(screen.getByRole('heading', { name: 'Events unavailable' })).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch event data')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked in error state', () => {
    const onRetry = jest.fn();
    const error = new AppError('Failed to fetch event data', 'API_ERROR');
    render(
      <EventCard 
        event={undefined} 
        isHighlighted={false} 
        error={error} 
        onRetry={onRetry} 
      />
    );

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('applies highlighted styles when isHighlighted is true', () => {
    render(<EventCard event={mockEvent} isHighlighted={true} />);

    const card = screen.getByRole('button', { pressed: true });
    expect(card).toHaveClass('border-primary', 'bg-primary/5');
  });

  it('calls onClick when card is clicked', () => {
    const onClick = jest.fn();
    render(<EventCard event={mockEvent} isHighlighted={false} onClick={onClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
}); 