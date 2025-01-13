import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { FormData } from '@/types/form';

interface MealsStepProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onComplete: () => void;
  isValid: boolean;
}

const mealPreferences = [
  {
    id: 'local',
    name: 'Local Cuisine',
    description: 'Traditional local dishes',
    emoji: '🍜',
  },
  {
    id: 'fine',
    name: 'Fine Dining',
    description: 'High-end restaurants',
    emoji: '🍽️',
  },
  {
    id: 'street',
    name: 'Street Food',
    description: 'Authentic street vendors',
    emoji: '🥘',
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    description: 'Plant-based options',
    emoji: '🥗',
  },
  {
    id: 'halal',
    name: 'Halal',
    description: 'Halal-certified food',
    emoji: '🥩',
  },
  {
    id: 'kosher',
    name: 'Kosher',
    description: 'Kosher-certified food',
    emoji: '✡️',
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

export default function MealsStep({
  formData,
  updateFormData,
  onComplete,
  isValid,
}: MealsStepProps) {
  const toggleMeal = (id: string) => {
    updateFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        meals: formData.preferences.meals.includes(id)
          ? formData.preferences.meals.filter((m) => m !== id)
          : [...formData.preferences.meals, id],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Meal Preferences</h2>
        <p className="mt-2 text-gray-400">
          Select your dining preferences for the trip
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {mealPreferences.map((meal) => {
          const isSelected = formData.preferences.meals.includes(meal.id);

          return (
            <motion.button
              key={meal.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleMeal(meal.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border
                       backdrop-blur-xl transition-all duration-200 aspect-square
                       ${
                         isSelected
                           ? 'bg-sky-500/20 border-sky-400'
                           : 'bg-black/20 border-white/10 hover:border-white/20'
                       }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <HeartIcon className="h-5 w-5 text-sky-400" />
                </motion.div>
              )}
              <span className="text-3xl mb-3" role="img" aria-label={meal.name}>
                {meal.emoji}
              </span>
              <h3 className="text-lg font-semibold text-white text-center">
                {meal.name}
              </h3>
              <p className="text-sm text-gray-400 text-center mt-1">
                {meal.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected Meals Summary */}
      <div className="flex flex-wrap gap-2 justify-center">
        {formData.preferences.meals.map((id) => {
          const meal = mealPreferences.find((m) => m.id === id);
          if (!meal) return null;

          return (
            <motion.span
              key={id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                       bg-sky-500/20 border border-sky-400 text-sm text-white"
            >
              <span>{meal.emoji}</span>
              {meal.name}
            </motion.span>
          );
        })}
      </div>

      {!isValid && (
        <p className="text-center text-sm text-amber-400">
          Please select at least one meal preference
        </p>
      )}
    </div>
  );
} 