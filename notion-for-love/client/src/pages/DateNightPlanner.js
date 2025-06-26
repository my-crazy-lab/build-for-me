/**
 * Love Journey - Date Night Planner Page
 * 
 * Comprehensive date planning system with idea generation,
 * budget tracking, location suggestions, and activity recommendations.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, DollarSign, Clock, Users, Star,
  Plus, Filter, Search, Heart, Coffee, Camera,
  Music, Utensils, Gamepad2, Plane, Home, Gift,
  Shuffle, BookOpen, Lightbulb, CheckCircle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { eventsService } from '../services';

const DateNightPlanner = () => {
  const [datePlans, setDatePlans] = useState([]);
  const [dateIdeas, setDateIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showIdeaGenerator, setShowIdeaGenerator] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBudget, setFilterBudget] = useState('all');

  // Date categories with icons and suggestions
  const dateCategories = {
    romantic: {
      name: 'Romantic',
      icon: Heart,
      color: 'bg-red-500',
      ideas: [
        'Candlelit dinner at home',
        'Sunset picnic in the park',
        'Couples massage',
        'Wine tasting',
        'Stargazing session',
        'Love letter writing'
      ]
    },
    adventure: {
      name: 'Adventure',
      icon: Plane,
      color: 'bg-blue-500',
      ideas: [
        'Hiking trail exploration',
        'Rock climbing',
        'Kayaking adventure',
        'Road trip to nearby town',
        'Escape room challenge',
        'Geocaching hunt'
      ]
    },
    cultural: {
      name: 'Cultural',
      icon: BookOpen,
      color: 'bg-purple-500',
      ideas: [
        'Museum visit',
        'Art gallery tour',
        'Theater show',
        'Concert or live music',
        'Poetry reading',
        'Historical site visit'
      ]
    },
    food: {
      name: 'Food & Drink',
      icon: Utensils,
      color: 'bg-orange-500',
      ideas: [
        'Cooking class together',
        'Food truck tour',
        'Farmers market visit',
        'New restaurant try',
        'Cocktail making',
        'Dessert crawl'
      ]
    },
    active: {
      name: 'Active',
      icon: Users,
      color: 'bg-green-500',
      ideas: [
        'Dance class',
        'Mini golf',
        'Bowling night',
        'Tennis match',
        'Bike ride',
        'Yoga session'
      ]
    },
    cozy: {
      name: 'Cozy',
      icon: Home,
      color: 'bg-yellow-500',
      ideas: [
        'Movie marathon',
        'Board game night',
        'Puzzle solving',
        'Reading together',
        'Spa night at home',
        'Baking session'
      ]
    },
    creative: {
      name: 'Creative',
      icon: Camera,
      color: 'bg-pink-500',
      ideas: [
        'Photography walk',
        'Painting class',
        'Pottery making',
        'Craft project',
        'Music jam session',
        'Creative writing'
      ]
    },
    seasonal: {
      name: 'Seasonal',
      icon: Gift,
      color: 'bg-indigo-500',
      ideas: [
        'Pumpkin patch visit',
        'Ice skating',
        'Beach day',
        'Apple picking',
        'Holiday market',
        'Festival attendance'
      ]
    }
  };

  // Budget ranges
  const budgetRanges = {
    free: { name: 'Free', min: 0, max: 0, color: 'bg-green-500' },
    low: { name: '$1-25', min: 1, max: 25, color: 'bg-blue-500' },
    medium: { name: '$26-75', min: 26, max: 75, color: 'bg-yellow-500' },
    high: { name: '$76-150', min: 76, max: 150, color: 'bg-orange-500' },
    luxury: { name: '$150+', min: 150, max: 1000, color: 'bg-red-500' }
  };





  useEffect(() => {
    // Load date plans and ideas from API
    const loadData = async () => {
      try {
        setLoading(true);
        // Load date plans from events service (filter by type: 'date')
        const plansResponse = await eventsService.getEvents({ type: 'date' });
        if (plansResponse.success) {
          setDatePlans(plansResponse.data);
        }

        // For date ideas, we'll use empty array for now
        // In a real app, these could come from a separate service
        setDateIdeas([]);
      } catch (error) {
        console.error('Error loading date planner data:', error);
        setError('Failed to load date planner data');
        setDatePlans([]);
        setDateIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => clearTimeout(timer);
  }, []);

  const filteredPlans = datePlans.filter(plan => {
    if (filterCategory !== 'all' && plan.category !== filterCategory) return false;
    if (filterBudget !== 'all' && plan.budget !== filterBudget) return false;
    return true;
  });

  const getDateStats = () => {
    const total = datePlans.length;
    const upcoming = datePlans.filter(plan => new Date(plan.date) > new Date() && plan.status === 'planned').length;
    const completed = datePlans.filter(plan => plan.status === 'completed').length;
    const totalSpent = datePlans.filter(plan => plan.status === 'completed').reduce((sum, plan) => sum + plan.estimatedCost, 0);

    return { total, upcoming, completed, totalSpent };
  };

  const generateRandomIdea = () => {
    const categories = Object.keys(dateCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const categoryData = dateCategories[randomCategory];
    const randomIdea = categoryData.ideas[Math.floor(Math.random() * categoryData.ideas.length)];
    
    return {
      category: randomCategory,
      idea: randomIdea,
      categoryData
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner 
          size="lg" 
          variant="heart" 
          text="Planning your perfect dates..." 
        />
      </div>
    );
  }

  const stats = getDateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Date Night Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Plan unforgettable moments together
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<Shuffle className="w-4 h-4" />}
            onClick={() => setShowIdeaGenerator(true)}
          >
            Get Ideas
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowPlanModal(true)}
          >
            Plan Date
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Dates
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
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.upcoming}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalSpent}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Category:
              </span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(dateCategories).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget:
              </span>
              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Budgets</option>
                {Object.entries(budgetRanges).map(([key, range]) => (
                  <option key={key} value={key}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Date Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan, index) => (
          <DatePlanCard
            key={plan.id}
            plan={plan}
            index={index}
            dateCategories={dateCategories}
            budgetRanges={budgetRanges}
            formatDate={formatDate}
            formatTime={formatTime}
            onClick={() => setSelectedPlan(plan)}
          />
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No date plans found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filterCategory !== 'all' || filterBudget !== 'all'
              ? 'Try adjusting your filter criteria.'
              : 'Start planning your perfect date night!'
            }
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowPlanModal(true)}
          >
            Plan Your First Date
          </Button>
        </div>
      )}

      {/* Plan Date Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title="Plan New Date"
        size="xl"
      >
        <DatePlanForm
          dateCategories={dateCategories}
          budgetRanges={budgetRanges}
          onClose={() => setShowPlanModal(false)}
          onSave={async (planData) => {
            try {
              const response = await eventsService.createEvent(planData);
              if (response.success) {
                // Refresh date plans list
                const plansResponse = await eventsService.getEvents({ type: 'date' });
                if (plansResponse.success) {
                  setDatePlans(plansResponse.data);
                }
                setShowPlanModal(false);
              } else {
                console.error('Failed to create date plan:', response.error);
                alert('Failed to create date plan. Please try again.');
              }
            } catch (error) {
              console.error('Error creating date plan:', error);
              alert('Failed to create date plan. Please try again.');
            }
          }}
        />
      </Modal>

      {/* Idea Generator Modal */}
      <Modal
        isOpen={showIdeaGenerator}
        onClose={() => setShowIdeaGenerator(false)}
        title="Date Idea Generator"
        size="lg"
      >
        <IdeaGenerator
          dateCategories={dateCategories}
          dateIdeas={dateIdeas}
          generateRandomIdea={generateRandomIdea}
          onClose={() => setShowIdeaGenerator(false)}
          onPlanDate={(idea) => {
            setShowIdeaGenerator(false);
            setShowPlanModal(true);
          }}
        />
      </Modal>

      {/* Date Plan Detail Modal */}
      {selectedPlan && (
        <DatePlanDetailModal
          plan={selectedPlan}
          dateCategories={dateCategories}
          budgetRanges={budgetRanges}
          formatDate={formatDate}
          formatTime={formatTime}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
};

// Date Plan Card Component
const DatePlanCard = ({
  plan,
  index,
  dateCategories,
  budgetRanges,
  formatDate,
  formatTime,
  onClick
}) => {
  const category = dateCategories[plan.category];
  const budget = budgetRanges[plan.budget];
  const CategoryIcon = category?.icon;

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer"
      onClick={() => onClick(plan)}
    >
      <Card hover className="relative">
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="outline" size="sm" className={getStatusColor(plan.status)}>
            {plan.status}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start space-x-3 pr-16">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color}`}>
              {CategoryIcon && <CategoryIcon className="w-5 h-5 text-white" />}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {plan.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" size="sm">
                  {category?.name}
                </Badge>
                <Badge variant="outline" size="sm" className={budget?.color}>
                  {budget?.name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(plan.date)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(plan.date)}</span>
            </div>
          </div>

          {/* Activities Preview */}
          <div className="space-y-2">
            {plan.activities.slice(0, 2).map((activity, activityIndex) => (
              <div key={activityIndex} className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {activity.time} - {activity.activity}
                </span>
              </div>
            ))}
            {plan.activities.length > 2 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                +{plan.activities.length - 2} more activities
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium text-gray-900 dark:text-white">
                ${plan.estimatedCost}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{plan.duration}h</span>
            </div>
          </div>

          {/* Rating (for completed dates) */}
          {plan.status === 'completed' && plan.rating && (
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < plan.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Date Plan Form Component
const DatePlanForm = ({ dateCategories, budgetRanges, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'romantic',
    budget: 'medium',
    date: '',
    time: '19:00',
    duration: 2,
    estimatedCost: 0,
    activities: [{ time: '', activity: '', location: '', cost: 0, notes: '' }],
    notes: '',
    tags: '',
    isShared: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    // Format date and time for API
    const eventDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    const endDateTime = new Date(new Date(`${formData.date}T${formData.time}`).getTime() + (formData.duration * 60 * 60 * 1000)).toISOString();

    const planData = {
      title: formData.title,
      description: formData.notes || `${formData.category} date night`,
      date: eventDateTime,
      endDate: endDateTime,
      type: 'date',
      status: 'planning',
      location: formData.activities.length > 0 ? { name: formData.activities[0].location } : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      notes: JSON.stringify({
        category: formData.category,
        budget: formData.budget,
        estimatedCost: formData.estimatedCost,
        activities: formData.activities,
        isShared: formData.isShared
      }),
      isPrivate: !formData.isShared
    };

    onSave(planData);
  };

  const addActivity = () => {
    setFormData({
      ...formData,
      activities: [...formData.activities, { time: '', activity: '', location: '', cost: 0, notes: '' }]
    });
  };

  const removeActivity = (index) => {
    setFormData({
      ...formData,
      activities: formData.activities.filter((_, i) => i !== index)
    });
  };

  const updateActivity = (index, field, value) => {
    const updatedActivities = formData.activities.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    );
    setFormData({ ...formData, activities: updatedActivities });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Romantic Dinner Night"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(dateCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <Input
          label="Start Time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
        <Input
          label="Duration (hours)"
          type="number"
          min="0.5"
          step="0.5"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
        />
      </div>

      {/* Budget */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Budget Range
          </label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(budgetRanges).map(([key, range]) => (
              <option key={key} value={key}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Estimated Cost"
          type="number"
          min="0"
          value={formData.estimatedCost}
          onChange={(e) => setFormData({ ...formData, estimatedCost: parseInt(e.target.value) })}
          leftIcon={<DollarSign className="w-4 h-4" />}
        />
      </div>

      {/* Activities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white">Activities</h4>
          <Button type="button" variant="outline" size="sm" onClick={addActivity}>
            Add Activity
          </Button>
        </div>

        <div className="space-y-4">
          {formData.activities.map((activity, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  label="Time"
                  type="time"
                  value={activity.time}
                  onChange={(e) => updateActivity(index, 'time', e.target.value)}
                />
                <Input
                  label="Cost"
                  type="number"
                  min="0"
                  value={activity.cost}
                  onChange={(e) => updateActivity(index, 'cost', parseInt(e.target.value) || 0)}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <Input
                  label="Activity"
                  value={activity.activity}
                  onChange={(e) => updateActivity(index, 'activity', e.target.value)}
                  placeholder="Dinner at restaurant"
                />
                <Input
                  label="Location"
                  value={activity.location}
                  onChange={(e) => updateActivity(index, 'location', e.target.value)}
                  placeholder="123 Main St"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={activity.notes}
                    onChange={(e) => updateActivity(index, 'notes', e.target.value)}
                    placeholder="Special instructions or reminders"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                {formData.activities.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActivity(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes & Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Additional Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any special notes or reminders for this date..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        placeholder="romantic, dinner, special"
        helperText="Add tags to help organize your dates"
      />

      {/* Share Option */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isShared"
          checked={formData.isShared}
          onChange={(e) => setFormData({ ...formData, isShared: e.target.checked })}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="isShared" className="text-sm text-gray-700 dark:text-gray-300">
          Share with partner
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Date Plan
        </Button>
      </div>
    </form>
  );
};

// Idea Generator Component
const IdeaGenerator = ({ dateCategories, dateIdeas, generateRandomIdea, onClose, onPlanDate }) => {
  const [currentIdea, setCurrentIdea] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getNewIdea = () => {
    const idea = generateRandomIdea();
    setCurrentIdea(idea);
  };

  const filteredIdeas = selectedCategory === 'all'
    ? dateIdeas
    : dateIdeas.filter(idea => idea.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Random Idea Generator */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Need Inspiration?
        </h3>
        <Button
          variant="primary"
          leftIcon={<Shuffle className="w-4 h-4" />}
          onClick={getNewIdea}
          size="lg"
        >
          Generate Random Idea
        </Button>
      </div>

      {/* Current Random Idea */}
      {currentIdea && (
        <Card className="text-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${currentIdea.categoryData.color}`}>
            <currentIdea.categoryData.icon className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {currentIdea.idea}
          </h4>
          <Badge variant="outline" size="sm" className="mb-4">
            {currentIdea.categoryData.name}
          </Badge>
          <div className="flex justify-center space-x-3">
            <Button variant="outline" onClick={getNewIdea}>
              Try Another
            </Button>
            <Button variant="primary" onClick={() => onPlanDate(currentIdea)}>
              Plan This Date
            </Button>
          </div>
        </Card>
      )}

      {/* Browse Ideas by Category */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Browse Ideas by Category
        </h4>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Categories
          </button>
          {Object.entries(dateCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedCategory === key
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredIdeas.map((idea) => {
            const category = dateCategories[idea.category];
            const CategoryIcon = category?.icon;

            return (
              <Card key={idea.id} hover className="cursor-pointer" onClick={() => onPlanDate(idea)}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color}`}>
                    {CategoryIcon && <CategoryIcon className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                      {idea.title}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {idea.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>${idea.estimatedCost}</span>
                      <span>{idea.duration}h</span>
                      <span>{idea.difficulty}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

// Date Plan Detail Modal Component
const DatePlanDetailModal = ({
  plan,
  dateCategories,
  budgetRanges,
  formatDate,
  formatTime,
  onClose
}) => {
  const category = dateCategories[plan.category];
  const budget = budgetRanges[plan.budget];
  const CategoryIcon = category?.icon;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={plan.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category?.color}`}>
              {CategoryIcon && <CategoryIcon className="w-5 h-5 text-white" />}
            </div>
            <div>
              <Badge variant="outline" size="sm">
                {category?.name}
              </Badge>
              <Badge variant="outline" size="sm" className={`ml-2 ${budget?.color}`}>
                {budget?.name}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ${plan.estimatedCost}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {plan.duration} hours
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(plan.date)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Date
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatTime(plan.date)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Start Time
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Activities */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Activities ({plan.activities.length})
          </h4>
          <div className="space-y-4">
            {plan.activities.map((activity, index) => (
              <Card key={index}>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {activity.activity}
                      </h5>
                      <div className="flex items-center space-x-2 text-sm">
                        <Badge variant="outline" size="sm">
                          {activity.time}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          ${activity.cost}
                        </Badge>
                      </div>
                    </div>
                    {activity.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                    {activity.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {activity.notes}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Notes */}
        {plan.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
            <p className="text-gray-600 dark:text-gray-300">{plan.notes}</p>
          </div>
        )}

        {/* Tags */}
        {plan.tags && plan.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {plan.tags.map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rating & Review (for completed dates) */}
        {plan.status === 'completed' && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Review</h4>
            {plan.rating && (
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < plan.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {plan.rating}/5 stars
                </span>
              </div>
            )}
            {plan.review && (
              <p className="text-gray-600 dark:text-gray-300">{plan.review}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            Edit
          </Button>
          {plan.status === 'planned' && (
            <Button variant="primary">
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DateNightPlanner;
