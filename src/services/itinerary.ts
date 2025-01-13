import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  GenerateItineraryRequest,
  ItineraryResponse
} from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function useGenerateItinerary() {
  return useMutation({
    mutationFn: async (data: GenerateItineraryRequest) => {
      const response = await axios.post<ItineraryResponse>(
        `${API_URL}/api/itinerary`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    }
  });
}

export function useItinerary(id: string) {
  return useQuery({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      const response = await axios.get<ItineraryResponse>(
        `${API_URL}/api/itinerary/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.data;
    }
  });
}