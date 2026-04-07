import { type Page, type Locator, expect } from '@playwright/test';
import { NavbarPage } from './navbar.page';

/**
 * InventoryPage - Page Object for SauceDemo.com Inventory Page
 *
 * Encapsulates all inventory interactions including browsing products,
 * adding items to cart, sorting, and navigation.
 * Follows POM best practices: intent-revealing methods, no assertions.
 *
 * Available products:
 * - Sauce Labs Backpack ($29.99)
 * - Sauce Labs Bike Light ($9.99)
 * - Sauce Labs Bolt T-Shirt ($15.99)
 * - Sauce Labs Fleece Jacket ($49.99)
 * - Sauce Labs Onesie ($7.99)
 * - Test.allTheThings() T-Shirt (Red) ($15.99)
 *
 * Navbar functionality (menu, cart) is provided by NavbarPage via composition.
 */
export class InventoryPage {
  readonly page: Page;
  readonly path = '/inventory.html';
  readonly url = /\/inventory\.html/;
  readonly navbar: NavbarPage;  // Composition: has-a NavbarPage
  readonly sortDropdown: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItemName: Locator;
  readonly inventoryItemPrice: Locator;
  readonly inventoryItem: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navbar composition for cart and menu access
    this.navbar = new NavbarPage(page);

    // Sorting
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Product list
    this.inventoryList = page.locator('[data-test="inventory-list"]');

    // Product item elements
    this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.inventoryItem = page.locator('[data-test="inventory-item"]');

    // Add to cart buttons (using starts-with for dynamic product IDs)
    this.addToCartButton = page.locator('[data-test^="add-to-cart-"]');
  }

  /**
   * Navigate to the inventory page
   */
  async goto() {
    await this.page.goto(this.path);
    await this.inventoryList.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verify we're on the inventory page
   */
  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await this.inventoryList.waitFor({ state: 'visible' });
  }

  /**
   * Add a specific product to the cart by product ID
   * @param productId - The product ID (e.g., 'sauce-labs-backpack')
   */
  async addToCart(productId: string) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await addButton.click();
  }

  /**
   * Remove a specific product from the cart by product ID
   * @param productId - The product ID (e.g., 'sauce-labs-backpack')
   */
  async removeFromCart(productId: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.click();
  }

  /**
   * Sort products by the specified option
   * @param sortOption - The sort option to select
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(sortOption);
  }

  /**
   * Get all product names displayed on the page
   */
  async getProductNames(): Promise<string[]> {
    return await this.inventoryItemName.allTextContents();
  }

  /**
   * Get all product prices displayed on the page
   */
  async getProductPrices(): Promise<string[]> {
    return await this.inventoryItemPrice.allTextContents();
  }

  /**
   * Get the count of products displayed on the page
   */
  async getProductCount(): Promise<number> {
    return await this.inventoryItem.count();
  }

  /**
   * Get the first available product ID from the inventory page
   * Uses the first "add to cart" button to determine product availability
   * @returns The product ID (e.g., 'sauce-labs-backpack')
   */
  async getFirstProductId(): Promise<string> {
    const firstAddButton = this.addToCartButton.first();
    const dataTestId = await firstAddButton.getAttribute('data-test');
    // Extract product ID from "add-to-cart-sauce-labs-backpack"
    return dataTestId?.replace('add-to-cart-', '') || '';
  }

  /**
   * Get the first N available product IDs from the inventory page
   * @param count - Number of product IDs to return
   * @returns Array of product IDs (capped at available items)
   */
  async getFirstProductIds(count: number): Promise<string[]> {
    const availableCount = await this.addToCartButton.count();
    const toGet = Math.min(count, availableCount);

    const ids: string[] = [];
    for (let i = 0; i < toGet; i++) {
      const button = this.addToCartButton.nth(i);
      const dataTestId = await button.getAttribute('data-test');
      const productId = dataTestId?.replace('add-to-cart-', '') || '';
      ids.push(productId);
    }
    return ids;
  }

  /**
   * Get the first product name from the inventory page
   * @returns The first product name
   */
  async getFirstProductName(): Promise<string> {
    const name = await this.inventoryItemName.first().textContent();
    return name?.trim() || '';
  }

  /**
   * Get product name by index
   * @param index - The index of the product (0-based)
   * @returns The product name at the specified index
   */
  async getProductNameByIndex(index: number): Promise<string> {
    const name = await this.inventoryItemName.nth(index).textContent();
    return name?.trim() || '';
  }

  /**
   * Click on the first product name to navigate to detail page
   */
  async clickFirstProductName() {
    await this.inventoryItemName.first().click();
  }

  /**
   * Click on product name by index to navigate to detail page
   * @param index - The index of the product (0-based)
   */
  async clickProductNameByIndex(index: number) {
    await this.inventoryItemName.nth(index).click();
  }
}
