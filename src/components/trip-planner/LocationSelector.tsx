'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPinIcon, MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { FormData } from '@/types/form';

interface City {
  name: string;
  country: string;
  image: string;
  landmarks: string[];
}

interface LocationSelectorProps {
  formData: FormData;
  updateFormData: Dispatch<SetStateAction<FormData>>;
  onNext: () => void;
}

export default function LocationSelector({ formData, updateFormData, onNext }: LocationSelectorProps) {
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<'origin' | 'destination' | null>(null);
  
  // Mock data - replace with API call
  const popularDestinations: City[] = [
    {
      name: 'Paris',
      country: 'France',
      image: '/images/destinations/paris.jpg',
      landmarks: ['Eiffel Tower', 'Louvre Museum']
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      image: '/images/destinations/tokyo.jpg',
      landmarks: ['Tokyo Tower', 'Shibuya Crossing']
    },
    {
      name: 'New York',
      country: 'United States',
      image: '/images/destinations/newyork.jpg',
      landmarks: ['Statue of Liberty', 'Times Square']
    }
  ];

  // Mock suggestions - replace with API call
  const getSuggestions = (value: string) => {
    if (!value.trim()) return [];
    const allCities = [...popularDestinations.map(city => city.name), 'London', 'Dubai', 'Singapore', 'Rome', 'Barcelona'];
    return allCities.filter(city => 
      city.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);
  };

  const handleOriginChange = (value: string) => {
    updateFormData(prev => ({ ...prev, origin: value }));
    if (activeSuggestion === 'origin') {
      setSuggestions(getSuggestions(value));
    }
  };

  const handleDestinationChange = (value: string) => {
    updateFormData(prev => ({ ...prev, destination: value }));
    if (activeSuggestion === 'destination') {
      setSuggestions(getSuggestions(value));
    }
  };

  const handleSuggestionClick = (value: string) => {
    if (activeSuggestion === 'origin') {
      handleOriginChange(value);
    } else if (activeSuggestion === 'destination') {
      handleDestinationChange(value);
    }
    setSuggestions([]);
    setActiveSuggestion(null);
  };

  const handleClearInput = (field: 'origin' | 'destination') => {
    updateFormData(prev => ({ ...prev, [field]: '' }));
  };

  const handleNext = () => {
    if (formData.origin && formData.destination) {
      onNext();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Full page background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1225] via-[#132347] to-[#1B1631]" />
        <div className="absolute inset-0">
          {/* Subtle star field effect */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/10 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1
              }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: Math.random() * 2 + 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Steps */}
            <div className="flex items-center gap-8">
              {[
                { number: 1, label: 'Location', active: true },
                { number: 2, label: 'Dates', active: false },
                { number: 3, label: 'Preferences', active: false }
              ].map((step, index) => (
                <div key={step.label} className="flex items-center">
                  {index > 0 && (
                    <div className="h-px w-8 bg-gray-800 -ml-8 mr-4" />
                  )}
                  <motion.div 
                    className={`flex items-center gap-2 ${
                      step.active ? 'opacity-100' : 'opacity-40'
                    }`}
                    initial={false}
                    animate={{ opacity: step.active ? 1 : 0.4 }}
                  >
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                      ${step.active ? 'bg-sky-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {step.number}
                    </span>
                    <span className="text-sm font-medium text-white">
                      {step.label}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
            
            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!formData.origin || !formData.destination}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                       ${formData.origin && formData.destination
                         ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30'
                         : 'bg-gray-800/50 text-gray-400 cursor-not-allowed'}`}
            >
              Continue
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-24"
          >
            {/* Travel Details Section */}
            <div className="relative">
              <div className="max-w-2xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  {/* Main Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                    {/* Dynamic Gradient Background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-pink-500/10"
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Glass Container */}
                    <div className="relative bg-gray-900/40 backdrop-blur-xl p-8">
                      {/* Header Section */}
                      <div className="flex items-center gap-4 mb-8">
                        <motion.div 
                          className="p-3 rounded-xl bg-sky-500/10"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MapPinIcon className="w-6 h-6 text-sky-400" />
                        </motion.div>
                        <div className="flex-1">
                          <h2 className="text-2xl font-semibold text-white">Plan Your Journey</h2>
                          <p className="text-sm text-gray-400 mt-1">Discover your next adventure</p>
                        </div>
                        {/* Completion Indicator */}
                        <motion.div 
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                          animate={formData.origin && formData.destination ? { scale: [1, 1.05, 1] } : {}}
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            formData.origin && formData.destination ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                          <span className="text-xs font-medium text-gray-400">
                            {formData.origin && formData.destination ? 'Ready' : 'Select locations'}
                          </span>
                        </motion.div>
                      </div>

                      {/* Interactive Form Section */}
                      <div className="space-y-6">
                        {/* Origin Input */}
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`relative group ${
                              isOriginFocused ? 'ring-2 ring-sky-400/50' : ''
                            }`}
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400/50 to-transparent 
                                          rounded-l-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                            
                            <MapPinIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors
                              ${isOriginFocused ? 'text-sky-400' : 'text-gray-400'}`} />
                            
                            <input
                              type="text"
                              value={formData.origin}
                              onChange={(e) => handleOriginChange(e.target.value)}
                              onFocus={() => {
                                setIsOriginFocused(true);
                                setActiveSuggestion('origin');
                                setSuggestions(getSuggestions(formData.origin));
                              }}
                              onBlur={() => {
                                setIsOriginFocused(false);
                                setTimeout(() => setActiveSuggestion(null), 200);
                              }}
                              placeholder="From where?"
                              className="w-full pl-12 pr-10 py-4 bg-white/5 rounded-xl text-white placeholder-gray-400
                                       outline-none border border-white/10 focus:border-sky-400/50 transition-all"
                            />

                            {/* Status Indicator */}
                            <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 
                              ${formData.origin ? 'opacity-100' : 'opacity-0'}`}>
                              {formData.origin ? (
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                                  onClick={() => handleClearInput('origin')}
                                >
                                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                                </motion.button>
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                              )}
                            </div>
                          </motion.div>

                          {/* Enhanced Suggestions */}
                          <AnimatePresence>
                            {activeSuggestion === 'origin' && suggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-2 py-2 bg-gray-900/95 backdrop-blur-xl
                                         rounded-xl border border-white/10 shadow-xl"
                              >
                                {suggestions.map((suggestion, index) => (
                                  <motion.div
                                    key={suggestion}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group px-4 py-2.5 hover:bg-white/5 cursor-pointer flex items-center
                                             text-white transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                        <MapPinIcon className="h-4 w-4 text-sky-400" />
                                      </div>
                                      <div>
                                        <span className="block font-medium">{suggestion}</span>
                                        <span className="text-xs text-gray-400">Popular destination</span>
                                      </div>
                                    </div>
                                    <motion.div
                                      className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <ArrowRightIcon className="w-3 h-3 text-gray-400" />
                                    </motion.div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Simplified Connection Line */}
                        <div className="relative flex justify-center py-4">
                          <div className="absolute left-1/2 -translate-x-1/2 w-[1px] h-10">
                            <div className="w-full h-full bg-gradient-to-b from-sky-400/20 to-purple-400/20" />
                            <motion.div 
                              className="absolute inset-0"
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{
                                duration: 0.3,
                                ease: "easeOut"
                              }}
                              style={{
                                background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
                                transformOrigin: 'top'
                              }}
                            />
                          </div>
                        </div>

                        {/* Destination Input (Similar enhancements as Origin) */}
                        <div className="relative">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`relative group ${
                              isDestinationFocused ? 'ring-2 ring-purple-400/50' : ''
                            }`}
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400/50 to-transparent 
                                          rounded-l-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                            
                            <MapPinIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors
                              ${isDestinationFocused ? 'text-purple-400' : 'text-gray-400'}`} />
                            
                            <input
                              type="text"
                              value={formData.destination}
                              onChange={(e) => handleDestinationChange(e.target.value)}
                              onFocus={() => {
                                setIsDestinationFocused(true);
                                setActiveSuggestion('destination');
                                setSuggestions(getSuggestions(formData.destination));
                              }}
                              onBlur={() => {
                                setIsDestinationFocused(false);
                                setTimeout(() => setActiveSuggestion(null), 200);
                              }}
                              placeholder="Where to?"
                              className="w-full pl-12 pr-10 py-4 bg-white/5 rounded-xl text-white placeholder-gray-400
                                       outline-none border border-white/10 focus:border-purple-400/50 transition-all"
                            />

                            {/* Status Indicator */}
                            <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 
                              ${formData.destination ? 'opacity-100' : 'opacity-0'}`}>
                              {formData.destination ? (
                                <motion.button
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                                  onClick={() => handleClearInput('destination')}
                                >
                                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                                </motion.button>
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                              )}
                            </div>
                          </motion.div>

                          {/* Enhanced Suggestions */}
                          <AnimatePresence>
                            {activeSuggestion === 'destination' && suggestions.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-50 w-full mt-2 py-2 bg-gray-900/95 backdrop-blur-xl
                                         rounded-xl border border-white/10 shadow-xl"
                              >
                                {suggestions.map((suggestion, index) => (
                                  <motion.div
                                    key={suggestion}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group px-4 py-2.5 hover:bg-white/5 cursor-pointer flex items-center
                                             text-white transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                        <MapPinIcon className="h-4 w-4 text-purple-400" />
                                      </div>
                                      <div>
                                        <span className="block font-medium">{suggestion}</span>
                                        <span className="text-xs text-gray-400">Popular destination</span>
                                      </div>
                                    </div>
                                    <motion.div
                                      className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <ArrowRightIcon className="w-3 h-3 text-gray-400" />
                                    </motion.div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Action Footer */}
                      {(formData.origin || formData.destination) && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 pt-6 border-t border-white/5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-sky-400" />
                              <span className="text-sm text-gray-400">
                                {formData.origin && formData.destination 
                                  ? 'Ready to explore!' 
                                  : 'Complete your journey details'}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleNext}
                              disabled={!formData.origin || !formData.destination}
                              className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all
                                       ${formData.origin && formData.destination
                                         ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-purple-500/20'
                                         : 'bg-gray-800/50 text-gray-400 cursor-not-allowed'}`}
                            >
                              Continue
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Popular Destinations */}
            <div className="mt-16">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-xl bg-purple-500/10">
                    <MapPinIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Popular Destinations</h2>
                    <p className="text-sm text-gray-400">Discover trending locations</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  {['All', 'Europe', 'Asia', 'Americas'].map((category) => (
                    <button
                      key={category}
                      className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 
                               text-gray-300 hover:text-white transition-colors border border-white/5"
                    >
                      {category}
                    </button>
                  ))}
                </motion.div>
              </div>

              {/* Mobile Scroll View */}
              <div className="block sm:hidden -mx-4">
                <div className="flex overflow-x-auto snap-x snap-mandatory pb-6 px-4 gap-4 
                              scrollbar-none scroll-smooth">
                  {popularDestinations.map((city, index) => (
                    <motion.div
                      key={city.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex-none w-[260px] snap-center"
                      onClick={() => handleDestinationChange(city.name)}
                    >
                      <div className="group cursor-pointer rounded-xl overflow-hidden 
                                    bg-gray-900/40 backdrop-blur-sm border border-white/10">
                        <div className="relative h-32">
                          <div className={`absolute inset-0 bg-black transition-opacity duration-300
                                        ${imageLoading[city.name] ? 'opacity-100' : 'opacity-0'}`} />
                          <Image
                            src={city.image}
                            alt={city.name}
                            fill
                            sizes="260px"
                            quality={85}
                            priority={index < 2}
                            className="object-cover transition-transform duration-500 
                                     group-hover:scale-110"
                            onLoad={() => setImageLoading(prev => ({ ...prev, [city.name]: false }))}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t 
                                        from-gray-900/90 via-gray-900/30 to-transparent" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{city.name}</h3>
                              <p className="text-sm text-gray-400">{city.country}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-purple-500/10 text-purple-400 
                                       hover:bg-purple-500/20 transition-colors"
                            >
                              <MapPinIcon className="h-4 w-4" />
                            </motion.button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {city.landmarks.map(landmark => (
                              <span
                                key={landmark}
                                className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-md
                                         backdrop-blur-sm border border-white/10"
                              >
                                {landmark}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Desktop Grid View */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularDestinations.map((city, index) => (
                  <motion.div
                    key={city.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleDestinationChange(city.name)}
                  >
                    <div className="relative rounded-xl overflow-hidden bg-gray-900/40 
                                  backdrop-blur-sm border border-white/10">
                      <div className="relative h-40">
                        <div className={`absolute inset-0 bg-black transition-opacity duration-300
                                      ${imageLoading[city.name] ? 'opacity-100' : 'opacity-0'}`} />
                        <Image
                          src={city.image}
                          alt={city.name}
                          fill
                          sizes="(max-width: 1200px) 50vw, 33vw"
                          quality={85}
                          priority={index < 2}
                          className="object-cover transition-transform duration-500 
                                   group-hover:scale-110"
                          onLoad={() => setImageLoading(prev => ({ ...prev, [city.name]: false }))}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t 
                                      from-gray-900/90 via-gray-900/30 to-transparent" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{city.name}</h3>
                            <p className="text-sm text-gray-400">{city.country}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg bg-purple-500/10 text-purple-400 
                                     hover:bg-purple-500/20 transition-colors"
                          >
                            <MapPinIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {city.landmarks.map(landmark => (
                            <span
                              key={landmark}
                              className="text-xs bg-white/5 text-gray-300 px-2 py-1 rounded-md
                                       backdrop-blur-sm border border-white/10"
                            >
                              {landmark}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 