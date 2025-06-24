/**
 * Profile Page Component for Reviewly Application
 * 
 * Comprehensive user profile management system with personal information,
 * preferences, avatar upload, and account settings.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/SimpleAuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import PreferencesForm from '../components/profile/PreferencesForm';
import SecuritySettings from '../components/profile/SecuritySettings';
import AvatarUpload from '../components/profile/AvatarUpload';
import './ProfilePage.css';

// Profile interfaces
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  title: string;
  department: string;
  manager: string;
  location: string;
  timezone: string;
  phone: string;
  bio: string;
  avatar: string;
  skills: string[];
  interests: string[];
  languages: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  joinDate: Date;
  lastActive: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  privacySettings: {
    profileVisibility: 'public' | 'team' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
  };
  dashboardLayout: string;
  defaultView: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  activeSessions: {
    id: string;
    device: string;
    location: string;
    lastActive: Date;
    current: boolean;
  }[];
  loginHistory: {
    date: Date;
    device: string;
    location: string;
    success: boolean;
  }[];
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: user?.id || '1',
          email: user?.email || 'john.doe@company.com',
          firstName: 'John',
          lastName: 'Doe',
          displayName: 'John Doe',
          title: 'Senior Software Engineer',
          department: 'Engineering',
          manager: 'Sarah Johnson',
          location: 'San Francisco, CA',
          timezone: 'America/Los_Angeles',
          phone: '+1 (555) 123-4567',
          bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Love building scalable applications and mentoring junior developers.',
          avatar: '👨‍💻',
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
          interests: ['Open Source', 'Machine Learning', 'Photography', 'Hiking'],
          languages: ['English', 'Spanish', 'French'],
          socialLinks: {
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            website: 'https://johndoe.dev',
          },
          joinDate: new Date('2020-03-15'),
          lastActive: new Date(),
        };

        const mockPreferences: UserPreferences = {
          theme: 'light',
          language: 'en',
          timezone: 'America/Los_Angeles',
          dateFormat: 'MM/DD/YYYY',
          emailNotifications: true,
          pushNotifications: true,
          weeklyDigest: true,
          privacySettings: {
            profileVisibility: 'team',
            showEmail: false,
            showPhone: false,
            showLocation: true,
          },
          dashboardLayout: 'default',
          defaultView: 'dashboard',
        };

        const mockSecurity: SecuritySettings = {
          twoFactorEnabled: false,
          lastPasswordChange: new Date('2024-10-15'),
          activeSessions: [
            {
              id: '1',
              device: 'Chrome on MacBook Pro',
              location: 'San Francisco, CA',
              lastActive: new Date(),
              current: true,
            },
            {
              id: '2',
              device: 'Safari on iPhone',
              location: 'San Francisco, CA',
              lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
              current: false,
            },
          ],
          loginHistory: [
            {
              date: new Date(),
              device: 'Chrome on MacBook Pro',
              location: 'San Francisco, CA',
              success: true,
            },
            {
              date: new Date(Date.now() - 24 * 60 * 60 * 1000),
              device: 'Safari on iPhone',
              location: 'San Francisco, CA',
              success: true,
            },
          ],
        };

        setProfile(mockProfile);
        setPreferences(mockPreferences);
        setSecurity(mockSecurity);
        setIsLoading(false);
      }, 1000);
    };

    loadUserData();
  }, [user]);

  // Save profile data
  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfile(updatedProfile);
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  // Save preferences
  const handleSavePreferences = async (updatedPreferences: UserPreferences) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setPreferences(updatedPreferences);
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  // Save security settings
  const handleSaveSecurity = async (updatedSecurity: SecuritySettings) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSecurity(updatedSecurity);
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="profile-page loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !preferences || !security) {
    return (
      <div className="profile-page error">
        <div className="error-message">
          <h2>Unable to load profile</h2>
          <p>Please try again later or contact support if the problem persists.</p>
          <button
            className="btn btn-primary btn-medium"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="page-header">
        <button
          className="btn btn-outline btn-medium back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
        
        <div className="header-info">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </div>
        
        <div className="header-actions">
          {isSaving && (
            <div className="saving-indicator">
              <div className="saving-spinner"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="profile-summary">
        <div className="profile-avatar">
          <AvatarUpload
            currentAvatar={profile.avatar}
            onAvatarChange={(newAvatar) => handleSaveProfile({ ...profile, avatar: newAvatar })}
          />
        </div>
        
        <div className="profile-info">
          <h2>{profile.displayName}</h2>
          <p className="profile-title">{profile.title}</p>
          <p className="profile-department">{profile.department}</p>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Member since</span>
              <span className="stat-value">{profile.joinDate.toLocaleDateString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Last active</span>
              <span className="stat-value">
                {profile.lastActive.toLocaleDateString()} at {profile.lastActive.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile Information
        </button>
        <button
          className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          ⚙️ Preferences
        </button>
        <button
          className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'profile' && (
          <ProfileForm
            profile={profile}
            onSave={handleSaveProfile}
            isSaving={isSaving}
          />
        )}
        
        {activeTab === 'preferences' && (
          <PreferencesForm
            preferences={preferences}
            onSave={handleSavePreferences}
            isSaving={isSaving}
          />
        )}
        
        {activeTab === 'security' && (
          <SecuritySettings
            security={security}
            onSave={handleSaveSecurity}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
