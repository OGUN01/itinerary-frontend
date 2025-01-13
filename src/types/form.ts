export interface FormData {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  preferences: {
    budget: number;
    activities: string[];
    meals: string[];
    transport_preferences: string[];
    preferred_places: string[];
    accommodation_type: 'hotel' | 'hostel' | 'apartment';
  };
} 