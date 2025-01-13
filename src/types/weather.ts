export interface WeatherCondition {
  icon: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
}

export const weatherConditions: Record<string, WeatherCondition> = {
  'Sunny': {
    icon: 'sun',
    label: 'Sunny',
    severity: 'low'
  },
  'Cloudy': {
    icon: 'cloud',
    label: 'Cloudy',
    severity: 'low'
  },
  'Rainy': {
    icon: 'cloud-rain',
    label: 'Rainy',
    severity: 'medium'
  },
  'Stormy': {
    icon: 'cloud-lightning',
    label: 'Stormy',
    severity: 'high'
  },
  'Snowy': {
    icon: 'cloud-snow',
    label: 'Snowy',
    severity: 'medium'
  }
};

export function getWeatherCondition(condition: string): WeatherCondition {
  return weatherConditions[condition] || {
    icon: 'question',
    label: condition,
    severity: 'low'
  };
}

export interface WeatherInfo {
  date: string;
  temperature_celsius: number;
  condition: string;
  precipitation_chance: number;
  humidity: number;
}

export interface WeatherForecast {
  daily: WeatherInfo[];
  lastUpdated: string;
}

export interface WeatherError {
  code: string;
  message: string;
}

// Utility functions
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * 5/9;
}

export function getWeatherSeverity(condition: string): 'low' | 'medium' | 'high' {
  const weatherCondition = getWeatherCondition(condition);
  return weatherCondition.severity;
}

export function formatTemperature(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
} 