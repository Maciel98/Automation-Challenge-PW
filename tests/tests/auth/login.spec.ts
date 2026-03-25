import { test, expect } from '../../fixtures/base.fixture';
import loginData from '../../test-data/login.json';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Authentication', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const lockedOutUser = process.env.LOCKED_OUT_USER || 'locked_out_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.describe('Standard User (Valid Login)', () => {
    test('should navigate to login page', async ({ loginPage }) => {
      await loginPage.goto();
      await expect(loginPage.page).toHaveTitle(/Swag Labs/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should login with valid credentials @smoke @critical @P0', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.loginAndWaitForDashboard(standardUser, password);

      await expect(page).toHaveURL(/\/inventory\.html/);
      await expect(loginPage.usernameInput).not.toBeVisible();
      await expect(page.locator('.inventory_list')).toBeVisible();
    });

    test('should maintain session after login', async ({ loginPage, page }) => {
      await loginPage.goto();
      await loginPage.loginAndWaitForDashboard(standardUser, password);

      await page.goto('https://www.saucedemo.com/inventory.html');
      await page.waitForTimeout(1000);

      await expect(page).toHaveURL(/\/inventory\.html/);
      await expect(loginPage.usernameInput).not.toBeVisible();
    });
  });

  test.describe('Locked Out User', () => {
    test('should show error for locked_out_user', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(lockedOutUser, password);

      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.lockedOut);

      const isOnLoginPage = await loginPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
    });

    test('should not navigate to dashboard when locked', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(lockedOutUser, password);

      const isOnDashboard = await loginPage.isOnDashboardPage();
      expect(isOnDashboard).toBeFalsy();

      await expect(loginPage.usernameInput).toBeVisible();
    });
  });

  test.describe('Invalid Credentials', () => {
    test('should show error with wrong username', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError('invalid_user', password);

      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.invalidCredentials);
    });

    test('should show error with wrong password', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(standardUser, 'wrong_password');

      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.invalidCredentials);
    });

    test('should show error with empty fields', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError('', '');

      const isOnLoginPage = await loginPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
    });
  });

  test.describe('Error Banner Interactions', () => {
    test('should dismiss error banner', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError(lockedOutUser, password);

      await expect(loginPage.errorMessage).toBeVisible();

      await loginPage.dismissError();

      await expect(loginPage.errorMessage).not.toBeVisible();
    });
  });
});
