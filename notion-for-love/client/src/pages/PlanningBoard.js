/**
 * Love Journey - Planning Board
 *
 * Interactive planning board for couples to organize dates, goals, and activities.
 * Features drag-and-drop functionality and beautiful card layouts.
 *
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Heart, Star, Clock,
  Coffee, Music, Utensils, Plane, Gift
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import eventsService from '../services/eventsService';

const PlanningBoard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [upcomingPlans, setUpcomingPlans] = useState([]);
  const [dateIdeas, setDateIdeas] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showBucketListModal, setShowBucketListModal] = useState(false);

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Plans', icon: Calendar },
    { id: 'ideas', label: 'Date Ideas', icon: Heart },
    { id: 'bucket-list', label: 'Bucket List', icon: Star }
  ];

  // Load data from API
  useEffect(() => {
    const loadPlanningData = async () => {
      setLoading(true);
      try {
        const [upcomingResponse, ideasResponse, bucketResponse] = await Promise.all([
          eventsService.getUpcomingPlans(),
          eventsService.getDateIdeas(),
          eventsService.getBucketList()
        ]);

        if (upcomingResponse.success) {
          setUpcomingPlans(upcomingResponse.data);
        }
        if (ideasResponse.success) {
          setDateIdeas(ideasResponse.data);
        }
        if (bucketResponse.success) {
          setBucketList(bucketResponse.data);
        }
      } catch (error) {
        console.error('Error loading planning data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlanningData();
  }, []);

  // Helper function to get icon for event type
  const getEventIcon = (type) => {
    const iconMap = {
      'dinner': Utensils,
      'date-night': Heart,
      'travel': Plane,
      'activity': Coffee,
      'adventure': Star,
      'romantic': Heart,
      'entertainment': Music,
      'celebration': Gift,
      'other': Calendar
    };
    return iconMap[type] || Calendar;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Planning Board
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Plan your perfect moments together
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {activeTab === 'upcoming' && (
            <>
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : upcomingPlans.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming plans yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Start planning your next adventure together!
                  </p>
                </div>
              ) : (
                upcomingPlans.map((plan, index) => {
                  const Icon = getEventIcon(plan.type);
                  const eventDate = new Date(plan.date);
                  const formattedDate = eventDate.toLocaleDateString();
                  const formattedTime = plan.isAllDay ? 'All Day' : eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {plan.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {plan.location?.name || 'Location TBD'}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.status === 'confirmed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{formattedTime}</span>
                          </div>
                          {plan.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {plan.description}
                            </p>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Add New Plan
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Create a new date or activity
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setShowPlanModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Plan
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </>
          )}

          {activeTab === 'ideas' && (
            <>
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : dateIdeas.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No date ideas yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Add some creative ideas for your future dates!
                  </p>
                </div>
              ) : (
                dateIdeas.map((idea, index) => {
                  const Icon = getEventIcon(idea.type);
                  return (
                    <motion.div
                      key={idea._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                            <Icon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {idea.title}
                          </h3>
                        </div>
                        {idea.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {idea.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            {idea.type}
                          </span>
                          {idea.tags && idea.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-block px-2 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'bucket-list' && (
            <>
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : bucketList.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No bucket list items yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Add your dream experiences to accomplish together!
                  </p>
                </div>
              ) : (
                bucketList.map((item, index) => {
                  const Icon = getEventIcon(item.type);
                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-accent-100 dark:bg-accent-900 rounded-lg">
                              <Icon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {item.title}
                              </h3>
                              {item.location?.name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.location.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            bucket list
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {item.description}
                          </p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="inline-block px-2 py-1 bg-accent-100 dark:bg-accent-700 text-accent-600 dark:text-accent-300 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  );
                })
              )}

              {/* Add Bucket List Item Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: bucketList.length * 0.1 + 0.3 }}
              >
                <Card className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-accent-400 dark:hover:border-accent-500 transition-colors">
                  <div className="text-center">
                    <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      Add Bucket List Item
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Add a dream experience to accomplish together
                    </p>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => setShowBucketListModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Bucket List
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Plan Creation Modal */}
        <Modal
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          title="Create New Plan"
          size="lg"
        >
          <PlanForm
            onClose={() => setShowPlanModal(false)}
            onSave={async (planData) => {
              try {
                const response = await eventsService.createEvent(planData);
                if (response.success) {
                  // Refresh plans list
                  const plansResponse = await eventsService.getUpcomingPlans();
                  if (plansResponse.success) {
                    setUpcomingPlans(plansResponse.data);
                  }
                  setShowPlanModal(false);
                } else {
                  console.error('Failed to create plan:', response.error);
                  alert('Failed to create plan. Please try again.');
                }
              } catch (error) {
                console.error('Error creating plan:', error);
                alert('Failed to create plan. Please try again.');
              }
            }}
          />
        </Modal>

        {/* Bucket List Item Creation Modal */}
        <Modal
          isOpen={showBucketListModal}
          onClose={() => setShowBucketListModal(false)}
          title="Add Bucket List Item"
          size="lg"
        >
          <BucketListForm
            onClose={() => setShowBucketListModal(false)}
            onSave={async (bucketListData) => {
              try {
                const response = await eventsService.createEvent(bucketListData);
                if (response.success) {
                  // Refresh bucket list
                  const bucketListResponse = await eventsService.getBucketList();
                  if (bucketListResponse.success) {
                    setBucketList(bucketListResponse.data);
                  }
                  setShowBucketListModal(false);
                } else {
                  console.error('Failed to create bucket list item:', response.error);
                  alert('Failed to create bucket list item. Please try again.');
                }
              } catch (error) {
                console.error('Error creating bucket list item:', error);
                alert('Failed to create bucket list item. Please try again.');
              }
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

// Plan Form Component
const PlanForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    type: 'date-night',
    location: '',
    notes: '',
    estimatedCost: 0,
    duration: 2
  });

  const planTypes = [
    { value: 'date-night', label: 'Date Night' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'fun', label: 'Fun Activity' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'travel', label: 'Travel' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    // Format date and time for API
    const eventDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    const endDateTime = new Date(new Date(`${formData.date}T${formData.time}`).getTime() + (formData.duration * 60 * 60 * 1000)).toISOString();

    const planData = {
      title: formData.title,
      description: formData.description,
      date: eventDateTime,
      endDate: endDateTime,
      type: formData.type,
      status: 'planning',
      location: formData.location ? { name: formData.location } : undefined,
      notes: formData.notes,
      estimatedCost: formData.estimatedCost,
      isPrivate: false
    };

    onSave(planData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Plan Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Romantic Dinner Date"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Plan Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {planTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Estimated Cost ($)"
          type="number"
          value={formData.estimatedCost}
          onChange={(e) => setFormData({ ...formData, estimatedCost: parseInt(e.target.value) || 0 })}
          placeholder="50"
          min="0"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Input
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
        <Input
          label="Duration (hours)"
          type="number"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
          min="0.5"
          step="0.5"
        />
      </div>

      <Input
        label="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        placeholder="Where will this happen?"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your plan..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes or reminders..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Plan
        </Button>
      </div>
    </form>
  );
};

// Bucket List Form Component
const BucketListForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'adventure',
    location: '',
    notes: '',
    estimatedCost: 0,
    priority: 'medium',
    category: 'experience'
  });

  const bucketListTypes = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'travel', label: 'Travel' },
    { value: 'experience', label: 'Experience' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'celebration', label: 'Celebration' },
    { value: 'learning', label: 'Learning' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Someday' },
    { value: 'medium', label: 'This Year' },
    { value: 'high', label: 'Soon' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const bucketListData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: 'bucket-list',
      location: formData.location ? { name: formData.location } : undefined,
      notes: formData.notes,
      estimatedCost: formData.estimatedCost,
      priority: formData.priority,
      isPrivate: false,
      // Set a far future date for bucket list items
      date: new Date(new Date().getFullYear() + 10, 0, 1).toISOString()
    };

    onSave(bucketListData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Dream Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Travel to Japan together"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {bucketListTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {priorities.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Location (Optional)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Where will this happen?"
        />
        <Input
          label="Estimated Cost ($)"
          type="number"
          value={formData.estimatedCost}
          onChange={(e) => setFormData({ ...formData, estimatedCost: parseInt(e.target.value) || 0 })}
          placeholder="1000"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe this dream experience..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional thoughts or requirements..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add to Bucket List
        </Button>
      </div>
    </form>
  );
};

export default PlanningBoard;
