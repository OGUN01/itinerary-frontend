import { create } from 'zustand';
import { ItineraryResponse } from '@/types/api';

interface ItineraryState {
  currentItinerary: ItineraryResponse | null;
  setCurrentItinerary: (itinerary: ItineraryResponse | null) => void;
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  currentItinerary: null,
  setCurrentItinerary: (itinerary) => set({ currentItinerary: itinerary }),
})); 