'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { FormData } from '@/types/form';

interface DateSelectorProps {
  formData: FormData;
  updateFormData: Dispatch<SetStateAction<FormData>>;
  onNext: () => void;
  onBack: () => void;
}

interface DatePreset {
  label: string;
  days: number;
  description: string;
}

export default function DateSelector({ formData, updateFormData, onNext, onBack }: DateSelectorProps) {
  // Set default dates when component mounts
  useEffect(() => {
    if (!formData.startDate && !formData.endDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date(tomorrow);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      updateFormData(prev => ({
        ...prev,
        startDate: format(tomorrow, 'yyyy-MM-dd'),
        endDate: format(nextWeek, 'yyyy-MM-dd')
      }));
    }
  }, []);

  const datePresets: DatePreset[] = [
    { 
      label: 'Quick Escape', 
      days: 3, 
      description: `Perfect for a weekend in ${formData.destination}`,
    },
    { 
      label: 'Classic Journey', 
      days: 7, 
      description: 'Our most recommended duration',
    },
    { 
      label: 'Complete Experience', 
      days: 14, 
      description: 'Explore every hidden gem',
    }
  ];

  const handleStartDateChange = (value: string) => {
    updateFormData(prev => ({ 
      ...prev, 
      startDate: value,
      // Reset end date if it's before new start date
      endDate: prev.endDate && new Date(prev.endDate) < new Date(value) ? '' : prev.endDate
    }));
  };

  const handleEndDateChange = (value: string) => {
    updateFormData(prev => ({ ...prev, endDate: value }));
  };

  const applyPreset = (days: number) => {
    const start = new Date();
    start.setDate(start.getDate() + 1); // Start from tomorrow
    
    const end = new Date(start);
    end.setDate(start.getDate() + days - 1); // Subtract 1 to include start date

    updateFormData(prev => ({
      ...prev,
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd')
    }));
  };

  const handleNext = () => {
    if (formData.startDate && formData.endDate) {
      onNext();
    }
  };

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 'Select dates';
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const nights = days - 1;
    
    return (
      <span className="flex items-center gap-2">
        <span className="font-medium text-white">{days} days</span>
        <span className="text-gray-400">•</span>
        <span className="font-medium text-white">{nights} nights</span>
      </span>
    );
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Enhanced Title Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-purple-400" />
                <span className="text-sm font-medium text-gray-400">Step 2 of 3</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[2.75rem] font-[450] tracking-[-0.02em] bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-white/80 to-white/70"
              >
                When would you like to explore?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-base text-gray-400 max-w-xl mx-auto font-light"
              >
                Choose your travel dates or select from our recommended durations for the perfect {formData.destination} experience
              </motion.p>
            </div>

            {/* Enhanced Route Display */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
            >
              <span className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 shadow-lg shadow-sky-400/20" />
                  <span className="font-medium text-white/90 text-sm">{formData.origin}</span>
                </div>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/20" />
                  <span className="font-medium text-white/90 text-sm">{formData.destination}</span>
                </div>
              </span>
            </motion.div>
          </div>

          {/* Date Selection Card */}
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            >
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
                {/* Date Inputs */}
                <div className="space-y-6">
                  {/* Departure Date */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="relative group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400/50 to-transparent 
                                    rounded-l-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                      
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Departure Date
                      </label>
                      
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleStartDateChange(e.target.value)}
                          min={today}
                          className="w-full pl-12 pr-10 py-4 bg-white/5 rounded-xl text-white 
                                   outline-none border border-white/10 focus:border-sky-400/50 
                                   transition-all [color-scheme:dark]"
                          required
                        />
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-400" />
                        
                        {formData.startDate && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 
                                     bg-sky-400/10 rounded-full flex items-center justify-center"
                          >
                            <CheckIcon className="w-4 h-4 text-sky-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Duration Indicator */}
                  {(formData.startDate || formData.endDate) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative flex justify-center"
                    >
                      <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 
                                   flex items-center gap-2 text-sm text-gray-300"
                      >
                        <CalendarIcon className="w-4 h-4 text-purple-400" />
                        {calculateDuration()}
                      </div>
                    </motion.div>
                  )}

                  {/* Return Date */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="relative group"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400/50 to-transparent 
                                    rounded-l-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                      
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Return Date
                      </label>
                      
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleEndDateChange(e.target.value)}
                          min={formData.startDate || today}
                          className="w-full pl-12 pr-10 py-4 bg-white/5 rounded-xl text-white 
                                   outline-none border border-white/10 focus:border-purple-400/50 
                                   transition-all [color-scheme:dark]"
                          required
                        />
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                        
                        {formData.endDate && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 
                                     bg-purple-400/10 rounded-full flex items-center justify-center"
                          >
                            <CheckIcon className="w-4 h-4 text-purple-400" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Enhanced Quick Presets */}
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Recommended Durations</h3>
                      <p className="text-sm text-gray-400 mt-1">Curated lengths for the best experience</p>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-3 py-1.5 rounded-lg bg-sky-400/10 border border-sky-400/20"
                    >
                      <span className="text-sm font-medium text-sky-400">Popular choices</span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {datePresets.map((preset, index) => (
                      <motion.div
                        key={preset.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        onClick={() => applyPreset(preset.days)}
                        className="group relative overflow-hidden rounded-xl cursor-pointer"
                      >
                        {/* Enhanced Gradient Border */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-400/20 via-purple-400/20 to-pink-400/20 
                                       group-hover:from-sky-400/30 group-hover:via-purple-400/30 group-hover:to-pink-400/30 transition-all duration-300" />
                        
                        {/* Enhanced Content */}
                        <div className="relative p-6 bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-xl
                                       group-hover:bg-gray-900/80 transition-all duration-300">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <h4 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">
                                  {preset.label}
                                </h4>
                                <p className="text-sm text-gray-400">{preset.description}</p>
                              </div>
                              <span className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 text-sm font-medium">
                                {preset.days} days
                              </span>
                            </div>
                            
                            {/* Enhanced Visual Indicator */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-sky-400 to-purple-400"
                                  initial={{ width: '30%' }}
                                  whileHover={{ width: '100%' }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <motion.div
                                whileHover={{ x: 4 }}
                                className="p-2 rounded-full bg-white/5 group-hover:bg-sky-400/10 transition-colors"
                              >
                                <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-sky-400 transition-colors" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-8 py-4 rounded-xl font-semibold text-lg
                       border border-white/10 hover:border-white/20
                       text-white transition-all"
            >
              Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!formData.startDate || !formData.endDate}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all
                       ${formData.startDate && formData.endDate
                         ? 'bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg shadow-purple-500/20'
                         : 'bg-gray-800/50 text-gray-400 cursor-not-allowed'}`}
            >
              Next
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 