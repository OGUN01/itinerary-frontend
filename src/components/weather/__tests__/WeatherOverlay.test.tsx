import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherOverlay } from '../WeatherOverlay';
import { WeatherInfo } from '@/types/api';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('WeatherOverlay', () => {
  const mockWeatherData: WeatherInfo[] = [
    {
      date: '2025-01-10',
      temperature_celsius: 25,
      condition: 'Sunny',
      precipitation_chance: 10,
      humidity: 65
    },
    {
      date: '2025-01-11',
      temperature_celsius: 22,
      condition: 'Cloudy',
      precipitation_chance: 30,
      humidity: 70
    },
    {
      date: '2025-01-12',
      temperature_celsius: 20,
      condition: 'Rainy',
      precipitation_chance: 80,
      humidity: 85
    }
  ];

  it('renders weather forecast title and summary', () => {
    render(<WeatherOverlay dailyWeather={mockWeatherData} />);
    
    expect(screen.getByText('Weather Forecast')).toBeInTheDocument();
    expect(screen.getByText('3 days forecast available')).toBeInTheDocument();
  });

  it('renders all weather cards', () => {
    render(<WeatherOverlay dailyWeather={mockWeatherData} />);
    
    // Check if all temperatures are displayed
    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
  });

  it('handles day selection', () => {
    const handleDaySelect = jest.fn();
    render(
      <WeatherOverlay 
        dailyWeather={mockWeatherData} 
        onDaySelect={handleDaySelect}
      />
    );
    
    // Click the first weather card
    fireEvent.click(screen.getByText('25°C').closest('div[role="button"]')!);
    expect(handleDaySelect).toHaveBeenCalledWith(new Date('2025-01-10'));
  });

  it('highlights selected date', () => {
    render(
      <WeatherOverlay 
        dailyWeather={mockWeatherData} 
        selectedDate={new Date('2025-01-11')}
      />
    );
    
    // Find the selected card (containing 22°C)
    const selectedCard = screen.getByText('22°C').closest('div[role="button"]')!;
    expect(selectedCard).toHaveAttribute('aria-pressed', 'true');
    expect(selectedCard).toHaveClass('ring-2', 'ring-primary');
  });

  it('displays weather legend', () => {
    render(<WeatherOverlay dailyWeather={mockWeatherData} />);
    
    expect(screen.getByText('Click on a day to see detailed weather information')).toBeInTheDocument();
  });

  it('handles empty weather data', () => {
    render(<WeatherOverlay dailyWeather={[]} />);
    
    expect(screen.getByText('0 days forecast available')).toBeInTheDocument();
  });
}); 