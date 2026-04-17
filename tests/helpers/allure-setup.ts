/**
 * Allure Environment Setup
 *
 * This file sets up environment information for Allure reports.
 * Call this in your playwright.config.ts or in a global setup file.
 */

import { test } from '@playwright/test';

/**
 * Write environment.properties file for Allure
 * This populates the Environment widget in the report
 */
export async function setupAllureEnvironment() {
  const fs = require('fs');
  const path = require('path');

  const environment = {
    // Environment info
    'Environment': process.env.ENV || 'dev',
    'Base URL': process.env.BASE_URL || 'https://www.saucedemo.com',

    // CI/CD info
    'CI': process.env.CI || 'false',
    'GitHub Run ID': process.env.GITHUB_RUN_ID || 'local',
    'GitHub Run Number': process.env.GITHUB_RUN_NUMBER || 'N/A',
    'GitHub Repository': process.env.GITHUB_REPOSITORY || 'local',

    // Browser info (will be detected by Playwright)
    'Browser': 'Chromium',
    'Headless': process.env.HEADED === 'true' ? 'false' : 'true',

    // Test info
    'Framework': 'Playwright',
    'Language': 'TypeScript',
    'Test Runner': process.env.CI ? 'GitHub Actions' : 'Local',

    // Dates
    'Execution Date': new Date().toISOString(),
    'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // Write to allure-results/environment.properties
  const allureResultsDir = path.join(process.cwd(), 'allure-results');
  const envFile = path.join(allureResultsDir, 'environment.properties');

  // Ensure directory exists
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
  }

  // Write environment properties
  const content = Object.entries(environment)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envFile, content);
}

/**
 * Write executor.json file for Allure
 * This populates the Executors widget in the report
 */
export async function setupAllureExecutor() {
  const fs = require('fs');
  const path = require('path');

  const executor = {
    name: 'GitHub Actions',
    type: 'github',
    url: process.env.GITHUB_SERVER_URL || 'https://github.com',
    buildUrl: process.env.GITHUB_RUN_URL
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
      : 'http://localhost',
    buildOrder: parseInt(process.env.GITHUB_RUN_NUMBER || '0'),
    reportUrl: process.env.GITHUB_SERVER_URL
      ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions`
      : 'http://localhost',
    reportName: 'Allure Report',
  };

  const allureResultsDir = path.join(process.cwd(), 'allure-results');
  const executorFile = path.join(allureResultsDir, 'executor.json');

  // Ensure directory exists
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
  }

  fs.writeFileSync(executorFile, JSON.stringify(executor, null, 2));
}

/**
 * Setup both environment and executor metadata
 * Call this once before running tests
 */
export async function setupAllureMetadata() {
  await setupAllureEnvironment();
  await setupAllureExecutor();
}
