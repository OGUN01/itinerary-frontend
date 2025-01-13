'use client';

import Script from 'next/script';

export function DevTools() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@tanstack/react-query-devtools@latest/build/umd/index.production.js"
        strategy="lazyOnload"
        onReady={() => {
          const checkQueryClient = () => {
            if (window.__REACT_QUERY_GLOBAL__ && window.ReactQueryDevtools) {
              window.ReactQueryDevtools.initialize({
                initialIsOpen: false,
                buttonPosition: 'bottom-left',
                position: 'bottom'
              });
            } else {
              setTimeout(checkQueryClient, 100);
            }
          };
          checkQueryClient();
        }}
      />
    </>
  );
}
