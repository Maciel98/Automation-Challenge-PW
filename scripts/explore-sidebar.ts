import { chromium, Page, Browser, Locator } from 'playwright';

async function exploreSidebarMenu() {
  const browser: Browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  console.log('🌐 Navigating to SauceDemo...');
  await page.goto('https://www.saucedemo.com/');

  console.log('🔐 Logging in with standard_user...');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');
  await page.waitForURL(/\/inventory\.html/, { timeout: 5000 });
  console.log('✅ Logged in successfully');

  // Wait for page to stabilize
  await page.waitForTimeout(1000);

  console.log('\n📸 Taking initial inventory page screenshot...');
  await page.screenshot({ path: 'docs/screenshots/sidebar-initial-inventory.png' });

  console.log('🍔 Exploring hamburger menu button...');
  const hamburgerButton = page.locator('#react-burger-menu-btn');

  // Get hamburger button details
  const isVisible = await hamburgerButton.isVisible();
  console.log(`  Hamburger button visible: ${isVisible}`);

  const boundingBox = await hamburgerButton.boundingBox();
  console.log(`  Position: x=${boundingBox?.x}, y=${boundingBox?.y}`);
  console.log(`  Size: width=${boundingBox?.width}, height=${boundingBox?.height}`);

  console.log('\n🖱️  Clicking hamburger menu to open sidebar...');
  await hamburgerButton.click();

  // Wait for sidebar to animate in
  await page.waitForTimeout(800);

  console.log('📸 Taking screenshot of open sidebar...');
  await page.screenshot({ path: 'docs/screenshots/sidebar-menu-open.png', fullPage: true });

  console.log('\n📋 Documenting sidebar structure...\n');

  // Get sidebar container
  const sidebar = page.locator('.bm-menu');

  // Find all menu items (anchors)
  console.log('🔗 Menu Items (Navigation Links):');
  const menuItems = await sidebar.locator('nav.bm-item-list a').all();
  const menuData: any[] = [];

  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i];
    const text = (await item.textContent())?.trim();
    const href = await item.getAttribute('href');
    const id = await item.getAttribute('id');
    const dataTest = await item.getAttribute('data-test');

    console.log(`\n  ${i + 1}. ${text}`);
    console.log(`     ID: ${id}`);
    console.log(`     data-test: ${dataTest}`);
    console.log(`     Href: ${href}`);

    menuData.push({
      index: i + 1,
      text,
      id,
      dataTest,
      href
    });
  }

  // Find all elements with data-test in sidebar
  console.log('\n\n🔍 Elements with data-test attributes in sidebar:');
  const elementsWithDataTest = await sidebar.locator('*[data-test]').all();
  const testDataElements: any[] = [];

  for (let i = 0; i < elementsWithDataTest.length; i++) {
    const element = elementsWithDataTest[i];
    const dataTest = await element.getAttribute('data-test');
    const tagName = await element.evaluate(el => el.tagName);
    const id = await element.getAttribute('id');
    const textContent = (await element.textContent())?.trim().substring(0, 60);

    console.log(`\n  ${i + 1}. <${tagName}>`);
    console.log(`     data-test: "${dataTest}"`);
    console.log(`     id: ${id || 'none'}`);
    console.log(`     text: ${textContent}`);

    testDataElements.push({
      index: i + 1,
      tag: tagName,
      dataTest,
      id,
      text: textContent
    });
  }

  // Document close button
  console.log('\n\n❌ Close Button Details:');
  const closeButton = page.locator('#react-burger-cross-btn');
  const closeVisible = await closeButton.isVisible();
  console.log(`  Close button visible: ${closeVisible}`);
  console.log(`  Close button ID: react-burger-cross-btn`);

  // Test navigation to each menu item
  console.log('\n\n🧪 Testing navigation for each menu item:\n');

  for (let i = 0; i < menuItems.length; i++) {
    const menuItem = menuData[i];

    // Reopen menu if needed
    const isMenuOpen = await sidebar.isVisible();
    if (!isMenuOpen) {
      await hamburgerButton.click();
      await page.waitForTimeout(800);
      // Get fresh reference
      const freshItems = await sidebar.locator('nav.bm-item-list a').all();
      await freshItems[i].click();
    } else {
      await menuItems[i].click();
    }

    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    console.log(`\n  ${i + 1}. Clicked "${menuItem.text}"`);
    console.log(`     Navigated to: ${currentUrl}`);

    // Take screenshot
    const filename = `docs/screenshots/sidebar-nav-${menuItem.text?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`     Screenshot: ${filename}`);

    // Go back to inventory for next test
    if (i < menuItems.length - 1) {
      await page.goto('https://www.saucedemo.com/inventory.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    }
  }

  // Generate YAML snapshot
  console.log('\n\n📄 Generating YAML snapshot...');

  const yamlContent = `
# SauceDemo Sidebar Menu Snapshot
# Generated: ${new Date().toISOString()}

sidebar_menu:
  container:
    selector: ".bm-menu"
    description: "Main sidebar menu container"

  hamburger_button:
    selector: "#react-burger-menu-btn"
    description: "Button to open/close the sidebar menu"
    type: "button"

  close_button:
    selector: "#react-burger-cross-btn"
    description: "X button to close the sidebar menu"
    type: "button"

  menu_items:
${menuData.map(item => `    - text: "${item.text}"
      id: "${item.id || 'N/A'}"
      data_test: "${item.dataTest || 'N/A'}"
      href: "${item.href}"
      selector: "nav.bm-item-list a[href="${item.href}"]"
`).join('\n')}

  all_data_test_elements:
${testDataElements.map(el => `    - tag: "${el.tag}"
      data_test: "${el.dataTest}"
      id: "${el.id || 'N/A'}"
      text: "${el.text?.replace(/"/g, '\\"')}"
      selector: '[data-test="${el.dataTest}"]'
`).join('\n')}

  navigation_flows:
${menuData.map(item => `    - from: "inventory"
      action: "click_menu_item"
      target: "${item.text}"
      expected_url: "**${item.href}"
`).join('\n')}
`;

  await page.context().close();
  await browser.close();

  return {
    menuData,
    testDataElements,
    yamlContent
  };
}

// Run exploration
exploreSidebarMenu()
  .then(result => {
    console.log('\n✨ Exploration complete!');

    // Save YAML snapshot
    const fs = require('fs');
    const snapshotPath = 'docs/snapshots/sidebar-menu.yaml';
    fs.writeFileSync(snapshotPath, result.yamlContent);
    console.log(`📄 YAML snapshot saved to: ${snapshotPath}`);

    // Save JSON data for reference
    const jsonPath = 'docs/snapshots/sidebar-menu-data.json';
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    console.log(`📊 JSON data saved to: ${jsonPath}`);

    console.log('\n📸 Screenshots saved to: docs/screenshots/sidebar-*.png');
    console.log('\n🎉 All documentation created successfully!');
  })
  .catch(error => {
    console.error('❌ Error during exploration:', error);
    process.exit(1);
  });
