import { test, expect } from '../../../fixtures/base.fixture';
import inventoryData from '../../../test-data/inventory.json';
import checkoutCompleteData from '../../../test-data/checkout-complete.json';
import checkoutStepTwoData from '../../../test-data/checkout-step-two.json';

test.describe('Checkout Step Two - Overview @checkout', () => {
  test.describe('Price Calculations', () => {
    test('should verify subtotal, tax, and total calculations are correct @smoke @regression', async ({
      checkoutStepTwoPageReady,
    }) => {

      // Get displayed values
      const actualSubtotal = await checkoutStepTwoPageReady.getSubtotal();
      const actualTax = await checkoutStepTwoPageReady.getTax();
      const actualTotal = await checkoutStepTwoPageReady.getTotal();

      // Get product names and calculate expected values
      const productNames = await checkoutStepTwoPageReady.getProductNames();

      let expectedSubtotal = 0;
      for (const name of productNames) {
        const product = inventoryData.products.find(p => p.name === name);
        expect(product).toBeDefined(); // Verify product exists in test data
        expectedSubtotal += product!.price;
      }

      // Calculate expected tax using tax rate from test data
      const expectedTax = expectedSubtotal * checkoutStepTwoData.taxRate;

      // Calculate expected total
      const expectedTotal = expectedSubtotal + expectedTax;

      // Verify exact calculations
      expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
      expect(actualTax).toBeCloseTo(expectedTax, 2);
      expect(actualTotal).toBeCloseTo(expectedTotal, 2);

      // Verify relationship: Total = Subtotal + Tax
      expect(actualTotal).toBeCloseTo(actualSubtotal + actualTax, 2);
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
