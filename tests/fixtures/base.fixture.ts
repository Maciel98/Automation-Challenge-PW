import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SidebarPage } from '../pages/sidebar.page';

/**
 * Type definition for our custom fixtures
 */
type MyFixtures = {
  loginPage: LoginPage;
  sidebarPage: SidebarPage;
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

  /**
   * SidebarPage fixture
   * Automatically creates a new SidebarPage instance for each test
   */
  sidebarPage: async ({ page }, use) => {
    const sidebarPage = new SidebarPage(page);
    await use(sidebarPage);
  },
});

/**
 * Re-export expect from @playwright/test
 * Use this in your tests:
 * import { test, expect } from '../fixtures/base.fixture';
 */
export { expect } from '@playwright/test';
