import { test, expect } from '../../fixtures/base.fixture';
import loginData from '../../test-data/login.json';
import { getStandardUserCredentials, getLockedOutUserCredentials } from '../../helpers/credentials';

test.describe('Authentication @auth', () => {
  test.describe('Standard User (Valid Login)', () => {
    test('should navigate to login page @smoke', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.isLoaded();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });

    test('should login with valid credentials @smoke', async ({ loginPage, inventoryPage }) => {
      await loginPage.goto();
      await loginPage.loginAndWaitForInventoryWithDefaults();

      await inventoryPage.isLoaded();
      await expect(loginPage.usernameInput).not.toBeVisible();
      await expect(loginPage.inventoryList).toBeVisible();
    });

    test('should maintain session after login @regression', async ({ loginPage, inventoryPage }) => {
      await loginPage.goto();
      await loginPage.loginAndWaitForInventoryWithDefaults();

      await inventoryPage.goto();

      await inventoryPage.isLoaded();
      await expect(loginPage.usernameInput).not.toBeVisible();
    });
  });

  test.describe('Locked Out User', () => {
    test('should show error for locked_out_user @regression', async ({ loginPage }) => {
      const { username, password } = getLockedOutUserCredentials();

      await loginPage.goto();
      await loginPage.loginExpectingError(username, password);

      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.lockedOut);

      const isOnLoginPage = await loginPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
    });

    test('should not navigate to inventory when locked @regression', async ({ loginPage }) => {
      const { username, password } = getLockedOutUserCredentials();

      await loginPage.goto();
      await loginPage.loginExpectingError(username, password);

      const isOnInventory = await loginPage.isOnInventoryPage();
      expect(isOnInventory).toBeFalsy();

      // Verify error message is displayed
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.lockedOut);

      await expect(loginPage.usernameInput).toBeVisible();
    });
  });

  test.describe('Invalid Credentials', () => {
    test('should show error with wrong username @regression', async ({ loginPage }) => {
      const { password } = getStandardUserCredentials();

      await loginPage.goto();
      await loginPage.loginExpectingError('invalid_user', password);

      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.invalidCredentials);
    });

    test('should show error with wrong password @regression', async ({ loginPage }) => {
      const { username } = getStandardUserCredentials();

      await loginPage.goto();
      await loginPage.loginExpectingError(username, 'wrong_password');

      const hasError = await loginPage.hasErrorMessage();
      expect(hasError).toBeTruthy();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.invalidCredentials);
    });

    test('should show error with empty fields @regression', async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.loginExpectingError('', '');

      // Verify error message is displayed
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBe(loginData.errorMessages.missingUsername);

      const isOnLoginPage = await loginPage.isOnLoginPage();
      expect(isOnLoginPage).toBeTruthy();
    });
  });

  test.describe('Error Banner Interactions', () => {
    test('should dismiss error banner @regression', async ({ loginPage }) => {
      const { username, password } = getLockedOutUserCredentials();

      await loginPage.goto();
      await loginPage.loginExpectingError(username, password);

      await expect(loginPage.errorMessage).toBeVisible();

      await loginPage.dismissError();

      await expect(loginPage.errorMessage).not.toBeVisible();
    });
  });
});
