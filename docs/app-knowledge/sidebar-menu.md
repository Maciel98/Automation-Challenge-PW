# Sidebar Menu (Hamburger Menu)

**Page Component:** Left Sidebar Navigation Menu
**Accessed From:** Any authenticated page (Inventory, Cart, Checkout)
**Trigger:** Hamburger menu button (three horizontal lines icon)

---

## Overview

The sidebar menu is a slide-out navigation panel that provides quick access to key application features. It appears from the left side of the screen when the hamburger button is clicked and can be dismissed by clicking the X button or clicking outside the menu.

---

## Elements

### Hamburger Menu Button
Opens the sidebar menu.

- **Selector:** `#react-burger-menu-btn`
- **Type:** Button
- **Position:** Top-left corner (x: 20, y: 20)
- **Size:** 20x20 pixels
- **Icon:** Three horizontal lines (☰)
- **Visible:** Always visible on authenticated pages

### Close Button (X)
Closes the sidebar menu.

- **Selector:** `#react-burger-cross-btn`
- **Type:** Button
- **Location:** Top-right corner of sidebar
- **Icon:** X mark
- **Visible:** Only when sidebar is open

---

## Menu Items

All menu items are located within `nav.bm-item-list` and are anchor elements (`<a>`).

### 1. All Items
Navigates to/reloads the inventory page.

- **Text:** "All Items"
- **ID:** `inventory_sidebar_link`
- **data-test:** `inventory-sidebar-link`
- **Selector:** `nav.bm-item-list a#inventory_sidebar_link`
- **Alt Selector:** `[data-test="inventory-sidebar-link"]`
- **HREF:** `#`
- **Action:** Refreshes the inventory page view
- **Navigation:** Stays on `https://www.saucedemo.com/inventory.html`

### 2. About
Opens the Sauce Labs website (external link).

- **Text:** "About"
- **ID:** `about_sidebar_link`
- **data-test:** `about-sidebar-link`
- **Selector:** `nav.bm-item-list a#about_sidebar_link`
- **Alt Selector:** `[data-test="about-sidebar-link"]`
- **HREF:** `https://saucelabs.com/`
- **Action:** Opens external website
- **Navigation:** Opens `https://saucelabs.com/` in the same tab (navigates away from app)
- **Is External:** Yes

### 3. Logout
Logs out the current user and redirects to login page.

- **Text:** "Logout"
- **ID:** `logout_sidebar_link`
- **data-test:** `logout-sidebar-link`
- **Selector:** `nav.bm-item-list a#logout_sidebar_link`
- **Alt Selector:** `[data-test="logout-sidebar-link"]`
- **HREF:** `#`
- **Action:** Clears session, redirects to login
- **Navigation:** Goes to `https://www.saucedemo.com/`

### 4. Reset App State
Resets the application to initial state (clears cart, filters, etc.).

- **Text:** "Reset App State"
- **ID:** `reset_sidebar_link`
- **data-test:** `reset-sidebar-link`
- **Selector:** `nav.bm-item-list a#reset_sidebar_link`
- **Alt Selector:** `[data-test="reset-sidebar-link"]`
- **HREF:** `#`
- **Action:** Clears cart items, removes filters, resets sort order
- **Navigation:** Stays on current page

---

## Interactions & Workflows

### Open Sidebar Menu
1. Click hamburger button (`#react-burger-menu-btn`)
2. Sidebar slides in from left
3. Semi-transparent overlay appears behind menu
4. Menu items become visible and clickable

```typescript
// Example: Open sidebar menu
await page.click('#react-burger-menu-btn');
await page.waitForSelector('.bm-menu', { state: 'visible' });
```

### Close Sidebar Menu
**Option 1:** Click X button
```typescript
await page.click('#react-burger-cross-btn');
await page.waitForSelector('.bm-menu', { state: 'hidden' });
```

**Option 2:** Click outside menu (on overlay)
```typescript
await page.click('.bm-overlay'); // Click overlay to close
```

**Option 3:** Press Escape key
```typescript
await page.keyboard.press('Escape');
```

### Navigate to All Items
Refreshes the inventory page (useful after filtering/sorting).

```typescript
await page.click('#react-burger-menu-btn'); // Open menu
await page.click('[data-test="inventory-sidebar-link"]');
// Stays on inventory page
```

### Navigate to About (External Link)
Opens Sauce Labs website.

```typescript
await page.click('#react-burger-menu-btn'); // Open menu
await page.click('[data-test="about-sidebar-link"]');
await page.waitForURL(/saucelabs\.com/);
// Page navigates to saucelabs.com in the same tab
```

### Logout
Ends user session and returns to login page.

```typescript
await page.click('#react-burger-menu-btn'); // Open menu
await page.click('[data-test="logout-sidebar-link"]');
await page.waitForURL('https://www.saucedemo.com/');
```

### Reset App State
Clears cart and resets filters without logging out.

**What it does:**
- Removes all items from shopping cart
- Clears cart badge counter
- Resets product filters (e.g., Name (A to Z), Price (low to high))
- Resets all "Remove" buttons back to "Add to Cart"
- Keeps user logged in
- Stays on current page

**Visual Verification:**
- Cart badge disappears (or shows 0)
- All product buttons show "Add to Cart" instead of "Remove"
- Filter dropdown returns to default (Name (A to Z))

```typescript
await page.click('#react-burger-menu-btn'); // Open menu
await page.click('[data-test="reset-sidebar-link"]');
// Cart cleared, filters reset, stays on current page

// Verify cart is cleared
await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
```

