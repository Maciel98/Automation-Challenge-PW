import { test, expect } from '../../../fixtures/base.fixture';
import inventoryData from '../../../test-data/inventory.json';
import checkoutStepOneData from '../../../test-data/checkout-step-one.json';

// Get test customer data from JSON
const TEST_CUSTOMER = checkoutStepOneData.testCustomer;

test.describe('Checkout Step One - Information', () => {
  test('should navigate to checkout step one', async ({ authenticatedInventoryPage, cartPage, checkoutStepOnePage, page }) => {
    await authenticatedInventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/\/checkout-step-one\.html/);
    await expect(checkoutStepOnePage.pageTitle).toHaveText(checkoutStepOneData.formLabels.title);
  });

  test('TC041: should require first name @smoke @checkout @validation @P0', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutStepOnePage,
  }) => {
    await authenticatedInventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.lastNameInput.fill(TEST_CUSTOMER.lastName);
    await checkoutStepOnePage.postalCodeInput.fill(TEST_CUSTOMER.postalCode);
    await checkoutStepOnePage.continueButton.click();

    const errorText = await checkoutStepOnePage.getErrorMessage();
    expect(errorText).toBe(checkoutStepOneData.errors.missingFirstName);
  });

  test('should require last name', async ({ authenticatedInventoryPage, cartPage, checkoutStepOnePage }) => {
    await authenticatedInventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.firstNameInput.fill(TEST_CUSTOMER.firstName);
    await checkoutStepOnePage.postalCodeInput.fill(TEST_CUSTOMER.postalCode);
    await checkoutStepOnePage.continueButton.click();

    const errorText = await checkoutStepOnePage.getErrorMessage();
    expect(errorText).toBe(checkoutStepOneData.errors.missingLastName);
  });

  test('should require postal code', async ({ authenticatedInventoryPage, cartPage, checkoutStepOnePage }) => {
    await authenticatedInventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.firstNameInput.fill(TEST_CUSTOMER.firstName);
    await checkoutStepOnePage.lastNameInput.fill(TEST_CUSTOMER.lastName);
    await checkoutStepOnePage.continueButton.click();

    const errorText = await checkoutStepOnePage.getErrorMessage();
    expect(errorText).toBe(checkoutStepOneData.errors.missingZipCode);
  });

  test('TC027: should proceed to checkout overview with valid information @smoke @checkout @P0', async ({
    authenticatedInventoryPage,
    cartPage,
    checkoutStepOnePage,
    page,
  }) => {
    await authenticatedInventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.fillInformationAndContinue(
      TEST_CUSTOMER.firstName,
      TEST_CUSTOMER.lastName,
      TEST_CUSTOMER.postalCode
    );

    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
  });

  test('should cancel and return to cart', async ({ authenticatedInventoryPage, cartPage, checkoutStepOnePage, page }) => {
    await authenticatedInventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await checkoutStepOnePage.cancel();

    await expect(page).toHaveURL(/\/cart\.html/);
  });
});
