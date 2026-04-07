# Inventory Item Detail Page

**URL:** https://www.saucedemo.com/inventory-item.html?id={numeric_id}
**Auth Required:** Yes
**Title:** Swag Labs

## Overview

The inventory item detail page displays detailed information about a single product. Users can view product details, add items to cart, and navigate back to the product list.

**Access:** Navigate from inventory page by clicking product name or product image.
**ID Format:** Numeric IDs (0-5), not product slugs

## Confirmed Element Locators

### Product Information

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Product name | `[data-test="inventory-item-name"]` | div | Product title |
| Product description | `[data-test="inventory-item-desc"]` | div | Detailed product info |
| Product price | `[data-test="inventory-item-price"]` | div | Item price |
| Product image | `.inventory_details_img` | img | Product photo |
| Description container | `.inventory_details_desc` | div | Wrapper for desc text |

### Action Buttons

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Add to cart | `[data-test="add-to-cart"]` | button | Add item to cart |
| Remove | `[data-test="remove"]` | button | Remove from cart (appears after add) |
| Back to products | `[data-test="back-to-products"]` | button | Return to inventory |

## Product IDs

| ID | Product |
|----|---------|
| 0 | Sauce Labs Backpack |
| 1 | Sauce Labs Bike Light |
| 2 | Sauce Labs Bolt T-Shirt |
| 3 | Sauce Labs Fleece Jacket |
| 4 | Sauce Labs Onesie |
| 5 | Test.allTheThings() T-Shirt (Red) |

## Key User Interactions

### View Product Details
1. From inventory page, click product name or image
2. Navigate to `/inventory-item.html?id={numeric_id}`
3. View product information

### Add to Cart
1. Click "Add to cart" → `[data-test="add-to-cart"]`
2. Button changes to "Remove"
3. Cart badge increments by 1

### Remove from Cart
1. Click "Remove" → `[data-test="remove"]`
2. Button changes back to "Add to cart"
3. Cart badge decrements by 1

### Navigate Back
1. Click "Back to products" → `[data-test="back-to-products"]`
2. Returns to `/inventory.html`

## API Calls

- No external API calls
- Cart state maintained in browser storage/session

## Navigation

- **From inventory page** → Click product name/image → `/inventory-item.html?id={id}`
- **Back to products** → Click "Back to products" → `/inventory.html`
