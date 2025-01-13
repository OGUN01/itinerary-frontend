import { useState, useMemo } from 'react';
import { format } from 'date-fns/format';
import { parseISO } from 'date-fns/parseISO';
import { isSameDay } from 'date-fns/isSameDay';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { LocalEvent } from '@/types/events';
import { EventCard } from './EventCard';
import { 
  MagnifyingGlassIcon as SearchIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

interface EventsListProps {
  events: LocalEvent[];
  selectedDate?: Date;
  onEventSelect?: (event: LocalEvent) => void;
  className?: string;
}

export function EventsList({
  events,
  selectedDate,
  onEventSelect,
  className
}: EventsListProps) {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories for filter
  const categories = useMemo(() => {
    return Array.from(new Set(events.map(event => event.category)));
  }, [events]);

  // Group and filter events
  const groupedEvents = useMemo(() => {
    const filtered = events.filter(event => {
      if (filterCategory && event.category !== filterCategory) return false;
      if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    return filtered.reduce<Record<string, LocalEvent[]>>((groups, event) => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    }, {});
  }, [events, filterCategory, searchQuery]);

  return (
    <div className={clsx("events-list", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="select select-sm select-bordered"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="input input-sm input-bordered pl-8"
            />
            <SearchIcon className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Event Count */}
        <div className="text-sm text-gray-600">
          {Object.values(groupedEvents).reduce((sum, events) => sum + events.length, 0)} events found
        </div>
      </div>

      {/* Events by Date */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dateEvents]) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            {/* Date Header */}
            <h3 className="text-lg font-semibold">
              {format(parseISO(date), 'EEEE, MMMM d')}
            </h3>

            {/* Events */}
            <div className="grid gap-3">
              {dateEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isHighlighted={selectedDate ? isSameDay(event.date, selectedDate) : false}
                  onClick={() => onEventSelect?.(event)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(groupedEvents).length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-600">
            No events found for the selected filters
          </p>
        </motion.div>
      )}
    </div>
  );
} 