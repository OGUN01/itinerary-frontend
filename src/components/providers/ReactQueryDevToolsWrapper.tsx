'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Properly lazy-load the devtools
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(mod => ({
    default: mod.ReactQueryDevtools,
  })),
  {
    ssr: false,
    loading: () => null,
  }
);

export function ReactQueryDevToolsWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
}
