import { format } from 'date-fns/format';
import clsx from 'clsx';
import { WeatherInfo } from '@/types/api';
import { 
  SunIcon, 
  CloudIcon, 
  CloudIcon as CloudRainIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';
import { WeatherErrorState } from './WeatherErrorState';
import { AppError } from '@/utils/errors';

interface WeatherCardProps {
  weather?: WeatherInfo;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onRetry?: () => void;
  error?: AppError;
}

export function WeatherCard({ 
  weather, 
  className, 
  isSelected, 
  onClick,
  onRetry,
  error 
}: WeatherCardProps) {
  if (error) {
    return <WeatherErrorState error={error} onRetry={onRetry} />;
  }

  if (!weather) {
    return <WeatherErrorState 
      error={new AppError('Weather data unavailable', 'API_ERROR')} 
      onRetry={onRetry} 
    />;
  }

  return (
    <div 
      className={clsx(
        "bg-white rounded-lg shadow-md p-4 transition-all",
        "hover:shadow-lg cursor-pointer",
        isSelected && "ring-2 ring-primary",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between">
        {/* Date */}
        <div className="text-sm text-gray-600">
          {format(new Date(weather.date), 'EEE, MMM d')}
        </div>
        
        {/* Temperature */}
        <div className="text-lg font-semibold">
          {weather.temperature_celsius}°C
        </div>
      </div>
      
      {/* Weather Condition */}
      <div className="flex items-center mt-2">
        <WeatherIcon condition={weather.condition} />
        <span className="ml-2 text-sm">{weather.condition}</span>
      </div>
      
      {/* Additional Info */}
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Precipitation:</span>
          <span>{weather.precipitation_chance}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Humidity:</span>
          <span>{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
}

function WeatherIcon({ condition }: { condition: string }) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'Sunny': SunIcon,
    'Cloudy': CloudIcon,
    'Rainy': CloudRainIcon,
    // Add more mappings as needed
  };
  
  const Icon = iconMap[condition] || QuestionMarkCircleIcon;
  return <Icon className="w-6 h-6 text-gray-600" />;
} 