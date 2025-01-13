import { motion } from 'framer-motion';
import {
  BuildingOffice2Icon,
  SparklesIcon,
  SunIcon,
  BuildingStorefrontIcon,
  AcademicCapIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';
import { FormData } from '@/types/form';

interface PlacesStepProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onComplete: () => void;
  isValid: boolean;
}

const placeTypes = [
  {
    id: 'landmarks',
    name: 'Landmarks',
    icon: BuildingOffice2Icon,
    description: 'Famous sites',
    category: 'Cultural',
  },
  {
    id: 'parks',
    name: 'Parks',
    icon: SparklesIcon,
    description: 'Green spaces',
    category: 'Nature',
  },
  {
    id: 'beaches',
    name: 'Beaches',
    icon: SunIcon,
    description: 'Coastal areas',
    category: 'Nature',
  },
  {
    id: 'markets',
    name: 'Markets',
    icon: BuildingStorefrontIcon,
    description: 'Local markets',
    category: 'Shopping',
  },
  {
    id: 'museums',
    name: 'Museums',
    icon: AcademicCapIcon,
    description: 'Cultural institutions',
    category: 'Cultural',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: HomeModernIcon,
    description: 'Dining spots',
    category: 'Food',
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

const categoryColors = {
  Cultural: 'text-purple-400',
  Nature: 'text-emerald-400',
  Shopping: 'text-pink-400',
  Food: 'text-amber-400',
};

export default function PlacesStep({
  formData,
  updateFormData,
  onComplete,
  isValid,
}: PlacesStepProps) {
  const togglePlace = (id: string) => {
    updateFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        preferred_places: formData.preferences.preferred_places.includes(id)
          ? formData.preferences.preferred_places.filter((p) => p !== id)
          : [...formData.preferences.preferred_places, id],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Preferred Places</h2>
        <p className="mt-2 text-gray-400">
          Select the types of places you'd like to visit
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {placeTypes.map((place) => {
          const Icon = place.icon;
          const isSelected = formData.preferences.preferred_places.includes(place.id);
          const categoryColor = categoryColors[place.category as keyof typeof categoryColors];

          return (
            <motion.button
              key={place.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => togglePlace(place.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border
                       backdrop-blur-xl transition-all duration-200 aspect-square
                       ${
                         isSelected
                           ? 'bg-sky-500/20 border-sky-400'
                           : 'bg-black/20 border-white/10 hover:border-white/20'
                       }`}
            >
              <Icon
                className={`h-8 w-8 mb-3 ${
                  isSelected ? 'text-sky-400' : 'text-gray-400'
                }`}
              />
              <h3 className="text-lg font-semibold text-white text-center">
                {place.name}
              </h3>
              <p className="text-sm text-gray-400 text-center mt-1">
                {place.description}
              </p>
              <span className={`absolute top-2 right-2 text-xs ${categoryColor}`}>
                {place.category}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected Places Summary */}
      <div className="flex flex-wrap gap-2 justify-center">
        {formData.preferences.preferred_places.map((id) => {
          const place = placeTypes.find((p) => p.id === id);
          if (!place) return null;

          return (
            <motion.span
              key={id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                       bg-sky-500/20 border border-sky-400 text-sm text-white"
            >
              <place.icon className="h-4 w-4" />
              {place.name}
            </motion.span>
          );
        })}
      </div>

      {!isValid && (
        <p className="text-center text-sm text-amber-400">
          Please select at least one place type
        </p>
      )}

      {/* Category Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')}`} />
            <span className={color}>{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 