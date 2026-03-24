import { type Page, type Locator } from '@playwright/test';

/**
 * CheckoutStepOnePage - Page Object for Checkout Information Page
 *
 * Encapsulates all interactions for the first step of checkout:
 * collecting user information (first name, last name, postal code).
 * Follows POM best practices: intent-revealing methods, no assertions.
 */
export class CheckoutStepOnePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Page elements
    this.pageTitle = page.locator('[data-test="title"]');

    // Form fields
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    // Action buttons
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.continueButton = page.locator('[data-test="continue"]');

    // Error message
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Navigate to the checkout step one page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Fill in the checkout form with user information
   * @param firstName - Customer first name
   * @param lastName - Customer last name
   * @param postalCode - Customer postal/zip code
   */
  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Submit the form and proceed to checkout overview
   */
  async continueToOverview() {
    await this.continueButton.click();
    await this.page.waitForURL(/\/checkout-step-two\.html/, { timeout: 5000 });
  }

  /**
   * Fill form and continue - convenience method for complete flow
   * @param firstName - Customer first name
   * @param lastName - Customer last name
   * @param postalCode - Customer postal/zip code
   */
  async fillInformationAndContinue(firstName: string, lastName: string, postalCode: string) {
    await this.fillInformation(firstName, lastName, postalCode);
    await this.continueToOverview();
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancel() {
    await this.cancelButton.click();
    await this.page.waitForURL(/\/cart\.html/, { timeout: 5000 });
  }

  /**
   * Get the error message text (if any)
   */
  async getErrorMessage(): Promise<string> {
    if (!(await this.errorMessage.isVisible().catch(() => false))) {
      return '';
    }
    const text = await this.errorMessage.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if an error message is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * Clear all form fields
   */
  async clearForm() {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.postalCodeInput.clear();
  }
}
