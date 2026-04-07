import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { NavbarPage } from '../pages/navbar.page';
import { SidebarPage } from '../pages/sidebar.page';
import { InventoryPage } from '../pages/inventory.page';
import { InventoryItemPage } from '../pages/inventory-item.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';
import { setupCheckoutWithItems } from '../helpers/checkout-setup';

/**
 * Type definition for our custom fixtures
 */
type MyFixtures = {
  loginPage: LoginPage;
  navbarPage: NavbarPage;
  sidebarPage: SidebarPage;
  inventoryPage: InventoryPage;
  inventoryItemPage: InventoryItemPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  authenticatedInventoryPage: InventoryPage;
  cartWithItemPage: CartPage;
  checkoutStepOnePageWithData: CheckoutStepOnePage;
  checkoutStepTwoPageReady: CheckoutStepTwoPage;
  checkoutStepTwoPageWithTwoItems: CheckoutStepTwoPage;
  checkoutCompletePageReady: CheckoutCompletePage;
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
   * SidebarPage fixture
   * Automatically creates a new SidebarPage instance for each test
   * Requires navbarPage as dependency since hamburger button is on navbar
   */
  sidebarPage: async ({ page, navbarPage }, use) => {
    await use(new SidebarPage(page, navbarPage));
  },

  /**
   * InventoryPage fixture
   * Automatically creates a new InventoryPage instance for each test
   */
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  /**
   * InventoryItemPage fixture
   * Automatically creates a new InventoryItemPage instance for each test
   */
  inventoryItemPage: async ({ page }, use) => {
    await use(new InventoryItemPage(page));
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

  /**
   * Authenticated InventoryPage fixture
   * Automatically logs in and navigates to inventory page
   * Use this for tests that require an authenticated session
   */
  authenticatedInventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * CartPage with item fixture
   * Automatically logs in, adds product to cart, and navigates to cart
   * Use this for tests that operate on a cart with items
   */
  cartWithItemPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.loginWithDefaults();
    const firstProductId = await inventoryPage.getFirstProductId();
    await inventoryPage.addToCart(firstProductId);
    await inventoryPage.navbar.navigateToCart();

    await use(cartPage);
  },

  /**
   * CheckoutStepOnePage with data fixture
   * Automatically logs in, adds product, and navigates to checkout step one
   * Use this for tests that operate on the checkout information form
   */
  checkoutStepOnePageWithData: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);

    await loginPage.goto();
    await loginPage.loginWithDefaults();
    const firstProductId = await inventoryPage.getFirstProductId();
    await inventoryPage.addToCart(firstProductId);
    await inventoryPage.navbar.navigateToCart();
    await cartPage.proceedToCheckout();

    await use(checkoutStepOnePage);
  },

  /**
   * CheckoutStepTwoPage ready fixture
   * Automatically logs in, adds 1 product, fills checkout info, and navigates to checkout step two
   * Use this for tests that operate on the checkout overview page
   */
  checkoutStepTwoPageReady: async ({ page }, use) => {
    const checkoutPage = await setupCheckoutWithItems(page, 1);
    await use(checkoutPage);
  },

  /**
   * CheckoutStepTwoPage with 2 items fixture
   * Automatically logs in, adds 2 products, fills checkout info, and navigates to checkout step two
   * Use this for tests that validate multiple product handling
   */
  checkoutStepTwoPageWithTwoItems: async ({ page }, use) => {
    const checkoutPage = await setupCheckoutWithItems(page, 2);
    await use(checkoutPage);
  },

  /**
   * CheckoutCompletePage ready fixture
   * Automatically completes full checkout flow and navigates to confirmation page
   * Use this for tests that operate on the order confirmation page
   */
  checkoutCompletePageReady: async ({ page }, use) => {
    const checkoutStepTwoPage = await setupCheckoutWithItems(page, 1);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    await checkoutStepTwoPage.finishOrder();
    await use(checkoutCompletePage);
  },
});

/**
 * Re-export expect from @playwright/test
 * Use this in your tests:
 * import { test, expect } from '../fixtures/base.fixture';
 */
export { expect } from '@playwright/test';
