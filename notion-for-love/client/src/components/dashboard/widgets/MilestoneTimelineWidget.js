/**
 * Love Journey - Milestone Timeline Widget
 * 
 * Dashboard widget displaying recent milestones in a beautiful timeline format
 * with quick actions and navigation to the full timeline view.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardWidget from '../DashboardWidget';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import Avatar from '../../ui/Avatar';

const MilestoneTimelineWidget = ({ id, onRemove, onResize, onSettings }) => {
  // Mock milestone data
  const milestones = [
    {
      id: 1,
      title: "First Anniversary Celebration",
      date: "2024-12-20",
      location: "Rooftop Restaurant",
      emotion: "loved",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=60&h=60&fit=crop&crop=center",
      daysAgo: 2
    },
    {
      id: 2,
      title: "Moved in Together",
      date: "2024-12-10",
      location: "Our New Home",
      emotion: "excited",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=60&h=60&fit=crop&crop=center",
      daysAgo: 12
    },
    {
      id: 3,
      title: "First Trip to Paris",
      date: "2024-11-15",
      location: "Paris, France",
      emotion: "amazing",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=60&h=60&fit=crop&crop=center",
      daysAgo: 37
    }
  ];

  const getEmotionColor = (emotion) => {
    const colors = {
      loved: 'primary',
      excited: 'warning',
      amazing: 'success',
      happy: 'secondary',
      grateful: 'info'
    };
    return colors[emotion] || 'default';
  };

  return (
    <DashboardWidget
      id={id}
      title="Recent Milestones"
      onRemove={onRemove}
      onResize={onResize}
      onSettings={onSettings}
      size="lg"
    >
      <div className="space-y-4">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-primary-500 fill-current" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {milestones.length} milestones this month
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
            <Link to="/timeline">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 to-secondary-200 dark:from-primary-800 dark:to-secondary-800"></div>

          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 border-2 border-primary-300 dark:border-primary-700 rounded-full">
                  <Heart className="w-4 h-4 text-primary-500 fill-current" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {milestone.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {milestone.daysAgo === 0 ? 'Today' : 
                             milestone.daysAgo === 1 ? 'Yesterday' : 
                             `${milestone.daysAgo} days ago`}
                          </div>
                          {milestone.location && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <MapPin className="w-3 h-3 mr-1" />
                              {milestone.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={getEmotionColor(milestone.emotion)} 
                      size="sm"
                    >
                      {milestone.emotion}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Next milestone reminder in 3 days
            </span>
            <Link 
              to="/timeline" 
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              View timeline →
            </Link>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
};

export default MilestoneTimelineWidget;
