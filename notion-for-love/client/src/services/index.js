/**
 * Love Journey - Services Index
 * 
 * Central export point for all API services in the application.
 * 
 * Created: 2025-06-26
 * Version: 1.0.0
 */

import authService from './authService';
import goalsService from './goalsService';
import memoriesService from './memoriesService';
import dashboardService from './dashboardService';
import eventsService from './eventsService';
import emotionsService from './emotionsService';
import checkinsService from './checkinsService';
import milestonesService from './milestonesService';
import timeCapsulesService from './timeCapsulesService';

export {
  authService,
  goalsService,
  memoriesService,
  dashboardService,
  eventsService,
  emotionsService,
  checkinsService,
  milestonesService,
  timeCapsulesService,
};

// Default export for convenience
const services = {
  auth: authService,
  goals: goalsService,
  memories: memoriesService,
  dashboard: dashboardService,
  events: eventsService,
  emotions: emotionsService,
  checkins: checkinsService,
  milestones: milestonesService,
  timeCapsules: timeCapsulesService,
};

export default services;
