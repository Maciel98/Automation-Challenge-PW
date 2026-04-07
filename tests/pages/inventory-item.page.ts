import { type Page, type Locator, expect } from '@playwright/test';
import { InventoryPage } from './inventory.page';

/**
 * InventoryItemPage - Page Object for SauceDemo.com Product Detail Page
 *
 * Encapsulates all product detail interactions including viewing details,
 * adding/removing from cart, and navigation back to inventory.
 * Follows POM best practices: intent-revealing methods, no assertions.
 *
 * Access: Navigate from inventory page by clicking product name or image
 * URL Pattern: /inventory-item.html?id={numeric_id} (ids 0-5)
 */
export class InventoryItemPage {
  readonly page: Page;
  readonly path = '/inventory-item.html';
  readonly url = /\/inventory-item\.html\?id=\d+/;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Product information elements
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productImage = page.locator('.inventory_details_img');

    // Action buttons
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Navigate to a specific product detail page by numeric ID
   * @param productId - Numeric product ID (0-5)
   */
  async goto(productId: number) {
    await this.page.goto(`${this.path}?id=${productId}`);
    await this.isLoaded();
  }

  /**
   * Verify we're on the inventory item detail page
   */
  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    // Wait for product name as anchor element indicating page is ready
    await this.productName.waitFor({ state: 'visible' });
  }

  /**
   * Get the product name displayed on the detail page
   */
  async getProductName(): Promise<string> {
    const name = await this.productName.textContent();
    return name?.trim() || '';
  }

  /**
   * Get the product description
   */
  async getProductDescription(): Promise<string> {
    const desc = await this.productDescription.textContent();
    return desc?.trim() || '';
  }

  /**
   * Get the product price
   */
  async getProductPrice(): Promise<string> {
    const price = await this.productPrice.textContent();
    return price?.trim() || '';
  }

  /**
   * Add the current product to cart
   */
  async addToCart() {
    await this.addToCartButton.click();
    // Wait for remove button to appear indicating add was successful
    await this.removeButton.waitFor({ state: 'visible' });
  }

  /**
   * Remove the current product from cart
   */
  async removeFromCart() {
    await this.removeButton.click();
    // Wait for add to cart button to appear indicating remove was successful
    await this.addToCartButton.waitFor({ state: 'visible' });
  }

  /**
   * Check if the product is currently in cart (remove button is visible)
   */
  async isInCart(): Promise<boolean> {
    return await this.removeButton.isVisible().catch(() => false);
  }

  /**
   * Navigate back to the inventory page
   * @returns Instance of InventoryPage for chaining
   */
  async backToProducts(): Promise<InventoryPage> {
    await this.backToProductsButton.click();
    await this.page.waitForURL('**/inventory.html');
    return new InventoryPage(this.page);
  }

  /**
   * Extract the product ID from the current URL
   */
  async getProductIdFromUrl(): Promise<number | null> {
    const url = this.page.url();
    const match = url.match(/id=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }
}
