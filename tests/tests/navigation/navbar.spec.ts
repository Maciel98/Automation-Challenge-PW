import { test, expect } from '../../fixtures/base.fixture';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Navbar Component @navigation', () => {
  test.describe('Visibility', () => {
    test('should display primary header on inventory page @regression', async ({ authenticatedInventoryPage }) => {
      const isVisible = await authenticatedInventoryPage.navbar.isPrimaryHeaderVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should display hamburger button @regression', async ({ authenticatedInventoryPage }) => {
      const isVisible = await authenticatedInventoryPage.navbar.isHamburgerButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should display shopping cart link @regression', async ({ authenticatedInventoryPage }) => {
      const isVisible = await authenticatedInventoryPage.navbar.isShoppingCartLinkVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should wait for navbar to load @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.navbar.waitForNavbar();
      const isVisible = await authenticatedInventoryPage.navbar.isPrimaryHeaderVisible();
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('Cart Badge', () => {
    test('TC032: should not show badge when cart is empty @smoke @regression', async ({ authenticatedInventoryPage }) => {
      const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(count).toBe(0);

      const isVisible = await authenticatedInventoryPage.navbar.isCartBadgeVisible();
      expect(isVisible).toBeFalsy();
    });

    test('TC014: should show badge count when items added @smoke @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart('sauce-labs-backpack');

      const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(count).toBe(1);

      const isVisible = await authenticatedInventoryPage.navbar.isCartBadgeVisible();
      expect(isVisible).toBeTruthy();
    });

    test('TC015: should increment badge with multiple items @smoke @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart('sauce-labs-backpack');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.addToCart('sauce-labs-bike-light');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.addToCart('sauce-labs-bolt-t-shirt');
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('TC016: should decrement badge when items removed @regression', async ({ authenticatedInventoryPage }) => {
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
    test('TC025: should navigate to cart page @smoke @regression', async ({ authenticatedInventoryPage, page }) => {
      await authenticatedInventoryPage.navbar.navigateToCart();
      await expect(page).toHaveURL(/\/cart\.html/);
    });

    test('should open sidebar menu @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.navbar.openMenu();
      const isVisible = await authenticatedInventoryPage.navbar.isSidebarVisible();
      expect(isVisible).toBeTruthy();
    });
  });
});

test.describe('Navbar Integration', () => {
  test('InventoryPage should use composed navbar @regression', async ({ authenticatedInventoryPage, page }) => {
    await authenticatedInventoryPage.addToCart('sauce-labs-backpack');

    const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
    expect(count).toBe(1);

    await authenticatedInventoryPage.navbar.navigateToCart();
    await expect(page).toHaveURL(/\/cart\.html/);
  });
});
