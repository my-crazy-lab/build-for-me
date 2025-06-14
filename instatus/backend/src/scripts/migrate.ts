#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '../config/database';
import { logger } from '../utils/logger';

/**
 * Database Migration Script
 * 
 * Runs the database schema migration from schema.sql
 */

async function runMigration(): Promise<void> {
  try {
    logger.info('Starting database migration...');

    // Read the schema file
    const schemaPath = join(__dirname, '../../../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    logger.info(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        await query(statement);
        logger.debug(`Executed statement ${i + 1}/${statements.length}`);
      } catch (error) {
        // Skip errors for statements that might already exist (like CREATE TABLE IF NOT EXISTS)
        if (error instanceof Error && error.message.includes('already exists')) {
          logger.debug(`Skipped statement ${i + 1} (already exists): ${statement.substring(0, 50)}...`);
        } else {
          logger.error(`Failed to execute statement ${i + 1}: ${statement.substring(0, 100)}...`);
          throw error;
        }
      }
    }

    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error('Database migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      logger.info('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigration };
