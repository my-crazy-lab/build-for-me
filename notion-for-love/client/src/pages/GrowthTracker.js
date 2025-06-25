/**
 * Love Journey - Growth Tracker Page
 *
 * Visual relationship tree that grows with milestones, achievements,
 * and shared experiences. Gamified progress tracking system.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TreePine, Sprout, Leaf, Star, Heart, Trophy,
  Calendar, TrendingUp, Award, Gift, Zap, Crown,
  Plus, Eye, Filter, Download, Share
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GrowthTracker = () => {
  const [treeData, setTreeData] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('tree'); // tree, timeline, stats

  // Tree growth stages
  const growthStages = {
    seed: {
      name: 'Seed of Love',
      icon: Sprout,
      color: 'bg-green-300',
      description: 'Your love story begins',
      requirement: 0
    },
    sapling: {
      name: 'Growing Together',
      icon: TreePine,
      color: 'bg-green-400',
      description: 'Building your foundation',
      requirement: 5
    },
    young_tree: {
      name: 'Flourishing Bond',
      icon: TreePine,
      color: 'bg-green-500',
      description: 'Your relationship is thriving',
      requirement: 15
    },
    mature_tree: {
      name: 'Deep Roots',
      icon: TreePine,
      color: 'bg-green-600',
      description: 'Strong and unshakeable love',
      requirement: 30
    },
    ancient_tree: {
      name: 'Eternal Love',
      icon: TreePine,
      color: 'bg-green-700',
      description: 'A love that stands the test of time',
      requirement: 50
    }
  };

  // Achievement categories
  const achievementCategories = {
    milestone: {
      name: 'Milestones',
      icon: Star,
      color: 'bg-yellow-500',
      achievements: [
        { id: 'first_date', name: 'First Date', points: 5, description: 'Your journey begins' },
        { id: 'first_kiss', name: 'First Kiss', points: 5, description: 'A magical moment' },
        { id: 'first_ily', name: 'First "I Love You"', points: 10, description: 'Words from the heart' },
        { id: 'moving_in', name: 'Moving In Together', points: 15, description: 'Sharing your space' },
        { id: 'engagement', name: 'Engagement', points: 20, description: 'Promising forever' },
        { id: 'marriage', name: 'Marriage', points: 25, description: 'Becoming one' }
      ]
    },
    adventure: {
      name: 'Adventures',
      icon: Zap,
      color: 'bg-blue-500',
      achievements: [
        { id: 'first_trip', name: 'First Trip Together', points: 8, description: 'Exploring the world' },
        { id: 'road_trip', name: 'Epic Road Trip', points: 10, description: 'Miles of memories' },
        { id: 'international', name: 'International Adventure', points: 15, description: 'Crossing borders together' },
        { id: 'camping', name: 'Camping Under Stars', points: 8, description: 'Nature and love' },
        { id: 'skydiving', name: 'Extreme Adventure', points: 12, description: 'Adrenaline rush together' }
      ]
    },
    growth: {
      name: 'Personal Growth',
      icon: TrendingUp,
      color: 'bg-purple-500',
      achievements: [
        { id: 'conflict_resolution', name: 'Conflict Master', points: 10, description: 'Resolving disagreements peacefully' },
        { id: 'support_system', name: 'Ultimate Support', points: 8, description: 'Being there through thick and thin' },
        { id: 'communication', name: 'Communication Pro', points: 10, description: 'Mastering the art of talking' },
        { id: 'trust_builder', name: 'Trust Builder', points: 12, description: 'Building unbreakable trust' },
        { id: 'team_player', name: 'Dream Team', points: 10, description: 'Working together perfectly' }
      ]
    },
    celebration: {
      name: 'Celebrations',
      icon: Gift,
      color: 'bg-pink-500',
      achievements: [
        { id: 'anniversary_1', name: 'First Anniversary', points: 10, description: 'One year of love' },
        { id: 'anniversary_5', name: 'Five Years Strong', points: 15, description: 'Half a decade together' },
        { id: 'anniversary_10', name: 'Decade of Love', points: 20, description: 'Ten amazing years' },
        { id: 'valentine_master', name: 'Valentine Virtuoso', points: 5, description: 'Celebrating love perfectly' },
        { id: 'surprise_expert', name: 'Surprise Expert', points: 8, description: 'Master of romantic surprises' }
      ]
    }
  };

  // Mock tree data
  const mockTreeData = {
    stage: 'young_tree',
    totalPoints: 127,
    level: 8,
    branches: [
      {
        id: 1,
        type: 'milestone',
        achievement: 'first_date',
        date: '2023-06-14',
        points: 5,
        position: { x: 20, y: 80 }
      },
      {
        id: 2,
        type: 'milestone',
        achievement: 'first_kiss',
        date: '2023-06-20',
        points: 5,
        position: { x: 80, y: 75 }
      },
      {
        id: 3,
        type: 'milestone',
        achievement: 'first_ily',
        date: '2023-08-15',
        points: 10,
        position: { x: 15, y: 60 }
      },
      {
        id: 4,
        type: 'adventure',
        achievement: 'first_trip',
        date: '2023-09-22',
        points: 8,
        position: { x: 85, y: 55 }
      },
      {
        id: 5,
        type: 'milestone',
        achievement: 'moving_in',
        date: '2024-01-10',
        points: 15,
        position: { x: 50, y: 40 }
      },
      {
        id: 6,
        type: 'growth',
        achievement: 'communication',
        date: '2024-03-15',
        points: 10,
        position: { x: 25, y: 35 }
      },
      {
        id: 7,
        type: 'celebration',
        achievement: 'anniversary_1',
        date: '2024-06-14',
        points: 10,
        position: { x: 75, y: 30 }
      },
      {
        id: 8,
        type: 'adventure',
        achievement: 'international',
        date: '2024-08-20',
        points: 15,
        position: { x: 40, y: 20 }
      },
      {
        id: 9,
        type: 'growth',
        achievement: 'trust_builder',
        date: '2024-10-05',
        points: 12,
        position: { x: 65, y: 15 }
      },
      {
        id: 10,
        type: 'celebration',
        achievement: 'surprise_expert',
        date: '2024-12-01',
        points: 8,
        position: { x: 30, y: 10 }
      }
    ]
  };

  const mockAchievements = [
    { id: 'first_date', category: 'milestone', earnedAt: '2023-06-14T19:00:00Z', isNew: false },
    { id: 'first_kiss', category: 'milestone', earnedAt: '2023-06-20T22:30:00Z', isNew: false },
    { id: 'first_ily', category: 'milestone', earnedAt: '2023-08-15T20:15:00Z', isNew: false },
    { id: 'first_trip', category: 'adventure', earnedAt: '2023-09-22T08:00:00Z', isNew: false },
    { id: 'moving_in', category: 'milestone', earnedAt: '2024-01-10T12:00:00Z', isNew: false },
    { id: 'communication', category: 'growth', earnedAt: '2024-03-15T16:30:00Z', isNew: false },
    { id: 'anniversary_1', category: 'celebration', earnedAt: '2024-06-14T19:00:00Z', isNew: false },
    { id: 'international', category: 'adventure', earnedAt: '2024-08-20T10:00:00Z', isNew: false },
    { id: 'trust_builder', category: 'growth', earnedAt: '2024-10-05T14:20:00Z', isNew: false },
    { id: 'surprise_expert', category: 'celebration', earnedAt: '2024-12-01T18:45:00Z', isNew: true }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTreeData(mockTreeData);
      setAchievements(mockAchievements);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getCurrentStage = () => {
    if (!treeData) return growthStages.seed;

    const stages = Object.values(growthStages);
    return stages.reverse().find(stage => treeData.totalPoints >= stage.requirement) || growthStages.seed;
  };

  const getNextStage = () => {
    if (!treeData) return growthStages.sapling;

    const stages = Object.values(growthStages);
    return stages.find(stage => treeData.totalPoints < stage.requirement) || stages[stages.length - 1];
  };

  const getProgressToNextStage = () => {
    if (!treeData) return 0;

    const currentStage = getCurrentStage();
    const nextStage = getNextStage();

    if (currentStage === nextStage) return 100;

    const progress = ((treeData.totalPoints - currentStage.requirement) / (nextStage.requirement - currentStage.requirement)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getAchievementData = (achievementId, category) => {
    const categoryData = achievementCategories[category];
    return categoryData?.achievements.find(a => a.id === achievementId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner
          size="lg"
          variant="pulse"
          text="Growing your love tree..."
        />
      </div>
    );
  }

  const currentStage = getCurrentStage();
  const nextStage = getNextStage();
  const progress = getProgressToNextStage();
  const CurrentStageIcon = currentStage.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Growth Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Watch your love story grow into a beautiful tree
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1">
            {['tree', 'timeline', 'stats'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === mode
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddModal(true)}
          >
            Add Achievement
          </Button>
        </div>
      </div>

      {/* Current Stage Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentStage.color}`}>
                <CurrentStageIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentStage.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentStage.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {treeData.totalPoints}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Love Points
              </div>
            </div>
          </div>

          {currentStage !== nextStage && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress to {nextStage.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {treeData.totalPoints}/{nextStage.requirement} points
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tree Visualization */}
      <Card>
        <div className="relative h-96 bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-900/20 dark:to-green-900/20 rounded-lg overflow-hidden">
          {/* Tree Trunk */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-32 bg-amber-800 rounded-t-lg"></div>

          {/* Tree Crown */}
          <div className={`absolute bottom-24 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full ${currentStage.color} opacity-80`}></div>

          {/* Achievement Nodes */}
          {treeData.branches.map((branch, index) => {
            const category = achievementCategories[branch.type];
            const achievement = getAchievementData(branch.achievement, branch.type);
            const CategoryIcon = category?.icon;

            return (
              <motion.div
                key={branch.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="absolute cursor-pointer"
                style={{
                  left: `${branch.position.x}%`,
                  top: `${branch.position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedNode(branch)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category?.color} shadow-lg hover:scale-110 transition-transform`}>
                  {CategoryIcon && <CategoryIcon className="w-4 h-4 text-white" />}
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                  {achievement?.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Achievement Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(achievementCategories).map(([key, category]) => {
          const CategoryIcon = category.icon;
          const earnedCount = achievements.filter(a => a.category === key).length;
          const totalCount = category.achievements.length;

          return (
            <Card key={key}>
              <div className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${category.color}`}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {earnedCount}/{totalCount}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Achievements
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Achievements
        </h3>
        <div className="space-y-3">
          {achievements.slice(0, 5).map((achievement, index) => {
            const category = achievementCategories[achievement.category];
            const achievementData = getAchievementData(achievement.id, achievement.category);
            const CategoryIcon = category?.icon;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color}`}>
                  {CategoryIcon && <CategoryIcon className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {achievementData?.name}
                    </h4>
                    {achievement.isNew && (
                      <Badge variant="success" size="sm">
                        New!
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {achievementData?.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600 dark:text-primary-400">
                    +{achievementData?.points}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(achievement.earnedAt)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Add Achievement Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Achievement"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            Select an achievement to add to your love tree:
          </p>

          {Object.entries(achievementCategories).map(([categoryKey, category]) => {
            const CategoryIcon = category.icon;

            return (
              <div key={categoryKey}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${category.color}`}>
                    <CategoryIcon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2 ml-8">
                  {category.achievements.map((achievement) => {
                    const isEarned = achievements.some(a => a.id === achievement.id);

                    return (
                      <button
                        key={achievement.id}
                        disabled={isEarned}
                        className={`text-left p-3 rounded-lg border transition-colors ${
                          isEarned
                            ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {achievement.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {achievement.description}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary-600">
                              +{achievement.points}
                            </div>
                            {isEarned && (
                              <Badge variant="success" size="sm">
                                Earned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Node Detail Modal */}
      {selectedNode && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedNode(null)}
          title="Achievement Details"
          size="md"
        >
          <div className="space-y-4">
            {(() => {
              const category = achievementCategories[selectedNode.type];
              const achievement = getAchievementData(selectedNode.achievement, selectedNode.type);
              const CategoryIcon = category?.icon;

              return (
                <>
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${category?.color}`}>
                      {CategoryIcon && <CategoryIcon className="w-8 h-8 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {achievement?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {achievement?.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          +{achievement?.points}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Love Points
                        </div>
                      </div>
                    </Card>
                    <Card>
                      <div className="text-center">
                        <div className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                          {formatDate(selectedNode.date)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Achieved
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={() => setSelectedNode(null)}>
                      Close
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GrowthTracker;
