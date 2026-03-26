import dotenv from 'dotenv';

// Load environment variables from .env file only in local development
// In CI, environment variables are set via GitHub Secrets
if (process.env.CI !== 'true') {
  dotenv.config();
}

/**
 * SauceDemo credentials interface
 */
export interface SauceDemoCredentials {
  username: string;
  password: string;
}

/**
 * Get standard user credentials from environment variables
 * In CI: reads from GitHub Secrets
 * Locally: reads from .env file
 * @throws Error if credentials are not set
 */
export function getStandardUserCredentials(): SauceDemoCredentials {
  const username = process.env.STANDARD_USER;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    const source = process.env.CI === 'true' ? 'GitHub Secrets' : '.env file';
    throw new Error(
      `Missing credentials! Please set STANDARD_USER and TEST_PASSWORD in ${source}`
    );
  }

  return { username, password };
}

/**
 * Get locked out user credentials from environment variables
 * In CI: reads from GitHub Secrets
 * Locally: reads from .env file
 * @throws Error if credentials are not set
 */
export function getLockedOutUserCredentials(): SauceDemoCredentials {
  const username = process.env.LOCKED_OUT_USER;
  const password = process.env.TEST_PASSWORD;

  if (!username || !password) {
    const source = process.env.CI === 'true' ? 'GitHub Secrets' : '.env file';
    throw new Error(
      `Missing credentials! Please set LOCKED_OUT_USER and TEST_PASSWORD in ${source}`
    );
  }

  return { username, password };
}

/**
 * Get test password from environment variables
 */
export function getTestPassword(): string {
  const password = process.env.TEST_PASSWORD;
  if (!password) {
    throw new Error('TEST_PASSWORD is not set in environment variables');
  }
  return password;
}

/**
 * Get standard username from environment variables
 */
export function getStandardUsername(): string {
  const username = process.env.STANDARD_USER;
  if (!username) {
    throw new Error('STANDARD_USER is not set in environment variables');
  }
  return username;
}

/**
 * Get locked out username from environment variables
 */
export function getLockedOutUsername(): string {
  const username = process.env.LOCKED_OUT_USER;
  if (!username) {
    throw new Error('LOCKED_OUT_USER is not set in environment variables');
  }
  return username;
}
