export const theme = {
  colors: {
    primary: {
      main: '#2563eb',     // Deep blue
      light: '#60a5fa',    // Light blue
      dark: '#1e40af'      // Dark blue
    },
    accent: {
      main: '#f59e0b',     // Warm orange
      light: '#fcd34d',    // Light yellow
      dark: '#d97706'      // Dark orange
    },
    background: {
      main: '#ffffff',
      dark: '#1f2937',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      light: '#ffffff'
    }
  },
  animations: {
    transition: 'all 0.3s ease',
    buttonHover: 'transform 0.2s ease',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideUp: 'slideUp 0.5s ease-out',
    wiggle: 'wiggle 1s ease-in-out infinite'
  },
  keyframes: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
  `
};

export type Theme = typeof theme;

// Utility function to get theme values
export const getThemeValue = (path: string, theme: Theme): string => {
  return path.split('.').reduce((acc: any, part: string) => acc[part], theme) as string;
};

// CSS Custom Properties
export const cssVariables = `
  :root {
    --color-primary: ${theme.colors.primary.main};
    --color-primary-light: ${theme.colors.primary.light};
    --color-primary-dark: ${theme.colors.primary.dark};
    
    --color-accent: ${theme.colors.accent.main};
    --color-accent-light: ${theme.colors.accent.light};
    --color-accent-dark: ${theme.colors.accent.dark};
    
    --color-background: ${theme.colors.background.main};
    --color-background-dark: ${theme.colors.background.dark};
    --color-overlay: ${theme.colors.background.overlay};
    
    --transition-default: ${theme.animations.transition};
    --animation-button-hover: ${theme.animations.buttonHover};
  }

  ${theme.keyframes}
`; 