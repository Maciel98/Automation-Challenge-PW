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
import checkoutCompleteData from '../../test-data/checkout-complete.json';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test Data Configuration
 *
 * Using product and customer data from test data JSON files for maintainability.
 * Environment variables for credentials keep sensitive data out of code.
 */
const STANDARD_USER = process.env.STANDARD_USER || 'standard_user';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'secret_sauce';

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
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    // Act: Login and add product to cart
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(STANDARD_USER, TEST_PASSWORD);
    await inventoryPage.addToCart(TEST_PRODUCT.id);

    // Navigate to checkout
    await inventoryPage.navbar.navigateToCart();

    // Verify cart has the product
    const cartItemCount = await inventoryPage.navbar.getCartBadgeCount();
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

    expect(subtotal).toBe(TEST_PRODUCT.price);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // Complete the order
    await checkoutStepTwoPage.finishOrder();

    // Assert: Verify order confirmation
    await checkoutCompletePage.isLoaded();
    const completeHeader = await checkoutCompletePage.getCompleteHeader();
    expect(completeHeader).toBe(checkoutCompleteData.labels.thankYouMessage);

    // Verify cart is cleared after order
    const finalCartCount = await checkoutCompletePage.navbar.getCartBadgeCount();
    expect(finalCartCount).toBe(0);
    await expect(checkoutCompletePage.navbar.shoppingCartBadge).not.toBeVisible();
  });
});
