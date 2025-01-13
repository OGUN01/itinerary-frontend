import { render, screen, fireEvent } from '@testing-library/react';
import { TransportCard } from '../TransportCard';
import { AppError } from '@/utils/errors';
import { TransportOption } from '@/types/api';

const mockOption: TransportOption = {
  id: '1',
  mode: 'train',
  provider: 'Eurostar',
  departure_time: '2024-02-20T10:00:00Z',
  arrival_time: '2024-02-20T12:00:00Z',
  price: 100,
  duration_minutes: 120,
  details: {
    route: 'London → Paris',
    stops: ['Lille'],
    amenities: ['WiFi', 'Food']
  }
};

describe('TransportCard', () => {
  it('renders transport information correctly', () => {
    render(<TransportCard option={mockOption} isSelected={false} onSelect={() => {}} />);

    expect(screen.getByText('London → Paris')).toBeInTheDocument();
    expect(screen.getByText('Eurostar')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });

  it('handles missing transport data with error state', () => {
    render(<TransportCard option={undefined} isSelected={false} onSelect={() => {}} />);

    expect(screen.getByRole('heading', { name: 'Transport options unavailable' })).toBeInTheDocument();
  });

  it('displays error state when error prop is provided', () => {
    const error = new AppError('Failed to fetch transport data', 'API_ERROR');
    render(<TransportCard option={undefined} isSelected={false} onSelect={() => {}} error={error} />);

    expect(screen.getByRole('heading', { name: 'Transport options unavailable' })).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch transport data')).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked in error state', () => {
    const onRetry = jest.fn();
    const error = new AppError('Failed to fetch transport data', 'API_ERROR');
    render(
      <TransportCard 
        option={undefined} 
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
    render(<TransportCard option={mockOption} isSelected={true} onSelect={() => {}} />);

    const card = screen.getByRole('button', { pressed: true });
    expect(card).toHaveClass('border-primary', 'bg-primary/5');
  });

  it('calls onSelect when card is clicked', () => {
    const onSelect = jest.fn();
    render(<TransportCard option={mockOption} isSelected={false} onSelect={onSelect} />);

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(onSelect).toHaveBeenCalledTimes(1);
  });
}); 