import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Add transition class before theme change
    document.documentElement.classList.add('transition-colors');
    document.documentElement.classList.add('duration-200');
    
    // Set theme
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Store in localStorage for SSR
    localStorage.setItem('theme', theme);

    // Remove transition class after theme change
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('transition-colors');
      document.documentElement.classList.remove('duration-200');
    }, 200);

    return () => clearTimeout(timeout);
  }, [theme]);

  return <>{children}</>;
}; 