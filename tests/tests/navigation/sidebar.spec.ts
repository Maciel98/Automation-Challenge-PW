import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';

import dotenv from 'dotenv';

dotenv.config();

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
      await loginPage.loginAndWaitForInventoryWithDefaults();

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

      // Verify ALL menu items are visible
      expect(await sidebarPage.isMenuItemVisible(sidebarPage.allItemsLink)).toBeTruthy();
      expect(await sidebarPage.isMenuItemVisible(sidebarPage.aboutLink)).toBeTruthy();
      expect(await sidebarPage.isMenuItemVisible(sidebarPage.logoutLink)).toBeTruthy();
      expect(await sidebarPage.isMenuItemVisible(sidebarPage.resetAppStateLink)).toBeTruthy();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to all items and stay on inventory page @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
    }) => {
      await sidebarPage.openAndNavigateToAllItems();

      // Verify still on inventory page
      await authenticatedInventoryPage.isLoaded();
    });

    test('should navigate to about page and open external saucelabs.com @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
      page,
    }) => {
      // Navigate to About - opens new tab
      const newPage = await sidebarPage.openAndNavigateToAbout();

      // Verify new page opened and navigated to saucelabs.com
      await expect(newPage).toHaveURL(/saucelabs\.com/);

      // Clean up - close the new page
      await newPage.close();
    });
  });

  test.describe('Reset App State', () => {
    test('should clear cart when resetting app state @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
    }) => {
      // Add item to cart
      await authenticatedInventoryPage.addToCart(inventoryData.products[0].id);

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
