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

  test('should display product information @regression', async ({ checkoutStepTwoPageReady }) => {
    const productNames = await checkoutStepTwoPageReady.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    expect(productNames[0]).toBe(inventoryData.products[0].name);
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
