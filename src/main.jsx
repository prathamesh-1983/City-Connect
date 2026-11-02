import React from 'react';
import { createRoot } from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('CityConnect cannot start: the #root element is missing from index.html.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>,
);
