'use client';

import { useParams } from 'next/navigation';
import { ItineraryTimeline } from '@/components/itinerary/ItineraryTimeline';
import { useItinerary } from '@/services/itinerary';

export default function ItineraryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: itinerary, isLoading, error } = useItinerary(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Error loading itinerary</p>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">No itinerary found</p>
          <p className="text-gray-400">The requested itinerary could not be found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Your Travel Itinerary
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(itinerary.trip_summary).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <span className="text-gray-600 capitalize">{key.replace('_', ' ')}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Daily Activities</h2>
        <ItineraryTimeline itinerary={itinerary} />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
        <ul className="list-disc pl-5 space-y-2">
          {itinerary.recommendations.map((recommendation: string, index: number) => (
            <li key={index} className="text-gray-700">{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 