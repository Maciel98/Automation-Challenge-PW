import { type Page, type Locator } from '@playwright/test';

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
 */
export class InventoryPage {
  readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryList: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navigation elements
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn'); // Hamburger menu button

    // Sorting
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    // Product list
    this.inventoryList = page.locator('[data-test="inventory-list"]');
  }

  /**
   * Navigate to the inventory page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.inventoryList.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Add a specific product to the cart by product ID
   * @param productId - The product ID (e.g., 'sauce-labs-backpack')
   */
  async addToCart(productId: string) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await addButton.waitFor({ state: 'visible', timeout: 5000 });
    await addButton.click();
  }

  /**
   * Remove a specific product from the cart by product ID
   * @param productId - The product ID (e.g., 'sauce-labs-backpack')
   */
  async removeFromCart(productId: string) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await removeButton.waitFor({ state: 'visible', timeout: 5000 });
    await removeButton.click();
  }

  /**
   * Navigate to the cart page
   */
  async navigateToCart() {
    await this.shoppingCartLink.click();
    await this.page.waitForURL(/\/cart\.html/, { timeout: 5000 });
  }

  /**
   * Sort products by the specified option
   * @param sortOption - The sort option to select
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(sortOption);
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
   * Get all product names displayed on the page
   */
  async getProductNames(): Promise<string[]> {
    const productNames = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return productNames;
  }

  /**
   * Get all product prices displayed on the page
   */
  async getProductPrices(): Promise<string[]> {
    const productPrices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return productPrices;
  }

  /**
   * Open the sidebar menu
   * @deprecated Use SidebarPage.open() instead
   */
  async openMenu() {
    await this.menuButton.click();
    await this.page.locator('.bm-menu').waitFor({ state: 'visible', timeout: 1000 });
    await this.page.waitForTimeout(500); // Wait for animation
  }

  /**
   * Logout via the sidebar menu
   * @deprecated Use SidebarPage.openAndLogout() instead
   */
  async logout() {
    await this.openMenu();
    await this.page.locator('[data-test="logout-sidebar-link"]').click();
    await this.page.waitForURL(/\/(index\.html)?$/, { timeout: 5000 });
  }
}
