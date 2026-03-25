import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two.page';
import dotenv from 'dotenv';

dotenv.config();

const STANDARD_USER = process.env.STANDARD_USER || 'standard_user';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'secret_sauce';
const TEST_CUSTOMER = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '12345'
};

/**
 * Parameterized helper to set up checkout with any number of items
 * Use this in fixtures to create pre-configured checkout scenarios
 *
 * @param page - Playwright page object
 * @param itemCount - Number of products to add to cart
 * @returns CheckoutStepTwoPage ready for testing
 *
 * @example
 * ```typescript
 * checkoutStepTwoPageWithTwoItems: async ({ page }, use) => {
 *   const checkoutPage = await setupCheckoutWithItems(page, 2);
 *   await use(checkoutPage);
 * },
 * ```
 */
export async function setupCheckoutWithItems(
  page: Page,
  itemCount: number
): Promise<CheckoutStepTwoPage> {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

  // Login
  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(STANDARD_USER, TEST_PASSWORD);

  // Add specified number of items
  const productIds = await inventoryPage.getFirstProductIds(itemCount);
  for (const id of productIds) {
    await inventoryPage.addToCart(id);
  }

  // Navigate to checkout step two
  await inventoryPage.navbar.navigateToCart();
  await cartPage.proceedToCheckout();
  await checkoutStepOnePage.fillInformationAndContinue(
    TEST_CUSTOMER.firstName,
    TEST_CUSTOMER.lastName,
    TEST_CUSTOMER.postalCode
  );

  return checkoutStepTwoPage;
}
