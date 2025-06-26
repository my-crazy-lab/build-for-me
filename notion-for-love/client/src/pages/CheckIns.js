/**
 * Love Journey - Relationship Health Check-ins Page
 * 
 * Periodic relationship health assessments with prompts, tracking,
 * gamification badges, and progress analytics.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, TrendingUp, Calendar, Award, Star, Plus,
  CheckCircle, Clock, Target, Users, MessageCircle,
  BarChart3, Trophy, Flame, Zap, Shield, Gift
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { checkinsService } from '../services';

const CheckIns = () => {
  const [checkIns, setCheckIns] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [error, setError] = useState(null);

  // Check-in categories and questions
  const checkInCategories = {
    communication: {
      name: 'Communication',
      icon: MessageCircle,
      color: 'bg-blue-500',
      questions: [
        "How well did we communicate this week?",
        "Did we listen to each other actively?",
        "Were we able to resolve conflicts peacefully?",
        "Did we express our feelings openly?"
      ]
    },
    intimacy: {
      name: 'Intimacy & Connection',
      icon: Heart,
      color: 'bg-red-500',
      questions: [
        "How connected did we feel this week?",
        "Did we make time for physical affection?",
        "Were we emotionally supportive of each other?",
        "Did we share meaningful moments together?"
      ]
    },
    goals: {
      name: 'Shared Goals',
      icon: Target,
      color: 'bg-green-500',
      questions: [
        "Did we work towards our shared goals?",
        "Are we aligned on our future plans?",
        "Did we support each other's individual goals?",
        "Are we making progress as a team?"
      ]
    },
    fun: {
      name: 'Fun & Adventure',
      icon: Star,
      color: 'bg-yellow-500',
      questions: [
        "Did we have fun together this week?",
        "Did we try something new or adventurous?",
        "Were we playful with each other?",
        "Did we laugh together regularly?"
      ]
    },
    support: {
      name: 'Support & Care',
      icon: Shield,
      color: 'bg-purple-500',
      questions: [
        "Did we support each other during challenges?",
        "Were we there for each other emotionally?",
        "Did we show appreciation and gratitude?",
        "Did we help each other with daily tasks?"
      ]
    }
  };

  // Available badges
  const availableBadges = [
    {
      id: 'streak_7',
      name: 'Week Warrior',
      description: 'Complete 7 consecutive check-ins',
      icon: Flame,
      color: 'bg-orange-500',
      requirement: 7,
      type: 'streak'
    },
    {
      id: 'streak_30',
      name: 'Monthly Master',
      description: 'Complete 30 consecutive check-ins',
      icon: Trophy,
      color: 'bg-gold-500',
      requirement: 30,
      type: 'streak'
    },
    {
      id: 'perfect_score',
      name: 'Perfect Harmony',
      description: 'Score 5/5 in all categories',
      icon: Star,
      color: 'bg-yellow-500',
      requirement: 1,
      type: 'perfect'
    },
    {
      id: 'communicator',
      name: 'Great Communicator',
      description: 'Excel in communication for 5 check-ins',
      icon: MessageCircle,
      color: 'bg-blue-500',
      requirement: 5,
      type: 'category'
    },
    {
      id: 'supporter',
      name: 'Ultimate Supporter',
      description: 'Excel in support for 5 check-ins',
      icon: Shield,
      color: 'bg-purple-500',
      requirement: 5,
      type: 'category'
    }
  ];



  // Load check-ins from API
  const loadCheckIns = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkinsService.getCheckins({ days: 30 });
      if (response.success) {
        setCheckIns(response.data);
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error('Error loading check-ins:', error);
      setError('Failed to load check-ins');
    } finally {
      setLoading(false);
    }
  };

  // Load user streak
  const loadUserStreak = async () => {
    try {
      // Assuming we have a way to get current user ID
      const userId = 'current-user-id'; // This would come from auth context
      const response = await checkinsService.getUserStreak(userId);
      if (response.success) {
        setCurrentStreak(response.data.streak);
      }
    } catch (error) {
      console.error('Error loading user streak:', error);
    }
  };

  useEffect(() => {
    loadCheckIns();
    loadUserStreak();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getCheckInStats = () => {
    const total = checkIns.length;
    const averageScore = checkIns.reduce((sum, checkIn) => sum + checkIn.overallScore, 0) / total || 0;
    const lastWeekScore = checkIns.length > 0 ? checkIns[0].overallScore : 0;
    const badgeCount = badges.length;

    return {
      total,
      averageScore: averageScore.toFixed(1),
      lastWeekScore: lastWeekScore.toFixed(1),
      badgeCount,
      streak: currentStreak
    };
  };

  const getCategoryTrends = () => {
    const trends = {};
    Object.keys(checkInCategories).forEach(category => {
      const scores = checkIns.map(checkIn => checkIn.responses[category]?.score || 0);
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length || 0;
      const latest = scores[0] || 0;
      const previous = scores[1] || 0;
      const trend = latest > previous ? 'up' : latest < previous ? 'down' : 'stable';
      
      trends[category] = {
        average: average.toFixed(1),
        latest,
        trend
      };
    });
    return trends;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isCheckInDue = () => {
    if (checkIns.length === 0) return true;
    
    const lastCheckIn = new Date(checkIns[0].date);
    const now = new Date();
    const daysSinceLastCheckIn = Math.floor((now - lastCheckIn) / (1000 * 60 * 60 * 24));
    
    return daysSinceLastCheckIn >= 7;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="heart"
          text="Loading your relationship insights..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-6 text-center">
          <p className="text-error-600 dark:text-error-400 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={() => loadCheckIns()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const stats = getCheckInStats();
  const trends = getCategoryTrends();
  const isDue = isCheckInDue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relationship Check-ins
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Weekly health assessments to strengthen your bond
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isDue && (
            <Badge variant="warning" size="sm">
              <Clock className="w-3 h-3 mr-1" />
              Check-in Due
            </Badge>
          )}
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCheckInModal(true)}
            disabled={!isDue}
          >
            {isDue ? 'Start Check-in' : 'Check-in Complete'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Check-ins
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Score
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageScore}/5
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Last Week
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.lastWeekScore}/5
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.streak}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Badges Earned
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.badgeCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Trends */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(checkInCategories).map(([key, category]) => {
            const trend = trends[key];
            const CategoryIcon = category.icon;
            
            return (
              <div key={key} className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 ${category.color}`}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                  {category.name}
                </h4>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {trend?.latest || 0}
                  </span>
                  <span className="text-sm text-gray-500">/5</span>
                  {trend?.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                  {trend?.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Avg: {trend?.average || 0}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Badges Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Achievement Badges
          </h3>
          <Badge variant="primary" size="sm">
            {badges.length} earned
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {availableBadges.map((badge) => {
            const earned = badges.find(b => b.id === badge.id);
            const BadgeIcon = badge.icon;
            
            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earned}
                BadgeIcon={BadgeIcon}
              />
            );
          })}
        </div>
      </Card>

      {/* Recent Check-ins */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Check-ins
        </h3>
        
        <div className="space-y-4">
          {checkIns.slice(0, 3).map((checkIn, index) => (
            <CheckInCard
              key={checkIn.id}
              checkIn={checkIn}
              index={index}
              checkInCategories={checkInCategories}
              formatDate={formatDate}
              onClick={() => setSelectedCheckIn(checkIn)}
            />
          ))}
        </div>

        {checkIns.length > 3 && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm">
              View All Check-ins
            </Button>
          </div>
        )}
      </Card>

      {/* Check-in Modal */}
      <Modal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        title="Weekly Relationship Check-in"
        size="xl"
      >
        <CheckInForm
          checkInCategories={checkInCategories}
          onClose={() => setShowCheckInModal(false)}
          onSave={async (checkInData) => {
            try {
              const response = await checkinsService.createCheckin(checkInData);
              if (response.success) {
                // Refresh check-ins list
                const checkinsResponse = await checkinsService.getCheckins();
                if (checkinsResponse.success) {
                  setCheckIns(checkinsResponse.data);
                }
                setShowCheckInModal(false);
              } else {
                console.error('Failed to create check-in:', response.error);
                alert('Failed to create check-in. Please try again.');
              }
            } catch (error) {
              console.error('Error creating check-in:', error);
              alert('Failed to create check-in. Please try again.');
            }
          }}
        />
      </Modal>

      {/* Check-in Detail Modal */}
      {selectedCheckIn && (
        <CheckInDetailModal
          checkIn={selectedCheckIn}
          checkInCategories={checkInCategories}
          onClose={() => setSelectedCheckIn(null)}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

// Badge Card Component
const BadgeCard = ({ badge, earned, BadgeIcon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg border-2 text-center transition-all ${
        earned
          ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
        earned ? badge.color : 'bg-gray-400'
      }`}>
        <BadgeIcon className="w-6 h-6 text-white" />
      </div>
      <h4 className={`font-medium text-sm mb-1 ${
        earned ? 'text-gray-900 dark:text-white' : 'text-gray-500'
      }`}>
        {badge.name}
      </h4>
      <p className={`text-xs ${
        earned ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'
      }`}>
        {badge.description}
      </p>
      {earned?.isNew && (
        <Badge variant="success" size="sm" className="mt-2">
          New!
        </Badge>
      )}
    </motion.div>
  );
};

