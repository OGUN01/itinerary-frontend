import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherCard } from '../WeatherCard';
import { AppError } from '@/utils/errors';
import { WeatherInfo } from '@/types/api';

const mockWeather: WeatherInfo = {
  date: '2024-02-20T12:00:00Z',
  temperature_celsius: 25,
  condition: 'Sunny',
  precipitation_chance: 10,
  humidity: 65
};

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('handles missing weather data with error state', () => {
    render(<WeatherCard weather={undefined} />);

    expect(screen.getByRole('heading', { name: 'Weather data unavailable' })).toBeInTheDocument();
  });

  it('displays error state when error prop is provided', () => {
    const error = new AppError('Failed to fetch weather data', 'API_ERROR');
    render(<WeatherCard weather={undefined} error={error} />);

    expect(screen.getByRole('heading', { name: 'Weather data unavailable' })).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked in error state', () => {
    const onRetry = jest.fn();
    const error = new AppError('Failed to fetch weather data', 'API_ERROR');
    render(<WeatherCard weather={undefined} error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when isSelected is true', () => {
    render(<WeatherCard weather={mockWeather} isSelected={true} />);

    const card = screen.getByRole('button', { pressed: true });
    expect(card).toHaveClass('ring-2', 'ring-primary');
  });

  it('calls onClick when card is clicked', () => {
    const onClick = jest.fn();
    render(<WeatherCard weather={mockWeather} onClick={onClick} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
}); 