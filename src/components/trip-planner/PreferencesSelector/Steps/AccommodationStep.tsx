import { motion } from 'framer-motion';
import {
  BuildingOffice2Icon,
  HomeIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';
import { FormData } from '@/types/form';

interface AccommodationStepProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onComplete: () => void;
  isValid: boolean;
}

const accommodationTypes = [
  {
    id: 'hotel',
    name: 'Hotel',
    icon: BuildingOffice2Icon,
    description: 'Traditional hotels',
    features: ['Room service', 'Daily cleaning', 'Front desk'],
    priceRange: '$$$',
  },
  {
    id: 'hostel',
    name: 'Hostel',
    icon: HomeIcon,
    description: 'Budget-friendly',
    features: ['Shared spaces', 'Kitchen access', 'Social atmosphere'],
    priceRange: '$',
  },
  {
    id: 'apartment',
    name: 'Apartment',
    icon: HomeModernIcon,
    description: 'Self-catering',
    features: ['Full kitchen', 'Privacy', 'Living space'],
    priceRange: '$$',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AccommodationStep({
  formData,
  updateFormData,
  onComplete,
  isValid,
}: AccommodationStepProps) {
  const setAccommodationType = (type: 'hotel' | 'hostel' | 'apartment') => {
    updateFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        accommodation_type: type,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Accommodation</h2>
        <p className="mt-2 text-gray-400">
          Choose your preferred type of accommodation
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {accommodationTypes.map((accommodation) => {
          const Icon = accommodation.icon;
          const isSelected = formData.preferences.accommodation_type === accommodation.id;

          return (
            <motion.button
              key={accommodation.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAccommodationType(accommodation.id as 'hotel' | 'hostel' | 'apartment')}
              className={`relative flex flex-col items-center p-6 rounded-xl border
                       backdrop-blur-xl transition-all duration-200
                       ${
                         isSelected
                           ? 'bg-sky-500/20 border-sky-400'
                           : 'bg-black/20 border-white/10 hover:border-white/20'
                       }`}
            >
              <Icon
                className={`h-12 w-12 mb-4 ${
                  isSelected ? 'text-sky-400' : 'text-gray-400'
                }`}
              />
              <h3 className="text-xl font-semibold text-white">
                {accommodation.name}
              </h3>
              <p className="text-sm text-gray-400 text-center mt-2">
                {accommodation.description}
              </p>
              
              {/* Features */}
              <div className="mt-4 space-y-2 w-full">
                {accommodation.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-400"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <span className="absolute top-4 right-4 text-lg font-mono">
                {accommodation.priceRange}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected Accommodation Summary */}
      {formData.preferences.accommodation_type && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-sm text-gray-400">
            You've selected:{' '}
            <span className="text-white font-semibold">
              {accommodationTypes.find(
                (a) => a.id === formData.preferences.accommodation_type
              )?.name}
            </span>
          </span>
        </motion.div>
      )}

      {!isValid && (
        <p className="text-center text-sm text-amber-400">
          Please select an accommodation type
        </p>
      )}

      {/* Price Range Legend */}
      <div className="flex justify-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-mono">$</span>
          <span>Budget</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono">$$</span>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono">$$$</span>
          <span>Luxury</span>
        </div>
      </div>
    </div>
  );
} 