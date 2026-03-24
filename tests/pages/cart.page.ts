import { type Page, type Locator } from '@playwright/test';

/**
 * CartPage - Page Object for SauceDemo.com Cart Page
 *
 * Encapsulates all cart interactions including viewing items,
 * removing products, and proceeding to checkout.
 * Follows POM best practices: intent-revealing methods, no assertions.
 */
export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly cartList: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Header elements
    this.pageTitle = page.locator('[data-test="title"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');

    // Cart contents
    this.cartList = page.locator('[data-test="cart-list"]');

    // Action buttons
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Navigate to the cart page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Remove a specific product from the cart by product ID
   * @param productId - The product ID (e.g., 'sauce-labs-backpack')
   */
  async removeProduct(productId: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.waitFor({ state: 'visible', timeout: 5000 });
    await removeButton.click();
  }

  /**
   * Continue shopping - navigate back to inventory
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.page.waitForURL(/\/inventory\.html/, { timeout: 5000 });
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL(/\/checkout-step-one\.html/, { timeout: 5000 });
  }

  /**
   * Get the cart badge count
   */
  async getCartBadgeCount(): Promise<number> {
    if (!(await this.shoppingCartBadge.isVisible().catch(() => false))) {
      return 0;
    }
    const text = await this.shoppingCartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Get all product names in the cart
   */
  async getProductNames(): Promise<string[]> {
    const productNames = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return productNames;
  }

  /**
   * Get all product quantities in the cart
   */
  async getProductQuantities(): Promise<string[]> {
    const quantities = await this.page.locator('[data-test="item-quantity"]').allTextContents();
    return quantities;
  }

  /**
   * Get all product prices in the cart
   */
  async getProductPrices(): Promise<string[]> {
    const productPrices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return productPrices;
  }

  /**
   * Get the number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    const items = await this.page.locator('[data-test="inventory-item"]').count();
    return items;
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }
}
