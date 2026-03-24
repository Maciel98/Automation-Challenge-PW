import { type Page, type Locator } from '@playwright/test';

/**
 * CheckoutStepTwoPage - Page Object for Checkout Overview Page
 *
 * Encapsulates all interactions for the second step of checkout:
 * reviewing order details, payment info, shipping info, and totals.
 * Follows POM best practices: intent-revealing methods, no assertions.
 */
export class CheckoutStepTwoPage {
  readonly page: Page;
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
  }

  /**
   * Navigate to the checkout step two page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-two.html');
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Complete the order and navigate to confirmation page
   */
  async finishOrder() {
    await this.finishButton.click();
    await this.page.waitForURL(/\/checkout-complete\.html/, { timeout: 5000 });
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancel() {
    await this.cancelButton.click();
    await this.page.waitForURL(/\/cart\.html/, { timeout: 5000 });
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
    const productNames = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return productNames;
  }

  /**
   * Get all product quantities in the order
   */
  async getProductQuantities(): Promise<string[]> {
    const quantities = await this.page.locator('[data-test="item-quantity"]').allTextContents();
    return quantities;
  }

  /**
   * Get all product prices in the order
   */
  async getProductPrices(): Promise<string[]> {
    const productPrices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return productPrices;
  }

  /**
   * Get the number of items in the order
   */
  async getItemCount(): Promise<number> {
    const items = await this.page.locator('[data-test="inventory-item"]').count();
    return items;
  }
}
