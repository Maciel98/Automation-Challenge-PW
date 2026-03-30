import { type Page, type Locator, expect } from '@playwright/test';

/**
 * LoginPage - Page Object for SauceDemo.com
 *
 * Encapsulates all login interactions for SauceDemo authentication.
 * Follows POM best practices: actions, not locators.
 *
 * Available users:
 * - standard_user (valid)
 * - locked_out_user (locked)
 * - problem_user (has issues)
 * - performance_glitch_user (slow)
 * - error_user (errors)
 * - visual_user (visual testing)
 */
export class LoginPage {
  readonly page: Page;
  readonly path = '/';
  readonly url = /\/$/;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorIcon: Locator;
  readonly inventoryList: Locator;
  readonly errorButton: Locator;

  // Credentials loaded from environment (no hardcoded values)
  private defaultUsername: string;
  private defaultPassword: string;

  constructor(page: Page) {
    this.page = page;

    // Credentials from environment (no hardcoded values)
    this.defaultUsername = process.env.STANDARD_USER ?? (() => { throw new Error('STANDARD_USER not set'); })();
    this.defaultPassword = process.env.TEST_PASSWORD ?? (() => { throw new Error('TEST_PASSWORD not set'); })();

    // SauceDemo login selectors - using data-test-id attributes (POM best practice)
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorIcon = page.locator('.error-icon');
    this.inventoryList = page.locator('.inventory_list');
    this.errorButton = page.locator('[data-test="error-button"]');
  }

  /**
   * Navigate to the login page
   * Playwright will auto-wait for elements when we interact with them
   */
  async goto() {
    await this.page.goto(this.path);
  }

  /**
   * Verify we're on the login page
   */
  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
  }

  /**
   * Fill in the login credentials and submit the form
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Login using default credentials
   * Convenience method that uses the default standard_user credentials
   */
  async loginWithDefaults() {
    await this.login(this.defaultUsername, this.defaultPassword);
  }

  /**
   * Login expecting to stay on login page (for error scenarios)
   * @param username - Username
   * @param password - Password
   */
  async loginExpectingError(username: string, password: string) {
    await this.login(username, password);
    // Wait for error message to appear
    await this.errorMessage.waitFor({ state: 'visible' });
  }

  /**
   * Check if error message is visible
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    const text = await this.errorMessage.textContent();
    return text?.trim() || '';
  }

  /**
   * Dismiss the error banner by clicking the X button
   */
  async dismissError() {
    await this.errorButton.click();
    await this.errorMessage.waitFor({ state: 'hidden' });
  }

  /**
   * Verify we're on the login page
   */
  async isOnLoginPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('saucedemo.com') && !url.includes('inventory.html');
  }

  /**
   * Verify we're on the inventory page (successful login)
   */
  async isOnInventoryPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('inventory.html');
  }

  /**
   * Check if the page has the correct title
   */
  async hasPageTitle(expectedTitle: string): Promise<boolean> {
    const title = await this.page.title();
    return title === expectedTitle;
  }
}
