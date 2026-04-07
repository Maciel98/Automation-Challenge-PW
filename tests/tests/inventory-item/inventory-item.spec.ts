import { test, expect } from '../../fixtures/base.fixture';
import { InventoryPage } from '../../pages/inventory.page';
import { InventoryItemPage } from '../../pages/inventory-item.page';
import { CartPage } from '../../pages/cart.page';
import inventoryItemData from '../../test-data/inventory-item.json';

test.describe('Inventory Item @inventory-item', () => {
  test.describe('Navigation & Display @smoke', () => {
    test('should display product details correctly for all products @smoke @regression', async ({ authenticatedInventoryItemPage }) => {
      // Arrange & Act & Assert - Test all products (IDs 0-5)
      for (const product of inventoryItemData.products) {
        await authenticatedInventoryItemPage.goto(product.id);

        const actualName = await authenticatedInventoryItemPage.getProductName();
        const actualPrice = await authenticatedInventoryItemPage.getProductPrice();

        expect(actualName).toBe(product.name);
        expect(actualPrice).toBe(product.price);
      }
    });

    test('should navigate from inventory to item detail page @smoke', async ({ authenticatedInventoryPage }) => {
      // Arrange
      const firstProductName = await authenticatedInventoryPage.getFirstProductName();

      // Act
      await authenticatedInventoryPage.clickProductNameByIndex(0);
      const inventoryItemPage = new InventoryItemPage(authenticatedInventoryPage.page);
      await inventoryItemPage.isLoaded();

      // Assert
      const detailPageName = await inventoryItemPage.getProductName();
      expect(detailPageName).toBe(firstProductName);
    });

    test('should navigate back to products from detail page @smoke', async ({ authenticatedInventoryItemPage }) => {
      // Act
      await authenticatedInventoryItemPage.backToProducts();
      const inventoryPage = new InventoryPage(authenticatedInventoryItemPage.page);

      // Assert
      await inventoryPage.isLoaded();
    });

    test('should display product description @regression', async ({ authenticatedInventoryItemPage }) => {
      // Act
      const description = await authenticatedInventoryItemPage.getProductDescription();

      // Assert
      expect(description).toBeTruthy();
      expect(description.length).toBeGreaterThan(0);
    });

    test('should display product image @regression', async ({ authenticatedInventoryItemPage }) => {
      // Act & Assert
      await expect(authenticatedInventoryItemPage.productImage).toBeVisible();
      const src = await authenticatedInventoryItemPage.productImage.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).toMatch(/\.(jpg|jpeg|png|webp)$/);
    });
  });

  test.describe('Cart Operations ', () => {
    test('should add item to cart from detail page @smoke ', async ({ authenticatedInventoryItemPage }) => {
      // Act
      await authenticatedInventoryItemPage.addToCart();

      // Assert
      expect(await authenticatedInventoryItemPage.isInCart()).toBe(true);
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(1);
    });

    test('should remove item from cart from detail page @smoke ', async ({ authenticatedInventoryItemPage }) => {
      // Arrange
      await authenticatedInventoryItemPage.addToCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(1);

      // Act
      await authenticatedInventoryItemPage.removeFromCart();

      // Assert
      expect(await authenticatedInventoryItemPage.isInCart()).toBe(false);
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(0);
    });

    test('should increment cart badge when adding item @smoke ', async ({ authenticatedInventoryItemPage }) => {
      // Act & Assert - Add first item
      await authenticatedInventoryItemPage.goto(0);
      await authenticatedInventoryItemPage.addToCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(1);

      // Add second item
      await authenticatedInventoryItemPage.goto(1);
      await authenticatedInventoryItemPage.addToCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(2);

      // Add third item
      await authenticatedInventoryItemPage.goto(2);
      await authenticatedInventoryItemPage.addToCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(3);
    });

    test('should decrement cart badge when removing item @smoke ', async ({ authenticatedInventoryItemPage }) => {
      // Arrange - Add multiple items
      await authenticatedInventoryItemPage.goto(0);
      await authenticatedInventoryItemPage.addToCart();

      await authenticatedInventoryItemPage.goto(1);
      await authenticatedInventoryItemPage.addToCart();

      await authenticatedInventoryItemPage.goto(2);
      await authenticatedInventoryItemPage.addToCart();

      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(3);

      // Act & Assert - Remove items one by one
      await authenticatedInventoryItemPage.removeFromCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(2);

      await authenticatedInventoryItemPage.goto(1);
      await authenticatedInventoryItemPage.removeFromCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(1);

      await authenticatedInventoryItemPage.goto(0);
      await authenticatedInventoryItemPage.removeFromCart();
      expect(await authenticatedInventoryItemPage.navbar.getCartBadgeCount()).toBe(0);
    });

    test('should show correct button state based on cart status @regression', async ({ authenticatedInventoryItemPage }) => {
      // Act & Assert - Initially should show "Add to cart"
      await expect(authenticatedInventoryItemPage.addToCartButton).toBeVisible();
      await expect(authenticatedInventoryItemPage.removeButton).not.toBeVisible();

      // After adding should show "Remove"
      await authenticatedInventoryItemPage.addToCart();
      await expect(authenticatedInventoryItemPage.removeButton).toBeVisible();
      await expect(authenticatedInventoryItemPage.addToCartButton).not.toBeVisible();

      // After removing should show "Add to cart" again
      await authenticatedInventoryItemPage.removeFromCart();
      await expect(authenticatedInventoryItemPage.addToCartButton).toBeVisible();
      await expect(authenticatedInventoryItemPage.removeButton).not.toBeVisible();
    });
  });
});
