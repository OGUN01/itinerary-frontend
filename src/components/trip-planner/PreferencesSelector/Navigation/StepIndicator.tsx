import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

interface StepIndicatorProps {
  steps: Array<{ id: string; title: string }>;
  currentStep: number;
  completedSteps: number[];
}

export default function StepIndicator({
  steps,
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Background Progress Bar */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2" />
      
      {/* Active Progress Bar */}
      <motion.div 
        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-sky-400 to-sky-600 -translate-y-1/2"
        initial={{ width: '0%' }}
        animate={{ 
          width: `${(Math.max(currentStep, completedSteps.length) / (steps.length - 1)) * 100}%` 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />

      {/* Steps */}
      <div className="relative z-10 flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = currentStep === index;
          const isActive = index <= currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2
                          transition-colors duration-200 ${
                            isCompleted || isCurrent
                              ? 'border-sky-400 bg-sky-400/20'
                              : isActive
                              ? 'border-sky-400/50 bg-sky-400/10'
                              : 'border-gray-700 bg-gray-800'
                          }`}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  opacity: isActive ? 1 : 0.5
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <CheckIcon className="w-5 h-5 text-sky-400" />
                  </motion.div>
                ) : (
                  <span className={`text-sm font-semibold ${
                    isActive ? 'text-sky-400' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Step Label */}
              <motion.span
                className={`mt-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
                animate={{
                  opacity: isActive ? 1 : 0.5,
                  y: isCurrent ? 0 : 4
                }}
              >
                {step.title}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 