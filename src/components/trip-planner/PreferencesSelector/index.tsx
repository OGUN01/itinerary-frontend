import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGenerateItinerary } from '@/services/itinerary';
import { toast } from 'react-hot-toast';
import { useItineraryStore } from '@/store/itinerary';
import { FormData } from '@/types/form';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useFloating, useInteractions, useClick, FloatingOverlay, FloatingFocusManager } from '@floating-ui/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { format } from 'date-fns';
import { CheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Step Components
import BudgetStep from './Steps/BudgetStep';
import ActivitiesStep from './Steps/ActivitiesStep';
import MealsStep from './Steps/MealsStep';
import TransportStep from './Steps/TransportStep';
import PlacesStep from './Steps/PlacesStep';
import AccommodationStep from './Steps/AccommodationStep';
import StepIndicator from './Navigation/StepIndicator';
import NavigationControls from './Navigation/NavigationControls';

interface PreferencesSelectorProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onBack: () => void;
  onComplete: () => void;
}

const steps = [
  { id: 'budget', title: 'Budget', component: BudgetStep },
  { id: 'activities', title: 'Activities', component: ActivitiesStep },
  { id: 'meals', title: 'Meals', component: MealsStep },
  { id: 'transport', title: 'Transport', component: TransportStep },
  { id: 'places', title: 'Places', component: PlacesStep },
  { id: 'accommodation', title: 'Accommodation', component: AccommodationStep },
];