// Check-in Card Component
const CheckInCard = ({ checkIn, index, checkInCategories, formatDate, onClick }) => {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600 dark:text-green-400';
    if (score >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer"
      onClick={() => onClick(checkIn)}
    >
      <Card hover className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {checkIn.week}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completed {formatDate(checkIn.completedAt)}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(checkIn.overallScore)}`}>
              {checkIn.overallScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Overall
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-3">
          {Object.entries(checkInCategories).map(([key, category]) => {
            const score = checkIn.responses[key]?.score || 0;
            const CategoryIcon = category.icon;

            return (
              <div key={key} className="text-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1 ${category.color}`}>
                  <CategoryIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {score}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-1">
          {checkIn.highlights.slice(0, 2).map((highlight, highlightIndex) => (
            <div key={highlightIndex} className="flex items-center space-x-2 text-sm">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

// Check-in Form Component
const CheckInForm = ({ checkInCategories, onClose, onSave }) => {
  const [responses, setResponses] = useState({});
  const [highlights, setHighlights] = useState('');
  const [improvements, setImprovements] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const categories = Object.entries(checkInCategories);
  const currentCategory = categories[currentStep];

  const handleScoreChange = (category, score, notes) => {
    setResponses(prev => ({
      ...prev,
      [category]: { score, notes }
    }));
  };

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const overallScore = Object.values(responses).reduce((sum, response) => sum + response.score, 0) / Object.keys(responses).length;

    // Format data for API - create a comprehensive check-in response
    const responseText = Object.entries(responses)
      .map(([category, data]) => `${category}: ${data.score}/5 - ${data.notes || 'No notes'}`)
      .join('\n');

    const fullResponse = [
      responseText,
      highlights && `Highlights: ${highlights}`,
      improvements && `Improvements: ${improvements}`
    ].filter(Boolean).join('\n\n');

    const checkInData = {
      prompt: 'Weekly Relationship Check-in',
      response: fullResponse,
      category: 'reflection',
      mood: overallScore >= 4 ? 'great' : overallScore >= 3 ? 'good' : overallScore >= 2 ? 'okay' : 'concerned',
      rating: Math.round(overallScore * 2) // Convert 1-5 scale to 1-10 scale
    };

    onSave(checkInData);
  };

  const isComplete = Object.keys(responses).length === categories.length;

  if (currentStep >= categories.length) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Almost Done!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Add some final thoughts about this week
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What went well this week? (One per line)
          </label>
          <textarea
            value={highlights}
            onChange={(e) => setHighlights(e.target.value)}
            placeholder="Great communication during dinner&#10;Had an amazing date night&#10;Supported each other through stress"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What could we improve next week? (One per line)
          </label>
          <textarea
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
            placeholder="Make more time for date nights&#10;Work on our savings goal&#10;Try a new activity together"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={handlePrevious}>
            Back
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Complete Check-in
          </Button>
        </div>
      </div>
    );
  }

  const [categoryKey, category] = currentCategory;
  const CategoryIcon = category.icon;
  const currentResponse = responses[categoryKey] || { score: 0, notes: '' };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {categories.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {currentStep + 1} of {categories.length}
        </span>
      </div>

      {/* Category Header */}
      <div className="text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${category.color}`}>
          <CategoryIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {category.name}
        </h3>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {category.questions.map((question, index) => (
          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">{question}</p>
          </div>
        ))}
      </div>

      {/* Score Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          How would you rate this category this week?
        </label>
        <div className="flex justify-center space-x-4 mb-4">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => handleScoreChange(categoryKey, score, currentResponse.notes)}
              className={`w-12 h-12 rounded-full border-2 font-bold transition-all ${
                currentResponse.score === score
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-300 hover:border-primary-300 text-gray-600'
              }`}
            >
              {score}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Needs Work</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional notes (optional)
        </label>
        <textarea
          value={currentResponse.notes}
          onChange={(e) => handleScoreChange(categoryKey, currentResponse.score, e.target.value)}
          placeholder="Any specific thoughts about this category this week..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={currentStep === 0 ? onClose : handlePrevious}
        >
          {currentStep === 0 ? 'Cancel' : 'Previous'}
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          disabled={currentResponse.score === 0}
        >
          {currentStep === categories.length - 1 ? 'Review' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

// Check-in Detail Modal Component
const CheckInDetailModal = ({ checkIn, checkInCategories, onClose, formatDate }) => {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600 dark:text-green-400';
    if (score >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={checkIn.week}
      size="lg"
    >
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(checkIn.overallScore)}`}>
            {checkIn.overallScore}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Overall Relationship Health Score
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Completed on {formatDate(checkIn.completedAt)}
          </p>
        </div>

        {/* Category Breakdown */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h4>
          <div className="space-y-4">
            {Object.entries(checkInCategories).map(([key, category]) => {
              const response = checkIn.responses[key];
              const CategoryIcon = category.icon;

              return (
                <Card key={key}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </h5>
                        <div className={`text-xl font-bold ${getScoreColor(response?.score || 0)}`}>
                          {response?.score || 0}/5
                        </div>
                      </div>
                      {response?.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {response.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Highlights */}
        {checkIn.highlights && checkIn.highlights.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              What Went Well
            </h4>
            <div className="space-y-2">
              {checkIn.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements */}
        {checkIn.improvements && checkIn.improvements.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              {checkIn.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-300">{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CheckIns;
