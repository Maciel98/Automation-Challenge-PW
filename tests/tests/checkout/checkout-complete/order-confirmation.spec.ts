import { test, expect } from '../../../fixtures/base.fixture';
import inventoryData from '../../../test-data/inventory.json';
import checkoutStepOneData from '../../../test-data/checkout-step-one.json';
import checkoutCompleteData from '../../../test-data/checkout-complete.json';
import dotenv from 'dotenv';

dotenv.config();

// Get test customer data from JSON
const TEST_CUSTOMER = checkoutStepOneData.testCustomer;

test.describe('Checkout Complete', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.beforeEach(async ({ loginPage, inventoryPage, cartPage, checkoutStepOnePage, checkoutStepTwoPage }) => {
    await loginPage.goto();
    await loginPage.loginAndWaitForDashboard(standardUser, password);
    await inventoryPage.addToCart(inventoryData.products[0].id);
    await inventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutStepOnePage.fillInformationAndContinue(
      TEST_CUSTOMER.firstName,
      TEST_CUSTOMER.lastName,
      TEST_CUSTOMER.postalCode
    );
    await checkoutStepTwoPage.finishOrder();
  });

  test('should display thank you message', async ({ checkoutCompletePage }) => {
    const completeHeader = await checkoutCompletePage.getCompleteHeader();
    expect(completeHeader).toBe(checkoutCompleteData.labels.thankYouMessage);
  });

  test('should display dispatch message', async ({ page }) => {
    const dispatchMessage = await page.locator('[data-test="complete-text"]').textContent();
    expect(dispatchMessage).toBe(checkoutCompleteData.labels.dispatchMessage);
  });

  test('should clear cart after order completion', async ({ checkoutCompletePage }) => {
    const cartCount = await checkoutCompletePage.navbar.getCartBadgeCount();
    expect(cartCount).toBe(0);
  });

  test('should navigate back to inventory', async ({ checkoutCompletePage, page }) => {
    await checkoutCompletePage.backToProducts();

    await expect(page).toHaveURL(/\/inventory\.html/);
  });
});
