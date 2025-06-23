/**
 * Career Path Visualization - Main App Component
 *
 * This is the root component of the application that sets up the main layout
 * and handles initial data loading.
 *
 * @fileoverview Main application component with data loading and layout
 * @author Career Path Visualization Team
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { type CareerData, ViewMode } from './types';
import { AppLayout, useAppContext } from './components/Layout/AppLayout';
import { loadCareerData } from './data/loader';
import { validateCareerData } from './utils/validation';
import { PageLoader } from './components/Common/LoadingSpinner';

// Import all view components
import { OverviewView } from './components/Views/OverviewView';
import { TimelineView } from './components/Views/TimelineView';
import { MapView } from './components/Views/MapView';
import { RadarView } from './components/Views/RadarView';
import { ProgressView } from './components/Views/ProgressView';
import { GoalsView } from './components/Views/GoalsView';
import { ProfileView } from './components/Views/ProfileView';
import { ExportView } from './components/Views/ExportView';
import { SettingsView } from './components/Views/SettingsView';

/**
 * View renderer component that displays the appropriate view based on current view mode
 */
function ViewRenderer(): React.JSX.Element {
  const { currentView } = useAppContext();

  switch (currentView) {
    case ViewMode.OVERVIEW:
      return <OverviewView />;
    case ViewMode.TIMELINE:
      return <TimelineView />;
    case ViewMode.MAP:
      return <MapView />;
    case ViewMode.RADAR:
      return <RadarView />;
    case ViewMode.PROGRESS:
      return <ProgressView />;
    case ViewMode.GOALS:
      return <GoalsView />;
    case ViewMode.PROFILE:
      return <ProfileView />;
    case ViewMode.EXPORT:
      return <ExportView />;
    case ViewMode.SETTINGS:
      return <SettingsView />;
    default:
      return <OverviewView />;
  }
}

/**
 * Main application component
 *
 * Handles initial data loading, validation, and renders the main layout
 * with the career path visualization components.
 */
function App(): React.JSX.Element {
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load and validate career data on component mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load career data
        const result = await loadCareerData();

        if (!result.success) {
          throw new Error(result.error.message);
        }

        const { data: loadedData } = result.data;

        // Validate the loaded data
        const validationResult = validateCareerData(loadedData);

        if (!validationResult.isValid) {
          const errorMessages = validationResult.errors.map(e => e.message).join(', ');
          throw new Error(`Data validation failed: ${errorMessages}`);
        }

        // Log warnings if any
        if (validationResult.warnings.length > 0) {
          console.warn('Data validation warnings:', validationResult.warnings);
        }

        setCareerData(loadedData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Failed to load career data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Show loading screen while data is being loaded
  if (isLoading) {
    return <PageLoader message="Loading your career data..." />;
  }

  // Show error screen if data loading failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            Failed to Load Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render main application with layout
  return (
    <AppLayout
      initialData={careerData || undefined}
      initialView={ViewMode.OVERVIEW}
    >
      <ViewRenderer />
    </AppLayout>
  );
}

export default App;
