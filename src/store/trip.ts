import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';
import { DateRange, UserPreferences, ItineraryResponse } from '@/types/api';

interface TripState {
  origin: string;
  destination: string;
  dates: DateRange | null;
  preferences: UserPreferences | null;
  budget: number;
  currentItinerary: ItineraryResponse | null;
  
  // Actions
  setLocation: (type: 'origin' | 'destination', value: string) => void;
  setDates: (dates: DateRange) => void;
  setPreferences: (prefs: UserPreferences) => void;
  setBudget: (amount: number) => void;
  setItinerary: (itinerary: ItineraryResponse) => void;
  resetTrip: () => void;
}

const initialState = {
  origin: '',
  destination: '',
  dates: null,
  preferences: null,
  budget: 0,
  currentItinerary: null,
};

export const useTripStore = create<TripState>()((set) => ({
  ...initialState,

  setLocation: (type: 'origin' | 'destination', value: string) => 
    set((state: TripState) => ({
      ...state,
      [type]: value,
    })),

  setDates: (dates: DateRange) =>
    set((state: TripState) => ({
      ...state,
      dates,
    })),

  setPreferences: (preferences: UserPreferences) =>
    set((state: TripState) => ({
      ...state,
      preferences,
    })),

  setBudget: (budget: number) =>
    set((state: TripState) => ({
      ...state,
      budget,
    })),

  setItinerary: (itinerary: ItineraryResponse) =>
    set((state: TripState) => {
      console.log('setItinerary called with:', itinerary);
      
      // Validate itinerary data before setting
      if (!itinerary) {
        console.error('No itinerary data received');
        return state;
      }

      // Log the structure of the received data
      console.log('Received itinerary structure:', {
        tripSummary: itinerary.trip_summary,
        dailyItineraries: itinerary.daily_itineraries,
        totalCost: itinerary.total_cost,
        recommendations: itinerary.recommendations,
        weatherForecast: itinerary.weather_forecast,
        transportOptions: itinerary.transport_options,
        emergencyContacts: itinerary.emergency_contacts,
        usefulPhrases: itinerary.useful_phrases
      });

      // Basic validation with detailed logging
      if (!itinerary.trip_summary) {
        console.error('Missing trip_summary in itinerary');
        return state;
      }

      if (!Array.isArray(itinerary.daily_itineraries)) {
        console.error('daily_itineraries is not an array:', itinerary.daily_itineraries);
        return state;
      }

      // Validate daily itineraries with more detailed logging
      const validItineraries = itinerary.daily_itineraries.every((day, index) => {
        if (!day) {
          console.error(`Day ${index} is null or undefined`);
          return false;
        }

        const validationResults = {
          hasActivities: Array.isArray(day.activities),
          hasMeals: Array.isArray(day.meals),
          hasTransport: Array.isArray(day.transport),
          hasEstimatedCosts: typeof day.estimated_costs === 'object'
        };

        const isValid = Object.values(validationResults).every(Boolean);
        
        if (!isValid) {
          console.error(`Invalid structure for day ${index}:`, {
            dayData: day,
            validationResults
          });
        }
        
        return isValid;
      });

      if (!validItineraries) {
        console.error('Invalid daily itinerary structure detected');
        return state;
      }

      console.log('Itinerary validation passed, updating store');
      return {
        ...state,
        currentItinerary: itinerary,
      };
    }),

  resetTrip: () => set(initialState),
})); 