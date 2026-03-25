import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';

const products = inventoryData.products;

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
    test('should not show badge when cart is empty @smoke @regression', async ({ authenticatedInventoryPage }) => {
      const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(count).toBe(0);

      const isVisible = await authenticatedInventoryPage.navbar.isCartBadgeVisible();
      expect(isVisible).toBeFalsy();
    });

    test('should show badge count when items added @smoke @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(products[0].id);

      const count = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(count).toBe(1);

      const isVisible = await authenticatedInventoryPage.navbar.isCartBadgeVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should increment badge with multiple items @smoke @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.addToCart(products[1].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.addToCart(products[2].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('should decrement badge when items removed @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(products[0].id);
      await authenticatedInventoryPage.addToCart(products[1].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.removeFromCart(products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.removeFromCart(products[1].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(0);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to cart page @smoke @regression', async ({ authenticatedInventoryPage, cartPage }) => {
      await authenticatedInventoryPage.navbar.navigateToCart();
      await cartPage.isLoaded();
    });

    test('should open sidebar menu @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.navbar.openMenu();
      const isVisible = await authenticatedInventoryPage.navbar.isSidebarVisible();
      expect(isVisible).toBeTruthy();
    });
  });
});
