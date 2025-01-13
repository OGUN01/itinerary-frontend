import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTripStore } from '@/store/trip';
import { UserPreferences, APIError } from '@/types/api';
import { useGenerateItinerary } from '@/services/itinerary';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const REQUEST_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  VALIDATING: 'VALIDATING',
  FETCHING_WEATHER: 'FETCHING_WEATHER',
  FETCHING_EVENTS: 'FETCHING_EVENTS',
  GENERATING: 'GENERATING'
} as const;

type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

const preferencesSchema = z.object({
  budget: z.number()
    .min(100, 'Budget must be at least $100')
    .max(1000000, 'Budget cannot exceed $1,000,000'),
  activities: z.array(z.string())
    .min(1, 'Select at least one activity')
    .max(5, 'Maximum 5 activities allowed'),
  meal_preferences: z.array(z.string()),
  preferred_places: z.array(z.string()),
  transport_preferences: z.array(z.string())
    .min(1, 'Select at least one transport preference'),
  accommodation_type: z.enum(['hotel', 'hostel', 'resort', 'apartment', 'guesthouse', 'boutique hotel']),
});

const activityOptions = [
  'Sightseeing',
  'Museums',
  'Shopping',
  'Nature',
  'Adventure',
  'Relaxation',
  'Cultural',
  'Food Tours',
  'Nightlife',
];

const mealOptions = [
  'Vegetarian',
  'Vegan',
  'Halal',
  'Kosher',
  'Gluten-free',
  'Local Cuisine',
  'Fine Dining',
  'Street Food',
];

const transportOptions = [
  'Flight',
  'Train',
  'Bus',
  'Car Rental',
  'Public Transport',
  'Walking',
];

const accommodationOptions = [
  'Hotel',
  'Hostel',
  'Resort',
  'Apartment',
  'Guesthouse',
  'Boutique Hotel',
];

