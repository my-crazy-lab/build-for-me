/**
 * Avatar Upload Component for Reviewly Application
 * 
 * Component for uploading and managing user avatar images with emoji fallback.
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState } from 'react';
import './AvatarUpload.css';

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Common emoji options for avatars
  const emojiOptions = [
    '👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬',
    '👨‍🎨', '👩‍🎨', '👨‍🏫', '👩‍🏫', '👨‍⚕️', '👩‍⚕️',
    '🧑‍💻', '🧑‍💼', '🧑‍🔬', '🧑‍🎨', '🧑‍🏫', '🧑‍⚕️',
    '😀', '😃', '😄', '😁', '😊', '😇', '🙂', '🙃',
    '😉', '😌', '😍', '🥰', '😎', '🤓', '🧐', '🤔',
    '🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '🧙‍♂️', '🧙‍♀️',
    '🎯', '🚀', '⭐', '🌟', '💫', '✨', '🔥', '💎',
  ];

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    onAvatarChange(emoji);
    setShowEmojiPicker(false);
  };

  // Handle file upload (simulated)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just use a placeholder
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onAvatarChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="avatar-upload">
      <div className="avatar-container">
        <div className="avatar-display">
          {currentAvatar.startsWith('data:') || currentAvatar.startsWith('http') ? (
            <img src={currentAvatar} alt="Avatar" className="avatar-image" />
          ) : (
            <span className="avatar-emoji">{currentAvatar}</span>
          )}
        </div>
        
        <div className="avatar-overlay">
          <button
            type="button"
            className="avatar-edit-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            ✏️
          </button>
        </div>
      </div>

      {showEmojiPicker && (
        <div className="emoji-picker">
          <div className="emoji-picker-header">
            <h4>Choose an Avatar</h4>
            <button
              type="button"
              className="emoji-picker-close"
              onClick={() => setShowEmojiPicker(false)}
            >
              ×
            </button>
          </div>
          
          <div className="emoji-grid">
            {emojiOptions.map(emoji => (
              <button
                key={emoji}
                type="button"
                className={`emoji-option ${currentAvatar === emoji ? 'selected' : ''}`}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <div className="upload-section">
            <label htmlFor="avatar-upload" className="upload-label">
              📁 Upload Image
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleFileUpload}
              className="upload-input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
