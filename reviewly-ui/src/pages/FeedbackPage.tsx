/**
 * Feedback Page Component for Reviewly Application
 * 
 * Comprehensive peer feedback system with anonymous feedback options,
 * structured feedback forms, and feedback request management.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import FeedbackCard from '../components/feedback/FeedbackCard';
import FeedbackForm from '../components/feedback/FeedbackForm';
import FeedbackRequestForm from '../components/feedback/FeedbackRequestForm';
import FeedbackFiltersComponent from '../components/feedback/FeedbackFilters';
import './FeedbackPage.css';

// Feedback interfaces
export interface FeedbackItem {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  toUserName: string;
  type: 'peer' | 'manager' | 'direct-report' | 'self';
  category: 'performance' | 'collaboration' | 'leadership' | 'communication' | 'technical' | 'general';
  isAnonymous: boolean;
  content: string;
  rating?: number; // 1-5 scale
  strengths: string[];
  improvements: string[];
  tags: string[];
  isPublic: boolean;
  createdDate: string;
  lastUpdated: string;
  status: 'draft' | 'submitted' | 'acknowledged';
  requestId?: string;
}

export interface FeedbackRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetUserIds: string[];
  targetUserNames: string[];
  message: string;
  category: FeedbackItem['category'];
  deadline: string;
  isAnonymous: boolean;
  questions: string[];
  status: 'pending' | 'completed' | 'expired';
  createdDate: string;
  responses: string[]; // feedback IDs
}

interface FeedbackFilters {
  type: string;
  category: string;
  status: string;
  isAnonymous: string;
  search: string;
}

const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'given' | 'requests'>('received');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FeedbackRequest | null>(null);
  const [filters, setFilters] = useState<FeedbackFilters>({
    type: 'all',
    category: 'all',
    status: 'all',
    isAnonymous: 'all',
    search: '',
  });

  // Load feedback data from localStorage
  useEffect(() => {
    const savedFeedback = localStorage.getItem(`reviewly_feedback_${user?.id}`);
    const savedRequests = localStorage.getItem(`reviewly_feedback_requests_${user?.id}`);
    
    if (savedFeedback) {
      const parsedFeedback = JSON.parse(savedFeedback);
      setFeedbackItems(parsedFeedback);
    } else {
      // Initialize with sample feedback
      const sampleFeedback: FeedbackItem[] = [
        {
          id: '1',
          fromUserId: 'user_demo2',
          fromUserName: 'Sarah Johnson',
          fromUserAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
          toUserId: user?.id || '',
          toUserName: user?.name || '',
          type: 'peer',
          category: 'collaboration',
          isAnonymous: false,
          content: 'Great collaboration on the recent project. Your communication skills and ability to coordinate with different teams was excellent.',
          rating: 5,
          strengths: ['Communication', 'Team coordination', 'Problem solving'],
          improvements: ['Could be more proactive in sharing updates'],
          tags: ['teamwork', 'communication'],
          isPublic: true,
          createdDate: '2024-12-20',
          lastUpdated: '2024-12-20',
          status: 'submitted',
        },
        {
          id: '2',
          fromUserId: 'anonymous',
          fromUserName: 'Anonymous Colleague',
          toUserId: user?.id || '',
          toUserName: user?.name || '',
          type: 'peer',
          category: 'technical',
          isAnonymous: true,
          content: 'Your technical expertise in React is impressive. You helped me understand complex concepts quickly.',
          rating: 4,
          strengths: ['Technical knowledge', 'Teaching ability', 'Patience'],
          improvements: ['Could document solutions better'],
          tags: ['technical', 'mentoring'],
          isPublic: false,
          createdDate: '2024-12-18',
          lastUpdated: '2024-12-18',
          status: 'submitted',
        },
      ];
      setFeedbackItems(sampleFeedback);
      localStorage.setItem(`reviewly_feedback_${user?.id}`, JSON.stringify(sampleFeedback));
    }

    if (savedRequests) {
      const parsedRequests = JSON.parse(savedRequests);
      setFeedbackRequests(parsedRequests);
    } else {
      // Initialize with sample requests
      const sampleRequests: FeedbackRequest[] = [
        {
          id: '1',
          requesterId: user?.id || '',
          requesterName: user?.name || '',
          targetUserIds: ['user_demo2', 'user_demo3'],
          targetUserNames: ['Sarah Johnson', 'Mike Chen'],
          message: 'Hi! I would appreciate your feedback on my performance this quarter, especially regarding collaboration and communication.',
          category: 'performance',
          deadline: '2025-01-15',
          isAnonymous: false,
          questions: [
            'How would you rate my collaboration skills?',
            'What areas should I focus on for improvement?',
            'Any specific examples of good or poor performance?'
          ],
          status: 'pending',
          createdDate: '2024-12-22',
          responses: [],
        },
      ];
      setFeedbackRequests(sampleRequests);
      localStorage.setItem(`reviewly_feedback_requests_${user?.id}`, JSON.stringify(sampleRequests));
    }
  }, [user?.id]);

  // Filter feedback based on active tab and filters
  useEffect(() => {
    let filtered = feedbackItems;

    // Filter by tab
    if (activeTab === 'received') {
      filtered = filtered.filter(item => item.toUserId === user?.id);
    } else if (activeTab === 'given') {
      filtered = filtered.filter(item => item.fromUserId === user?.id);
    }

    // Apply other filters
    if (filters.type !== 'all') {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.isAnonymous !== 'all') {
      const isAnonymous = filters.isAnonymous === 'true';
      filtered = filtered.filter(item => item.isAnonymous === isAnonymous);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.content.toLowerCase().includes(searchLower) ||
        item.fromUserName.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredFeedback(filtered);
  }, [feedbackItems, activeTab, filters, user?.id]);

  // Save feedback to localStorage
  const saveFeedback = (updatedFeedback: FeedbackItem[]) => {
    setFeedbackItems(updatedFeedback);
    localStorage.setItem(`reviewly_feedback_${user?.id}`, JSON.stringify(updatedFeedback));
  };

  // Save requests to localStorage
  const saveRequests = (updatedRequests: FeedbackRequest[]) => {
    setFeedbackRequests(updatedRequests);
    localStorage.setItem(`reviewly_feedback_requests_${user?.id}`, JSON.stringify(updatedRequests));
  };

  // Handle feedback submission
  const handleFeedbackSubmit = (feedbackData: Omit<FeedbackItem, 'id' | 'createdDate' | 'lastUpdated'>) => {
    const newFeedback: FeedbackItem = {
      ...feedbackData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    saveFeedback([...feedbackItems, newFeedback]);
    setShowFeedbackForm(false);
    setSelectedRequest(null);
  };

  // Handle request submission
  const handleRequestSubmit = (requestData: Omit<FeedbackRequest, 'id' | 'createdDate' | 'responses'>) => {
    const newRequest: FeedbackRequest = {
      ...requestData,
      id: Date.now().toString(),
      createdDate: new Date().toISOString(),
      responses: [],
    };
    saveRequests([...feedbackRequests, newRequest]);
    setShowRequestForm(false);
  };

  // Handle feedback acknowledgment
  const handleAcknowledge = (feedbackId: string) => {
    const updatedFeedback = feedbackItems.map(item =>
      item.id === feedbackId ? { ...item, status: 'acknowledged' as const } : item
    );
    saveFeedback(updatedFeedback);
  };

  // Calculate statistics
  const stats = {
    received: feedbackItems.filter(f => f.toUserId === user?.id).length,
    given: feedbackItems.filter(f => f.fromUserId === user?.id).length,
    pending: feedbackRequests.filter(r => r.status === 'pending').length,
    averageRating: (() => {
      const receivedWithRating = feedbackItems.filter(f => f.toUserId === user?.id && f.rating);
      return receivedWithRating.length > 0
        ? Math.round((receivedWithRating.reduce((sum, f) => sum + (f.rating || 0), 0) / receivedWithRating.length) * 10) / 10
        : 0;
    })(),
  };

  return (
    <div className="feedback-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Peer Feedback</h1>
          <p>Give and receive feedback to grow together</p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-secondary btn-medium"
            onClick={() => setShowRequestForm(true)}
          >
            📝 Request Feedback
          </button>
          <button
            className="btn btn-primary btn-medium"
            onClick={() => setShowFeedbackForm(true)}
          >
            💬 Give Feedback
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="feedback-stats">
        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-content">
            <h3>Received</h3>
            <p className="stat-value">{stats.received}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <h3>Given</h3>
            <p className="stat-value">{stats.given}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Requests</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Average Rating</h3>
            <p className="stat-value">{stats.averageRating || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          📥 Received ({stats.received})
        </button>
        <button
          className={`tab-button ${activeTab === 'given' ? 'active' : ''}`}
          onClick={() => setActiveTab('given')}
        >
          📤 Given ({stats.given})
        </button>
        <button
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📝 Requests ({stats.pending})
        </button>
      </div>

      {/* Filters */}
      {activeTab !== 'requests' && (
        <FeedbackFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      {/* Content */}
      <div className="feedback-content">
        {activeTab === 'requests' ? (
          // Requests Tab
          <div className="requests-content">
            {feedbackRequests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No feedback requests</h3>
                <p>Start by requesting feedback from your colleagues.</p>
                <button
                  className="btn btn-primary btn-medium"
                  onClick={() => setShowRequestForm(true)}
                >
                  Request Feedback
                </button>
              </div>
            ) : (
              <div className="requests-grid">
                {feedbackRequests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <h3>{request.category} Feedback Request</h3>
                      <span className={`status-badge ${request.status}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="request-message">{request.message}</p>
                    <div className="request-details">
                      <div className="detail-item">
                        <strong>Recipients:</strong> {request.targetUserNames.join(', ')}
                      </div>
                      <div className="detail-item">
                        <strong>Deadline:</strong> {new Date(request.deadline).toLocaleDateString()}
                      </div>
                      <div className="detail-item">
                        <strong>Responses:</strong> {request.responses.length}/{request.targetUserIds.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Feedback Tabs
          <div className="feedback-list">
            {filteredFeedback.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>No feedback found</h3>
                <p>
                  {activeTab === 'received'
                    ? "You haven't received any feedback yet. Request feedback from your colleagues!"
                    : "You haven't given any feedback yet. Start by giving feedback to your colleagues!"
                  }
                </p>
                <button
                  className="btn btn-primary btn-medium"
                  onClick={() => activeTab === 'received' ? setShowRequestForm(true) : setShowFeedbackForm(true)}
                >
                  {activeTab === 'received' ? 'Request Feedback' : 'Give Feedback'}
                </button>
              </div>
            ) : (
              <div className="feedback-grid">
                {filteredFeedback.map(feedback => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    currentUserId={user?.id || ''}
                    onAcknowledge={handleAcknowledge}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          request={selectedRequest}
          onSubmit={handleFeedbackSubmit}
          onCancel={() => {
            setShowFeedbackForm(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {/* Request Form Modal */}
      {showRequestForm && (
        <FeedbackRequestForm
          onSubmit={handleRequestSubmit}
          onCancel={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
};

export default FeedbackPage;
