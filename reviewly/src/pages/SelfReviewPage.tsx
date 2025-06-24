/**
 * Self-Review Page Component for Reviewly Application
 * 
 * A dedicated page for employees to complete their self-evaluations.
 * Handles form submission, auto-saving, and navigation.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import SelfReviewForm from '../components/forms/SelfReviewForm';
import './SelfReviewPage.css';

interface SelfReviewData {
  period: string;
  tasks: any[];
  achievements: any[];
  skills: any[];
  feedback: any;
  goals: any[];
  challenges: string;
  improvements: string;
  additionalComments: string;
}

const SelfReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Load saved data from localStorage
  const [savedData, setSavedData] = useState<Partial<SelfReviewData> | undefined>(() => {
    const saved = localStorage.getItem(`reviewly_self_review_${user?.id}`);
    return saved ? JSON.parse(saved) : undefined;
  });

  // Handle form submission
  const handleSubmit = async (data: SelfReviewData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved draft
      localStorage.removeItem(`reviewly_self_review_${user?.id}`);
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle auto-save
  const handleSave = (data: SelfReviewData) => {
    localStorage.setItem(`reviewly_self_review_${user?.id}`, JSON.stringify(data));
    setLastSaved(new Date());
  };

  // Handle navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showSuccessMessage) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showSuccessMessage]);

  if (showSuccessMessage) {
    return (
      <div className="self-review-page">
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h1>Review Submitted Successfully!</h1>
            <p>Thank you for completing your self-review. Your responses have been saved and will be reviewed by your manager.</p>
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Submitted by:</span>
                <span className="detail-value">{user?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Submission time:</span>
                <span className="detail-value">{new Date().toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Review period:</span>
                <span className="detail-value">Q4 2024</span>
              </div>
            </div>
            <div className="success-actions">
              <button
                className="btn btn-primary btn-large"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="self-review-page">
      {/* Page Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Self-Review Form</h1>
          {lastSaved && (
            <p className="last-saved">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="header-actions">
          {savedData && (
            <button
              className="btn btn-ghost btn-medium"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved data?')) {
                  localStorage.removeItem(`reviewly_self_review_${user?.id}`);
                  setSavedData(undefined);
                  window.location.reload();
                }
              }}
            >
              Clear Draft
            </button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <h2>Submitting Your Review...</h2>
            <p>Please wait while we save your responses.</p>
          </div>
        </div>
      )}

      {/* Form */}
      <SelfReviewForm
        onSubmit={handleSubmit}
        onSave={handleSave}
        initialData={savedData}
        readOnly={isSubmitting}
      />
    </div>
  );
};

export default SelfReviewPage;
