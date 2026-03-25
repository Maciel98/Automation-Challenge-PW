import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { NavbarPage } from '../pages/navbar.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';

/**
 * Type definition for our custom fixtures
 */
type MyFixtures = {
  loginPage: LoginPage;
  navbarPage: NavbarPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
};

/**
 * Extended test with custom fixtures
 *
 * This provides dependency injection for page objects, making tests cleaner
 * and easier to maintain. Each fixture automatically creates a new instance
 * of the page object for each test.
 */
export const test = base.extend<MyFixtures>({
  /**
   * LoginPage fixture
   * Automatically creates a new LoginPage instance for each test
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * NavbarPage fixture
   * Automatically creates a new NavbarPage instance for each test
   */
  navbarPage: async ({ page }, use) => {
    await use(new NavbarPage(page));
  },

  /**
   * InventoryPage fixture
   * Automatically creates a new InventoryPage instance for each test
   */
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  /**
   * CartPage fixture
   * Automatically creates a new CartPage instance for each test
   */
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  /**
   * CheckoutStepOnePage fixture
   * Automatically creates a new CheckoutStepOnePage instance for each test
   */
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },

  /**
   * CheckoutStepTwoPage fixture
   * Automatically creates a new CheckoutStepTwoPage instance for each test
   */
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },

  /**
   * CheckoutCompletePage fixture
   * Automatically creates a new CheckoutCompletePage instance for each test
   */
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

/**
 * Re-export expect from @playwright/test
 * Use this in your tests:
 * import { test, expect } from '../fixtures/base.fixture';
 */
export { expect } from '@playwright/test';
