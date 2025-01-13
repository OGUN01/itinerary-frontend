import { format } from 'date-fns/format';
import clsx from 'clsx';
import { TransportOption, TransportDetails } from '@/types/api';
import { 
  TruckIcon as TrainIcon,
  TruckIcon as BusIcon,
  PaperAirplaneIcon,
  TruckIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { TransportErrorState } from './TransportErrorState';
import { AppError } from '@/utils/errors';

interface TransportCardProps {
  option?: TransportOption;
  isSelected: boolean;
  onSelect: () => void;
  error?: AppError;
  onRetry?: () => void;
}

export function TransportCard({ 
  option, 
  isSelected, 
  onSelect,
  error,
  onRetry
}: TransportCardProps) {
  if (error) {
    return <TransportErrorState error={error} onRetry={onRetry} />;
  }

  if (!option) {
    return <TransportErrorState 
      error={new AppError('Transport option unavailable', 'API_ERROR')} 
      onRetry={onRetry} 
    />;
  }

  const {
    mode,
    provider,
    departure,
    arrival,
    price,
    duration,
    details
  } = option;

  // Parse details if it's a string
  let parsedDetails: TransportDetails;
  try {
    parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
  } catch (e) {
    parsedDetails = { route: 'Route information unavailable' };
  }

  return (
    <div 
      className={clsx(
        "transport-card p-4 rounded-lg border transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-gray-200",
        "hover:border-primary/50 cursor-pointer"
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TransportIcon mode={mode} />
          <span className="font-medium">{provider}</span>
        </div>
        <div className="flex items-center gap-1 text-lg font-semibold">
          <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />
          <span data-testid="transport-price">{price}</span>
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4 text-gray-600" />
          <time>{format(new Date(departure), 'HH:mm')}</time>
        </div>
        <span className="text-gray-400">→</span>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4 text-gray-600" />
          <time>{format(new Date(arrival), 'HH:mm')}</time>
        </div>
        <span className="ml-auto text-gray-600" data-testid="transport-duration">
          {duration}
        </span>
      </div>

      {/* Details */}
      <div className="mt-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPinIcon className="w-4 h-4" />
          <span>{parsedDetails.route}</span>
        </div>
        {parsedDetails.stops && Array.isArray(parsedDetails.stops) && parsedDetails.stops.length > 0 && (
          <div className="mt-1">
            <span className="text-gray-500">Stops: </span>
            {parsedDetails.stops.join(' → ')}
          </div>
        )}
        {parsedDetails.amenities && Array.isArray(parsedDetails.amenities) && parsedDetails.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {parsedDetails.amenities.map((amenity: string) => (
              <Badge key={amenity}>{amenity}</Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransportIcon({ mode }: { mode: string }) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'train': TrainIcon,
    'bus': BusIcon,
    'flight': PaperAirplaneIcon,
    'car': TruckIcon,
  };
  
  const Icon = iconMap[mode.toLowerCase()] || QuestionMarkCircleIcon;
  return <Icon className="w-6 h-6 text-gray-600" />;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
      {children}
    </span>
  );
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
} 