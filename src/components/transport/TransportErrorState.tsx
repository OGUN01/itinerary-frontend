import { TruckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { getErrorType, getErrorMessage } from '@/utils/errors';

interface TransportErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function TransportErrorState({ error, onRetry }: TransportErrorStateProps) {
  const errorType = getErrorType(error);
  const message = getErrorMessage(error);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-red-100">
      <div className="flex items-center justify-center space-x-2 text-red-500 mb-3">
        <TruckIcon className="w-6 h-6" />
        <ExclamationCircleIcon className="w-5 h-5" />
      </div>
      
      <h3 className="text-center font-medium text-gray-900 mb-2">
        {errorType === 'NETWORK_ERROR' 
          ? 'Unable to fetch transport options'
          : 'Transport options unavailable'}
      </h3>
      
      <p className="text-sm text-center text-gray-600 mb-4">
        {message}
      </p>

      {onRetry && (
        <div className="text-center">
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
} 