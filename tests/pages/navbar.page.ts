import { type Page, type Locator } from '@playwright/test';

/**
 * NavbarPage - Page Object for SauceDemo.com Navigation Bar
 *
 * Encapsulates all navbar interactions that appear on authenticated pages
 * (inventory, cart, checkout pages). Includes hamburger menu, shopping cart,
 * and cart badge functionality.
 * Follows POM best practices: intent-revealing methods, no assertions.
 *
 * Elements:
 * - Primary header container
 * - Hamburger menu button (opens sidebar)
 * - Shopping cart link (navigates to cart)
 * - Shopping cart badge (shows item count, conditional visibility)
 */
export class NavbarPage {
  readonly page: Page;
  readonly primaryHeader: Locator;
  readonly hamburgerButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    // Primary header container
    this.primaryHeader = page.locator('[data-test="primary-header"]');

    // Hamburger menu button (uses ID as data-test not available)
    this.hamburgerButton = page.locator('#react-burger-menu-btn');

    // Shopping cart
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Open the sidebar menu by clicking hamburger button
   * Waits for menu to become visible after animation
   * Note: Consider using SidebarPage.open() for full sidebar interactions
   */
  async openMenu() {
    await this.hamburgerButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.hamburgerButton.click();
    // Wait for sidebar slide-in animation
    await this.page.locator('.bm-menu').waitFor({ state: 'visible', timeout: 1000 });
    await this.page.waitForTimeout(500); // Wait for animation
  }

  /**
   * Navigate to the shopping cart page
   */
  async navigateToCart() {
    await this.shoppingCartLink.click();
    await this.page.waitForURL(/\/cart\.html/, { timeout: 5000 });
  }

  /**
   * Get the current cart badge count
   * Returns 0 if badge is not visible (empty cart)
   */
  async getCartBadgeCount(): Promise<number> {
    if (!(await this.shoppingCartBadge.isVisible().catch(() => false))) {
      return 0;
    }
    const text = await this.shoppingCartBadge.textContent();
    return parseInt(text || '0', 10);
  }

  /**
   * Check if the cart badge is visible
   * Badge is hidden when cart is empty
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.shoppingCartBadge.isVisible().catch(() => false);
  }

  /**
   * Check if the primary header is visible
   * Useful for verifying navbar is loaded
   */
  async isPrimaryHeaderVisible(): Promise<boolean> {
    return await this.primaryHeader.isVisible().catch(() => false);
  }

  /**
   * Check if hamburger button is visible
   */
  async isHamburgerButtonVisible(): Promise<boolean> {
    return await this.hamburgerButton.isVisible().catch(() => false);
  }

  /**
   * Check if shopping cart link is visible
   */
  async isShoppingCartLinkVisible(): Promise<boolean> {
    return await this.shoppingCartLink.isVisible().catch(() => false);
  }

  /**
   * Wait for navbar to be fully loaded
   */
  async waitForNavbar() {
    await this.primaryHeader.waitFor({ state: 'visible', timeout: 5000 });
  }
}
