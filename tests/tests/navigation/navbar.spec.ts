import { test, expect } from '../../fixtures/base.fixture';
import { InventoryPage } from '../../pages/inventory.page';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Navbar Component', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(standardUser, password);
  });

  test.describe('Visibility', () => {
    test('should display primary header on inventory page', async ({ navbarPage }) => {
      const isVisible = await navbarPage.isPrimaryHeaderVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should display hamburger button', async ({ navbarPage }) => {
      const isVisible = await navbarPage.isHamburgerButtonVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should display shopping cart link', async ({ navbarPage }) => {
      const isVisible = await navbarPage.isShoppingCartLinkVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should wait for navbar to load', async ({ navbarPage }) => {
      await navbarPage.waitForNavbar();
      const isVisible = await navbarPage.isPrimaryHeaderVisible();
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('Cart Badge', () => {
    test('should not show badge when cart is empty', async ({ navbarPage }) => {
      const count = await navbarPage.getCartBadgeCount();
      expect(count).toBe(0);

      const isVisible = await navbarPage.isCartBadgeVisible();
      expect(isVisible).toBeFalsy();
    });

    test('should show badge count when items added', async ({ navbarPage, page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.addToCart('sauce-labs-backpack');

      const count = await navbarPage.getCartBadgeCount();
      expect(count).toBe(1);

      const isVisible = await navbarPage.isCartBadgeVisible();
      expect(isVisible).toBeTruthy();
    });

    test('should increment badge with multiple items', async ({ navbarPage, page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.addToCart('sauce-labs-backpack');
      expect(await navbarPage.getCartBadgeCount()).toBe(1);

      await inventoryPage.addToCart('sauce-labs-bike-light');
      expect(await navbarPage.getCartBadgeCount()).toBe(2);

      await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');
      expect(await navbarPage.getCartBadgeCount()).toBe(3);
    });

    test('should decrement badge when items removed', async ({ navbarPage, page }) => {
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.addToCart('sauce-labs-backpack');
      await inventoryPage.addToCart('sauce-labs-bike-light');
      expect(await navbarPage.getCartBadgeCount()).toBe(2);

      await inventoryPage.removeFromCart('sauce-labs-backpack');
      expect(await navbarPage.getCartBadgeCount()).toBe(1);

      await inventoryPage.removeFromCart('sauce-labs-bike-light');
      expect(await navbarPage.getCartBadgeCount()).toBe(0);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to cart page', async ({ navbarPage, page }) => {
      await navbarPage.navigateToCart();
      await expect(page).toHaveURL(/\/cart\.html/);
    });

    test('should open sidebar menu', async ({ navbarPage, page }) => {
      await navbarPage.openMenu();
      const sidebar = page.locator('.bm-menu');
      await expect(sidebar).toBeVisible();
    });
  });
});

test.describe('Navbar Integration', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(standardUser, password);
  });

  test('InventoryPage should use composed navbar', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCart('sauce-labs-backpack');

    const count = await inventoryPage.navbar.getCartBadgeCount();
    expect(count).toBe(1);

    await inventoryPage.navbar.navigateToCart();
    await expect(page).toHaveURL(/\/cart\.html/);
  });
});
