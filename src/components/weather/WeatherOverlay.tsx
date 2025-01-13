import { motion } from 'framer-motion';
import { isSameDay } from 'date-fns/isSameDay';
import { WeatherInfo } from '@/types/api';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { WeatherCard } from './WeatherCard';

interface WeatherOverlayProps {
  dailyWeather: WeatherInfo[];
  onDaySelect?: (date: Date) => void;
  selectedDate?: Date;
}

export function WeatherOverlay({ 
  dailyWeather, 
  onDaySelect,
  selectedDate 
}: WeatherOverlayProps) {
  return (
    <div className="weather-overlay bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Weather Summary */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Weather Forecast</h3>
        <p className="text-sm text-gray-600">
          {dailyWeather.length} days forecast available
        </p>
      </div>

      {/* Weather Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {dailyWeather.map((weather) => (
          <WeatherCard
            key={weather.date.toString()}
            weather={weather}
            isSelected={selectedDate && isSameDay(selectedDate, new Date(weather.date))}
            onClick={() => onDaySelect?.(new Date(weather.date))}
          />
        ))}
      </motion.div>

      {/* Weather Legend */}
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <InformationCircleIcon className="w-4 h-4" />
          <span>Click on a day to see detailed weather information</span>
        </div>
      </div>
    </div>
  );
} 