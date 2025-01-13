import { render, screen, fireEvent } from '@testing-library/react';
import { TransportErrorState } from '../TransportErrorState';
import { AppError } from '@/utils/errors';

describe('TransportErrorState', () => {
  it('renders network error message correctly', () => {
    const error = new AppError('Failed to fetch transport data', 'NETWORK_ERROR');
    render(<TransportErrorState error={error} />);

    expect(screen.getByText('Unable to fetch transport options')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch transport data')).toBeInTheDocument();
  });

  it('renders generic error message correctly', () => {
    const error = new AppError('Transport service unavailable', 'API_ERROR');
    render(<TransportErrorState error={error} />);

    expect(screen.getByText('Transport options unavailable')).toBeInTheDocument();
    expect(screen.getByText('Transport service unavailable')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    const error = new AppError('Test error');
    render(<TransportErrorState error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    const error = new AppError('Test error');
    render(<TransportErrorState error={error} />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('handles non-AppError errors gracefully', () => {
    const error = new Error('Generic error');
    render(<TransportErrorState error={error} />);

    expect(screen.getByText('Transport options unavailable')).toBeInTheDocument();
    expect(screen.getByText('Generic error')).toBeInTheDocument();
  });
}); 