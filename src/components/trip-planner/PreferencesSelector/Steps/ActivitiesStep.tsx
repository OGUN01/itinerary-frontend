import { motion } from 'framer-motion';
import {
  CameraIcon,
  GlobeAltIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
  AcademicCapIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';
import { FormData } from '@/types/form';

interface ActivitiesStepProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onComplete: () => void;
  isValid: boolean;
}

const activities = [
  {
    id: 'sightseeing',
    name: 'Sightseeing',
    icon: CameraIcon,
    description: 'Explore landmarks and attractions',
  },
  {
    id: 'culture',
    name: 'Cultural',
    icon: GlobeAltIcon,
    description: 'Experience local traditions',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: SparklesIcon,
    description: 'Outdoor adventures',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: BuildingStorefrontIcon,
    description: 'Retail therapy',
  },
  {
    id: 'museums',
    name: 'Museums',
    icon: AcademicCapIcon,
    description: 'Learn and discover',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: MusicalNoteIcon,
    description: 'Shows and performances',
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

export default function ActivitiesStep({
  formData,
  updateFormData,
  onComplete,
  isValid,
}: ActivitiesStepProps) {
  const toggleActivity = (id: string) => {
    updateFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        activities: formData.preferences.activities.includes(id)
          ? formData.preferences.activities.filter((a) => a !== id)
          : [...formData.preferences.activities, id],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Choose Activities</h2>
        <p className="mt-2 text-gray-400">
          Select the types of activities you're interested in
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {activities.map((activity) => {
          const Icon = activity.icon;
          const isSelected = formData.preferences.activities.includes(activity.id);

          return (
            <motion.button
              key={activity.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleActivity(activity.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border
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
                {activity.name}
              </h3>
              <p className="text-sm text-gray-400 text-center mt-1">
                {activity.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected Activities Summary */}
      <div className="flex flex-wrap gap-2 justify-center">
        {formData.preferences.activities.map((id) => {
          const activity = activities.find((a) => a.id === id);
          if (!activity) return null;

          return (
            <motion.span
              key={id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center px-3 py-1 rounded-full
                       bg-sky-500/20 border border-sky-400 text-sm text-white"
            >
              {activity.name}
            </motion.span>
          );
        })}
      </div>

      {!isValid && (
        <p className="text-center text-sm text-amber-400">
          Please select at least one activity
        </p>
      )}
    </div>
  );
} 