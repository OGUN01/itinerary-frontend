import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherErrorState } from '../WeatherErrorState';
import { AppError } from '@/utils/errors';

describe('WeatherErrorState', () => {
  it('renders network error message correctly', () => {
    const error = new AppError('Failed to fetch weather data', 'NETWORK_ERROR');
    render(<WeatherErrorState error={error} />);

    expect(screen.getByText('Unable to fetch weather data')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
  });

  it('renders generic error message correctly', () => {
    const error = new AppError('Weather service unavailable', 'API_ERROR');
    render(<WeatherErrorState error={error} />);

    expect(screen.getByText('Weather data unavailable')).toBeInTheDocument();
    expect(screen.getByText('Weather service unavailable')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    const error = new AppError('Test error');
    render(<WeatherErrorState error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    const error = new AppError('Test error');
    render(<WeatherErrorState error={error} />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('handles non-AppError errors gracefully', () => {
    const error = new Error('Generic error');
    render(<WeatherErrorState error={error} />);

    expect(screen.getByText('Weather data unavailable')).toBeInTheDocument();
    expect(screen.getByText('Generic error')).toBeInTheDocument();
  });
}); 