import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TransportOption } from '@/types/api';
import { 
  FunnelIcon,
  ArrowsUpDownIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { TransportCard } from './TransportCard';

interface TransportListProps {
  options: TransportOption[];
  selectedOption?: TransportOption;
  onOptionSelect: (option: TransportOption) => void;
  filters?: TransportFilters;
  onFilterChange?: (filters: TransportFilters) => void;
}

interface TransportFilters {
  modes?: string[];
  maxPrice?: number;
  maxDuration?: number;
}

type SortKey = 'price' | 'duration' | 'departure';

// Helper functions
function parsePrice(priceStr: string): number {
  // Remove currency symbol and convert to number
  return Number(priceStr.replace(/[^0-9.-]+/g, ''));
}

function parseDuration(durationStr: string): number {
  // Parse duration string (e.g., "2h 30m" or "150m")
  const hours = durationStr.match(/(\d+)h/);
  const minutes = durationStr.match(/(\d+)m/);
  return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
}

export function TransportList({
  options,
  selectedOption,
  onOptionSelect,
  filters,
  onFilterChange
}: TransportListProps) {
  const [sortBy, setSortBy] = useState<SortKey>('price');
  const [showFilters, setShowFilters] = useState(false);

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parsePrice(a.price) - parsePrice(b.price);
        case 'duration':
          return parseDuration(a.duration) - parseDuration(b.duration);
        case 'departure':
          return new Date(a.departure).getTime() - new Date(b.departure).getTime();
        default:
          return 0;
      }
    });
  }, [options, sortBy]);

  const filteredOptions = useMemo(() => {
    if (!filters) return sortedOptions;
    
    return sortedOptions.filter(option => {
      if (filters.modes?.length && !filters.modes.includes(option.mode)) {
        return false;
      }
      if (filters.maxPrice && parsePrice(option.price) > filters.maxPrice) {
        return false;
      }
      if (filters.maxDuration && parseDuration(option.duration) > filters.maxDuration) {
        return false;
      }
      return true;
    });
  }, [sortedOptions, filters]);

  return (
    <div className="transport-list space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost btn-sm gap-2"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="select select-sm select-bordered"
          >
            <option value="price">Price</option>
            <option value="duration">Duration</option>
            <option value="departure">Departure</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {filteredOptions.length} options available
        </div>
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg">
            {/* Mode Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Mode</label>
              <div className="flex flex-wrap gap-2">
                {['train', 'bus', 'flight', 'car'].map(mode => (
                  <label key={mode} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters?.modes?.includes(mode)}
                      onChange={(e) => {
                        const newModes = e.target.checked
                          ? [...(filters?.modes || []), mode]
                          : (filters?.modes || []).filter(m => m !== mode);
                        onFilterChange?.({
                          ...filters,
                          modes: newModes
                        });
                      }}
                      className="checkbox checkbox-sm"
                    />
                    <span className="text-sm capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mt-4">
              <label className="text-sm font-medium">Max Price</label>
              <input
                type="range"
                min={0}
                max={1000}
                step={50}
                value={filters?.maxPrice || 1000}
                onChange={(e) => {
                  onFilterChange?.({
                    ...filters,
                    maxPrice: Number(e.target.value)
                  });
                }}
                className="range range-sm"
              />
              <div className="text-sm text-gray-600">
                Up to ${filters?.maxPrice || 1000}
              </div>
            </div>

            {/* Duration Filter */}
            <div className="mt-4">
              <label className="text-sm font-medium">Max Duration</label>
              <input
                type="range"
                min={0}
                max={24}
                step={1}
                value={filters?.maxDuration ? filters.maxDuration / 60 : 24}
                onChange={(e) => {
                  onFilterChange?.({
                    ...filters,
                    maxDuration: Number(e.target.value) * 60
                  });
                }}
                className="range range-sm"
              />
              <div className="text-sm text-gray-600">
                Up to {filters?.maxDuration ? filters.maxDuration / 60 : 24} hours
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Transport Options List */}
      <div className="space-y-2">
        {filteredOptions.map((option) => (
          <TransportCard
            key={`${option.mode}-${option.departure}`}
            option={option}
            isSelected={option === selectedOption}
            onSelect={() => onOptionSelect(option)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredOptions.length === 0 && (
        <div className="text-center py-8">
          <NoSymbolIcon className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">
            No transport options match your filters
          </p>
        </div>
      )}
    </div>
  );
} 