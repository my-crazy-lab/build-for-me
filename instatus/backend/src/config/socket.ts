import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { logger } from '../utils/logger';
import { query } from './database';
import { User, WebSocketEvent, WebSocketEventType } from '../../../shared/types';

/**
 * Socket.IO Configuration and Real-time Event Management
 * 
 * Handles:
 * - WebSocket authentication
 * - Real-time event broadcasting
 * - Room management for projects
 * - Connection management
 */

interface AuthenticatedSocket extends Socket {
  user?: User;
  projectRooms?: Set<string>;
}

interface SocketData {
  user?: User;
  projectRooms?: Set<string>;
}

/**
 * Socket.IO server instance
 */
let io: SocketIOServer;

/**
 * Setup Socket.IO server with authentication and event handlers
 */
export const setupSocketIO = (socketServer: SocketIOServer): void => {
  io = socketServer;

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        logger.warn('Socket connection without token', {
          socketId: socket.id,
          ip: socket.handshake.address,
        });
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      // Fetch user from database
      const userResult = await query<User>(
        'SELECT id, email, name, role, email_verified, avatar_url, preferences, created_at, updated_at FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length === 0) {
        return next(new Error('User not found'));
      }

      socket.user = userResult.rows[0];
      socket.projectRooms = new Set();
      
      logger.info('Socket authenticated', {
        socketId: socket.id,
        userId: socket.user.id,
        email: socket.user.email,
        ip: socket.handshake.address,
      });

      next();
    } catch (error) {
      logger.warn('Socket authentication failed', {
        socketId: socket.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: socket.handshake.address,
      });
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info('Socket connected', {
      socketId: socket.id,
      userId: socket.user?.id,
      email: socket.user?.email,
    });

    // Join user to their personal room
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
    }

    // Handle project room joining
    socket.on('join_project', async (projectId: string) => {
      try {
        if (!socket.user) {
          socket.emit('error', { message: 'Authentication required' });
          return;
        }

        // Verify user has access to the project
        const projectResult = await query(
          'SELECT id, user_id, is_private FROM projects WHERE id = $1',
          [projectId]
        );

        if (projectResult.rows.length === 0) {
          socket.emit('error', { message: 'Project not found' });
          return;
        }

        const project = projectResult.rows[0];

        // Check access permissions
        if (project.is_private && project.user_id !== socket.user.id && socket.user.role !== 'admin') {
          socket.emit('error', { message: 'Access denied to private project' });
          return;
        }

        // Join project room
        const roomName = `project:${projectId}`;
        socket.join(roomName);
        socket.projectRooms?.add(roomName);

        logger.info('Socket joined project room', {
          socketId: socket.id,
          userId: socket.user.id,
          projectId,
          roomName,
        });

        socket.emit('joined_project', { projectId });
      } catch (error) {
        logger.error('Error joining project room', {
          socketId: socket.id,
          projectId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        socket.emit('error', { message: 'Failed to join project' });
      }
    });

    // Handle project room leaving
    socket.on('leave_project', (projectId: string) => {
      const roomName = `project:${projectId}`;
      socket.leave(roomName);
      socket.projectRooms?.delete(roomName);

      logger.info('Socket left project room', {
        socketId: socket.id,
        userId: socket.user?.id,
        projectId,
        roomName,
      });

      socket.emit('left_project', { projectId });
    });

    // Handle status page viewing (for public pages)
    socket.on('view_status_page', async (slug: string) => {
      try {
        // Get project by slug
        const projectResult = await query(
          'SELECT id, is_private FROM projects WHERE slug = $1',
          [slug]
        );

        if (projectResult.rows.length === 0) {
          socket.emit('error', { message: 'Status page not found' });
          return;
        }

        const project = projectResult.rows[0];

        // Check if public or user has access
        if (!project.is_private || (socket.user && (project.user_id === socket.user.id || socket.user.role === 'admin'))) {
          const roomName = `status:${slug}`;
          socket.join(roomName);

          logger.info('Socket viewing status page', {
            socketId: socket.id,
            userId: socket.user?.id,
            slug,
            projectId: project.id,
          });

          socket.emit('viewing_status_page', { slug, projectId: project.id });
        } else {
          socket.emit('error', { message: 'Access denied to private status page' });
        }
      } catch (error) {
        logger.error('Error viewing status page', {
          socketId: socket.id,
          slug,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        socket.emit('error', { message: 'Failed to view status page' });
      }
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info('Socket disconnected', {
        socketId: socket.id,
        userId: socket.user?.id,
        reason,
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error', {
        socketId: socket.id,
        userId: socket.user?.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
  });

  logger.info('Socket.IO server configured');
};

/**
 * Broadcast event to project room
 */
export const broadcastToProject = (projectId: string, event: WebSocketEvent): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized');
    return;
  }

  const roomName = `project:${projectId}`;
  io.to(roomName).emit('project_event', event);

  logger.debug('Event broadcasted to project', {
    projectId,
    roomName,
    eventType: event.type,
  });
};

/**
 * Broadcast event to status page viewers
 */
export const broadcastToStatusPage = (slug: string, event: WebSocketEvent): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized');
    return;
  }

  const roomName = `status:${slug}`;
  io.to(roomName).emit('status_event', event);

  logger.debug('Event broadcasted to status page', {
    slug,
    roomName,
    eventType: event.type,
  });
};

/**
 * Send event to specific user
 */
export const sendToUser = (userId: string, event: WebSocketEvent): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized');
    return;
  }

  const roomName = `user:${userId}`;
  io.to(roomName).emit('user_event', event);

  logger.debug('Event sent to user', {
    userId,
    roomName,
    eventType: event.type,
  });
};

