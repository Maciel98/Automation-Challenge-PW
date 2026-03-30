import { type Page, type Locator, expect } from '@playwright/test';
import { NavbarPage } from './navbar.page';

/**
 * CheckoutCompletePage - Page Object for Checkout Completion Page
 *
 * Encapsulates all interactions for the order confirmation page.
 * Follows POM best practices: intent-revealing methods, no assertions.
 *
 * Navbar functionality is provided by NavbarPage via composition.
 */
export class CheckoutCompletePage {
  readonly page: Page;
  readonly path = '/checkout-complete.html';
  readonly url = /\/checkout-complete\.html/;
  readonly navbar: NavbarPage;  // Composition: has-a NavbarPage
  readonly pageTitle: Locator;
  readonly checkoutCompleteContainer: Locator;
  readonly ponyExpressImage: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Navbar composition
    this.navbar = new NavbarPage(page);

    // Page elements
    this.pageTitle = page.locator('[data-test="title"]');
    this.checkoutCompleteContainer = page.locator('[data-test="checkout-complete-container"]');
    this.ponyExpressImage = page.locator('[data-test="pony-express"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');

    // Navigation
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Navigate to the checkout complete page
   */
  async goto() {
    await this.page.goto(this.path);
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Verify we're on the checkout complete page
   */
  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  /**
   * Return to the inventory page (back home)
   */
  async backToProducts() {
    await this.backToProductsButton.click();
  }

  /**
   * Get the complete header text
   */
  async getCompleteHeader(): Promise<string> {
    const text = await this.completeHeader.textContent();
    return text?.trim() || '';
  }

  /**
   * Get the complete message text
   */
  async getCompleteText(): Promise<string> {
    const text = await this.completeText.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if the pony express image is visible
   */
  async isPonyExpressImageVisible(): Promise<boolean> {
    return await this.ponyExpressImage.isVisible().catch(() => false);
  }
}
