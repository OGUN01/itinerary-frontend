'use client';

import { useMemo } from 'react';
import { format, parse, isValid } from 'date-fns';
import { ItineraryResponse } from '@/types/api';

interface ItineraryTimelineProps {
  itinerary: ItineraryResponse;
}

export function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  const days = useMemo(() => {
    return itinerary.daily_itineraries.map((day, index) => {
      // Try to parse the date string safely
      let parsedDate: Date | null = null;
      try {
        // First try parsing as ISO string
        parsedDate = new Date(day.date);
        if (!isValid(parsedDate)) {
          // If that fails, try parsing as YYYY-MM-DD
          parsedDate = parse(day.date, 'yyyy-MM-dd', new Date());
        }
      } catch (error) {
        console.error(`Error parsing date for day ${index}:`, error);
        parsedDate = null;
      }

      return {
        date: parsedDate,
        activities: day.activities || [],
        meals: day.meals || [],
        transport: day.transport || [],
        weather: day.weather,
        weather_summary: day.weather_summary,
        index,
      };
    });
  }, [itinerary]);

  if (!days.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">No itinerary data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day.index} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Day {day.index + 1}
            {day.date && isValid(day.date) && (
              <span> - {format(day.date, 'MMMM d, yyyy')}</span>
            )}
          </h3>
          
          {/* Weather information */}
          {day.weather && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Weather</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Temperature: </span>
                  <span>{day.weather.temperature_celsius}°C</span>
                </div>
                <div>
                  <span className="text-gray-600">Condition: </span>
                  <span>{day.weather.condition}</span>
                </div>
                <div>
                  <span className="text-gray-600">Precipitation: </span>
                  <span>{day.weather.precipitation_chance}</span>
                </div>
                <div>
                  <span className="text-gray-600">Humidity: </span>
                  <span>{day.weather.humidity}</span>
                </div>
              </div>
              {day.weather_summary && (
                <div className="mt-4 text-sm">
                  <p className="text-gray-800">{day.weather_summary.description}</p>
                  <p className="text-gray-600 mt-2">{day.weather_summary.recommendations}</p>
                </div>
              )}
            </div>
          )}

          {/* Activities */}
          {day.activities.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Activities</h4>
              <div className="space-y-4">
                {day.activities.map((activity, activityIndex) => (
                  <div
                    key={activityIndex}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-24 flex-shrink-0">
                      <span className="text-gray-600">{activity.time}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meals */}
          {day.meals.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">Meals</h4>
              <div className="space-y-4">
                {day.meals.map((meal, mealIndex) => (
                  <div
                    key={mealIndex}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-24 flex-shrink-0">
                      <span className="text-gray-600">{meal.type}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800">{meal.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport */}
          {day.transport.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Transport</h4>
              <div className="space-y-4">
                {day.transport.map((transport, transportIndex) => (
                  <div
                    key={transportIndex}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-24 flex-shrink-0">
                      <span className="text-gray-600">{transport.time}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-gray-800">{transport.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 