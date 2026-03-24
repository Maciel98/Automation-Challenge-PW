# Cart Page

**URL:** https://www.saucedemo.com/cart.html
**Auth Required:** Yes
**Title:** Swag Labs

## Overview

The cart page displays all items added to the shopping cart. Users can review items, remove products, and proceed to checkout.

## Confirmed Element Locators

### Header Elements

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Page title | `[data-test="title"]` | span | Displays "Your Cart" |
| Shopping cart link | `[data-test="shopping-cart-link"]` | a | Current page indicator |
| Cart badge | `[data-test="shopping-cart-badge"]` | span | Item count |

### Cart Contents

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Cart contents container | `[data-test="cart-contents-container"]` | div | Cart wrapper |
| Cart list | `[data-test="cart-list"]` | div | Items container |
| Cart item | `[data-test="inventory-item"]` | div | Individual cart item |
| Item quantity | `[data-test="item-quantity"]` | div | Quantity display |
| Item name | `[data-test="inventory-item-name"]` | div | Product name |
| Item description | `[data-test="inventory-item-desc"]` | div | Product details |
| Item price | `[data-test="inventory-item-price"]` | div | Item price |

### Remove Buttons (Product-Specific)

| Product | Selector |
|---------|----------|
| Sauce Labs Backpack | `[data-test="remove-sauce-labs-backpack"]` |
| Sauce Labs Bike Light | `[data-test="remove-sauce-labs-bike-light"]` |
| Sauce Labs Bolt T-Shirt | `[data-test="remove-sauce-labs-bolt-t-shirt"]` |
| Sauce Labs Fleece Jacket | `[data-test="remove-sauce-labs-fleece-jacket"]` |
| Sauce Labs Onesie | `[data-test="remove-sauce-labs-onesie"]` |
| Test.allTheThings() T-Shirt (Red) | `[data-test="remove-test.allthethings()-t-shirt-(red)"]` |

### Action Buttons

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Continue Shopping | `[data-test="continue-shopping"]` | button | Return to inventory |
| Checkout | `[data-test="checkout"]` | button | Proceed to checkout |

## Key User Interactions

### Remove Item Flow

1. **Click "Remove" button**
   - Selector: `[data-test="remove-*"]` (product-specific)
   - Trigger: Item removed from cart
   - Cart badge: Decrements by 1
   - Button: Disappears from cart list

2. **Empty cart behavior**
   - Cart list: Hidden or shows empty message
   - Checkout button: May be disabled or hidden

### Continue Shopping

1. **Click "Continue Shopping"**
   - Selector: `[data-test="continue-shopping"]`
   - Trigger: Navigates to `/inventory.html`
   - Cart state: Preserved

### Proceed to Checkout

1. **Click "Checkout"**
   - Selector: `[data-test="checkout"]`
   - Trigger: Navigates to `/checkout-step-one.html`
   - Precondition: Cart must have at least 1 item

## Cart Display Format

| Column | Selector | Label |
|--------|----------|-------|
| Quantity | `[data-test="cart-quantity-label"]` | "QTY" |
| Description | `[data-test="cart-desc-label"]` | "Description" |

## API Calls

- No API calls on page load
- Cart state maintained in browser storage/session

## Navigation

- **Continue Shopping** → `/inventory.html`
- **Checkout** → `/checkout-step-one.html`
- **Cart Icon** → Current page (no navigation)

## Empty Cart State

When cart is empty:
- Cart list: Hidden or shows empty message
- Cart badge: Hidden or shows "0"
- Checkout button: May be disabled
