# Checkout Pages

**Auth Required:** Yes
**Title:** Swag Labs

## Overview

The checkout process consists of three pages:
1. **Checkout Step One:** Your Information - Collect user details
2. **Checkout Step Two:** Overview - Review order and totals
3. **Checkout Complete:** Order confirmation

---

## Checkout Step One: Your Information

**URL:** https://www.saucedemo.com/checkout-step-one.html

### Confirmed Element Locators

| Element | Selector | Type | Required | Purpose |
|---------|----------|------|----------|---------|
| Page title | `[data-test="title"]` | span | - | "Checkout: Your Information" |
| First name | `[data-test="firstName"]` | input | Yes | Customer first name |
| Last name | `[data-test="lastName"]` | input | Yes | Customer last name |
| Postal code | `[data-test="postalCode"]` | input | Yes | Postal/zip code |
| Cancel button | `[data-test="cancel"]` | button | - | Return to cart |
| Continue button | `[data-test="continue"]` | input | - | Proceed to overview |

### Key User Interactions

**Fill Checkout Form:**
1. Enter first name → `[data-test="firstName"]`
2. Enter last name → `[data-test="lastName"]`
3. Enter postal code → `[data-test="postalCode"]`
4. Click "Continue" → `[data-test="continue"]`

**Validation:**
- All fields required
- Empty fields trigger error message
- Valid input proceeds to step two

**Cancel:**
- Click "Cancel" → Returns to `/cart.html`

### Navigation

- **Continue** → `/checkout-step-two.html` (with valid input)
- **Cancel** → `/cart.html`

---

## Checkout Step Two: Overview

**URL:** https://www.saucedemo.com/checkout-step-two.html

### Confirmed Element Locators

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Page title | `[data-test="title"]` | span | "Checkout: Overview" |
| Checkout summary container | `[data-test="checkout-summary-container"]` | div | Summary wrapper |
| Cart list | `[data-test="cart-list"]` | div | Order items |
| Item quantity | `[data-test="item-quantity"]` | div | Quantity per item |
| Item name | `[data-test="inventory-item-name"]` | div | Product name |
| Item price | `[data-test="inventory-item-price"]` | div | Price per item |

### Payment & Shipping Info

| Element | Selector | Content |
|---------|----------|---------|
| Payment info label | `[data-test="payment-info-label"]` | "Payment Information:" |
| Payment info value | `[data-test="payment-info-value"]` | "SauceCard #31337" |
| Shipping info label | `[data-test="shipping-info-label"]` | "Shipping Information:" |
| Shipping info value | `[data-test="shipping-info-value"]` | "Free Pony Express Delivery!" |

### Price Totals

| Element | Selector | Example |
|---------|----------|---------|
| Subtotal label | `[data-test="subtotal-label"]` | "Item total: $29.99" |
| Tax label | `[data-test="tax-label"]` | "Tax: $2.40" |
| Total label | `[data-test="total-label"]` | "Total: $32.39" |

### Action Buttons

| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Cancel | `[data-test="cancel"]` | button | Return to cart |
| Finish | `[data-test="finish"]` | button | Complete order |

### Key User Interactions

**Review Order:**
- Verify all items displayed correctly
- Check subtotal calculation
- Verify tax (approximately 8%)
- Confirm total (subtotal + tax)

**Complete Order:**
1. Click "Finish" → `[data-test="finish"]`
2. Order submitted
3. Navigate to `/checkout-complete.html`

**Cancel:**
- Click "Cancel" → Returns to `/cart.html`

### Price Calculations

```
Tax Rate: ~8%
Total = Subtotal + Tax

Example:
  Subtotal: $29.99
  Tax: $2.40 (8%)
  Total: $32.39
```

### Navigation

- **Finish** → `/checkout-complete.html`
- **Cancel** → `/cart.html`

---

## Checkout Complete

**URL:** https://www.saucedemo.com/checkout-complete.html

### Confirmed Element Locators

| Element | Selector | Type | Content |
|---------|----------|------|---------|
| Page title | `[data-test="title"]` | span | "Checkout: Complete!" |
| Checkout complete container | `[data-test="checkout-complete-container"]` | div | Confirmation wrapper |
| Pony express image | `[data-test="pony-express"]` | img | Success graphic |
| Complete header | `[data-test="complete-header"]` | h2 | "Thank you for your order!" |
| Complete text | `[data-test="complete-text"]` | div | "Your order has been dispatched..." |
| Back home button | `[data-test="back-to-products"]` | button | "Back Home" |

### Key User Interactions

**Order Completion:**
1. View success message
2. Note "Thank you for your order!" header
3. Click "Back Home" → Returns to `/inventory.html`

**Post-Order State:**
- Cart: Cleared (empty)
- Cart badge: Hidden or shows "0"
- Session: Reset for new order

### Navigation

- **Back Home** → `/inventory.html`

---

## Complete Checkout Flow Summary

```
Cart Page → Click "Checkout"
    ↓
Checkout Step One → Fill form → Click "Continue"
    ↓
Checkout Step Two → Review order → Click "Finish"
    ↓
Checkout Complete → View confirmation → Click "Back Home"
    ↓
Inventory Page → Cart cleared, ready for new order
```

## API Calls

- No external API calls during checkout
- All state managed client-side
- Order completion clears cart state
