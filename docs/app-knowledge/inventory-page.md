# Inventory Page

**URL:** https://www.saucedemo.com/inventory.html
**Auth Required:** Yes
**Title:** Swag Labs

## Overview

The inventory page displays 6 available products for purchase. Users can browse products, sort them, and add items to their shopping cart.

## Confirmed Element Locators

### Navigation Elements

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Menu button | `[data-test="open-menu"]` | img | Opens sidebar menu |
| Shopping cart link | `[data-test="shopping-cart-link"]` | a | Navigate to cart |
| Cart badge | `[data-test="shopping-cart-badge"]` | span | Shows item count |

### Sorting

| Element | Selector | Type | Options |
|---------|----------|------|---------|
| Sort dropdown | `[data-test="product-sort-container"]` | select | Name (A-Z, Z-A), Price (low-high, high-low) |
| Active sort option | `[data-test="active-option"]` | span | Shows current sort |

### Product Display

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Inventory container | `[data-test="inventory-container"]` | div | Main product list wrapper |
| Inventory list | `[data-test="inventory-list"]` | div | Product items container |
| Product item | `[data-test="inventory-item"]` | div | Individual product (6 total) |
| Product name | `[data-test="inventory-item-name"]` | div | Product title |
| Product description | `[data-test="inventory-item-desc"]` | div | Product details |
| Product price | `[data-test="inventory-item-price"]` | div | Item price |

### Add to Cart Buttons

| Product | Selector | Price |
|---------|----------|-------|
| Sauce Labs Backpack | `[data-test="add-to-cart-sauce-labs-backpack"]` | $29.99 |
| Sauce Labs Bike Light | `[data-test="add-to-cart-sauce-labs-bike-light"]` | $9.99 |
| Sauce Labs Bolt T-Shirt | `[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]` | $15.99 |
| Sauce Labs Fleece Jacket | `[data-test="add-to-cart-sauce-labs-fleece-jacket"]` | $49.99 |
| Sauce Labs Onesie | `[data-test="add-to-cart-sauce-labs-onesie"]` | $7.99 |
| Test.allTheThings() T-Shirt (Red) | `[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]` | $15.99 |

### Sidebar Menu (Hidden by default)

| Element | Selector | Visibility | Purpose |
|---------|----------|------------|---------|
| All Items | `[data-test="inventory-sidebar-link"]` | Hidden until menu open | Navigate to inventory |
| About | `[data-test="about-sidebar-link"]` | Hidden until menu open | About page |
| Logout | `[data-test="logout-sidebar-link"]` | Hidden until menu open | Logout user |
| Reset App State | `[data-test="reset-sidebar-link"]` | Hidden until menu open | Reset cart/session |
| Close menu | `[data-test="close-menu"]` | Hidden until menu open | Close sidebar |

## Key User Interactions

### Add to Cart Flow

1. **Click "Add to cart" button**
   - Selector: `[data-test="add-to-cart-*"]` (product-specific)
   - Trigger: Cart badge count increments by 1
   - Button change: "Add to cart" → "Remove"

2. **View cart badge**
   - Selector: `[data-test="shopping-cart-badge"]`
   - Displays: Number of items in cart
   - Hidden: When cart is empty

3. **Navigate to cart**
   - Selector: `[data-test="shopping-cart-link"]`
   - Trigger: Navigates to `/cart.html`

### Sort Products

1. **Click sort dropdown**
   - Selector: `[data-test="product-sort-container"]`

2. **Select sort option**
   - Options: Name (A-Z), Name (Z-A), Price (low to high), Price (high to low)
   - Trigger: Products reorder immediately

### Open Sidebar Menu

1. **Click menu button**
   - Selector: `[data-test="open-menu"]`
   - Trigger: Sidebar slides in, menu items become visible

2. **Click "Logout"**
   - Selector: `[data-test="logout-sidebar-link"]`
   - Trigger: Logout, redirect to login page

## API Calls

- No API calls on page load
- Cart state maintained in browser storage/session

## Navigation

- **Cart** → Click cart icon → `/cart.html`
- **Menu** → Click hamburger → Opens sidebar
- **Logout** → Menu → Logout → `/index.html`
