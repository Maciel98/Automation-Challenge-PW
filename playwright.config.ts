import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 *
 * This loads .env file for local development.
 * In CI, environment variables are set via GitHub Secrets.
 */
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Global setup to configure Allure metadata */
  globalSetup: './tests/global-setup.ts',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
        ['dot'],                                      // Minimal console output for CI
        ['html', { open: 'never' }],                 // HTML report for artifacts
        ['allure-playwright', {                      // Allure report for dashboard
          detail: true,
          outputFolder: 'allure-results',
          suiteTitle: true,
        }],
      ]
    : [
        ['list'],                                    // Verbose console output locally
        ['html', { open: 'on-failure' }],            // Auto-open HTML report on failure
        ['allure-playwright', {                      // Allure report for local development
          detail: true,
          outputFolder: 'allure-results',
          suiteTitle: true,
        }],
      ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',

    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',

    /* Capture video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // -------------------------------------------------------------------------
    // ENVIRONMENT PROJECTS
    // -------------------------------------------------------------------------
    // Each environment has its own baseURL configured below.
    // This allows the same test suite to run against different environments
    // by specifying the project name: --project=dev, --project=test, --project=prd
    //
    // Usage in CI pipeline:
    // • DEV:  npx playwright test --project=dev --grep @smoke
    // • TEST: npx playwright test --project=test --grep @smoke (then full regression)
    // • PRD:  npx playwright test --project=prd --grep @smoke (NEVER regression in PRD)
    // -------------------------------------------------------------------------

    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        // DEV environment URL
        // Update this to your development environment URL
        baseURL: 'https://www.saucedemo.com', // example 'https://dev.saucedemo.com'
      },
    },

    {
      name: 'test',
      use: {
        ...devices['Desktop Chrome'],
        // TEST/STAGING environment URL
        // Update this to your test/staging environment URL
        baseURL: 'https://www.saucedemo.com', // example 'https://test.saucedemo.com'
      },
    },

    {
      name: 'prd',
      use: {
        ...devices['Desktop Chrome'],
        // PRODUCTION environment URL
        // This is the live production URL - use with caution
        baseURL: 'https://www.saucedemo.com',
      },
    },

    // -------------------------------------------------------------------------
    // LEGACY BROWSER PROJECTS (Optional - commented out)
    // -------------------------------------------------------------------------
    // Uncomment if you need to test on additional browsers
    // -------------------------------------------------------------------------
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
