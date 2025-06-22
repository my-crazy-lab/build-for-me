import React, { useState } from 'react';
import { LogIn, Target, TrendingUp, Clock, Brain } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { User } from '../../types';

export default function LoginPage() {
  const { dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showGuestMode, setShowGuestMode] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    // Simulate Google OAuth login
    setTimeout(() => {
      const user: User = {
        id: crypto.randomUUID(),
        email: 'user@example.com',
        name: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date(),
        settings: {
          theme: 'light',
          chartType: 'bar',
          availableHoursPerWeek: 40,
          showModules: {
            goals: true,
            timeTracking: true,
            motivation: true,
            notes: true,
          },
          notifications: {
            weeklyReview: true,
            goalDeadlines: true,
            timeWarnings: true,
          },
        },
      };
      
      dispatch({ type: 'SET_USER', payload: user });
      setIsLoading(false);
    }, 2000);
  };

  const handleGuestMode = () => {
    const guestUser: User = {
      id: 'guest',
      email: 'guest@focusdashboard.com',
      name: 'Guest User',
      createdAt: new Date(),
      settings: {
        theme: 'light',
        chartType: 'bar',
        availableHoursPerWeek: 40,
        showModules: {
          goals: true,
          timeTracking: true,
          motivation: true,
          notes: true,
        },
        notifications: {
          weeklyReview: true,
          goalDeadlines: true,
          timeWarnings: true,
        },
      },
    };
    
    dispatch({ type: 'SET_USER', payload: guestUser });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Personal Focus Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            "You can achieve everything — just not all at once."
            <br />
            <span className="text-lg">Visualize, track, and manage time across your personal goals.</span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Features Section */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Take Control of Your Goals
              </h2>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Goal Management</h3>
                  <p className="text-gray-600">Create, organize, and track your personal goals with categories, priorities, and deadlines.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Visual Progress</h3>
                  <p className="text-gray-600">Beautiful charts and timelines to visualize your progress and time allocation.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Tracking</h3>
                  <p className="text-gray-600">Smart time management with warnings for overloaded or neglected goals.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Weekly Reviews</h3>
                  <p className="text-gray-600">Reflect on your progress with weekly reviews and motivational insights.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600">Sign in to start managing your goals</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={handleGuestMode}
                className="w-full flex items-center justify-center space-x-3 bg-gray-100 border-2 border-gray-200 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span>Continue as Guest</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500">
            Built with ❤️ for personal productivity
          </p>
        </div>
      </div>
    </div>
  );
}
