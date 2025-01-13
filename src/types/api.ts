// Base Types
export interface TravelInput {
  origin: string;
  destination: string;
  start_date: string;
  return_date: string;
}

export interface UserPreferences {
  budget: number;
  activities: string[];
  meal_preferences: string[];
  preferred_places: string[];
  transport_preferences: string[];
  accommodation_type: 'hotel' | 'hostel' | 'apartment';
}

export interface GenerateItineraryRequest {
  travel_input: TravelInput;
  user_preferences: UserPreferences;
}

// Weather Types
export interface WeatherInfo {
  date: string;
  temperature_celsius: number;
  condition: string;
  precipitation_chance: number;
  humidity: number;
}

export interface LocalEvent {
  name: string;
  date: string;
  venue: string;
  category: string;
  price_range: string;
  description?: string;
}

export interface WeatherResponse {
  weather_forecast: WeatherInfo[];
  local_events: LocalEvent[];
}

// Transport Types
export interface TransportDetails {
  route: string;
  stops?: string[];
  amenities?: string[];
}

export interface TransportOption {
  mode: string;
  provider: string;
  departure: string;
  arrival: string;
  price: string;
  duration: string;
  details: string | TransportDetails;
}

export interface TransportResponse {
  options: TransportOption[];
}

// Itinerary Types
export interface Activity {
  time: string;
  description: string;
}

export interface Meal {
  type: string;
  suggestion: string;
}

export interface Transport {
  time: string;
  description: string;
}

export interface Weather {
  date: string;
  temperature_celsius: string;
  condition: string;
  precipitation_chance: string;
  humidity: string;
}

export interface WeatherSummary {
  description: string;
  recommendations: string;
}

export interface Accommodation {
  name: string;
  address: string;
  details: string;
}

export interface DailyRoute {
  latitude: number;
  longitude: number;
  stop_name: string;
}

export interface EstimatedCosts {
  activities: number;
  meals: number;
  transport: number;
  accommodation: number;
}

export interface DailyItinerary {
  date: string;
  activities: Activity[];
  meals: Meal[];
  transport: Transport[];
  weather: Weather;
  estimated_costs: EstimatedCosts;
  weather_summary: WeatherSummary;
  accommodation: Accommodation;
  local_events: any[];
  daily_route: DailyRoute[];
}

export interface TripSummary {
  trip_dates: string;
  destination: string;
  budget: string;
  preferences: string;
  must_visit_places: string;
  trip_goal: string;
}

export interface EmergencyContacts {
  police: string;
  ambulance: string;
  tourist_helpline: string;
}

export interface UsefulPhrases {
  hello: string;
  thank_you: string;
  help: string;
}

export interface ItineraryResponse {
  trip_summary: TripSummary;
  daily_itineraries: DailyItinerary[];
  total_cost: number;
  recommendations: string[];
  weather_forecast: Weather[];
  transport_options: any[];
  emergency_contacts: EmergencyContacts;
  useful_phrases: UsefulPhrases;
}

// API Error Types
export type APIErrorType = 
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'TIMEOUT_ERROR'
  | 'CANCELLED'
  | 'UNKNOWN_ERROR';

export type ItineraryRequestStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface APIError {
  type: 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'CANCELLED' | 'UNKNOWN_ERROR';
  message: string;
  code: string;
  details?: unknown;
  status?: ItineraryRequestStatus;
}

export interface DateRange {
  start_date: string;
  return_date: string;
}

export interface EventInfo {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  category: string;
  price: number;
  currency: string;
  availability: string;
}