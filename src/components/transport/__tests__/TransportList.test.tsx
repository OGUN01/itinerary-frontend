import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransportList } from '../TransportList';
import { TransportOption } from '@/types/api';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}));

describe('TransportList', () => {
  const mockOptions: TransportOption[] = [
    {
      id: 'train-1',
      mode: 'train',
      provider: 'Indian Railways',
      departure_time: '2025-01-10T08:00:00',
      arrival_time: '2025-01-10T14:00:00',
      price: 50,
      duration_minutes: 360,
      details: {
        route: 'Delhi → Jaipur',
        stops: ['Gurgaon', 'Alwar'],
        amenities: ['WiFi', 'Food']
      }
    },
    {
      id: 'bus-1',
      mode: 'bus',
      provider: 'RedBus',
      departure_time: '2025-01-10T09:00:00',
      arrival_time: '2025-01-10T16:00:00',
      price: 30,
      duration_minutes: 420,
      details: {
        route: 'Delhi → Jaipur',
        stops: ['Gurgaon', 'Manesar', 'Alwar'],
        amenities: ['AC']
      }
    },
    {
      id: 'flight-1',
      mode: 'flight',
      provider: 'Air India',
      departure_time: '2025-01-10T10:00:00',
      arrival_time: '2025-01-10T11:00:00',
      price: 100,
      duration_minutes: 60,
      details: {
        route: 'Delhi → Jaipur',
        amenities: ['Meals']
      }
    }
  ];

  it('renders transport options correctly', () => {
    render(
      <TransportList 
        options={mockOptions}
        onOptionSelect={() => {}}
      />
    );
    
    expect(screen.getByText('Indian Railways')).toBeInTheDocument();
    expect(screen.getByText('RedBus')).toBeInTheDocument();
    expect(screen.getByText('Air India')).toBeInTheDocument();
  });

  it('handles option selection', () => {
    const handleSelect = jest.fn();
    render(
      <TransportList 
        options={mockOptions}
        onOptionSelect={handleSelect}
      />
    );
    
    fireEvent.click(screen.getByText('Indian Railways'));
    expect(handleSelect).toHaveBeenCalledWith(mockOptions[0]);
  });

  it('sorts options by price', () => {
    render(
      <TransportList 
        options={mockOptions}
        onOptionSelect={() => {}}
      />
    );
    
    const prices = screen.getAllByTestId('transport-price').map(el => Number(el.textContent));
    expect(prices).toEqual([30, 50, 100]); // Default sort is by price
  });

  it('sorts options by duration when selected', () => {
    render(
      <TransportList 
        options={mockOptions}
        onOptionSelect={() => {}}
      />
    );
    
    // Change sort to duration
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'duration' }
    });
    
    const durations = screen.getAllByTestId('transport-duration').map(el => el.textContent);
    expect(durations).toEqual(['1h 0m', '6h 0m', '7h 0m']);
  });

  it('filters options by mode', () => {
    const { rerender } = render(
      <TransportList 
        options={mockOptions}
        filters={{ modes: ['train'] }}
        onOptionSelect={() => {}}
      />
    );
    
    expect(screen.getByText('Indian Railways')).toBeInTheDocument();
    expect(screen.queryByText('RedBus')).not.toBeInTheDocument();
    expect(screen.queryByText('Air India')).not.toBeInTheDocument();
    
    // Update filters
    rerender(
      <TransportList 
        options={mockOptions}
        filters={{ modes: ['bus', 'flight'] }}
        onOptionSelect={() => {}}
      />
    );
    
    expect(screen.queryByText('Indian Railways')).not.toBeInTheDocument();
    expect(screen.getByText('RedBus')).toBeInTheDocument();
    expect(screen.getByText('Air India')).toBeInTheDocument();
  });

  it('filters options by price', () => {
    render(
      <TransportList 
        options={mockOptions}
        filters={{ maxPrice: 60 }}
        onOptionSelect={() => {}}
      />
    );
    
    expect(screen.getByText('Indian Railways')).toBeInTheDocument();
    expect(screen.getByText('RedBus')).toBeInTheDocument();
    expect(screen.queryByText('Air India')).not.toBeInTheDocument();
  });

  it('displays empty state when no options match filters', () => {
    render(
      <TransportList 
        options={mockOptions}
        filters={{ maxPrice: 20 }}
        onOptionSelect={() => {}}
      />
    );
    
    expect(screen.getByText('No transport options match your filters')).toBeInTheDocument();
  });

  it('shows correct number of available options', () => {
    render(
      <TransportList 
        options={mockOptions}
        onOptionSelect={() => {}}
      />
    );
    
    expect(screen.getByText('3 options available')).toBeInTheDocument();
  });
}); 