import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface NavigationControlsProps {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export default function NavigationControls({
  isFirstStep,
  isLastStep,
  isValid,
  isSubmitting,
  onBack,
  onNext,
  onComplete,
}: NavigationControlsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-gray-900 to-gray-900/80 backdrop-blur-md border-t border-white/[0.02]"
    >
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg 
                   bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.05]
                   text-[13px] font-medium text-white/80 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {isFirstStep ? 'Back to Location' : 'Previous Step'}
        </motion.button>

        {isLastStep ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isValid || isSubmitting}
            onClick={onComplete}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 
                     px-6 py-2.5 rounded-lg font-medium text-[13px]
                     ${isValid && !isSubmitting
                       ? 'bg-gradient-to-r from-sky-400 to-purple-400 text-white hover:from-sky-500 hover:to-purple-500'
                       : 'bg-white/[0.05] text-white/40 cursor-not-allowed'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Itinerary</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isValid}
            onClick={onNext}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 
                     px-6 py-2.5 rounded-lg font-medium text-[13px]
                     ${isValid
                       ? 'bg-gradient-to-r from-sky-400 to-purple-400 text-white hover:from-sky-500 hover:to-purple-500'
                       : 'bg-white/[0.05] text-white/40 cursor-not-allowed'}`}
          >
            <span>Next Step</span>
            <ArrowRightIcon className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      
      {/* Safe Area Spacing for Mobile */}
      <div className="h-[env(safe-area-inset-bottom)] bg-gray-900" />
    </motion.div>
  );
} 