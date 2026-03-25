import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Product Catalog', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(standardUser, password);
  });

  test.describe('Add to Cart', () => {
    test('TC004: User can add product to cart @smoke @cart @P0', async ({ inventoryPage }) => {
      const product = inventoryData.products[0];
      await inventoryPage.addToCart(product.id);

      const cartCount = await inventoryPage.navbar.getCartBadgeCount();
      expect(cartCount).toBe(1);
    });

    test('should increment cart badge when adding multiple items', async ({ inventoryPage }) => {
      await inventoryPage.addToCart(inventoryData.products[0].id);
      expect(await inventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await inventoryPage.addToCart(inventoryData.products[1].id);
      expect(await inventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await inventoryPage.addToCart(inventoryData.products[2].id);
      expect(await inventoryPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('should remove item from cart', async ({ inventoryPage }) => {
      await inventoryPage.addToCart(inventoryData.products[0].id);
      expect(await inventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await inventoryPage.removeFromCart(inventoryData.products[0].id);
      expect(await inventoryPage.navbar.getCartBadgeCount()).toBe(0);
    });
  });
});
