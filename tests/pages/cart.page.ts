import { type Page, type Locator, expect } from '@playwright/test';
import { NavbarPage } from './navbar.page';

/**
 * CartPage - Page Object for SauceDemo.com Cart Page
 *
 * Encapsulates all cart interactions including viewing items,
 * removing products, and proceeding to checkout.
 * Follows POM best practices: intent-revealing methods, no assertions.
 *
 * Navbar functionality (cart badge) is provided by NavbarPage via composition.
 */
export class CartPage {
  readonly page: Page;
  readonly path = '/cart.html';
  readonly url = /\/cart\.html/;
  readonly navbar: NavbarPage;  // Composition: has-a NavbarPage
  readonly pageTitle: Locator;
  readonly cartList: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly inventoryItemName: Locator;
  readonly itemQuantity: Locator;
  readonly inventoryItemPrice: Locator;
  readonly inventoryItem: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navbar composition
    this.navbar = new NavbarPage(page);

    // Header elements
    this.pageTitle = page.locator('[data-test="title"]');

    // Cart contents
    this.cartList = page.locator('[data-test="cart-list"]');

    // Action buttons
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');

    // Cart item elements
    this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');
  }

  /**
   * Navigate to the cart page
   */
  async goto() {
    await this.page.goto(this.path);
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verify we're on the cart page
   */
  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  /**
   * Remove a specific product from the cart by product ID
   * @param productId - The product ID (e.g., 'sauce-labs-backpack')
   */
  async removeProduct(productId: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.click();
  }

  /**
   * Continue shopping - navigate back to inventory
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Get all product names in the cart
   */
  async getProductNames(): Promise<string[]> {
    return await this.inventoryItemName.allTextContents();
  }

  /**
   * Get all product quantities in the cart
   */
  async getProductQuantities(): Promise<string[]> {
    return await this.itemQuantity.allTextContents();
  }

  /**
   * Get all product prices in the cart
   */
  async getProductPrices(): Promise<string[]> {
    return await this.inventoryItemPrice.allTextContents();
  }

  /**
   * Get the number of items in the cart
   */
  async getCartItemCount(): Promise<number> {
    return await this.inventoryItem.count();
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  /**
   * Get the first product name in the cart
   * @returns The first product name
   */
  async getFirstProductName(): Promise<string> {
    const name = await this.inventoryItemName.first().textContent();
    return name?.trim() || '';
  }
}
