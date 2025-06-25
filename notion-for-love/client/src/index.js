/**
 * Love Journey - Main React Entry Point
 * 
 * This file initializes the React application with all necessary providers
 * and global configurations for the Love Journey application.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Performance monitoring
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring function
function sendToAnalytics(metric) {
  // In production, you would send this to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', metric);
  }
}

// Measure and report Core Web Vitals
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