/**
 * Broadcast global event to all connected clients
 */
export const broadcastGlobal = (event: WebSocketEvent): void => {
  if (!io) {
    logger.warn('Socket.IO not initialized');
    return;
  }

  io.emit('global_event', event);

  logger.debug('Global event broadcasted', {
    eventType: event.type,
  });
};

/**
 * Get connected socket count
 */
export const getConnectedSocketCount = (): number => {
  if (!io) {
    return 0;
  }
  return io.engine.clientsCount;
};

/**
 * Get room information
 */
export const getRoomInfo = async (roomName: string): Promise<{
  socketCount: number;
  sockets: string[];
}> => {
  if (!io) {
    return { socketCount: 0, sockets: [] };
  }

  const room = io.sockets.adapter.rooms.get(roomName);
  if (!room) {
    return { socketCount: 0, sockets: [] };
  }

  return {
    socketCount: room.size,
    sockets: Array.from(room),
  };
};

/**
 * Disconnect user from all sockets
 */
export const disconnectUser = async (userId: string): Promise<void> => {
  if (!io) {
    return;
  }

  const sockets = await io.in(`user:${userId}`).fetchSockets();
  for (const socket of sockets) {
    socket.disconnect(true);
  }

  logger.info('User disconnected from all sockets', { userId });
};

/**
 * Real-time event helpers
 */
export const emitComponentStatusChanged = (projectId: string, componentId: string, status: string): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.COMPONENT_STATUS_CHANGED,
    data: { componentId, status },
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export const emitIncidentCreated = (projectId: string, incident: any): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.INCIDENT_CREATED,
    data: incident,
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export const emitIncidentUpdated = (projectId: string, incident: any): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.INCIDENT_UPDATED,
    data: incident,
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export const emitIncidentResolved = (projectId: string, incident: any): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.INCIDENT_RESOLVED,
    data: incident,
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export const emitUptimeCheckFailed = (projectId: string, checkId: string, error: string): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.UPTIME_CHECK_FAILED,
    data: { checkId, error },
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export const emitUptimeCheckRecovered = (projectId: string, checkId: string): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.UPTIME_CHECK_RECOVERED,
    data: { checkId },
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export const emitNewSubscriber = (projectId: string, subscriber: any): void => {
  const event: WebSocketEvent = {
    type: WebSocketEventType.NEW_SUBSCRIBER,
    data: subscriber,
    project_id: projectId,
    timestamp: new Date().toISOString(),
  };

  broadcastToProject(projectId, event);
};

export default {
  setupSocketIO,
  broadcastToProject,
  broadcastToStatusPage,
  sendToUser,
  broadcastGlobal,
  getConnectedSocketCount,
  getRoomInfo,
  disconnectUser,
  emitComponentStatusChanged,
  emitIncidentCreated,
  emitIncidentUpdated,
  emitIncidentResolved,
  emitUptimeCheckFailed,
  emitUptimeCheckRecovered,
  emitNewSubscriber,
};
