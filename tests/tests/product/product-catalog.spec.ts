import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';

test.describe('Product Catalog', () => {
  test.describe('Add to Cart', () => {
    test('TC004: User can add product to cart @smoke @cart @P0', async ({ authenticatedInventoryPage }) => {
      const product = inventoryData.products[0];
      await authenticatedInventoryPage.addToCart(product.id);

      const cartCount = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(cartCount).toBe(1);
    });

    test('should increment cart badge when adding multiple items', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(inventoryData.products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.addToCart(inventoryData.products[1].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.addToCart(inventoryData.products[2].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('should remove item from cart', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(inventoryData.products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.removeFromCart(inventoryData.products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(0);
    });
  });
});
