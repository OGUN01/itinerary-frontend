'use client';

import { ClientProviders } from './ClientProviders';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}