import { test, expect } from '../../../fixtures/base.fixture';
import inventoryData from '../../../test-data/inventory.json';
import checkoutCompleteData from '../../../test-data/checkout-complete.json';

test.describe('Checkout Step Two - Overview @checkout', () => {
  test.describe('Price Calculations', () => {
    test('should verify subtotal, tax, and total calculations are correct @smoke @regression', async ({
      checkoutStepTwoPageReady,
    }) => {
      // CO2-002: Verify subtotal, tax, and total on overview - Calculations are correct
      const subtotal = await checkoutStepTwoPageReady.getSubtotal();
      const tax = await checkoutStepTwoPageReady.getTax();
      const total = await checkoutStepTwoPageReady.getTotal();

      // Verify: Total = Subtotal + Tax
      expect(total).toBeCloseTo(subtotal + tax, 2);
      expect(total).toBeGreaterThan(subtotal);
      expect(tax).toBeGreaterThan(0);
    });
  });

  test('should display all products information @regression', async ({ checkoutStepTwoPageWithTwoItems }) => {
    // Act
    const productNames = await checkoutStepTwoPageWithTwoItems.getProductNames();
    const productQuantities = await checkoutStepTwoPageWithTwoItems.getProductQuantities();
    const productPrices = await checkoutStepTwoPageWithTwoItems.getProductPrices();
    const itemCount = await checkoutStepTwoPageWithTwoItems.getItemCount();

    // Assert - verify each displayed product matches test data
    expect(itemCount).toBe(2);
    expect(productNames).toHaveLength(2);

    productNames.forEach((displayName, index) => {
      // Find this product in test data by name
      const expectedProduct = inventoryData.products.find(p => p.name === displayName);
      expect(expectedProduct).toBeDefined();

      // Verify quantity, price match test data
      expect(productQuantities[index]).toBe('1');
      expect(productPrices[index]).toBe(`$${expectedProduct!.price.toFixed(2)}`);
    });
  });

  test('should calculate subtotal correctly @regression', async ({ checkoutStepTwoPageReady }) => {
    const subtotal = await checkoutStepTwoPageReady.getSubtotal();
    expect(subtotal).toBe(inventoryData.products[0].price);
  });

  test('should calculate tax @regression', async ({ checkoutStepTwoPageReady }) => {
    const subtotal = await checkoutStepTwoPageReady.getSubtotal();
    const tax = await checkoutStepTwoPageReady.getTax();
    const total = await checkoutStepTwoPageReady.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('should cancel and return to inventory @regression', async ({ checkoutStepTwoPageReady, inventoryPage }) => {
    await checkoutStepTwoPageReady.cancel();

    await inventoryPage.isLoaded();
  });

  test('should finish order and navigate to complete page @smoke @regression', async ({ checkoutStepTwoPageReady, checkoutCompletePage }) => {
    await checkoutStepTwoPageReady.finishOrder();

    await checkoutCompletePage.isLoaded();
    await expect(checkoutStepTwoPageReady.pageTitle).toHaveText(checkoutCompleteData.labels.title);
  });
});
