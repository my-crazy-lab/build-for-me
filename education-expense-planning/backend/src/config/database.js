/**
 * Database configuration and connection setup for MongoDB
 * 
 * This module handles:
 * - MongoDB connection via Mongoose
 * - Connection event handling
 * - Database configuration options
 * - Connection retry logic
 * - Graceful disconnection
 * 
 * @author Education Expense Dashboard Team
 * @version 1.0.0
 * @created 2025-06-25
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test' 
      ? process.env.MONGODB_TEST_URI 
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    const options = {
      // Connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      
      // Buffering options
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      
      // Retry options
      retryWrites: true,
      retryReads: true,
      
      // Other options
      autoIndex: process.env.NODE_ENV !== 'production', // Don't build indexes in production
    };

    const conn = await mongoose.connect(mongoURI, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      logger.info('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ Mongoose disconnected from MongoDB');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('🔌 Mongoose connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      logger.info('🔄 Retrying database connection...');
      connectDB();
    }, 5000);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('🔌 MongoDB connection closed');
  } catch (error) {
    logger.error('❌ Error closing MongoDB connection:', error.message);
  }
};

/**
 * Clear database (for testing purposes)
 * @returns {Promise<void>}
 */
export const clearDB = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearDB can only be used in test environment');
  }

  try {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    
    logger.info('🧹 Test database cleared');
  } catch (error) {
    logger.error('❌ Error clearing test database:', error.message);
    throw error;
  }
};

/**
 * Get database connection status
 * @returns {string} Connection status
 */
export const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Database health check
 * @returns {Promise<Object>} Health check result
 */
export const healthCheck = async () => {
  try {
    const status = getConnectionStatus();
    
    if (status !== 'connected') {
      return {
        status: 'unhealthy',
        message: `Database is ${status}`,
        timestamp: new Date().toISOString(),
      };
    }

    // Ping the database
    await mongoose.connection.db.admin().ping();
    
    return {
      status: 'healthy',
      message: 'Database connection is active',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      message: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
