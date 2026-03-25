import { test, expect } from '../../../fixtures/base.fixture';
import inventoryData from '../../../test-data/inventory.json';
import checkoutStepOneData from '../../../test-data/checkout-step-one.json';
import checkoutCompleteData from '../../../test-data/checkout-complete.json';
import dotenv from 'dotenv';

dotenv.config();

// Get test customer data from JSON
const TEST_CUSTOMER = checkoutStepOneData.testCustomer;

test.describe('Checkout Step Two - Overview', () => {
  const standardUser = process.env.STANDARD_USER || 'standard_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  test.beforeEach(async ({ loginPage, inventoryPage, cartPage, checkoutStepOnePage }) => {
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
  });

  test('should display product information', async ({ checkoutStepTwoPage }) => {
    const productNames = await checkoutStepTwoPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    expect(productNames[0]).toBe(inventoryData.products[0].name);
  });

  test('should calculate subtotal correctly', async ({ checkoutStepTwoPage }) => {
    const subtotal = await checkoutStepTwoPage.getSubtotal();
    expect(subtotal).toBe(inventoryData.products[0].price);
  });

  test('should calculate tax', async ({ checkoutStepTwoPage }) => {
    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const tax = await checkoutStepTwoPage.getTax();
    const total = await checkoutStepTwoPage.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('should cancel and return to inventory', async ({ checkoutStepTwoPage, page }) => {
    await checkoutStepTwoPage.cancel();

    await expect(page).toHaveURL(/\/inventory\.html/);
  });

  test('should finish order and navigate to complete page', async ({
    checkoutStepTwoPage,
    checkoutCompletePage,
    page,
  }) => {
    await checkoutStepTwoPage.finishOrder();

    await expect(page).toHaveURL(/\/checkout-complete\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText(checkoutCompleteData.labels.title);
  });
});
