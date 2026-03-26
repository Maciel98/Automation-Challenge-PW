import { type Page, type Locator } from '@playwright/test';
import { NavbarPage } from './navbar.page';

/**
 * SidebarPage - Page Object for SauceDemo.com Sidebar Menu
 *
 * Encapsulates all sidebar menu interactions including opening/closing the menu,
 * navigation, logout, and resetting app state.
 * Follows POM best practices: intent-revealing methods, no assertions.
 *
 * Menu Items:
 * - All Items - Navigates to inventory page
 * - About - Opens external saucelabs.com
 * - Logout - Logs out user
 * - Reset App State - Clears cart and resets filters
 */
export class SidebarPage {
  readonly page: Page;
  readonly navbar: NavbarPage;
  readonly closeButton: Locator;
  readonly sidebarContainer: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly menuItemList: Locator;
  readonly overlay: Locator;

  constructor(page: Page, navbar: NavbarPage) {
    this.page = page;
    this.navbar = navbar;

    // Sidebar controls (use IDs as data-test not available for buttons)
    this.closeButton = page.locator('#react-burger-cross-btn');

    // Sidebar container
    this.sidebarContainer = page.locator('.bm-menu');

    // Menu items (use data-test attributes for stability)
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');

    // Menu item list for getting all items
    this.menuItemList = page.locator('nav.bm-item-list a');

    // Overlay for closing sidebar by clicking outside
    this.overlay = page.locator('.bm-overlay');
  }

  /**
   * Open the sidebar menu
   * Delegates to navbar.openMenu() since hamburger button is on navbar
   * Waits for menu to become visible after animation
   */
  async open() {
    await this.navbar.openMenu();
  }

  /**
   * Close the sidebar menu
   */
  async close() {
    await this.closeButton.click();
    await this.sidebarContainer.waitFor({ state: 'hidden' });
  }

  /**
   * Check if sidebar menu is currently open
   */
  async isOpen(): Promise<boolean> {
    return await this.sidebarContainer.isVisible().catch(() => false);
  }

  /**
   * Navigate to "All Items" (inventory page)
   * Use this to refresh the inventory view
   */
  async navigateToAllItems() {
    await this.allItemsLink.click();
    // Stays on inventory page, just wait for navigation to settle
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to "About" (opens external saucelabs.com)
   * Navigates in the same tab (not a new page as documented)
   * Returns the current page after navigation
   */
  async navigateToAbout(): Promise<Page> {
    await this.aboutLink.click();
    // Wait for navigation to saucelabs.com to complete
    await this.page.waitForURL(/saucelabs\.com/, { timeout: 10000 });
    return this.page;
  }

  /**
   * Logout via the sidebar menu
   * Navigates to login page
   */
  async logout() {
    await this.logoutLink.click();
    await this.page.waitForURL(/\/(index\.html)?$/);
  }

  /**
   * Reset application state
   * Clears cart, resets filters, keeps user logged in
   */
  async resetAppState() {
    await this.resetAppStateLink.click();
    // State reset is instant, no wait needed
  }

  /**
   * Open sidebar and navigate to All Items
   * Convenience method for common workflow
   */
  async openAndNavigateToAllItems() {
    await this.open();
    await this.navigateToAllItems();
  }

  /**
   * Open sidebar and logout
   * Convenience method for common workflow
   */
  async openAndLogout() {
    await this.open();
    await this.logout();
  }

  /**
   * Open sidebar and reset app state
   * Convenience method for common workflow
   */
  async openAndResetAppState() {
    await this.open();
    await this.resetAppState();
  }

  /**
   * Open sidebar and navigate to About
   * Convenience method for common workflow
   * Returns the new page object
   */
  async openAndNavigateToAbout(): Promise<Page> {
    await this.open();
    return await this.navigateToAbout();
  }

  /**
   * Get the text content of all menu items
   * Useful for verification in tests
   */
  async getMenuItemsText(): Promise<string[]> {
    return await this.menuItemList.allTextContents();
  }

  /**
   * Get count of menu items visible
   */
  async getMenuItemCount(): Promise<number> {
    return await this.menuItemList.count();
  }

  /**
   * Check if specific menu item is visible
   * @param menuItem - The menu item locator to check
   */
  async isMenuItemVisible(menuItem: Locator): Promise<boolean> {
    return await menuItem.isVisible().catch(() => false);
  }

  /**
   * Close sidebar by clicking outside (on overlay)
   * Alternative method to close()
   */
  async closeByClickingOutside() {
    await this.overlay.click();
    await this.sidebarContainer.waitFor({ state: 'hidden' });
  }

  /**
   * Close sidebar by pressing Escape key
   * Alternative method to close()
   */
  async closeByPressingEscape() {
    await this.page.keyboard.press('Escape');
    await this.sidebarContainer.waitFor({ state: 'hidden' });
  }
}
