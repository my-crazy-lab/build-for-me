// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'postgresql://test_user:test_password@localhost:5432/test_db';
process.env['REDIS_URL'] = 'redis://localhost:6379/15'; // Use different Redis DB for tests

// Increase timeout for monitoring tests
jest.setTimeout(30000);
