import { test, expect } from '../../fixtures/base.fixture';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Navbar Component', () => {
  test.describe('Visibility', () => {
    test('should display primary header on inventory page', async ({ authenticatedInventoryPage }) => {
      const isVisible = await authenticatedInventoryPage.navbar.isPrimaryHeaderVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should display hamburger button', async ({ authenticatedInventoryPage }) => {
      const isVisible = await authenticatedInventoryPage.navbar.isHamburgerButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should display shopping cart link', async ({ authenticatedInventoryPage }) => {
      const isVisible = await authenticatedInventoryPage.navbar.isShoppingCartLinkVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should wait for navbar to load', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.navbar.waitForNavbar();
      const isVisible = await authenticatedInventoryPage.navbar.isPrimaryHeaderVisible();
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('Cart Badge', () => {
    test('should not show badge when cart is empty', async ({ authenticatedInventoryPage }) => {
      const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(count).toBe(0);

      const isVisible = await authenticatedInventoryPage.navbar.isCartBadgeVisible();
      expect(isVisible).toBeFalsy();
    });

    test('should show badge count when items added', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart('sauce-labs-backpack');

      const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(count).toBe(1);

      const isVisible = await authenticatedInventoryPage.navbar.isCartBadgeVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should increment badge with multiple items', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart('sauce-labs-backpack');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.addToCart('sauce-labs-bike-light');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.addToCart('sauce-labs-bolt-t-shirt');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('should decrement badge when items removed', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart('sauce-labs-backpack');
      await authenticatedInventoryPage.addToCart('sauce-labs-bike-light');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.removeFromCart('sauce-labs-backpack');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.removeFromCart('sauce-labs-bike-light');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(0);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to cart page', async ({ authenticatedInventoryPage, page }) => {
      await authenticatedInventoryPage.navbar.navigateToCart();
      await expect(page).toHaveURL(/\/cart\.html/);
    });

    test('should open sidebar menu', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.navbar.openMenu();
      const isVisible = await authenticatedInventoryPage.navbar.isSidebarVisible();
      expect(isVisible).toBeTruthy();
    });
  });
});

test.describe('Navbar Integration', () => {
  test('InventoryPage should use composed navbar', async ({ authenticatedInventoryPage, page }) => {
    await authenticatedInventoryPage.addToCart('sauce-labs-backpack');

    const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
    expect(count).toBe(1);

    await authenticatedInventoryPage.navbar.navigateToCart();
    await expect(page).toHaveURL(/\/cart\.html/);
  });
});
