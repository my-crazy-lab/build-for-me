/**
 * Love Journey - Dashboard Page
 *
 * Main dashboard with modular widgets, drag-and-drop functionality,
 * and personalized content for couples to track their journey.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Calendar, Target, Image, Smile, Clock,
  TrendingUp, Plus, Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

import LoadingSpinner from '../components/ui/LoadingSpinner';
import MilestoneTimelineWidget from '../components/dashboard/widgets/MilestoneTimelineWidget';
import SharedGoalsWidget from '../components/dashboard/widgets/SharedGoalsWidget';
import MemoryHighlightsWidget from '../components/dashboard/widgets/MemoryHighlightsWidget';
import { dashboardService } from '../services';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    milestones: 0,
    memories: 0,
    goalsCompleted: 0,
    daysTogetherCount: 0,
    currentStreak: 0,
    lovePoints: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await dashboardService.getStats();
        if (statsResponse.success) {
          const data = statsResponse.data;
          setStats({
            milestones: data.milestones.total,
            memories: data.memories.total,
            goalsCompleted: data.goals.completed,
            daysTogetherCount: data.daysTogetherCount,
            currentStreak: data.currentStreak,
            lovePoints: data.lovePoints
          });
        }

        // Fetch upcoming events
        const eventsResponse = await dashboardService.getUpcomingEvents(2);
        if (eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Navigation handlers
  const handleAddMilestone = () => {
    navigate('/timeline');
  };

  const handleCustomize = () => {
    // For now, just show an alert - could open a settings modal later
    alert('Customize dashboard feature coming soon!');
  };

  const handleAddEvent = () => {
    navigate('/calendar');
  };

  const handleMoodCheck = () => {
    navigate('/emotions');
  };

  const handleAddMemory = () => {
    navigate('/memories');
  };

  const handleTimeCapsule = () => {
    // For now, just show an alert - could implement time capsule feature later
    alert('Time Capsule feature coming soon!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="heart"
          text="Loading your love journey..."
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
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]}! 💕
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening in your love journey today
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleAddMilestone}
            >
              Add Milestone
            </Button>
            <Button
              variant="outline"
              leftIcon={<SettingsIcon className="w-4 h-4" />}
              onClick={handleCustomize}
            >
              Customize
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="romantic" hover>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white fill-current" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Days Together
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.daysTogetherCount.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-secondary-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Goals Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.goalsCompleted}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Memories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.memories}
                </p>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.currentStreak} days
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Dashboard Widgets Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-fr">
          {/* Milestone Timeline Widget */}
          <div className="lg:col-span-8">
            <MilestoneTimelineWidget id="milestone-timeline" />
          </div>

          {/* Memory Highlights Widget */}
          <div className="lg:col-span-4">
            <MemoryHighlightsWidget id="memory-highlights" />
          </div>

          {/* Shared Goals Widget */}
          <div className="lg:col-span-6">
            <SharedGoalsWidget id="shared-goals" />
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-6">
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex-col"
                    onClick={handleAddEvent}
                  >
                    <Calendar className="w-5 h-5 mb-1" />
                    <span className="text-xs">Add Event</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex-col"
                    onClick={handleMoodCheck}
                  >
                    <Smile className="w-5 h-5 mb-1" />
                    <span className="text-xs">Mood Check</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex-col"
                    onClick={handleAddMemory}
                  >
                    <Image className="w-5 h-5 mb-1" />
                    <span className="text-xs">Add Memory</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-20 flex-col"
                    onClick={handleTimeCapsule}
                  >
                    <Clock className="w-5 h-5 mb-1" />
                    <span className="text-xs">Time Capsule</span>
                  </Button>
                </div>

                {/* Upcoming Events */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Upcoming Events
                  </h4>
                  <div className="space-y-2">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                            {event.title}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="secondary" size="sm">
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
