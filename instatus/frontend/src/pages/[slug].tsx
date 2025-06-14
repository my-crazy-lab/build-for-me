import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { StatusPageLayout } from '../components/layouts/StatusPageLayout';
import { ComponentStatusCard } from '../components/status/ComponentStatusCard';
import { IncidentCard } from '../components/status/IncidentCard';
import { UptimeChart } from '../components/status/UptimeChart';
import { SubscribeModal } from '../components/status/SubscribeModal';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { api } from '../utils/api';
import { useSocket } from '../hooks/useSocket';
import { StatusPageData, ComponentStatus } from '../../shared/types';

/**
 * Public Status Page
 * 
 * Displays the public status page for a project
 */

interface StatusPageProps {
  initialData: StatusPageData;
  slug: string;
}

export default function StatusPage({ initialData, slug }: StatusPageProps) {
  const [statusData, setStatusData] = useState<StatusPageData>(initialData);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Setup real-time updates
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Join project room for real-time updates
    socket.emit('join-project', statusData.project.id);

    // Listen for component status changes
    socket.on('component-status-changed', (data) => {
      setStatusData(prev => ({
        ...prev,
        components: prev.components.map(component =>
          component.id === data.componentId
            ? { ...component, status: data.status }
            : component
        )
      }));
    });

    // Listen for new incidents
    socket.on('incident-created', (incident) => {
      setStatusData(prev => ({
        ...prev,
        incidents: [incident, ...prev.incidents]
      }));
    });

    // Listen for incident updates
    socket.on('incident-updated', (incident) => {
      setStatusData(prev => ({
        ...prev,
        incidents: prev.incidents.map(inc =>
          inc.id === incident.id ? incident : inc
        )
      }));
    });

    return () => {
      socket.off('component-status-changed');
      socket.off('incident-created');
      socket.off('incident-updated');
    };
  }, [socket, statusData.project.id]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/status/${slug}`);
      setStatusData(response.data.data);
    } catch (error) {
      console.error('Failed to refresh status data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOverallStatusMessage = () => {
    const activeIncidents = statusData.incidents.filter(
      incident => incident.status !== 'resolved'
    );

    if (activeIncidents.length > 0) {
      return `We are currently experiencing ${activeIncidents.length} active incident${activeIncidents.length > 1 ? 's' : ''}`;
    }

    switch (statusData.overall_status) {
      case ComponentStatus.OPERATIONAL:
        return 'All systems operational';
      case ComponentStatus.DEGRADED:
        return 'Some systems experiencing degraded performance';
      case ComponentStatus.PARTIAL_OUTAGE:
        return 'Some systems experiencing partial outage';
      case ComponentStatus.MAJOR_OUTAGE:
        return 'Major outage affecting multiple systems';
      case ComponentStatus.MAINTENANCE:
        return 'Scheduled maintenance in progress';
      default:
        return 'Status unknown';
    }
  };

  const branding = statusData.project.branding || {};

  return (
    <>
      <Head>
        <title>{statusData.project.name} - Status</title>
        <meta name="description" content={statusData.project.description || `Status page for ${statusData.project.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Custom branding */}
        <style jsx>{`
          :root {
            --primary-color: ${branding.primary_color || '#3b82f6'};
            --secondary-color: ${branding.secondary_color || '#1e40af'};
            --accent-color: ${branding.accent_color || '#10b981'};
          }
        `}</style>
      </Head>

      <StatusPageLayout branding={branding}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {statusData.project.name}
            </h1>
            {statusData.project.description && (
              <p className="text-lg text-gray-600 mb-6">
                {statusData.project.description}
              </p>
            )}
            
            {/* Overall Status */}
            <div className="inline-flex items-center space-x-3 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <StatusIndicator status={statusData.overall_status} size="lg" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-600">Current Status</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getOverallStatusMessage()}
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="ml-4 btn btn-outline"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </button>
          </div>

          {/* Active Incidents */}
          {statusData.incidents.filter(incident => incident.status !== 'resolved').length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Incidents</h2>
              <div className="space-y-4">
                {statusData.incidents
                  .filter(incident => incident.status !== 'resolved')
                  .map(incident => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
              </div>
            </div>
          )}

          {/* Components */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Services</h2>
              <button
                onClick={() => setShowSubscribeModal(true)}
                className="btn btn-primary"
              >
                Subscribe to Updates
              </button>
            </div>
            
            {statusData.components.length > 0 ? (
              <div className="space-y-3">
                {statusData.components.map(component => (
                  <ComponentStatusCard key={component.id} component={component} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No services configured yet.</p>
              </div>
            )}
          </div>

          {/* Uptime Chart */}
          {statusData.uptime_stats && statusData.uptime_stats.daily_data.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Uptime History ({statusData.uptime_stats.period_days} days)
              </h2>
              <UptimeChart data={statusData.uptime_stats} />
            </div>
          )}

          {/* Past Incidents */}
          {statusData.incidents.filter(incident => incident.status === 'resolved').length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Incidents</h2>
              <div className="space-y-4">
                {statusData.incidents
                  .filter(incident => incident.status === 'resolved')
                  .slice(0, 10) // Show only last 10 resolved incidents
                  .map(incident => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
              </div>
              
              {statusData.incidents.filter(incident => incident.status === 'resolved').length > 10 && (
                <div className="text-center mt-6">
                  <button className="btn btn-outline">
                    View All Past Incidents
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Powered by{' '}
              <a 
                href="https://github.com/yourusername/instatus-clone" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Instatus Clone
              </a>
            </p>
          </div>
        </div>

        {/* Subscribe Modal */}
        {showSubscribeModal && (
          <SubscribeModal
            projectSlug={slug}
            onClose={() => setShowSubscribeModal(false)}
          />
        )}
      </StatusPageLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;

  try {
    // Fetch status page data server-side
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return {
          notFound: true
        };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    return {
      props: {
        initialData: data.data,
        slug: slug as string
      }
    };
  } catch (error) {
    console.error('Error fetching status page data:', error);
    
    return {
      notFound: true
    };
  }
};
