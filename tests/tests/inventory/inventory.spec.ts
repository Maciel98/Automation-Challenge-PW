import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';

test.describe('Inventory @inventory', () => {
  test.describe('Add to Cart', () => {
    test('User can add product to cart @smoke', async ({ authenticatedInventoryPage }) => {
      const product = inventoryData.products[0];
      await authenticatedInventoryPage.addToCart(product.id);

      const cartCount = await authenticatedInventoryPage.navbar.getCartBadgeCount();
      expect(cartCount).toBe(1);
    });

    test('should increment cart badge when adding multiple items @smoke @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(inventoryData.products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.addToCart(inventoryData.products[1].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryPage.addToCart(inventoryData.products[2].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('should remove item from cart @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.addToCart(inventoryData.products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryPage.removeFromCart(inventoryData.products[0].id);
      expect(await authenticatedInventoryPage.navbar.getCartBadgeCount()).toBe(0);
    });
  });

  test.describe('Sorting @sorting', () => {
    test('Select sort by name (A-Z) - Products are sorted alphabetically from A to Z @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortProducts('az');

      const productNames = await authenticatedInventoryPage.getProductNames();
      const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));

      expect(productNames).toEqual(sortedNames);
    });

    test('Select sort by name (Z-A) - Products are sorted alphabetically from Z to A @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortProducts('za');

      const productNames = await authenticatedInventoryPage.getProductNames();
      const sortedNames = [...productNames].sort((a, b) => b.localeCompare(a));

      expect(productNames).toEqual(sortedNames);
    });

    test('Select sort by price (low to high) - Products are sorted by price ascending @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortProducts('lohi');

      const productPrices = await authenticatedInventoryPage.getProductPrices();
      const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
      const sortedPrices = [...numericPrices].sort((a, b) => a - b);

      expect(numericPrices).toEqual(sortedPrices);
    });

    test('Select sort by price (high to low) - Products are sorted by price descending @regression', async ({ authenticatedInventoryPage }) => {
      await authenticatedInventoryPage.sortProducts('hilo');

      const productPrices = await authenticatedInventoryPage.getProductPrices();
      const numericPrices = productPrices.map(price => parseFloat(price.replace('$', '')));
      const sortedPrices = [...numericPrices].sort((a, b) => b - a);

      expect(numericPrices).toEqual(sortedPrices);
    });
  });
});
