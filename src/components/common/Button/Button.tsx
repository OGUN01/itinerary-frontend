import React from 'react';
import { useAnimation } from '@/hooks/useAnimation';
import { theme } from '@/styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  withAnimation?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  withAnimation = true,
  className = '',
  ...props
}) => {
  // Animation hooks
  const { isWiggling, startWiggle, className: wiggleClass } = useAnimation.buttonWiggle(withAnimation);
  const { isVisible, className: fadeClass } = useAnimation.fadeIn({ delay: 100 });

  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-in-out';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes
  const variantClasses = {
    primary: `bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`,
    secondary: `bg-accent-500 text-white hover:bg-accent-600 focus:ring-2 focus:ring-accent-400 focus:ring-offset-2`,
    outline: `border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
  };

  // Loading state
  const loadingClasses = isLoading ? 'opacity-75 cursor-wait' : '';

  // Combine all classes
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${loadingClasses}
    ${wiggleClass}
    ${fadeClass}
    ${className}
  `.trim();

  return (
    <button
      className={combinedClasses}
      disabled={isLoading}
      onMouseEnter={startWiggle}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}; 