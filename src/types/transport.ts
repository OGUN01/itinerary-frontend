export interface TransportMode {
  id: string;
  label: string;
  icon: string;
  amenities: string[];
}

export const transportModes: Record<string, TransportMode> = {
  'train': {
    id: 'train',
    label: 'Train',
    icon: 'train',
    amenities: ['WiFi', 'Food Service', 'Power Outlets']
  },
  'bus': {
    id: 'bus',
    label: 'Bus',
    icon: 'bus',
    amenities: ['Air Conditioning', 'WiFi']
  },
  'flight': {
    id: 'flight',
    label: 'Flight',
    icon: 'paper-airplane',
    amenities: ['In-flight Meals', 'Entertainment']
  },
  'car': {
    id: 'car',
    label: 'Car',
    icon: 'truck',
    amenities: ['Air Conditioning', 'Flexible Route']
  }
};

export interface TransportOption {
  id: string;
  mode: string;
  provider: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  duration_minutes: number;
  details: {
    route: string;
    stops?: string[];
    amenities?: string[];
  };
}

export interface TransportFilters {
  modes?: string[];
  maxPrice?: number;
  maxDuration?: number;
  departureTime?: [Date, Date];
}

export interface TransportError {
  code: string;
  message: string;
}

// Utility functions
export function getTransportMode(mode: string): TransportMode {
  return transportModes[mode.toLowerCase()] || {
    id: mode.toLowerCase(),
    label: mode,
    icon: 'question',
    amenities: []
  };
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function calculateLayoverTime(arrival: string, departure: string): number {
  const arrivalTime = new Date(arrival).getTime();
  const departureTime = new Date(departure).getTime();
  return Math.floor((departureTime - arrivalTime) / (1000 * 60)); // Returns minutes
}

export function isValidTransportOption(option: TransportOption): boolean {
  return (
    !!option.id &&
    !!option.mode &&
    !!option.provider &&
    !!option.departure_time &&
    !!option.arrival_time &&
    typeof option.price === 'number' &&
    typeof option.duration_minutes === 'number' &&
    !!option.details?.route
  );
}

export function sortTransportOptions(
  options: TransportOption[],
  sortBy: 'price' | 'duration' | 'departure'
): TransportOption[] {
  return [...options].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration_minutes - b.duration_minutes;
      case 'departure':
        return new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime();
      default:
        return 0;
    }
  });
}

export function filterTransportOptions(
  options: TransportOption[],
  filters: TransportFilters
): TransportOption[] {
  return options.filter(option => {
    if (filters.modes?.length && !filters.modes.includes(option.mode)) {
      return false;
    }
    if (filters.maxPrice && option.price > filters.maxPrice) {
      return false;
    }
    if (filters.maxDuration && option.duration_minutes > filters.maxDuration) {
      return false;
    }
    if (filters.departureTime) {
      const [start, end] = filters.departureTime;
      const departureTime = new Date(option.departure_time).getTime();
      if (departureTime < start.getTime() || departureTime > end.getTime()) {
        return false;
      }
    }
    return true;
  });
} 