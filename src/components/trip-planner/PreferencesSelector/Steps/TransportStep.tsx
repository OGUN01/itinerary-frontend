import { motion } from 'framer-motion';
import {
  PaperAirplaneIcon,
  RocketLaunchIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  MapIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { FormData } from '@/types/form';

interface TransportStepProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onComplete: () => void;
  isValid: boolean;
}

const transportOptions = [
  {
    id: 'flight',
    name: 'Flight',
    icon: PaperAirplaneIcon,
    description: 'Air travel',
    speed: 'Fastest',
  },
  {
    id: 'train',
    name: 'Train',
    icon: RocketLaunchIcon,
    description: 'Rail travel',
    speed: 'Fast',
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: TruckIcon,
    description: 'Bus travel',
    speed: 'Medium',
  },
  {
    id: 'car',
    name: 'Car Rental',
    icon: BuildingStorefrontIcon,
    description: 'Self-drive',
    speed: 'Flexible',
  },
  {
    id: 'public',
    name: 'Public Transport',
    icon: MapIcon,
    description: 'Local transit',
    speed: 'Variable',
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: UserIcon,
    description: 'On foot',
    speed: 'Leisurely',
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

export default function TransportStep({
  formData,
  updateFormData,
  onComplete,
  isValid,
}: TransportStepProps) {
  const toggleTransport = (id: string) => {
    updateFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        transport_preferences: formData.preferences.transport_preferences.includes(id)
          ? formData.preferences.transport_preferences.filter((t) => t !== id)
          : [...formData.preferences.transport_preferences, id],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Transport Options</h2>
        <p className="mt-2 text-gray-400">
          Choose how you'd like to get around
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        {transportOptions.map((transport) => {
          const Icon = transport.icon;
          const isSelected = formData.preferences.transport_preferences.includes(transport.id);

          return (
            <motion.button
              key={transport.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleTransport(transport.id)}
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
                {transport.name}
              </h3>
              <p className="text-sm text-gray-400 text-center mt-1">
                {transport.description}
              </p>
              <span className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-black/40 text-gray-400">
                {transport.speed}
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selected Transport Summary */}
      <div className="flex flex-wrap gap-2 justify-center">
        {formData.preferences.transport_preferences.map((id) => {
          const transport = transportOptions.find((t) => t.id === id);
          if (!transport) return null;

          return (
            <motion.span
              key={id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                       bg-sky-500/20 border border-sky-400 text-sm text-white"
            >
              <transport.icon className="h-4 w-4" />
              {transport.name}
            </motion.span>
          );
        })}
      </div>

      {!isValid && (
        <p className="text-center text-sm text-amber-400">
          Please select at least one transport option
        </p>
      )}

      {/* Speed Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-400">
        {Array.from(new Set(transportOptions.map(t => t.speed))).map((speed) => (
          <div key={speed} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-600" />
            {speed}
          </div>
        ))}
      </div>
    </div>
  );
} 