**Screenshot References:**
1. **[Before Reset](../screenshots/sidebar-reset-01-cart-with-item.png)** - Cart with 1 item added (badge visible)
2. **[Menu Open](../screenshots/sidebar-reset-02-menu-open.png)** - Sidebar menu open with cart badge still visible
3. **[After Reset](../screenshots/sidebar-reset-03-after-reset.png)** - Cart cleared, badge removed, buttons reset to "Add to Cart"

---

## State Management

### Cart State
When "Reset App State" is clicked:
- Cart items are cleared
- Cart badge count resets to 0 (disappears if empty)
- Product "Add to Cart" buttons reset (not "Remove")

### Filter State
When "Reset App State" is clicked:
- Active filter is cleared (returns to "All" view)
- Sort order resets to default (A to Z)

### Session State
When "Logout" is clicked:
- User session is terminated
- All state is cleared
- Redirected to login page

---

## Visual States

### Closed (Default)
- Sidebar hidden off-screen to the left
- Only hamburger button visible
- No overlay

### Open
- Sidebar slides in from left (approx. 250-300px wide)
- Dark semi-transparent overlay behind menu (50% opacity)
- Menu items visible and interactive
- Close button (X) visible in top-right of sidebar

---

## Accessibility

### Keyboard Navigation
- **Tab:** Navigate between menu items
- **Enter/Space:** Activate selected menu item
- **Escape:** Close sidebar menu
- **Shift+Tab:** Navigate backwards through menu

### ARIA Attributes
- Menu items have `role="link"`
- Hamburger button is keyboard accessible
- Close button is keyboard accessible

---

## Testing Considerations

### Menu Opens
✅ Click hamburger button → Sidebar appears
✅ Overlay appears behind menu
✅ Close button (X) is visible

### Menu Closes
✅ Click X button → Sidebar disappears
✅ Click outside menu → Sidebar disappears
✅ Press Escape → Sidebar disappears

### Navigation Works
✅ "All Items" → Stays on inventory page
✅ "About" → Opens external link
✅ "Logout" → Redirects to login page
✅ "Reset App State" → Clears cart

### State Changes
✅ "Reset App State" clears cart items
✅ "Reset App State" clears cart badge
✅ "Logout" ends session

---

## Common Patterns

### Test Pattern: Open Menu, Click Item, Verify
```typescript
test('sidebar menu navigation', async ({ page }) => {
  // Login first
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // Open sidebar menu
  await page.click('#react-burger-menu-btn');
  await expect(page.locator('.bm-menu')).toBeVisible();

  // Click logout
  await page.click('[data-test="logout-sidebar-link"]');

  // Verify redirected to login
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
```

### Test Pattern: Reset App State
```typescript
test('reset app state clears cart', async ({ page }) => {
  // Login, add item to cart
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // Verify cart badge shows 1
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

  // Open menu and reset
  await page.click('#react-burger-menu-btn');
  await page.click('[data-test="reset-sidebar-link"]');

  // Verify cart is cleared
  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});
```

---

## Screenshots

### General Navigation
- **[Initial State](../screenshots/sidebar-initial-inventory.png)** - Inventory page before opening menu
- **[Menu Open](../screenshots/sidebar-menu-open.png)** - Sidebar menu with all items visible
- **[All Items Navigation](../screenshots/sidebar-nav-all-items.png)** - After clicking "All Items"
- **[About Navigation](../screenshots/sidebar-nav-about.png)** - After clicking "About" (external)
- **[Logout Navigation](../screenshots/sidebar-nav-logout.png)** - After clicking "Logout"

### Reset App State (Detailed Flow)
- **[Reset - Step 1: Cart with Item](../screenshots/sidebar-reset-01-cart-with-item.png)** - Cart with 1 item, badge showing "1"
- **[Reset - Step 2: Menu Open](../screenshots/sidebar-reset-02-menu-open.png)** - Sidebar menu open with cart badge visible
- **[Reset - Step 3: After Reset](../screenshots/sidebar-reset-03-after-reset.png)** - Cart cleared, badge removed, buttons reset

---

## Related Files

- **[Snapshot YAML](../snapshots/sidebar-menu.yaml)** - Complete element selectors and attributes
- **[Inventory Page](./inventory-page.md)** - Main page where sidebar is accessed
- **[Cart Page](./cart-page.md)** - Another page where sidebar is accessible
- **[Checkout Pages](./checkout-pages.md)** - Sidebar also available during checkout

---

## Tips & Gotchas

⚠️ **External Link:** The "About" menu item opens an external website (saucelabs.com) in the same tab, navigating away from the app. Use `waitForURL()` to wait for navigation to complete.

⚠️ **Reset State:** The "Reset App State" doesn't provide visual feedback. Verify state changes by checking cart badge or product buttons.

⚠️ **Menu Animation:** Add small wait (500-800ms) after clicking hamburger button for slide animation to complete before interacting with menu items.

⚠️ **Logout Clears Everything:** After logout, you cannot return to inventory without logging in again.

💡 **Selector Priority:** Always use `[data-test="..."]` attributes for menu items as they are more stable than IDs or text.

💡 **Close After Test:** If sidebar remains open after test, it might interfere with subsequent tests. Always close menu when done or use `page.close()` / `context.close()`.

---

**Last Updated:** 2025-03-24
**Tested On:** Chrome, Firefox, Safari (Playwright 1.58.2)
