/**
 * Love Journey - Relationship Insights Dashboard
 * 
 * AI-powered analytics and insights about relationship patterns,
 * communication trends, and personalized recommendations.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Heart, MessageCircle, Calendar,
  Target, Award, Lightbulb, Users, Clock, Star,
  ArrowUp, ArrowDown, Minus, RefreshCw, Download
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, quarter, year
  const [refreshing, setRefreshing] = useState(false);

  // Mock insights data
  const mockInsights = {
    overview: {
      relationshipScore: 8.7,
      scoreChange: 0.3,
      totalActivities: 47,
      activitiesChange: 5,
      communicationScore: 9.1,
      communicationChange: 0.2,
      happinessLevel: 8.9,
      happinessChange: 0.1
    },
    trends: {
      communication: {
        daily: [7.5, 8.2, 8.8, 9.1, 8.7, 9.3, 9.1],
        weekly: [8.1, 8.4, 8.7, 9.1],
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      },
      activities: {
        categories: ['Romantic', 'Adventure', 'Home', 'Cultural', 'Active'],
        counts: [12, 8, 15, 7, 5],
        colors: ['#ef4444', '#3b82f6', '#eab308', '#8b5cf6', '#10b981']
      },
      emotions: {
        positive: 78,
        neutral: 18,
        negative: 4,
        trend: 'improving'
      }
    },
    patterns: {
      bestDays: ['Friday', 'Saturday', 'Sunday'],
      bestTimes: ['Evening (6-9 PM)', 'Morning (9-11 AM)'],
      favoriteActivities: ['Cooking together', 'Movie nights', 'Long walks'],
      communicationPeaks: ['After dinner', 'Weekend mornings', 'Before bed'],
      conflictTriggers: ['Work stress', 'Schedule conflicts', 'Household tasks']
    },
    recommendations: [
      {
        id: 1,
        type: 'communication',
        priority: 'high',
        title: 'Schedule Weekly Check-ins',
        description: 'Your communication scores are highest on weekends. Consider scheduling regular relationship check-ins on Sunday evenings.',
        action: 'Set up recurring calendar event',
        impact: 'Could improve communication score by 15%'
      },
      {
        id: 2,
        type: 'activity',
        priority: 'medium',
        title: 'Try New Adventure Activities',
        description: 'You\'ve been doing fewer adventure activities lately. Your happiness scores are 20% higher after outdoor adventures.',
        action: 'Plan a hiking trip or outdoor activity',
        impact: 'Boost overall relationship satisfaction'
      },
      {
        id: 3,
        type: 'routine',
        priority: 'medium',
        title: 'Morning Connection Ritual',
        description: 'Data shows you communicate best in the morning. Consider creating a morning connection ritual.',
        action: 'Start with 10 minutes of morning coffee together',
        impact: 'Strengthen daily connection'
      },
      {
        id: 4,
        type: 'stress',
        priority: 'low',
        title: 'Stress Management Strategy',
        description: 'Work stress appears to correlate with communication dips. Consider stress management techniques.',
        action: 'Practice evening wind-down routine',
        impact: 'Reduce conflict triggers by 25%'
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Communication Champions',
        description: 'Maintained 9+ communication score for 2 weeks',
        earnedDate: '2024-12-20',
        icon: MessageCircle,
        color: 'bg-blue-500'
      },
      {
        id: 2,
        title: 'Adventure Seekers',
        description: 'Completed 5 adventure activities this month',
        earnedDate: '2024-12-15',
        icon: Target,
        color: 'bg-green-500'
      },
      {
        id: 3,
        title: 'Consistency Kings',
        description: 'Logged activities for 30 consecutive days',
        earnedDate: '2024-12-10',
        icon: Calendar,
        color: 'bg-purple-500'
      }
    ],
    milestones: {
      upcoming: [
        {
          name: '6 Month Anniversary',
          date: '2025-01-14',
          daysUntil: 20,
          suggestions: ['Plan special dinner', 'Create photo album', 'Write love letters']
        },
        {
          name: '100 Shared Activities',
          current: 47,
          target: 100,
          progress: 47,
          suggestions: ['Try cooking class', 'Visit new museum', 'Go on weekend trip']
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading insights
    const timer = setTimeout(() => {
      setInsights(mockInsights);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const refreshInsights = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          size="lg" 
          variant="pulse" 
          text="Analyzing your relationship data..." 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relationship Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered analytics to strengthen your bond
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            leftIcon={refreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            onClick={refreshInsights}
            disabled={refreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Relationship Score
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.overview.relationshipScore}
                </p>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(insights.overview.scoreChange)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.overview.scoreChange)}`}>
                    {Math.abs(insights.overview.scoreChange)}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Communication
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.overview.communicationScore}
                </p>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(insights.overview.communicationChange)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.overview.communicationChange)}`}>
                    {Math.abs(insights.overview.communicationChange)}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Happiness Level
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.overview.happinessLevel}
                </p>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(insights.overview.happinessChange)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.overview.happinessChange)}`}>
                    {Math.abs(insights.overview.happinessChange)}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Activities
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {insights.overview.totalActivities}
                </p>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(insights.overview.activitiesChange)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.overview.activitiesChange)}`}>
                    {Math.abs(insights.overview.activitiesChange)}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Communication Trend Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Communication Trends
          </h3>
          <Badge variant="success" size="sm">
            <TrendingUp className="w-3 h-3 mr-1" />
            Improving
          </Badge>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {insights.trends.communication.weekly.map((score, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-primary-500 rounded-t-lg transition-all duration-1000 ease-out"
                style={{ 
                  height: `${(score / 10) * 100}%`,
                  minHeight: '20px'
                }}
              />
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {insights.trends.communication.labels[index]}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {score}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity Distribution & Emotional Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Activity Distribution
          </h3>
          <div className="space-y-3">
            {insights.trends.activities.categories.map((category, index) => {
              const count = insights.trends.activities.counts[index];
              const total = insights.trends.activities.counts.reduce((sum, c) => sum + c, 0);
              const percentage = Math.round((count / total) * 100);
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: insights.trends.activities.colors[index] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Emotional Balance
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {insights.trends.emotions.positive}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Positive Emotions
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">
                  {insights.trends.emotions.positive}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Positive</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                  {insights.trends.emotions.neutral}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Neutral</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-600 dark:text-red-400">
                  {insights.trends.emotions.negative}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Negative</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500"
                  style={{ width: `${insights.trends.emotions.positive}%` }}
                />
                <div 
                  className="bg-yellow-500"
                  style={{ width: `${insights.trends.emotions.neutral}%` }}
                />
                <div 
                  className="bg-red-500"
                  style={{ width: `${insights.trends.emotions.negative}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Patterns & Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Relationship Patterns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Best Days</h4>
            <div className="space-y-1">
              {insights.patterns.bestDays.map((day, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Peak Times</h4>
            <div className="space-y-1">
              {insights.patterns.bestTimes.map((time, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  {time}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Favorite Activities</h4>
            <div className="space-y-1">
              {insights.patterns.favoriteActivities.map((activity, index) => (
                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Recommendations
        </h3>
        <div className="space-y-4">
          {insights.recommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              index={index}
              getPriorityColor={getPriorityColor}
            />
          ))}
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              index={index}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

// Recommendation Card Component
const RecommendationCard = ({ recommendation, index, getPriorityColor }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'communication': return MessageCircle;
      case 'activity': return Calendar;
      case 'routine': return Clock;
      case 'stress': return Heart;
      default: return Lightbulb;
    }
  };

  const TypeIcon = getTypeIcon(recommendation.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card hover className="cursor-pointer">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <TypeIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {recommendation.title}
              </h4>
              <Badge variant="outline" size="sm" className={getPriorityColor(recommendation.priority)}>
                {recommendation.priority} priority
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {recommendation.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {recommendation.impact}
              </div>
              <Button variant="outline" size="sm">
                {recommendation.action}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Achievement Card Component
const AchievementCard = ({ achievement, index }) => {
  const AchievementIcon = achievement.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="text-center">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${achievement.color}`}>
          <AchievementIcon className="w-6 h-6 text-white" />
        </div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
          {achievement.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {achievement.description}
        </p>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Earned {new Date(achievement.earnedDate).toLocaleDateString()}
        </div>
      </Card>
    </motion.div>
  );
};

export default Insights;
