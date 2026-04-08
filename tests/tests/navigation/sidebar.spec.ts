import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';

test.describe('Sidebar Menu @navigation', () => {
  test.describe('Logout', () => {
    test('should logout and redirect to login page @smoke @regression', async ({
      loginPage,
      sidebarPage,
    }) => {
      // SID-001: Click logout - User is redirected to login page
      // First login
      await loginPage.goto();
      await loginPage.loginWithDefaults();

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
      authenticatedInventoryPage, // Required: provides authenticated session
      sidebarPage,
    }) => {
      await sidebarPage.open();
      await sidebarPage.close();

      const isOpen = await sidebarPage.isOpen();
      expect(isOpen).toBeFalsy();
    });

    test('should display all menu items @regression', async ({
      authenticatedInventoryPage, // Required: provides authenticated session
      sidebarPage,
    }) => {
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
      authenticatedInventoryPage, // Required: provides authenticated session
      sidebarPage,
      page,
    }) => {
      // Navigate to About - navigates in same tab to external site
      await sidebarPage.openAndNavigateToAbout();

      // Verify navigated to saucelabs.com
      await expect(page).toHaveURL(sidebarPage.aboutUrl);

      // Navigate back to restore app state for other tests
      await page.goBack();
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

    test('should clear cart with multiple items @smoke @regression', async ({
      authenticatedInventoryPage,
      sidebarPage,
      page,
    }) => {
      // Add multiple items to cart
      const testProducts = inventoryData.products.slice(0, 3);
      for (const product of testProducts) {
        await authenticatedInventoryPage.addToCart(product.id);
      }

      // Verify cart has items
      const cartCountBefore = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(cartCountBefore).toBe(testProducts.length);
      await expect(authenticatedInventoryPage.navbar.shoppingCartBadge).toBeVisible();

      // Verify remove buttons are present (state: items in cart)
      const removeButtonCountBefore = await authenticatedInventoryPage.getRemoveButtonCount();
      expect(removeButtonCountBefore).toBe(testProducts.length);

      // Reset app state via sidebar
      await sidebarPage.openAndResetAppState();

      // Verify cart is cleared - badge count = 0
      const cartCountAfter = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(cartCountAfter).toBe(0);

      // Verify cart badge is hidden when empty
      await expect(authenticatedInventoryPage.navbar.shoppingCartBadge).not.toBeVisible();

      // NOTE: Reset App State clears the cart but doesn't reset button states
      // Button states remain as "Remove" even though cart is empty
      // This is actual application behavior - buttons reset only on page refresh
    });
  });
});
