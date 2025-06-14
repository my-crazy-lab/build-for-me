import { Pool, PoolClient } from 'pg';
import { config } from './config';
import { logger } from '../utils/logger';

/**
 * PostgreSQL Database Configuration and Connection Management
 * 
 * This module handles:
 * - Database connection pooling
 * - Connection health checks
 * - Query execution with error handling
 * - Transaction management
 */

class Database {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor() {
    this.pool = new Pool({
      connectionString: config.database.url,
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
      min: config.database.pool.min,
      max: config.database.pool.max,
      idleTimeoutMillis: config.database.pool.idleTimeout,
      connectionTimeoutMillis: 10000,
      statement_timeout: 30000,
      query_timeout: 30000,
    });

    this.setupEventHandlers();
  }

  /**
   * Setup database event handlers
   */
  private setupEventHandlers(): void {
    this.pool.on('connect', (client: PoolClient) => {
      logger.debug('New database client connected');
    });

    this.pool.on('acquire', (client: PoolClient) => {
      logger.debug('Database client acquired from pool');
    });

    this.pool.on('remove', (client: PoolClient) => {
      logger.debug('Database client removed from pool');
    });

    this.pool.on('error', (err: Error, client: PoolClient) => {
      logger.error('Database pool error:', err);
    });
  }

  /**
   * Connect to the database and verify connection
   */
  public async connect(): Promise<void> {
    try {
      // Test the connection
      const client = await this.pool.connect();
      
      // Run a simple query to verify connection
      const result = await client.query('SELECT NOW() as current_time, version() as version');
      
      logger.info('Database connected successfully', {
        timestamp: result.rows[0].current_time,
        version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
      });

      client.release();
      this.isConnected = true;

      // Run initial setup if needed
      await this.runInitialSetup();

    } catch (error) {
      logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  /**
   * Run initial database setup (create extensions, etc.)
   */
  private async runInitialSetup(): Promise<void> {
    try {
      await this.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      logger.debug('Database extensions verified');
    } catch (error) {
      logger.warn('Failed to create database extensions:', error);
    }
  }

  /**
   * Execute a query with parameters
   */
  public async query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> {
    const start = Date.now();
    
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug('Query executed', {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        duration: `${duration}ms`,
        rowCount: result.rowCount
      });

      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    } catch (error) {
      const duration = Date.now() - start;
      
      logger.error('Query failed', {
        query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        duration: `${duration}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  }

  /**
   * Execute a query and return the first row
   */
  public async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(text, params);
    return result.rows[0] || null;
  }

  /**
   * Execute multiple queries in a transaction
   */
  public async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a client from the pool for manual transaction management
   */
  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  /**
   * Check if database is connected and healthy
   */
  public async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      const result = await this.query('SELECT NOW() as timestamp, version() as version');
      const poolInfo = {
        totalCount: this.pool.totalCount,
        idleCount: this.pool.idleCount,
        waitingCount: this.pool.waitingCount
      };

      return {
        healthy: true,
        details: {
          connected: this.isConnected,
          timestamp: result.rows[0].timestamp,
          version: result.rows[0].version,
          pool: poolInfo
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
   * Close all database connections
   */
  public async close(): Promise<void> {
    try {
      await this.pool.end();
      this.isConnected = false;
      logger.info('Database connections closed');
    } catch (error) {
      logger.error('Error closing database connections:', error);
      throw error;
    }
  }

  /**
   * Get pool statistics
   */
  public getPoolStats(): {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  } {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    };
  }
}

// Create singleton instance
const database = new Database();

/**
 * Connect to the database
 */
export const connectDatabase = async (): Promise<void> => {
  await database.connect();
};

/**
 * Execute a database query
 */
export const query = async <T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }> => {
  return await database.query<T>(text, params);
};

/**
 * Execute a query and return the first row
 */
export const queryOne = async <T = any>(text: string, params?: any[]): Promise<T | null> => {
  return await database.queryOne<T>(text, params);
};

/**
 * Execute multiple queries in a transaction
 */
export const transaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  return await database.transaction(callback);
};

/**
 * Get a database client for manual transaction management
 */
export const getClient = async (): Promise<PoolClient> => {
  return await database.getClient();
};

/**
 * Check database health
 */
export const healthCheck = async (): Promise<{ healthy: boolean; details: any }> => {
  return await database.healthCheck();
};

/**
 * Close database connections
 */
export const closeDatabase = async (): Promise<void> => {
  await database.close();
};

/**
 * Get database pool statistics
 */
export const getPoolStats = (): { totalCount: number; idleCount: number; waitingCount: number } => {
  return database.getPoolStats();
};

export default database;
