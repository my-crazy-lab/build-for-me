import { useState, useEffect } from 'react';
import { authAPI, dataAPI, getUserId, setUserId } from '../services/api';
import ConnectionCard from './ConnectionCard';

const Home = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    linear: { connected: false, user: null },
    gitlab: { connected: false, user: null }
  });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUserId = getUserId();

    if (currentUserId) {
      setUserId(currentUserId);
      checkConnectionStatus(currentUserId);
    } else {
      setLoading(false);
    }
  }, []);

  const checkConnectionStatus = async (currentUserId) => {
    try {
      const response = await dataAPI.getConnectionStatus(currentUserId);
      setConnectionStatus(response.data);
    } catch (error) {
      console.error('Failed to check connection status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinearConnect = async () => {
    try {
      const response = await authAPI.getLinearAuthUrl();
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Failed to get Linear auth URL:', error);
    }
  };

  const handleGitLabConnect = async () => {
    try {
      const response = await authAPI.getGitLabAuthUrl();
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Failed to get GitLab auth URL:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔧 React OAuth Integration Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with Linear & GitLab to view your issues and merge requests
          </p>
          
          {userId && (
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                User ID: {userId}
              </span>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <ConnectionCard
            title="Linear"
            description="Connect to Linear to view your assigned issues"
            icon="📋"
            connected={connectionStatus.linear.connected}
            user={connectionStatus.linear.user}
            onConnect={handleLinearConnect}
            color="blue"
          />
          
          <ConnectionCard
            title="GitLab"
            description="Connect to GitLab to view your merge requests"
            icon="🦊"
            connected={connectionStatus.gitlab.connected}
            user={connectionStatus.gitlab.user}
            onConnect={handleGitLabConnect}
            color="orange"
          />
        </div>

        {(connectionStatus.linear.connected || connectionStatus.gitlab.connected) && (
          <div className="text-center mt-12">
            <a
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              View Dashboard
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
