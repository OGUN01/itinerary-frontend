'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import LocationSelector from './LocationSelector';
import DateSelector from './DateSelector';
import PreferencesSelector from './PreferencesSelector/index';
import TravelBackground from '@/components/common/TravelBackground';
import Header from '@/components/common/Header';
import { FormData } from '@/types/form';

interface Step {
  title: string;
  component: React.ReactNode;
}

export default function TripPlannerLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    preferences: {
      budget: 1000,
      activities: [],
      meals: [],
      transport_preferences: [],
      preferred_places: [],
      accommodation_type: 'hotel' as const
    }
  });

  const steps: Step[] = [
    {
      title: 'Location',
      component: <LocationSelector
        formData={formData}
        updateFormData={setFormData}
        onNext={() => setCurrentStep(1)}
      />
    },
    {
      title: 'Dates',
      component: <DateSelector
        formData={formData}
        updateFormData={setFormData}
        onBack={() => setCurrentStep(0)}
        onNext={() => setCurrentStep(2)}
      />
    },
    {
      title: 'Preferences',
      component: <PreferencesSelector
        formData={formData}
        updateFormData={setFormData}
        onBack={() => setCurrentStep(1)}
        onComplete={() => router.push('/itinerary')}
      />
    }
  ];

  return (
    <div className="min-h-screen">
      <TravelBackground />
      <Header />
      
      <main className="pt-20 min-h-screen">
        {/* Progress Steps */}
        <div className="relative z-20 bg-black/20 backdrop-blur-sm py-4 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.title} className="flex items-center">
                  {/* Step Circle */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                              border-2 ${index <= currentStep 
                                ? 'border-sky-400 bg-sky-400/20' 
                                : 'border-gray-600 bg-gray-800'}`}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1,
                      opacity: index < currentStep ? 0.8 : 1
                    }}
                  >
                    {index < currentStep ? (
                      <CheckIcon className="w-6 h-6 text-sky-400" />
                    ) : (
                      <span className={`text-sm font-semibold ${
                        index <= currentStep ? 'text-sky-400' : 'text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <span className={`ml-3 text-sm font-medium ${
                    index <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className={`h-0.5 ${
                        index < currentStep ? 'bg-sky-400' : 'bg-gray-600'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
} 