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

  constructor(page: Page) {
    this.page = page;
    // SauceDemo login selectors - using data-test-id attributes (POM best practice)
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorIcon = page.locator('.error-icon');
    this.inventoryList = page.locator('.inventory_list');
  }

  /**
   * Navigate to the login page and wait for form to be ready
   */
  async goto() {
    await this.page.goto(this.path);
    // Wait for the form to be visible and ready for interaction
    await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
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

    // Wait for button to be attached and ready
    await this.loginButton.waitFor({ state: 'attached', timeout: 5000 });
    await this.loginButton.click();
  }

  /**
   * Login and wait for navigation to inventory page
   * Use this for successful login scenarios
   * @param username - Username
   * @param password - Password
   */
  async loginAndWaitForDashboard(username: string, password: string) {
    await this.login(username, password);
    // Wait for navigation to inventory page (successful login)
    await this.page.waitForURL(/\/inventory\.html/, { timeout: 10000 });
  }

  /**
   * Login expecting to stay on login page (for error scenarios)
   * @param username - Username
   * @param password - Password
   */
  async loginExpectingError(username: string, password: string) {
    await this.login(username, password);
    // Wait a bit for error message to appear
    await this.page.waitForTimeout(1000);
  }

  /**
   * Check if error message is visible
   */
  async hasErrorMessage(): Promise<boolean> {
    await this.page.waitForTimeout(500);
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
    await this.page.locator('[data-test="error-button"]').click();
    await this.errorMessage.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * Verify we're on the login page
   */
  async isOnLoginPage(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('saucedemo.com') && !url.includes('inventory.html');
  }

  /**
   * Verify we're on the inventory/dashboard page (successful login)
   */
  async isOnDashboardPage(): Promise<boolean> {
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
