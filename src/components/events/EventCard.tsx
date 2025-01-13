import { format } from 'date-fns/format';
import clsx from 'clsx';
import { LocalEvent } from '@/types/events';
import { 
  MusicalNoteIcon,
  TrophyIcon,
  PaintBrushIcon,
  CakeIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import type { ComponentProps } from 'react';
import { EventsErrorState } from './EventsErrorState';
import { AppError } from '@/utils/errors';

interface EventCardProps {
  event?: LocalEvent;
  className?: string;
  isHighlighted?: boolean;
  onClick?: () => void;
  onRetry?: () => void;
  error?: AppError;
}

export function EventCard({ 
  event, 
  className,
  isHighlighted,
  onClick,
  onRetry,
  error 
}: EventCardProps) {
  if (error) {
    return <EventsErrorState error={error} onRetry={onRetry} />;
  }

  if (!event) {
    return <EventsErrorState 
      error={new AppError('Event details unavailable', 'API_ERROR')} 
      onRetry={onRetry} 
    />;
  }

  const {
    name,
    date,
    venue,
    category,
    price_range,
    description
  } = event;

  return (
    <div 
      className={clsx(
        "event-card p-4 rounded-lg border transition-all",
        isHighlighted ? "border-primary bg-primary/5" : "border-gray-200",
        "hover:shadow-md cursor-pointer",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isHighlighted ? true : false}
    >
      {/* Event Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-600">{venue}</p>
        </div>
        <EventCategoryBadge category={category} />
      </div>

      {/* Event Time */}
      <div className="mt-2 flex items-center text-sm text-gray-600">
        <CalendarIcon className="w-4 h-4 mr-1" />
        <time>{format(new Date(date), 'MMM d, yyyy')}</time>
        <ClockIcon className="w-4 h-4 ml-3 mr-1" />
        <time>{format(new Date(date), 'h:mm a')}</time>
      </div>

      {/* Price Range */}
      {price_range && (
        <div className="mt-2 flex items-center text-sm">
          <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-600" />
          <span>{price_range}</span>
        </div>
      )}

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
}

function EventCategoryBadge({ category }: { category: string }) {
  type IconComponent = React.ComponentType<ComponentProps<'svg'>>;
  
  const categoryStyles: Record<string, { color: string; icon: IconComponent }> = {
    'Music': { color: 'bg-purple-100 text-purple-800', icon: MusicalNoteIcon },
    'Sports': { color: 'bg-green-100 text-green-800', icon: TrophyIcon },
    'Arts': { color: 'bg-blue-100 text-blue-800', icon: PaintBrushIcon },
    'Food': { color: 'bg-orange-100 text-orange-800', icon: CakeIcon }
  };

  const { color, icon: Icon } = categoryStyles[category] || {
    color: 'bg-gray-100 text-gray-800',
    icon: TagIcon
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      color
    )}>
      <Icon className="w-3 h-3 mr-1" />
      {category}
    </span>
  );
} 