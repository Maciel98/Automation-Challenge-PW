import { type Page, expect } from '@playwright/test';

/**
 * Assertion helpers for Shopify login tests
 */

/**
 * Assert that a toast/notification message appears and contains text
 * @param page - Playwright Page object
 * @param message - Expected message text (partial match)
 */
export async function expectToast(page: Page, message: string): Promise<void> {
  const toast = page.getByRole('status').filter({ hasText: message });
  await expect(toast).toBeVisible({ timeout: 5000 });
}

/**
 * Assert that an error message is visible on the page
 * @param page - Playwright Page object
 * @param expectedText - Optional expected error text
 */
export async function expectErrorMessage(page: Page, expectedText?: string): Promise<void> {
  const errorLocator = page.locator('.errors, .alert, [role="alert"]');
  await expect(errorLocator).toBeVisible({ timeout: 5000 });

  if (expectedText) {
    await expect(errorLocator).toContainText(expectedText);
  }
}

/**
 * Assert that the page URL matches a pattern
 * @param page - Playwright Page object
 * @param pattern - URL pattern to match
 */
export async function expectURL(page: Page, pattern: RegExp | string): Promise<void> {
  await expect(page).toHaveURL(pattern, { timeout: 10000 });
}

/**
 * Assert that an input field has a specific value
 * @param page - Playwright Page object
 * @param label - Label text or aria-label
 * @param value - Expected value
 */
export async function expectInputValue(page: Page, label: string, value: string): Promise<void> {
  const input = page.getByLabel(label);
  await expect(input).toHaveValue(value);
}

/**
 * Assert that a heading is visible
 * @param page - Playwright Page object
 * @param text - Heading text
 */
export async function expectHeading(page: Page, text: string): Promise<void> {
  const heading = page.getByRole('heading', { name: text });
  await expect(heading).toBeVisible();
}

/**
 * Wait for page to be stable (no network activity for 500ms)
 * @param page - Playwright Page object
 */
export async function waitForPageStable(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 10000 });
}
