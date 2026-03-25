import { test, expect } from '../../../fixtures/base.fixture';
import checkoutCompleteData from '../../../test-data/checkout-complete.json';

test.describe('Checkout Complete @checkout', () => {
  test('TC031: should display thank you message @smoke @regression', async ({ checkoutCompletePageReady }) => {
    const completeHeader = await checkoutCompletePageReady.getCompleteHeader();
    expect(completeHeader).toBe(checkoutCompleteData.labels.thankYouMessage);
  });

  test('should display dispatch message @regression', async ({ checkoutCompletePageReady }) => {
    const dispatchMessage = await checkoutCompletePageReady.getCompleteText();
    expect(dispatchMessage).toBe(checkoutCompleteData.labels.dispatchMessage);
  });

  test('TC032: should clear cart after order completion @smoke @regression', async ({ checkoutCompletePageReady }) => {
    const cartCount = await checkoutCompletePageReady.navbar.getCartBadgeCount();
    expect(cartCount).toBe(0);
  });

  test('should navigate back to inventory @regression', async ({ checkoutCompletePageReady, page }) => {
    await checkoutCompletePageReady.backToProducts();

    await expect(page).toHaveURL(/\/inventory\.html/);
  });
});
