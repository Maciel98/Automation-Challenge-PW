import { test, expect } from '../../fixtures/base.fixture';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Login Test Suite for SauceDemo
 * Tests the authentication flow using Page Object Model
 */
test.describe('SauceDemo Login - POM Tests', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const lockedOutUser = process.env.LOCKED_OUT_USER || 'locked_out_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.beforeAll(async () => {
    // Verify environment variables are loaded
    if (!standardUser || !password) {
      throw new Error(
        'Missing credentials! Please set STANDARD_USER and TEST_PASSWORD in .env file'
      );
    }
  });

  test.describe('Standard User (Valid Login)', () => {
    test('should navigate to login page', async ({ loginPage }) => {
      await loginPage.goto();
      await expect(loginPage.page).toHaveTitle(/Swag Labs/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should login with valid credentials', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.loginAndWaitForDashboard(standardUser, password);

      // Verify successful login - should be on inventory page
      await expect(page).toHaveURL(/\/inventory\.html/);

      // Verify we're no longer on login page
      await expect(loginPage.usernameInput).not.toBeVisible();

      // Verify inventory page is loaded
      await expect(page.locator('.inventory_list')).toBeVisible();
    });

    test('should maintain session after login', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.loginAndWaitForDashboard(standardUser, password);

      // Navigate to another page and come back
      await page.goto('https://www.saucedemo.com/inventory.html');
      await page.waitForTimeout(1000);

      // Should still be logged in and on inventory page
      await expect(page).toHaveURL(/\/inventory\.html/);
      await expect(loginPage.usernameInput).not.toBeVisible();
    });
  });

  test.describe('Locked Out User', () => {
    test('should show error for locked_out_user', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(lockedOutUser, password);

      // Verify error message appears
      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      // Verify the error message text
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage.toLowerCase()).toContain('locked');
      expect(errorMessage.toLowerCase()).toContain('sorry');

      // Verify we're still on login page
      const isOnLoginPage = await loginPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
    });

    test('should not navigate to dashboard when locked', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(lockedOutUser, password);

      // Should NOT be on inventory page
      const isOnDashboard = await loginPage.isOnDashboardPage();
      expect(isOnDashboard).toBeFalsy();

      // Should still have login form visible
      await expect(loginPage.usernameInput).toBeVisible();
    });
  });

  test.describe('Invalid Credentials', () => {
    test('should show error with wrong username', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError('invalid_user', password);

      // Verify error message appears
      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      // Verify the error message text
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage.toLowerCase()).toContain('username and password do not match');
    });

    test('should show error with wrong password', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(standardUser, 'wrong_password');

      // Verify error message appears
      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      // Verify the error message text
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage.toLowerCase()).toContain('username and password do not match');
    });

    test('should show error with empty fields', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError('', '');

      // Should stay on login page
      const isOnLoginPage = await loginPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
    });
  });

  test.describe('Error Banner Interactions', () => {
    test('should dismiss error banner', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(lockedOutUser, password);

      // Verify error is visible
      await expect(loginPage.errorMessage).toBeVisible();

      // Dismiss the error
      await loginPage.dismissError();

      // Verify error is hidden
      await expect(loginPage.errorMessage).not.toBeVisible();
    });
  });
});
