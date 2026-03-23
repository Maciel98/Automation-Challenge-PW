import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * Type definition for our custom fixtures
 */
type MyFixtures = {
  loginPage: LoginPage;
};

/**
 * Extended test with custom fixtures
 * Import test and expect from this file instead of @playwright/test
 */
export const test = base.extend<MyFixtures>({
  /**
   * LoginPage fixture
   * Automatically creates a new LoginPage instance for each test
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

/**
 * Re-export expect from @playwright/test
 * Use this in your tests:
 * import { test, expect } from '../fixtures/base.fixture';
 */
export { expect } from '@playwright/test';
