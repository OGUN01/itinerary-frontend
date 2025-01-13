'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useItineraryStore } from '@/store/itinerary';
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, CloudIcon } from '@heroicons/react/24/outline';

export default function ItineraryPage() {
  const router = useRouter();
  const currentItinerary = useItineraryStore(state => state.currentItinerary);

  useEffect(() => {
    if (!currentItinerary) {
      router.replace('/plan');
    }
  }, [currentItinerary, router]);

  if (!currentItinerary) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Title */}
          <h1 className="text-5xl font-bold text-center">Your Travel Itinerary</h1>

          {/* Summary */}
          <div className="bg-black/20 backdrop-blur-xl rounded-xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <MapPinIcon className="h-8 w-8 text-sky-400" />
                <div>
                  <p className="text-gray-400">Total Cost</p>
                  <p className="text-2xl font-semibold">
                    ${currentItinerary.total_cost}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-8 w-8 text-sky-400" />
                <div>
                  <p className="text-gray-400">Trip Dates</p>
                  <p className="text-2xl font-semibold">
                    {currentItinerary.trip_summary.trip_dates}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CurrencyDollarIcon className="h-8 w-8 text-sky-400" />
                <div>
                  <p className="text-gray-400">Budget</p>
                  <p className="text-2xl font-semibold">
                    {currentItinerary.trip_summary.budget}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {currentItinerary.recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Travel Tips</h2>
              <div className="bg-black/20 backdrop-blur-xl rounded-xl p-8 border border-white/10">
                <ul className="list-disc list-inside space-y-4 text-gray-300">
                  {currentItinerary.recommendations.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Daily Itineraries */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Daily Schedule</h2>
            {currentItinerary.daily_itineraries.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
                className="bg-black/20 backdrop-blur-xl rounded-xl p-8 border border-white/10"
              >
                <h3 className="text-xl font-semibold mb-6">
                  Day {dayIndex + 1} - {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>

                {/* Weather */}
                <div className="space-y-6 mb-8">
                  <h4 className="text-lg font-semibold text-sky-400">Weather</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-white/5">
                      <div className="flex items-start gap-4">
                        <CloudIcon className="h-8 w-8 text-sky-400" />
                        <div>
                          <p className="text-gray-400">Temperature</p>
                          <p className="text-xl font-semibold">{day.weather.temperature_celsius}°C</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-gray-300">Condition: {day.weather.condition}</p>
                        <p className="text-gray-300">Precipitation: {day.weather.precipitation_chance}</p>
                        <p className="text-gray-300">Humidity: {day.weather.humidity}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5">
                      <h5 className="font-semibold text-sky-400 mb-3">Weather Summary</h5>
                      <p className="text-gray-300 mb-3">{day.weather_summary.description}</p>
                      <p className="text-gray-300">{day.weather_summary.recommendations}</p>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                {day.activities.length > 0 && (
                  <div className="space-y-6 mb-8">
                    <h4 className="text-lg font-semibold text-sky-400">Activities</h4>
                    {day.activities.map((activity, activityIndex) => (
                      <div 
                        key={activityIndex}
                        className="flex items-start gap-6 p-4 rounded-lg bg-white/5"
                      >
                        <div className="text-sky-400 font-mono whitespace-nowrap">
                          {activity.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Meals */}
                {day.meals.length > 0 && (
                  <div className="space-y-6 mb-8">
                    <h4 className="text-lg font-semibold text-sky-400">Meals</h4>
                    {day.meals.map((meal, mealIndex) => (
                      <div 
                        key={mealIndex}
                        className="flex items-start gap-6 p-4 rounded-lg bg-white/5"
                      >
                        <div className="text-sky-400 font-mono whitespace-nowrap">
                          {meal.type}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">{meal.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transport */}
                {day.transport.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-sky-400">Transport</h4>
                    {day.transport.map((transport, transportIndex) => (
                      <div 
                        key={transportIndex}
                        className="flex items-start gap-6 p-4 rounded-lg bg-white/5"
                      >
                        <div className="text-sky-400 font-mono whitespace-nowrap">
                          {transport.time}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-300">{transport.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/plan')}
              className="px-8 py-4 rounded-xl font-semibold text-lg
                       border border-white/10 hover:border-white/20
                       text-white transition-all"
            >
              Plan Another Trip
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="px-8 py-4 rounded-xl font-semibold text-lg
                       bg-sky-500 hover:bg-sky-600 text-white
                       transition-all shadow-lg shadow-sky-500/30"
            >
              Save Itinerary
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 