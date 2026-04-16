/**
 * Allure Test Metadata Helper
 *
 * This file provides convenient functions for adding Allure metadata to tests.
 * Use these decorators to categorize and organize your test reports.
 *
 * USAGE:
 * ```ts
 * import { test } from '@playwright/test';
 * import { Allure } from './helpers/allure';
 *
 * test('should login successfully', async ({ page }) => {
 *   Allure.epic('Authentication');
 *   Allure.feature('Login');
 *   Allure.story('User logs in with valid credentials');
 *   Allure.severity('critical');
 *   Allure.tag('smoke', 'auth');
 *
 *   // test implementation...
 * });
 * ```
 *
 * @see https://github.com/allure-framework/allure-js/blob/master/packages/allure-playwright/README.md
 */

import { allure } from 'allure-playwright';

export const Allure = {
  /**
   * Test categorization - highest level grouping
   * @param name Epic name (e.g., 'E-Commerce', 'Authentication')
   */
  epic: (name: string) => allure.epic(name),

  /**
   * Test categorization - feature within an epic
   * @param name Feature name (e.g., 'Checkout', 'Login')
   */
  feature: (name: string) => allure.feature(name),

  /**
   * Test categorization - specific user story or scenario
   * @param name Story description (e.g., 'User pays with credit card')
   */
  story: (name: string) => allure.story(name),

  /**
   * Test severity/priority level
   * @param level Severity level: 'trivial', 'minor', 'normal', 'major', 'critical'
   */
  severity: (level: 'trivial' | 'minor' | 'normal' | 'major' | 'critical') =>
    allure.severity(level),

  /**
   * Add tags/labels to test
   * @param tags Tag names (e.g., 'smoke', 'regression', 'auth')
   */
  tag: (...tags: string[]) => {
    tags.forEach(tag => allure.tag(tag));
  },

  /**
   * Add test owner
   * @param name Owner name or team
   */
  owner: (name: string) => allure.owner(name),

  /**
   * Link to related ticket
   * @param url Ticket URL (e.g., JIRA, GitHub Issue)
   * @param name Link name (optional, defaults to 'Issue')
   */
  issue: (url: string, name?: string) => allure.issue(url, name),

  /**
   * Link to related documentation
   * @param url Documentation URL
   * @param name Link name (optional, defaults to 'Documentation')
   */
  tms: (url: string, name?: string) => allure.tms(url, name),

  /**
   * Add test description
   * @param text Description text (supports Markdown)
   */
  description: (text: string) => allure.description(text),

  /**
   * Add description as HTML
   * @param html HTML description
   */
  descriptionHtml: (html: string) => allure.descriptionHtml(html),

  /**
   * Add test step
   * @param name Step name
   * @param fn Step function
   */
  step: async <T>(name: string, fn: () => Promise<T>): Promise<T> =>
    allure.step(name, fn),

  /**
   * Attach screenshot to Allure report
   * @param name Attachment name
   * @param path Screenshot file path
   */
  attachScreenshot: async (name: string, path: string) => {
    await allure.attachment(name, path, 'image/png');
  },

  /**
   * Attach file to Allure report
   * @param name Attachment name
   * @param content File content
   * @param type MIME type (e.g., 'application/json', 'text/plain')
   */
  attachFile: async (name: string, content: string, type: string) => {
    await allure.attachment(name, content, type);
  },

  /**
   * Mark test as flaky (unstable)
   * @param reason Reason for flakiness
   */
  flaky: (reason?: string) => {
    if (reason) {
      allure.description(`**FLAKY TEST**: ${reason}`);
    }
    allure.tag('flaky');
  },
};

/**
 * Common severity levels for quick access
 */
export const Severity = {
  TRIVIAL: 'trivial',
  MINOR: 'minor',
  NORMAL: 'normal',
  MAJOR: 'major',
  CRITICAL: 'critical',
} as const;

/**
 * Common tags for test categorization
 */
export const Tags = {
  SMOKE: 'smoke',
  REGRESSION: 'regression',
  AUTH: 'auth',
  CART: 'cart',
  CHECKOUT: 'checkout',
  INVENTORY: 'inventory',
  NAVIGATION: 'navigation',
  API: 'api',
  UI: 'ui',
  NEGATIVE: 'negative',
  HAPPY_PATH: 'happy-path',
} as const;
