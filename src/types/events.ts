export interface EventCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const eventCategories: Record<string, EventCategory> = {
  'Music': {
    id: 'music',
    label: 'Music',
    icon: 'musical-note',
    color: 'purple'
  },
  'Sports': {
    id: 'sports',
    label: 'Sports',
    icon: 'trophy',
    color: 'green'
  },
  'Arts': {
    id: 'arts',
    label: 'Arts',
    icon: 'paint-brush',
    color: 'blue'
  },
  'Food': {
    id: 'food',
    label: 'Food',
    icon: 'cake',
    color: 'orange'
  }
};

export interface LocalEvent {
  id: string;
  name: string;
  date: Date;
  venue: string;
  category: string;
  price_range?: string;
  description?: string;
}

export function getEventCategory(category: string): EventCategory {
  return eventCategories[category] || {
    id: category.toLowerCase(),
    label: category,
    icon: 'tag',
    color: 'gray'
  };
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) return `$${min}`;
  if (max === 0) return 'Free';
  if (min === 0) return `Up to $${max}`;
  return `$${min} - $${max}`;
} 