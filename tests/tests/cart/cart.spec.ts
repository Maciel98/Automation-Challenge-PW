import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';

test.describe('Cart @cart', () => {
  test.describe('Cart Actions', () => {
    test('should proceed to checkout when clicking checkout button @smoke @regression', async ({
      cartWithItemPage,
      checkoutStepOnePage,
      page,
    }) => {
      // CRT-005: Click checkout button from cart - User navigates to checkout step one page
      await cartWithItemPage.proceedToCheckout();

      // Verify navigation to checkout step one
      await checkoutStepOnePage.isLoaded();
    });
  });

  test.describe('Cart Contents', () => {
    test('should display products added to cart @regression', async ({ cartWithItemPage }) => {
      const productNames = await cartWithItemPage.getProductNames();
      expect(productNames.length).toBeGreaterThan(0);
      expect(productNames[0]).toBe(inventoryData.products[0].name);
    });

    test('should show correct product count in cart @regression', async ({ cartWithItemPage }) => {
      const itemCount = await cartWithItemPage.getCartItemCount();
      expect(itemCount).toBe(1);
    });

    test('should remove item from cart @regression', async ({ cartWithItemPage }) => {
      const initialCount = await cartWithItemPage.getCartItemCount();
      expect(initialCount).toBe(1);

      await cartWithItemPage.removeProduct('sauce-labs-backpack');

      const finalCount = await cartWithItemPage.getCartItemCount();
      expect(finalCount).toBe(0);
    });
  });

  test.describe('Continue Shopping', () => {
    test('should navigate back to inventory when clicking continue shopping @regression', async ({
      cartWithItemPage,
      inventoryPage,
      page,
    }) => {
      await cartWithItemPage.continueShopping();

      // Verify navigation back to inventory
      await inventoryPage.isLoaded();
    });
  });
});
