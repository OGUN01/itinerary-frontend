export async function initDevTools() {
  if (process.env.NODE_ENV === 'development') {
    try {
      const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools');
      const { createRoot } = await import('react-dom/client');

      let devToolsRoot = document.getElementById('react-query-devtools-root');
      
      // Create root element if it doesn't exist
      if (!devToolsRoot) {
        devToolsRoot = document.createElement('div');
        devToolsRoot.id = 'react-query-devtools-root';
        document.body.appendChild(devToolsRoot);
      }

      const root = createRoot(devToolsRoot);
      root.render(<ReactQueryDevtools />);
    } catch (error) {
      console.warn('Failed to load React Query DevTools:', error);
    }
  }
}
