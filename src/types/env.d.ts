declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_MAPBOX_TOKEN: string;
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
} 