import { chromium } from 'playwright';

async function captureResetAppState() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage();

  console.log('🌐 Navigating to SauceDemo...');
  await page.goto('https://www.saucedemo.com/');

  console.log('🔐 Logging in...');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  await page.waitForURL(/\/inventory\.html/);

  console.log('🛒 Adding item to cart...');
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.waitForTimeout(500);

  console.log('📸 Screenshot 1: Cart with item added...');
  await page.screenshot({ path: 'docs/screenshots/sidebar-reset-01-cart-with-item.png' });

  console.log('🍔 Opening hamburger menu...');
  await page.click('#react-burger-menu-btn');
  await page.waitForTimeout(800);

  console.log('📸 Screenshot 2: Menu open with cart badge visible...');
  await page.screenshot({ path: 'docs/screenshots/sidebar-reset-02-menu-open.png', fullPage: true });

  console.log('🔄 Clicking Reset App State...');
  await page.click('[data-test="reset-sidebar-link"]');
  await page.waitForTimeout(1000);

  console.log('📸 Screenshot 3: After reset (cart should be empty)...');
  await page.screenshot({ path: 'docs/screenshots/sidebar-reset-03-after-reset.png' });

  // Verify cart is cleared
  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  const isBadgeVisible = await cartBadge.isVisible();
  console.log(`\n✅ Cart badge visible after reset: ${isBadgeVisible}`);

  // Verify button changed back to "Add to Cart"
  const addToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
  const isAddButtonVisible = await addToCartButton.isVisible();
  console.log(`✅ Add to Cart button visible: ${isAddButtonVisible}`);

  await browser.close();
  console.log('\n✨ Screenshots captured successfully!');
}

captureResetAppState().catch(console.error);
