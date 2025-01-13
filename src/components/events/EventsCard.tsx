import { AppError } from '@/utils/errors';
import { EventInfo } from '@/types/api';
import { cn } from '../../utils/styles';

interface EventsCardProps {
  event?: EventInfo;
  isSelected: boolean;
  onSelect: () => void;
  error?: AppError;
  onRetry?: () => void;
}

export function EventsCard({ event, isSelected, onSelect, error, onRetry }: EventsCardProps) {
  if (error) {
    return (
      <div className="p-4 border rounded-lg">
        <p>Event data unavailable</p>
        <p>{error.message}</p>
        {onRetry && <button onClick={onRetry}>Retry</button>}
      </div>
    );
  }

  if (!event) {
    return <div className="p-4 border rounded-lg">Event data unavailable</div>;
  }

  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        "w-full p-4 border rounded-lg text-left",
        isSelected && "border-primary bg-primary/5"
      )}
    >
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>{event.location}</p>
      <p>${event.price}</p>
    </button>
  );
} 