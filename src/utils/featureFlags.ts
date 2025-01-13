// Feature flags for UI enhancements
export const UIFeatureFlags = {
  // Video background and animations
  enableVideoBackground: process.env.NEXT_PUBLIC_ENABLE_VIDEO_BG === 'true',
  enableAnimations: process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS === 'true',
  
  // Enhanced components
  enableNewHeader: process.env.NEXT_PUBLIC_ENABLE_NEW_HEADER === 'true',
  enableNewFooter: process.env.NEXT_PUBLIC_ENABLE_NEW_FOOTER === 'true',
  
  // Page enhancements
  enableNewHomepage: process.env.NEXT_PUBLIC_ENABLE_NEW_HOME === 'true',
  enableNewDashboard: process.env.NEXT_PUBLIC_ENABLE_NEW_DASHBOARD === 'true',
};

// Performance monitoring thresholds
export const PerformanceThresholds = {
  FCP: 2000,      // First Contentful Paint (ms)
  LCP: 2500,      // Largest Contentful Paint (ms)
  FID: 100,       // First Input Delay (ms)
  CLS: 0.1,       // Cumulative Layout Shift
  TTI: 3500,      // Time to Interactive (ms)
};

// Rollback trigger conditions
export const shouldRollback = (metrics: {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  tti?: number;
}) => {
  if (metrics.fcp && metrics.fcp > PerformanceThresholds.FCP) return true;
  if (metrics.lcp && metrics.lcp > PerformanceThresholds.LCP) return true;
  if (metrics.fid && metrics.fid > PerformanceThresholds.FID) return true;
  if (metrics.cls && metrics.cls > PerformanceThresholds.CLS) return true;
  if (metrics.tti && metrics.tti > PerformanceThresholds.TTI) return true;
  return false;
};

interface BrowserSupport {
  videoAutoplay: boolean;
  webgl: boolean;
  animations: boolean;
}

// Utility to check browser capabilities
export const checkBrowserSupport = (): BrowserSupport | false => {
  if (typeof window === 'undefined') return false;
  
  try {
    const video = document.createElement('video');
    const h264Support = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
    const videoSupport = {
      basic: video.canPlayType !== undefined,
      h264: h264Support === 'probably' || h264Support === 'maybe',
      autoplay: 'autoplay' in video,
    };

    return {
      videoAutoplay: videoSupport.basic && videoSupport.h264 && videoSupport.autoplay,
      webgl: (() => {
        try {
          return !!window.WebGLRenderingContext && 
            !!document.createElement('canvas').getContext('webgl');
        } catch (e) {
          return false;
        }
      })(),
      animations: typeof document.createElement('div').animate === 'function',
    };
  } catch (e) {
    console.warn('Browser support check failed:', e);
    return false;
  }
};

// Safe feature enablement with SSR support
export const getSafeFeatures = () => {
  const browserSupport = checkBrowserSupport();
  const isClient = typeof window !== 'undefined';
  
  if (!isClient || !browserSupport) {
    return {
      ...UIFeatureFlags,
      enableVideoBackground: false,
      enableAnimations: false,
    };
  }

  return {
    ...UIFeatureFlags,
    enableVideoBackground: UIFeatureFlags.enableVideoBackground && browserSupport.videoAutoplay,
    enableAnimations: UIFeatureFlags.enableAnimations && browserSupport.animations,
  };
}; 