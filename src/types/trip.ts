export interface TripState {
  setPreferences: (preferences: TripPreferences) => void;
  preferences: TripPreferences;
}

export interface TripPreferences {
  budget: number;
  activities: string[];
  meal_preferences: string[];
  preferred_places: string[];
  transport_preferences: string[];
  accommodation_type: string;
} 