import { useState, useEffect } from 'react';
import { dataAPI, getUserId } from '../services/api';
import IssueCard from './IssueCard';
import MergeRequestCard from './MergeRequestCard';

const Dashboard = () => {
  const [linearData, setLinearData] = useState({ issues: [], user: null });
  const [gitlabData, setGitlabData] = useState({ mergeRequests: [], user: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUserId = getUserId();

    if (currentUserId) {
      setUserId(currentUserId);
      fetchData(currentUserId);
    } else {
      setError('No user ID found. Please connect your accounts first.');
      setLoading(false);
    }
  }, []);

  const fetchData = async (currentUserId) => {
    try {
      setLoading(true);

      // Fetch Linear issues
      try {
        const linearResponse = await dataAPI.getLinearIssues(currentUserId);
        setLinearData(linearResponse.data);
      } catch (linearError) {
        console.error('Failed to fetch Linear data:', linearError);
      }

      // Fetch GitLab merge requests
      try {
        const gitlabResponse = await dataAPI.getGitLabMergeRequests(currentUserId);
        setGitlabData(gitlabResponse.data);
      } catch (gitlabError) {
        console.error('Failed to fetch GitLab data:', gitlabError);
      }

    } catch (error) {
      setError('Failed to fetch data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Linear Issues Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="text-2xl mr-3">📋</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Linear Issues</h2>
                {linearData.user && (
                  <p className="text-gray-600">Connected as {linearData.user.name}</p>
                )}
              </div>
            </div>
            
            {linearData.issues.length > 0 ? (
              <div className="space-y-4">
                {linearData.issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">📝</div>
                <p className="text-gray-600">
                  {linearData.user ? 'No issues assigned to you' : 'Linear not connected'}
                </p>
              </div>
            )}
          </div>

          {/* GitLab Merge Requests Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="text-2xl mr-3">🦊</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">GitLab Merge Requests</h2>
                {gitlabData.user && (
                  <p className="text-gray-600">Connected as {gitlabData.user.name || gitlabData.user.username}</p>
                )}
              </div>
            </div>
            
            {gitlabData.mergeRequests.length > 0 ? (
              <div className="space-y-4">
                {gitlabData.mergeRequests.map((mr) => (
                  <MergeRequestCard key={mr.id} mergeRequest={mr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🔀</div>
                <p className="text-gray-600">
                  {gitlabData.user ? 'No open merge requests' : 'GitLab not connected'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
