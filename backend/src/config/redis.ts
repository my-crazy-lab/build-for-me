import { createClient, RedisClientType } from 'redis';
import { config } from './config';
import { logger } from '../utils/logger';

/**
 * Redis Configuration and Connection Management
 * 
 * This module handles:
 * - Redis connection management
 * - Caching operations
 * - Session storage
 * - Queue management
 * - Pub/Sub messaging
 */

class RedisManager {
  private client: RedisClientType;
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const redisConfig = {
      url: config.redis.url,
      socket: {
        host: config.redis.host,
        port: config.redis.port,
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            logger.error('Redis reconnection failed after 10 attempts');
            return new Error('Redis reconnection failed');
          }
          return Math.min(retries * 50, 1000);
        }
      },
      password: config.redis.password,
      database: config.redis.db,
    };

    // Main client for general operations
    this.client = createClient(redisConfig);
    
    // Dedicated clients for pub/sub
    this.subscriber = createClient(redisConfig);
    this.publisher = createClient(redisConfig);

    this.setupEventHandlers();
  }

  /**
   * Setup Redis event handlers
   */
  private setupEventHandlers(): void {
    // Main client events
    this.client.on('connect', () => {
      logger.debug('Redis client connecting...');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.info('Redis client connection ended');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    // Subscriber events
    this.subscriber.on('error', (error) => {
      logger.error('Redis subscriber error:', error);
    });

    // Publisher events
    this.publisher.on('error', (error) => {
      logger.error('Redis publisher error:', error);
    });
  }

  /**
   * Connect to Redis
   */
  public async connect(): Promise<void> {
    try {
      await Promise.all([
        this.client.connect(),
        this.subscriber.connect(),
        this.publisher.connect()
      ]);

      // Test the connection
      const pong = await this.client.ping();
      if (pong !== 'PONG') {
        throw new Error('Redis ping failed');
      }

      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    try {
      await Promise.all([
        this.client.quit(),
        this.subscriber.quit(),
        this.publisher.quit()
      ]);
      
      this.isConnected = false;
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }

  /**
   * Set a key-value pair with optional expiration
   */
  public async set(key: string, value: string | object, ttlSeconds?: number): Promise<void> {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get a value by key
   */
  public async get<T = string>(key: string, parseJson: boolean = false): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      
      if (value === null) {
        return null;
      }

      if (parseJson) {
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      }

      return value as T;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete a key
   */
  public async del(key: string): Promise<number> {
    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Check if a key exists
   */
  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Set expiration for a key
   */
  public async expire(key: string, ttlSeconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, ttlSeconds);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXPIRE error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple keys
   */
  public async mget<T = string>(keys: string[], parseJson: boolean = false): Promise<(T | null)[]> {
    try {
      const values = await this.client.mGet(keys);
      
      return values.map(value => {
        if (value === null) {
          return null;
        }

        if (parseJson) {
          try {
            return JSON.parse(value) as T;
          } catch {
            return value as T;
          }
        }

        return value as T;
      });
    } catch (error) {
      logger.error(`Redis MGET error for keys ${keys.join(', ')}:`, error);
      throw error;
    }
  }

  /**
   * Increment a numeric value
   */
  public async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Increment by a specific amount
   */
  public async incrBy(key: string, increment: number): Promise<number> {
    try {
      return await this.client.incrBy(key, increment);
    } catch (error) {
      logger.error(`Redis INCRBY error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Add to a set
   */
  public async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await this.client.sAdd(key, members);
    } catch (error) {
      logger.error(`Redis SADD error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get all members of a set
   */
  public async smembers(key: string): Promise<string[]> {
    try {
      return await this.client.sMembers(key);
    } catch (error) {
      logger.error(`Redis SMEMBERS error for key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Publish a message to a channel
   */
  public async publish(channel: string, message: string | object): Promise<number> {
    try {
      const serializedMessage = typeof message === 'string' ? message : JSON.stringify(message);
      return await this.publisher.publish(channel, serializedMessage);
    } catch (error) {
      logger.error(`Redis PUBLISH error for channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Subscribe to a channel
   */
  public async subscribe(channel: string, callback: (message: string, channel: string) => void): Promise<void> {
    try {
      await this.subscriber.subscribe(channel, callback);
    } catch (error) {
      logger.error(`Redis SUBSCRIBE error for channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Unsubscribe from a channel
   */
  public async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
    } catch (error) {
      logger.error(`Redis UNSUBSCRIBE error for channel ${channel}:`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      const start = Date.now();
      const pong = await this.client.ping();
      const latency = Date.now() - start;

      const info = await this.client.info();
      const memoryInfo = info.split('\r\n').find(line => line.startsWith('used_memory_human:'));
      const connectionsInfo = info.split('\r\n').find(line => line.startsWith('connected_clients:'));

      return {
        healthy: pong === 'PONG',
        details: {
          connected: this.isConnected,
          latency: `${latency}ms`,
          memory: memoryInfo?.split(':')[1] || 'unknown',
          connections: connectionsInfo?.split(':')[1] || 'unknown'
        }
      };
    } catch (error) {
      return {
        healthy: false,
        details: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Get Redis client for advanced operations
   */
  public getClient(): RedisClientType {
    return this.client;
  }

  /**
   * Get subscriber client
   */
  public getSubscriber(): RedisClientType {
    return this.subscriber;
  }

  /**
   * Get publisher client
   */
  public getPublisher(): RedisClientType {
    return this.publisher;
  }

  /**
   * Check if Redis is connected
   */
  public isRedisConnected(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
const redisManager = new RedisManager();

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<void> => {
  await redisManager.connect();
};

/**
 * Disconnect from Redis
 */
export const disconnectRedis = async (): Promise<void> => {
  await redisManager.disconnect();
};

/**
 * Cache operations
 */
export const cache = {
  set: (key: string, value: string | object, ttlSeconds?: number) => 
    redisManager.set(key, value, ttlSeconds),
  
  get: <T = string>(key: string, parseJson: boolean = false) => 
    redisManager.get<T>(key, parseJson),
  
  del: (key: string) => 
    redisManager.del(key),
  
  exists: (key: string) => 
    redisManager.exists(key),
  
  expire: (key: string, ttlSeconds: number) => 
    redisManager.expire(key, ttlSeconds),
  
  mget: <T = string>(keys: string[], parseJson: boolean = false) => 
    redisManager.mget<T>(keys, parseJson),
  
  incr: (key: string) => 
    redisManager.incr(key),
  
  incrBy: (key: string, increment: number) => 
    redisManager.incrBy(key, increment),
};

/**
 * Pub/Sub operations
 */
export const pubsub = {
  publish: (channel: string, message: string | object) => 
    redisManager.publish(channel, message),
  
  subscribe: (channel: string, callback: (message: string, channel: string) => void) => 
    redisManager.subscribe(channel, callback),
  
  unsubscribe: (channel: string) => 
    redisManager.unsubscribe(channel),
};

/**
 * Health check
 */
export const redisHealthCheck = async (): Promise<{ healthy: boolean; details: any }> => {
  return await redisManager.healthCheck();
};

/**
 * Get Redis clients
 */
export const getRedisClient = (): RedisClientType => redisManager.getClient();
export const getRedisSubscriber = (): RedisClientType => redisManager.getSubscriber();
export const getRedisPublisher = (): RedisClientType => redisManager.getPublisher();

export default redisManager;
