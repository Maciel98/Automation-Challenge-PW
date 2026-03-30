/**
 * E2E Test Suite for SauceDemo
 *
 * This suite contains end-to-end tests that span multiple features
 * and verify complete user journeys through the application.
 *
 * Test Selection Rationale:
 * - Only true E2E tests that cross feature boundaries belong here
 * - Single-feature tests belong in their respective feature folders
 *
 * Tags:
 * @smoke - Critical path tests that should run on every commit
 * @E2E - End-to-end journey tests spanning multiple features
 * @P0 - Priority level 0 (highest priority)
 * @regression - Tests for regression prevention
 */

import { test, expect } from '../../fixtures/base.fixture';
import inventoryData from '../../test-data/inventory.json';
import checkoutStepOneData from '../../test-data/checkout-step-one.json';
import checkoutStepTwoData from '../../test-data/checkout-step-two.json';
import checkoutCompleteData from '../../test-data/checkout-complete.json';

/**
 * Test Data Configuration
 *
 * Using product and customer data from test data JSON files for maintainability.
 * Credentials are centralized in the LoginPage class.
 */

// Get first product from test data
const TEST_PRODUCT = inventoryData.products[0];

// Get test customer data from JSON
const TEST_CUSTOMER = checkoutStepOneData.testCustomer;

test.describe('E2E Critical Paths @E2E', () => {
  /**
   * E2E Complete Purchase Flow (Critical - P0)
   *
   * Verify the complete end-to-end purchase journey from login to order confirmation.
   * This test spans multiple features: authentication, product catalog, cart, and checkout.
   *
   * This is the only true E2E test in this suite because it:
   * - Crosses feature boundaries (auth, products, cart, checkout)
   * - Tests a complete user journey from start to finish
   * - Verifies integration between multiple components
   *
   * Other tests that focus on single features (login only, cart only, checkout only)
   * should be placed in their respective feature folders (auth/, product/, cart/, checkout/).
   *
   * Tags: @smoke @regression
   */
  test('User can complete full purchase flow @smoke @regression', async ({
    loginPage,
    inventoryPage,
    navbarPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    // Act: Login and add product to cart
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    await inventoryPage.addToCart(TEST_PRODUCT.id);

    // Navigate to checkout
    await navbarPage.navigateToCart();

    // Verify cart has the product
    const cartItemCount = await navbarPage.getCartBadgeCount();
    expect(cartItemCount).toBe(1);

    // Proceed through checkout flow
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillInformationAndContinue(
      TEST_CUSTOMER.firstName,
      TEST_CUSTOMER.lastName,
      TEST_CUSTOMER.postalCode
    );

    // Verify checkout overview
    await checkoutStepTwoPage.isLoaded();
    const productNames = await checkoutStepTwoPage.getProductNames();
    expect(productNames).toContain(TEST_PRODUCT.name);

    // Verify price calculations
    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const tax = await checkoutStepTwoPage.getTax();
    const total = await checkoutStepTwoPage.getTotal();

    // Calculate expected values
    const expectedSubtotal = TEST_PRODUCT.price;
    const expectedTax = expectedSubtotal * checkoutStepTwoData.taxRate;
    const expectedTotal = expectedSubtotal + expectedTax;

    // Verify calculations match expected values
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(tax).toBeCloseTo(expectedTax, 2);
    expect(total).toBeCloseTo(expectedTotal, 2);

    // Verify relationship: Total = Subtotal + Tax
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Complete the order
    await checkoutStepTwoPage.finishOrder();

    // Assert: Verify order confirmation
    await checkoutCompletePage.isLoaded();
    const completeHeader = await checkoutCompletePage.getCompleteHeader();
    expect(completeHeader).toBe(checkoutCompleteData.labels.thankYouMessage);

    // Verify cart is cleared after order
    const finalCartCount = await navbarPage.getCartBadgeCount();
    expect(finalCartCount).toBe(0);
    await expect(navbarPage.shoppingCartBadge).not.toBeVisible();
  });

  /**
   * E2E Complete Checkout with Multiple Items (Regression - P1)
   *
   * Verify correct totals calculation for multiple items during checkout.
   * Tests that subtotal, tax, and total are calculated accurately across multiple products.
   *
   * This is an E2E regression test because it:
   * - Crosses feature boundaries (auth, products, cart, checkout)
   * - Tests a critical calculation path (totals with tax)
   * - Verifies order completion with cart state changes
   *
   * Tags: @regression
   */
  test('User can complete checkout with multiple items @regression', async ({
    loginPage,
    inventoryPage,
    navbarPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    // Arrange: Select 3 products from test data
    const TEST_PRODUCTS = inventoryData.products.slice(0, 3);

    // Calculate expected totals
    const expectedSubtotal = TEST_PRODUCTS.reduce(
      (sum, product) => sum + product.price,
      0
    );
    const taxRate = checkoutStepTwoData.taxRate;
    const expectedTax = expectedSubtotal * taxRate;
    const expectedTotal = expectedSubtotal + expectedTax;

    // Act: Login and add multiple products to cart
    await loginPage.goto();
    await loginPage.loginWithDefaults();

    // Add each product to cart
    for (const product of TEST_PRODUCTS) {
      await inventoryPage.addToCart(product.id);
    }

    // Navigate to checkout
    await navbarPage.navigateToCart();

    // Verify cart has all products
    const cartItemCount = await navbarPage.getCartBadgeCount();
    expect(cartItemCount).toBe(TEST_PRODUCTS.length);

    // Proceed through checkout flow
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillInformationAndContinue(
      TEST_CUSTOMER.firstName,
      TEST_CUSTOMER.lastName,
      TEST_CUSTOMER.postalCode
    );

    // Assert: Verify checkout overview with all products
    await checkoutStepTwoPage.isLoaded();
    const productNames = await checkoutStepTwoPage.getProductNames();
    for (const product of TEST_PRODUCTS) {
      expect(productNames).toContain(product.name);
    }

    // Verify price calculations for multiple items
    const actualSubtotal = await checkoutStepTwoPage.getSubtotal();
    const actualTax = await checkoutStepTwoPage.getTax();
    const actualTotal = await checkoutStepTwoPage.getTotal();

    // Verify calculations match expected values
    expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(actualTax).toBeCloseTo(expectedTax, 2);
    expect(actualTotal).toBeCloseTo(expectedTotal, 2);

    // Verify relationship: Total = Subtotal + Tax
    expect(actualTotal).toBeCloseTo(actualSubtotal + actualTax, 2);

    // Complete the order
    await checkoutStepTwoPage.finishOrder();

    // Assert: Verify order confirmation
    await checkoutCompletePage.isLoaded();
    const completeHeader = await checkoutCompletePage.getCompleteHeader();
    expect(completeHeader).toBe(checkoutCompleteData.labels.thankYouMessage);

    // Verify cart is cleared after order
    const finalCartCount = await navbarPage.getCartBadgeCount();
    expect(finalCartCount).toBe(0);
    await expect(navbarPage.shoppingCartBadge).not.toBeVisible();
  });
});
