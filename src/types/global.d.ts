import { QueryClient } from '@tanstack/react-query';

declare global {
  interface Window {
    __REACT_QUERY_GLOBAL__: QueryClient;
    ReactQueryDevtools: {
      initialize: (config: any) => void;
    };
  }
} 