export const PreferencesForm = () => {
  const router = useRouter();
  const { 
    setPreferences, 
    setBudget,
    origin,
    destination,
    dates,
    setItinerary 
  } = useTripStore();
  
  const generateItinerary = useGenerateItinerary();

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<UserPreferences>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      budget: 1000,
      activities: [],
      meal_preferences: [],
      preferred_places: [],
      transport_preferences: [],
      accommodation_type: 'hotel'
    },
  });

  const selectedActivities = watch('activities');
  const selectedTransport = watch('transport_preferences');

  const getStatusMessage = (status?: RequestStatus) => {
    switch (status) {
      case REQUEST_STATUS.VALIDATING:
        return 'Validating your preferences...';
      case REQUEST_STATUS.FETCHING_WEATHER:
        return 'Checking weather conditions...';
      case REQUEST_STATUS.FETCHING_EVENTS:
        return 'Finding local events...';
      case REQUEST_STATUS.GENERATING:
        return 'Creating your personalized itinerary...';
      case REQUEST_STATUS.PROCESSING:
        return 'Finalizing your itinerary...';
      default:
        return 'Generating your itinerary...';
    }
  };

  const isAPIError = (error: unknown): error is APIError => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error &&
      'code' in error
    );
  };

  const onSubmit = async (preferences: UserPreferences) => {
    if (isSubmitting || generateItinerary.isPending) {
      return;
    }

    let loadingToast: string | null = null;

    try {
      if (!origin || !destination) {
        toast.error('Please select origin and destination');
        return;
      }

      if (!dates?.start_date || !dates?.return_date) {
        toast.error('Please select travel dates');
        return;
      }

      const startDate = new Date(dates.start_date);
      const returnDate = new Date(dates.return_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        toast.error('Start date cannot be in the past');
        return;
      }

      if (returnDate <= startDate) {
        toast.error('Return date must be after start date');
        return;
      }

      setPreferences(preferences);
      setBudget(preferences.budget);

      loadingToast = toast.loading('Initializing...');

      try {
        const response = await generateItinerary.mutateAsync({
          travel_input: {
            origin,
            destination,
            start_date: dates.start_date,
            return_date: dates.return_date,
          },
          user_preferences: preferences,
        }, {
          onError: (error: unknown) => {
            if (loadingToast) {
              toast.dismiss(loadingToast);
            }

            if (!isAPIError(error)) {
              console.error('Unexpected error:', error);
              toast.error('An unexpected error occurred. Please try again.');
              return;
            }

            if (error.type === 'TIMEOUT_ERROR') {
              toast.error('Request is taking longer than expected. Please wait or try again.');
            } else if (error.type === 'VALIDATION_ERROR') {
              toast.error(error.message || 'Please check your input data');
            } else if (error.type === 'CANCELLED') {
              return;
            } else {
              console.error('Itinerary generation error:', error);
              toast.error('Failed to generate itinerary. Please try again.');
            }
          },
          onSettled: () => {
            if (loadingToast) {
              toast.dismiss(loadingToast);
            }
          }
        });

        if (response) {
          setItinerary(response);
          toast.success('Itinerary generated successfully!');
          router.replace('/itinerary');
        }
      } catch (error) {
        if (loadingToast) {
          toast.dismiss(loadingToast);
        }

        if (!isAPIError(error)) {
          console.error('Unexpected error:', error);
          toast.error('An unexpected error occurred. Please try again.');
          return;
        }
        
        // Update loading message based on status
        if (loadingToast && error.status) {
          toast.loading(getStatusMessage(error.status), {
            id: loadingToast
          });
        }

        if (error.type === 'TIMEOUT_ERROR') {
          // Don't show error for timeouts, just update the status
          return;
        }

        let message = '';
        switch (error.status) {
          case REQUEST_STATUS.PENDING:
            message = 'Your request is pending...';
            break;
          case REQUEST_STATUS.PROCESSING:
            message = 'Processing your itinerary...';
            break;
          case REQUEST_STATUS.COMPLETED:
            message = 'Itinerary generation completed!';
            break;
          case REQUEST_STATUS.FAILED:
            message = 'Failed to generate itinerary. Please try again.';
            break;
          default:
            message = 'An unexpected error occurred.';
        }

        throw error;
      }
    } catch (error) {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      role="form"
    >
      <div className="form-control">
        <label className="label" htmlFor="budget">
          <span className="label-text">Budget (USD)</span>
        </label>
        <input
          id="budget"
          type="number"
          className={`input input-bordered ${errors.budget ? 'input-error' : ''}`}
          {...register('budget', { 
            valueAsNumber: true,
            min: { value: 100, message: 'Budget must be at least $100' }
          })}
        />
        {errors.budget && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.budget.message}</span>
          </label>
        )}
      </div>

      <div className="form-control" role="group" aria-labelledby="activities-label">
        <label className="label" id="activities-label">
          <span className="label-text">Activities (Select 1-5)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {activityOptions.map((activity) => (
            <label key={activity} className="label cursor-pointer">
              <span className="label-text mr-2">{activity}</span>
              <input
                type="checkbox"
                className={`checkbox ${errors.activities ? 'checkbox-error' : ''}`}
                value={activity}
                disabled={selectedActivities.length >= 5 && !selectedActivities.includes(activity)}
                {...register('activities')}
              />
            </label>
          ))}
        </div>
        {errors.activities && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.activities.message}</span>
          </label>
        )}
      </div>

      <div className="form-control" role="group" aria-labelledby="meal-preferences-label">
        <label className="label" id="meal-preferences-label">
          <span className="label-text">Meal Preferences</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {mealOptions.map((meal) => (
            <label key={meal} className="label cursor-pointer">
              <span className="label-text mr-2">{meal}</span>
              <input
                type="checkbox"
                className="checkbox"
                value={meal}
                {...register('meal_preferences')}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="form-control" role="group" aria-labelledby="preferred-places-label">
        <label className="label" id="preferred-places-label">
          <span className="label-text">Preferred Places</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {activityOptions.map((place) => (
            <label key={place} className="label cursor-pointer">
              <span className="label-text mr-2">{place}</span>
              <input
                type="checkbox"
                className="checkbox"
                value={place}
                {...register('preferred_places')}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="form-control" role="group" aria-labelledby="transport-preferences-label">
        <label className="label" id="transport-preferences-label">
          <span className="label-text">Transport Preferences</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {transportOptions.map((transport) => (
            <label key={transport} className="label cursor-pointer">
              <span className="label-text mr-2">{transport}</span>
              <input
                type="checkbox"
                className={`checkbox ${errors.transport_preferences ? 'checkbox-error' : ''}`}
                value={transport}
                {...register('transport_preferences')}
              />
            </label>
          ))}
        </div>
        {errors.transport_preferences && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.transport_preferences.message}</span>
          </label>
        )}
      </div>

      <div className="form-control" role="group" aria-labelledby="accommodation-type-label">
        <label className="label" id="accommodation-type-label">
          <span className="label-text">Accommodation Type</span>
        </label>
        <select 
          id="accommodation-type" 
          className={`select select-bordered ${errors.accommodation_type ? 'select-error' : ''}`}
          {...register('accommodation_type')}
        >
          {accommodationOptions.map((option) => (
            <option key={option.toLowerCase()} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
        {errors.accommodation_type && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.accommodation_type.message}</span>
          </label>
        )}
      </div>

      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={isSubmitting || generateItinerary.isPending}
        >
          {(isSubmitting || generateItinerary.isPending) ? (
            <>
              <span className="loading loading-spinner"></span>
              Generating Itinerary...
            </>
          ) : (
            'Generate Itinerary'
          )}
        </button>
      </div>
    </form>
  );
};