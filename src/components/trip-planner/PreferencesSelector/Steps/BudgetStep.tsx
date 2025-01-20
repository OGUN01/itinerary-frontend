import { motion } from 'framer-motion';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { FormData } from '@/types/form';

interface BudgetStepProps {
  formData: FormData;
  updateFormData: (data: FormData) => void;
  onComplete: () => void;
  isValid: boolean;
}

const budgetPresets = [
  { label: 'Budget', value: 1000, description: 'Basic accommodations and activities' },
  { label: 'Comfort', value: 3000, description: 'Mid-range hotels and experiences' },
  { label: 'Luxury', value: 7000, description: 'High-end stays and premium activities' },
];

export default function BudgetStep({
  formData,
  updateFormData,
  onComplete,
  isValid,
}: BudgetStepProps) {
  const updateBudget = (value: number) => {
    updateFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        budget: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">Set Your Budget</h2>
        <p className="mt-2 text-gray-400">
          Choose your total budget for the trip
        </p>
      </div>

      {/* Budget Display */}
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center text-5xl font-bold text-white">
            <CurrencyDollarIcon className="h-8 w-8 text-sky-400" />
            <span>{formData.preferences.budget.toLocaleString()}</span>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Total budget for {Math.ceil(
              (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )} days
          </p>
        </motion.div>
      </div>

      {/* Budget Presets */}
      <div className="grid gap-4">
        {budgetPresets.map((preset) => (
          <motion.button
            key={preset.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateBudget(preset.value)}
            className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-xl
                     transition-all duration-200 ${
                       formData.preferences.budget === preset.value
                         ? 'bg-sky-500/20 border-sky-400'
                         : 'bg-black/20 border-white/10 hover:border-white/20'
                     }`}
          >
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">{preset.label}</h3>
              <p className="text-sm text-gray-400">{preset.description}</p>
            </div>
            <span className="text-lg font-semibold text-white">
              ${preset.value.toLocaleString()}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Custom Budget Slider */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-400">
          Or set a custom budget
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={formData.preferences.budget}
            onChange={(e) => updateBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Per Day Estimate */}
      <div className="text-center text-sm text-gray-400">
        Approximately{' '}
        <span className="text-white font-semibold">
          ${Math.round(
            formData.preferences.budget /
              Math.ceil(
                (new Date(formData.endDate).getTime() -
                  new Date(formData.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
          ).toLocaleString()}
        </span>{' '}
        per day
      </div>
    </div>
  );
} 