/**
 * main.jsx  ─ Application Entry Point
 * ───────────────────────────────────────────────────────────
 * Mounts the React application into the #root DOM element.
 * Wraps the app in:
 *   - <React.StrictMode>  ─ highlights potential issues in dev
 *   - <BrowserRouter>     ─ provides HTML5 history routing
 * ───────────────────────────────────────────────────────────
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { ThemeProvider } from './context/ThemeContext';
import { LayoutProvider } from './context/LayoutContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// Global styles – Tailwind CSS + custom design tokens
import './styles/index.css';

// PWA service worker (offline shell + install prompt)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <LayoutProvider>
              <App />
              <Analytics />
              <SpeedInsights />
            </LayoutProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
