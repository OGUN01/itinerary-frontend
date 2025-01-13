import { render, screen, fireEvent } from '@testing-library/react';
import { EventsErrorState } from '../EventsErrorState';
import { AppError } from '@/utils/errors';

describe('EventsErrorState', () => {
  it('renders network error message correctly', () => {
    const error = new AppError('Failed to fetch events data', 'NETWORK_ERROR');
    render(<EventsErrorState error={error} />);

    expect(screen.getByText('Unable to fetch events')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch events data')).toBeInTheDocument();
  });

  it('renders generic error message correctly', () => {
    const error = new AppError('Events service unavailable', 'API_ERROR');
    render(<EventsErrorState error={error} />);

    expect(screen.getByText('Events unavailable')).toBeInTheDocument();
    expect(screen.getByText('Events service unavailable')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    const error = new AppError('Test error');
    render(<EventsErrorState error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    const error = new AppError('Test error');
    render(<EventsErrorState error={error} />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('handles non-AppError errors gracefully', () => {
    const error = new Error('Generic error');
    render(<EventsErrorState error={error} />);

    expect(screen.getByText('Events unavailable')).toBeInTheDocument();
    expect(screen.getByText('Generic error')).toBeInTheDocument();
  });
}); 