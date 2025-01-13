import { useEffect, useState } from 'react';

interface AnimationOptions {
  duration?: number;
  delay?: number;
  threshold?: number;
}

export const useAnimation = {
  // Button wiggle animation
  buttonWiggle: (isEnabled = true) => {
    const [isWiggling, setIsWiggling] = useState(false);

    const startWiggle = () => {
      if (!isEnabled) return;
      setIsWiggling(true);
      setTimeout(() => setIsWiggling(false), 1000);
    };

    return {
      isWiggling,
      startWiggle,
      className: isWiggling ? 'animate-wiggle' : ''
    };
  },

  // Card hover animation
  cardHover: () => {
    const [isHovered, setIsHovered] = useState(false);

    return {
      isHovered,
      handlers: {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false)
      },
      className: isHovered ? 'transform -translate-y-1 shadow-lg' : ''
    };
  },

  // Input focus animation
  inputFocus: () => {
    const [isFocused, setIsFocused] = useState(false);

    return {
      isFocused,
      handlers: {
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false)
      },
      className: isFocused ? 'ring-2 ring-primary-500' : ''
    };
  },

  // Scroll parallax effect
  scrollParallax: (options: AnimationOptions = {}) => {
    const [offset, setOffset] = useState(0);
    const { threshold = 0.1 } = options;

    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const offsetValue = (scrollPosition / windowHeight) * threshold;
        setOffset(offsetValue);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return {
      offset,
      style: { transform: `translateY(${offset}px)` }
    };
  },

  // Fade in animation on mount
  fadeIn: (options: AnimationOptions = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { delay = 0 } = options;

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return {
      isVisible,
      className: isVisible ? 'animate-fadeIn' : 'opacity-0'
    };
  },

  // Slide up animation
  slideUp: (options: AnimationOptions = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { delay = 0 } = options;

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return {
      isVisible,
      className: isVisible ? 'animate-slideUp' : 'opacity-0 translate-y-4'
    };
  }
};

// Utility hook to check if user prefers reduced motion
export const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced;
};

// Hook to check animation support
export const useAnimationSupport = () => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const element = document.createElement('div');
    const animations = element.style;
    setIsSupported(
      'animation' in animations ||
      'webkitAnimation' in animations ||
      'mozAnimation' in animations
    );
  }, []);

  return isSupported;
}; 