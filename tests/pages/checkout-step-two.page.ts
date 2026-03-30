import { type Page, type Locator, expect } from '@playwright/test';

/**
 * CheckoutStepTwoPage - Page Object for Checkout Overview Page
 *
 * Encapsulates all interactions for the second step of checkout:
 * reviewing order details, payment info, shipping info, and totals.
 * Follows POM best practices: intent-revealing methods, no assertions.
 */
export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly path = '/checkout-step-two.html';
  readonly url = /\/checkout-step-two\.html/;
  readonly pageTitle: Locator;
  readonly checkoutSummaryContainer: Locator;
  readonly cartList: Locator;
  readonly paymentInfoLabel: Locator;
  readonly paymentInfoValue: Locator;
  readonly shippingInfoLabel: Locator;
  readonly shippingInfoValue: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly inventoryItemName: Locator;
  readonly itemQuantity: Locator;
  readonly inventoryItemPrice: Locator;
  readonly inventoryItem: Locator;

  constructor(page: Page) {
    this.page = page;
    // Page elements
    this.pageTitle = page.locator('[data-test="title"]');
    this.checkoutSummaryContainer = page.locator('[data-test="checkout-summary-container"]');
    this.cartList = page.locator('[data-test="cart-list"]');

    // Payment and shipping info
    this.paymentInfoLabel = page.locator('[data-test="payment-info-label"]');
    this.paymentInfoValue = page.locator('[data-test="payment-info-value"]');
    this.shippingInfoLabel = page.locator('[data-test="shipping-info-label"]');
    this.shippingInfoValue = page.locator('[data-test="shipping-info-value"]');

    // Price totals
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');

    // Action buttons
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Order item elements
    this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Navigate to the checkout step two page
   */
  async goto() {
    await this.page.goto(this.path);
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verify we're on the checkout step two page
   */
  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  /**
   * Complete the order and navigate to confirmation page
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Cancel checkout and return to inventory
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Get the payment information value
   */
  async getPaymentInfo(): Promise<string> {
    const text = await this.paymentInfoValue.textContent();
    return text?.trim() || '';
  }

  /**
   * Get the shipping information value
   */
  async getShippingInfo(): Promise<string> {
    const text = await this.shippingInfoValue.textContent();
    return text?.trim() || '';
  }

  /**
   * Get the subtotal amount (extracts numeric value)
   */
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.textContent();
    const match = text?.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the tax amount (extracts numeric value)
   */
  async getTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    const match = text?.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get the total amount (extracts numeric value)
   */
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    const match = text?.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get all product names in the order
   */
  async getProductNames(): Promise<string[]> {
    return await this.inventoryItemName.allTextContents();
  }

  /**
   * Get all product quantities in the order
   */
  async getProductQuantities(): Promise<string[]> {
    return await this.itemQuantity.allTextContents();
  }

  /**
   * Get all product prices in the order
   */
  async getProductPrices(): Promise<string[]> {
    return await this.inventoryItemPrice.allTextContents();
  }

  /**
   * Get the number of items in the order
   */
  async getItemCount(): Promise<number> {
    return await this.inventoryItem.count();
  }
}