export default function PreferencesSelector({
  formData,
  updateFormData,
  onBack,
  onComplete,
}: PreferencesSelectorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const swiperRef = useRef<any>(null);
  
  const { refs, context } = useFloating({
    open: isMobile,
    onOpenChange: () => {}
  });

  const click = useClick(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click]);

  const generateItineraryMutation = useGenerateItinerary();
  const setCurrentItinerary = useItineraryStore(state => state.setCurrentItinerary);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < steps.length - 1) {
      if (swiperRef.current) {
        swiperRef.current.slideNext();
      }
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 0) {
      onBack();
    } else {
      if (swiperRef.current) {
        swiperRef.current.slidePrev();
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      const result = await generateItineraryMutation.mutateAsync({
        travel_input: {
          origin: formData.origin,
          destination: formData.destination,
          start_date: formData.startDate,
          return_date: formData.endDate,
        },
        user_preferences: {
          budget: formData.preferences.budget,
          activities: formData.preferences.activities,
          meal_preferences: formData.preferences.meals,
          preferred_places: formData.preferences.preferred_places,
          transport_preferences: formData.preferences.transport_preferences,
          accommodation_type: formData.preferences.accommodation_type
        }
      });

      // Update store first
      setCurrentItinerary(result);
      
      // Wait for next tick to ensure store is updated
      setTimeout(() => {
        onComplete();
      }, 0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate itinerary');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Budget
        return formData.preferences.budget >= 100;
      case 1: // Activities
        return formData.preferences.activities.length > 0;
      case 2: // Meals
        return formData.preferences.meals.length > 0;
      case 3: // Transport
        return formData.preferences.transport_preferences.length > 0;
      case 4: // Places
        return formData.preferences.preferred_places.length > 0;
      case 5: // Accommodation
        return !!formData.preferences.accommodation_type;
      default:
        return false;
    }
  };

  const isValid = steps.every((_, index) => isStepValid(index));

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-12 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Top Progress Bar */}
          <div className="fixed top-0 inset-x-0 z-50">
            <div className="h-1 bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-400 via-purple-400 to-sky-400"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Enhanced Header Section */}
          <div className="text-center space-y-5">
            {/* Step Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-[13px] font-medium text-white/70">Step {currentStep + 1} of {steps.length}</span>
            </motion.div>
            
            {/* Main Title */}
            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[2.5rem] font-[450] tracking-[-0.02em] leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-white/90 via-white/80 to-white/70"
              >
                {steps[currentStep].title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[15px] text-white/50 max-w-md mx-auto font-light"
              >
                Customize your {formData.destination} experience with your preferred {steps[currentStep].title.toLowerCase()}
              </motion.p>
            </div>

            {/* Trip Details Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex flex-col items-center gap-2.5 mt-2"
            >
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-lg">
                <span className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400/90" />
                    <span className="font-[450] text-white/80 text-[13px]">{formData.origin}</span>
                  </div>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-white/40" />
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400/90" />
                    <span className="font-[450] text-white/80 text-[13px]">{formData.destination}</span>
                  </div>
                </span>
              </div>
              <span className="text-[13px] text-white/40 font-light">
                {format(new Date(formData.startDate), 'MMM d')} - {format(new Date(formData.endDate), 'MMM d, yyyy')}
              </span>
            </motion.div>
          </div>

          {/* Mini Step Progress */}
          <div className="max-w-2xl mx-auto mt-8 px-4">
            <div className="flex items-center justify-between gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1">
                  <div className="relative">
                    <div className="h-0.5 bg-white/[0.06]">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ 
                          width: currentStep > index ? "100%" : 
                                 currentStep === index ? "50%" : "0%"
                        }}
                        className="h-full bg-gradient-to-r from-sky-400 to-purple-400"
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: currentStep >= index ? 1 : 0.8,
                        opacity: currentStep >= index ? 1 : 0.4
                      }}
                      className={`absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 
                        ${currentStep > index ? 'bg-purple-400 border-purple-400' :
                          currentStep === index ? 'bg-sky-400 border-sky-400' :
                          'bg-transparent border-white/20'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {isMobile ? (
            <FloatingOverlay
              className="bg-black/50 backdrop-blur-sm transition-opacity"
              lockScroll
            >
              <FloatingFocusManager context={context}>
                <motion.div
                  ref={refs.setFloating}
                  className="fixed inset-x-0 bottom-0 bg-gray-900 rounded-t-xl shadow-xl overflow-hidden"
                  style={{ height: 'calc(100vh - 80px)' }}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  {...getFloatingProps()}
                >
                  {/* Handle for dragging */}
                  <div className="absolute top-0 inset-x-0 flex justify-center">
                    <div className="w-12 h-1.5 bg-gray-700 rounded-full my-3" />
                  </div>

                  {/* Title */}
                  <div className="px-4 pt-8 pb-4 border-b border-gray-800">
                    <h2 className="text-xl font-semibold text-white">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Step {currentStep + 1} of {steps.length}
                    </p>
                  </div>

                  <Swiper
                    ref={swiperRef}
                    modules={[Navigation]}
                    onSlideChange={(swiper) => setCurrentStep(swiper.activeIndex)}
                    allowTouchMove={!isSubmitting}
                    initialSlide={currentStep}
                    noSwiping={isSubmitting}
                    allowSlideNext={isStepValid(currentStep)}
                    allowSlidePrev={true}
                    preventInteractionOnTransition
                    speed={300}
                    onSwiper={(swiper) => {
                      // @ts-ignore
                      swiperRef.current = swiper;
                    }}
                    className="h-[calc(100%-120px)] mt-2"
                  >
                    {steps.map((step, index) => {
                      const StepComponent = step.component;
                      return (
                        <SwiperSlide key={step.id} className="overflow-y-auto">
                          <motion.div 
                            className="px-4 py-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <StepComponent
                              formData={formData}
                              updateFormData={updateFormData}
                              onComplete={() => handleStepComplete(index)}
                              isValid={isStepValid(index)}
                            />
                          </motion.div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </motion.div>
              </FloatingFocusManager>
            </FloatingOverlay>
          ) : (
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              onSlideChange={(swiper) => setCurrentStep(swiper.activeIndex)}
              allowTouchMove={!isSubmitting}
              initialSlide={currentStep}
              noSwiping={isSubmitting}
              allowSlideNext={isStepValid(currentStep)}
              allowSlidePrev={true}
              preventInteractionOnTransition
              speed={300}
              onSwiper={(swiper) => {
                // @ts-ignore
                swiperRef.current = swiper;
              }}
            >
              {steps.map((step, index) => {
                const StepComponent = step.component;
                return (
                  <SwiperSlide key={step.id}>
                    <div className="px-4 py-6">
                      <StepComponent
                        formData={formData}
                        updateFormData={updateFormData}
                        onComplete={() => handleStepComplete(index)}
                        isValid={isStepValid(index)}
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}

          {/* Navigation Controls */}
          <NavigationControls
            currentStep={currentStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
            isValid={isStepValid(currentStep)}
            isSubmitting={isSubmitting}
            onBack={handleStepBack}
            onNext={() => handleStepComplete(currentStep)}
            onComplete={handleComplete}
          />
        </motion.div>
      </div>
    </div>
  );
} 