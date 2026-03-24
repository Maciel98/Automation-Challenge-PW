# Navigation Bar (Primary Header)

**Component:** Top Navigation Bar
**Appears On:** All authenticated pages (Inventory, Cart, Checkout pages)
**Visibility:** Always visible after login

---

## Overview

The navigation bar is the top-level navigation component that appears on all authenticated pages. It provides access to the sidebar menu (hamburger button) and shopping cart. The cart badge dynamically shows the number of items in the cart.

---

## Elements

### Primary Header Container
Main wrapper for the navigation bar.

- **Selector:** `[data-test="primary-header"]`
- **Type:** `div`
- **Visible:** Always (on authenticated pages)

### Hamburger Menu Button
Opens the left sidebar menu.

- **Selector:** `#react-burger-menu-btn`
- **Type:** Button
- **Position:** Top-left corner
- **Icon:** Three horizontal lines (☰)
- **Visible:** Always (on authenticated pages)
- **Note:** Uses ID selector as `data-test` attribute is not available

### Shopping Cart Link
Navigates to the shopping cart page.

- **Selector:** `[data-test="shopping-cart-link"]`
- **Type:** Anchor (`<a>`)
- **Position:** Top-right corner
- **Visible:** Always (on authenticated pages)
- **Action:** Click → Navigate to `/cart.html`

### Shopping Cart Badge
Displays the count of items in the cart.

- **Selector:** `[data-test="shopping-cart-badge"]`
- **Type:** Span
- **Position:** Overlay on cart icon
- **Visible:** Conditional (only when cart has items)
- **Content:** Number of items in cart

---

## Key User Interactions

### Open Sidebar Menu
Click hamburger button to open left sidebar menu.

```typescript
// Using NavbarPage
await navbarPage.openMenu();
// Sidebar slides in from left
```

**Selector:** `#react-burger-menu-btn`
**Result:** Sidebar becomes visible, menu items accessible

### Navigate to Shopping Cart
Click cart icon to go to cart page.

```typescript
// Using NavbarPage
await navbarPage.navigateToCart();
// Navigates to /cart.html
```

**Selector:** `[data-test="shopping-cart-link"]`
**Result:** Navigates to `https://www.saucedemo.com/cart.html`

### Check Cart Badge Count
Get the number of items in the cart.

```typescript
// Using NavbarPage
const count = await navbarPage.getCartBadgeCount();
// Returns: number of items (0 if badge not visible)
```

**Selector:** `[data-test="shopping-cart-badge"]`
**Returns:** Number (0 if badge hidden, otherwise item count)

---

## Visual States

### Empty Cart
- Cart badge is **hidden**
- Cart link still visible and clickable

### Cart with Items
- Cart badge is **visible**
- Badge shows item count (e.g., "1", "2", "3")

---

## Usage in Tests

### Basic Navigation
```typescript
test('navigate to cart', async ({ navbarPage }) => {
  // Click cart link
  await navbarPage.navigateToCart();

  // Verify navigation
  await expect(page).toHaveURL(/\/cart\.html/);
});
```

### Verify Cart Badge
```typescript
test('cart badge shows correct count', async ({ navbarPage, inventoryPage }) => {
  await inventoryPage.goto();

  // Initially empty
  const countBefore = await navbarPage.getCartBadgeCount();
  expect(countBefore).toBe(0);

  // Add item
  await inventoryPage.addToCart('sauce-labs-backpack');

  // Check badge
  const countAfter = await navbarPage.getCartBadgeCount();
  expect(countAfter).toBe(1);
});
```

### Check Badge Visibility
```typescript
test('cart badge hidden when empty', async ({ navbarPage }) => {
  const isVisible = await navbarPage.isCartBadgeVisible();
  expect(isVisible).toBeFalsy();
});
```

---

## Integration with Page Objects

The navbar is available on all authenticated pages through composition:

### InventoryPage
```typescript
const inventoryPage = new InventoryPage(page);
await inventoryPage.navbar.navigateToCart();
```

### CartPage
```typescript
const cartPage = new CartPage(page);
const count = await cartPage.navbar.getCartBadgeCount();
```

### CheckoutCompletePage
```typescript
const checkoutCompletePage = new CheckoutCompletePage(page);
const isBadgeHidden = !(await checkoutCompletePage.navbar.isCartBadgeVisible());
```

---

## Accessibility

### Keyboard Navigation
- **Tab:** Navigate to hamburger button or cart link
- **Enter/Space:** Activate button/link
- **Tab Order:** Hamburger → ... → Cart Link

### ARIA Roles
- Hamburger button: `role="button"`
- Cart link: `role="link"`

---

## Testing Considerations

### Navbar Appears on Authenticated Pages
- Inventory page
- Cart page
- Checkout Step One
- Checkout Step Two
- Checkout Complete

### Cart Badge Behavior
- Hidden when cart empty
- Visible when cart has items
- Updates immediately when items added/removed

### Hamburger Button
- Opens sidebar menu
- Works on all authenticated pages
- Uses ID selector (#react-burger-menu-btn)

---

## Common Patterns

### Test Pattern: Add Item, Verify Badge
```typescript
test('cart badge increments', async ({ navbarPage, inventoryPage }) => {
  await inventoryPage.goto();

  // Add first item
  await inventoryPage.addToCart('sauce-labs-backpack');
  expect(await navbarPage.getCartBadgeCount()).toBe(1);

  // Add second item
  await inventoryPage.addToCart('sauce-labs-bike-light');
  expect(await navbarPage.getCartBadgeCount()).toBe(2);
});
```

### Test Pattern: Navigate to Cart
```typescript
test('navigate from inventory to cart', async ({ navbarPage, inventoryPage }) => {
  await inventoryPage.goto();
  await navbarPage.navigateToCart();

  // Verify on cart page
  await expect(page).toHaveURL(/\/cart\.html/);
});
```

---

## Related Files

- **[NavbarPage Object](../../tests/pages/navbar.page.ts)** - Page object implementation
- **[Sidebar Menu](./sidebar-menu.md)** - Sidebar menu opened via hamburger button
- **[Shopping Cart](./cart-page.md)** - Cart page navigation target
- **[Snapshot YAML](../snapshots/navbar.yaml)** - Complete element selectors

---

## Tips & Gotchas

⚠️ **Selector Inconsistency:** Hamburger button uses `#react-burger-menu-btn` (ID) not `[data-test="open-menu"]` as documented in some places. Always use the ID selector.

⚠️ **Conditional Badge:** Cart badge is not in DOM when cart is empty. Always use `getCartBadgeCount()` which handles this gracefully.

⚠️ **Animation Timing:** After clicking hamburger button, sidebar slides in with animation. Add small wait (500ms) for animation to complete.

⚠️ **Not on Login Page:** Navbar does not appear on login page. Only appears after authentication.

💡 **Composition Pattern:** NavbarPage is composed into page objects (inventoryPage.navbar, cartPage.navbar) rather than inherited.

💡 **Fixture Available:** NavbarPage is available as `navbarPage` fixture in tests.

---

**Last Updated:** 2025-03-24
**Tested On:** Chrome, Firefox, Safari (Playwright 1.58.2)
