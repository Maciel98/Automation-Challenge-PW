import { test, expect } from '../../fixtures/base.fixture';
import dotenv from 'dotenv';

dotenv.config();

const STANDARD_USER = process.env.STANDARD_USER || 'standard_user';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'secret_sauce';

test.describe('Sidebar Menu @navigation', () => {
  test.describe('Logout', () => {
    test('should logout and redirect to login page @smoke @regression', async ({
      loginPage,
      sidebarPage,
      page,
    }) => {
      // SID-001: Click logout - User is redirected to login page
      // First login
      await loginPage.goto();
      await loginPage.loginAndWaitForDashboard(STANDARD_USER, TEST_PASSWORD);

      // Open sidebar and logout
      await sidebarPage.openAndLogout();

      // Verify redirected to login page
      await loginPage.isLoaded();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });

  test.describe('Menu Display', () => {
    test('should open sidebar menu when clicking hamburger button @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
    }) => {
      await sidebarPage.open();

      const isOpen = await sidebarPage.isOpen();
      expect(isOpen).toBeTruthy();
    });

    test('should close sidebar menu when clicking close button @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
    }) => {
      await sidebarPage.open();
      await sidebarPage.close();

      const isOpen = await sidebarPage.isOpen();
      expect(isOpen).toBeFalsy();
    });

    test('should display all menu items @regression', async ({ authenticatedInventoryPage, sidebarPage }) => {
      await sidebarPage.open();

      const menuItemCount = await sidebarPage.getMenuItemCount();
      expect(menuItemCount).toBe(4); // All Items, About, Logout, Reset App State

      const isLogoutVisible = await sidebarPage.isMenuItemVisible(sidebarPage.logoutLink);
      expect(isLogoutVisible).toBeTruthy();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to all items and stay on inventory page @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
      inventoryPage,
    }) => {
      await sidebarPage.openAndNavigateToAllItems();

      // Verify still on inventory page
      await inventoryPage.isLoaded();
    });
  });

  test.describe('Reset App State', () => {
    test('should clear cart when resetting app state @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
    }) => {
      // Add item to cart
      await authenticatedInventoryPage.addToCart('sauce-labs-backpack');

      const cartCountBefore = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(cartCountBefore).toBe(1);

      // Reset app state
      await sidebarPage.openAndResetAppState();

      // Verify cart is cleared
      const cartCountAfter = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(cartCountAfter).toBe(0);
    });
  });
});
