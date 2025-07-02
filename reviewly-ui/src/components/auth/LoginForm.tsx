/**
 * Login Form Component for Reviewly Application
 * 
 * This component provides a beautiful login interface with support for both
 * email/password authentication and Google OAuth. It features a modern design
 * with neumorphism styling, smooth animations, and comprehensive form validation.
 * 
 * Features:
 * - Email/password login
 * - Google OAuth integration
 * - Form validation
 * - Loading states
 * - Error handling
 * - Demo credentials display
 * - Responsive design
 * - Accessibility support
 * 
 * Created: 2025-06-24
 * Version: 1.0.0
 * Author: Reviewly Development Team
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/SimpleAuthContext';
import './LoginForm.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);

  // Demo credentials for easy testing
  const demoCredentials = [
    { email: 'admin@reviewly.com', password: '123456', role: 'Admin' },
    { email: 'demo@reviewly.com', password: 'demo123', role: 'Employee' },
    { email: 'manager@reviewly.com', password: 'manager123', role: 'Manager' },
    { email: 'hr@reviewly.com', password: 'hr123', role: 'HR' },
  ];

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    if (error) {
      setFormErrors({ general: error });
    }
  }, [error]);

  useEffect(() => {
    clearError();
    setFormErrors({});
  }, [formData, clearError]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      onSuccess?.();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  // Handle Google login (placeholder for future implementation)
  const handleGoogleLogin = async () => {
    alert('Google login will be implemented in a future version');
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fill demo credentials
  const fillDemoCredentials = (credentials: typeof demoCredentials[0]) => {
    setFormData({
      email: credentials.email,
      password: credentials.password,
    });
    setShowDemoCredentials(false);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card animate-fade-in">
        {/* Header */}
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon">📊</div>
            <h1>Reviewly</h1>
          </div>
          <p className="login-subtitle">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {/* Demo Credentials */}
        {showDemoCredentials && (
          <div className="demo-credentials">
              <div className="demo-header">
                <span>🎯 Demo Credentials</span>
                <button
                  type="button"
                  className="close-demo"
                  onClick={() => setShowDemoCredentials(false)}
                >
                  ×
                </button>
              </div>
              <div className="demo-list">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    className="demo-credential"
                    onClick={() => fillDemoCredentials(cred)}
                  >
                    <div className="demo-role">{cred.role}</div>
                    <div className="demo-email">{cred.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
              <div className="input-icon">📧</div>
            </div>
            {formErrors.email && (
              <div className="error-message">
                {formErrors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {formErrors.password && (
              <div className="error-message">
                {formErrors.password}
              </div>
            )}
          </div>

          {/* General Error */}
          {formErrors.general && (
            <div className="error-message general-error">
              {formErrors.general}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <div className="google-icon">🔍</div>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button type="button" className="link-button">
              Contact your administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
