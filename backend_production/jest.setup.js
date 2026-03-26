// Load environment variables from .env file for tests
require('dotenv').config();

// Set test environment variables if not already set
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://testuser:testpass@localhost:5432/testdb';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_testing_only';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test_refresh_secret_for_testing_only';
process.env.NODE_ENV = 'test';
