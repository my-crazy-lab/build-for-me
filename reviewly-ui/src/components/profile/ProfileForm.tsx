/**
 * Profile Form Component for Reviewly Application
 * 
 * Form for editing user profile information including personal details,
 * skills, interests, and social links.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import type { UserProfile } from '../../pages/ProfilePage';
import './ProfileForm.css';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isSaving: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  isSaving,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle form field changes
  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  // Handle nested field changes
  const handleNestedFieldChange = (parent: keyof UserProfile, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  // Handle array field changes
  const handleArrayFieldChange = (field: keyof UserProfile, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: values,
    }));
    setHasChanges(true);
  };

  // Add skill
  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      handleArrayFieldChange('skills', [...formData.skills, skill.trim()]);
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove: string) => {
    handleArrayFieldChange('skills', formData.skills.filter(skill => skill !== skillToRemove));
  };

  // Add interest
  const handleAddInterest = (interest: string) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      handleArrayFieldChange('interests', [...formData.interests, interest.trim()]);
    }
  };

  // Remove interest
  const handleRemoveInterest = (interestToRemove: string) => {
    handleArrayFieldChange('interests', formData.interests.filter(interest => interest !== interestToRemove));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setHasChanges(false);
  };

  // Reset form
  const handleReset = () => {
    setFormData(profile);
    setHasChanges(false);
  };

  return (
    <div className="profile-form">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleFieldChange('displayName', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="form-section">
          <h3>Professional Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Job Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                value={formData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="manager">Manager</label>
              <input
                type="text"
                id="manager"
                value={formData.manager}
                onChange={(e) => handleFieldChange('manager', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="timezone">Timezone</label>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={(e) => handleFieldChange('timezone', e.target.value)}
              >
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="Europe/London">GMT</option>
                <option value="Europe/Paris">CET</option>
                <option value="Asia/Tokyo">JST</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Skills */}
        <div className="form-section">
          <h3>Skills</h3>
          <div className="tags-input">
            <div className="tags-list">
              {formData.skills.map(skill => (
                <span key={skill} className="tag">
                  {skill}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a skill and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>

        {/* Interests */}
        <div className="form-section">
          <h3>Interests</h3>
          <div className="tags-input">
            <div className="tags-list">
              {formData.interests.map(interest => (
                <span key={interest} className="tag">
                  {interest}
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={() => handleRemoveInterest(interest)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add an interest and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="form-section">
          <h3>Social Links</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) => handleNestedFieldChange('socialLinks', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="github">GitHub</label>
              <input
                type="url"
                id="github"
                value={formData.socialLinks.github || ''}
                onChange={(e) => handleNestedFieldChange('socialLinks', 'github', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="twitter">Twitter</label>
              <input
                type="url"
                id="twitter"
                value={formData.socialLinks.twitter || ''}
                onChange={(e) => handleNestedFieldChange('socialLinks', 'twitter', e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                value={formData.socialLinks.website || ''}
                onChange={(e) => handleNestedFieldChange('socialLinks', 'website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline btn-medium"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-medium"
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
