# Test Scenario Inventory
**Swag Labs (SauceDemo)**

## Overview

This inventory categorizes test scenarios for the Swag Labs e-commerce application at https://www.saucedemo.com. This is a demo testing application used for QA practice and automation testing.

**Application Type:** Product inventory and checkout system

**Test URL:** https://www.saucedemo.com/

**Available User Types:** standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user

---

## E2E Test Scenario Example

### Complete Purchase Flow

**Description:** Verify a registered user can log in, browse products, add items to cart, and complete the checkout process.

| Step | Expected Result |
|------|----------------|
| Navigate to login page | Login page loads with username and password fields visible |
| Log in with valid credentials (standard_user) | User is authenticated and redirected to inventory page |
| Verify inventory page loads | Page displays 6 available products with names and prices |
| Click "Add to cart" on a product | Cart badge updates to show item count (e.g., "1") |
| Navigate to cart page via cart icon | Cart page displays the added product with name, price, and quantity |
| Verify cart displays the added product | Product information matches what was added (name: "Sauce Labs Backpack", price: "$29.99") |
| Click "Checkout" button | Navigates to checkout step one (your information) |
| Verify checkout step one page loads | Page displays first name, last name, and postal code fields |
| Fill in required information (first name, last name, postal code) | All fields accept valid input |
| Click "Continue" button | Proceeds to checkout step two (overview) |
| Verify checkout overview page loads | Page displays item subtotal, tax, and total price |
| Verify price calculations are correct | Subtotal + Tax = Total (e.g., $29.99 + $2.40 = $32.39) |
| Click "Finish" button | Order is submitted and navigates to checkout complete page |
| Verify order confirmation page displays | Confirmation page loads with success message |
| Verify success message displays "Thank you for your order!" | Confirmation header is displayed to user |
| Click "Back Home" button | Returns to inventory page |
| Verify cart is cleared after order | Cart badge is no longer visible (count = 0) |

---

### Test Case Format Example

> **Note:** Test scenarios can be documented using the following format:

**Format:** `Feature: Action - Expected Result`

**Example:**
- **E2E: Complete Purchase Flow** - User successfully logs in, adds item to cart, and completes checkout with order confirmation

---

## Smoke Tests
> **Priority:** automate-now | **Purpose:** Quick health checks for critical application paths

### Basic Application Health

**Test Scenario:** Verify the application loads and basic authentication works

- TC1: Login: Navigate to login page - Login page loads successfully with username and password fields visible
- TC2: Login: Log in with standard_user credentials - User is authenticated and redirected to inventory page
- TC3: Inventory: View inventory page after login - Page displays 6 available products
- TC4: Inventory: Click "Add to cart" on a product - Cart badge updates to show item count
- TC5: Cart: Navigate to cart page via cart icon - Cart page loads and displays the added product
- TC6: Cart: Click "Checkout" button - Navigates to checkout step one page
- TC7: Checkout: Complete checkout flow with valid information - Order completes with confirmation page
- TC8: Authentication: Click logout button - User is redirected to login page

---

## Core Regression Tests
> **Priority:** automate-now | **Purpose:** Validate core functionality after code changes

### Authentication

**Test Scenario:** Verify all login authentication paths work correctly

- TC1: Authentication: Log in with valid standard_user credentials - User reaches inventory page successfully
- TC2: Authentication: Log in with locked_out_user credentials - Error message "Sorry, this user has been locked out" displays
- TC3: Authentication: Log in with problem_user credentials - Login succeeds but images may be broken
- TC4: Authentication: Log in with performance_glitch_user credentials - Login succeeds but with intentional delay
- TC5: Authentication: Attempt login with empty field/s - Validation error displays or user stays on login page
- TC6: Authentication: Log in with incorrect credentials - Error message "Username and password do not match" displays
- TC7: Authentication: Click logout - User is redirected to login page

**Test Scenario:** Verify user cannot bypass login

- TC1: Authentication: Navigate to any url other than login without logging in - User is redirected to login page

### Inventory & Products

**Test Scenario:** Verify product browsing functionality

- TC1: Inventory: Navigate to inventory page - All 6 products are displayed correctly
- TC2: Inventory: Click "Add to cart" on single product - Product is added and cart badge shows count of 1
- TC3: Inventory: Add multiple different products to cart - All selected products are added and cart badge increments
- TC4: Inventory: Remove product from inventory page - Product is removed from cart and badge decrements 

**Test Scenario:** Verify product sorting functionality

- TC1: Inventory: Select sort by name (A-Z) - Products are sorted alphabetically from A to Z
- TC2: Inventory: Select sort by name (Z-A) - Products are sorted alphabetically from Z to A
- TC3: Inventory: Select sort by price (low to high) - Products are sorted by price ascending
- TC4: Inventory: Select sort by price (high to low) - Products are sorted by price descending

### Cart Functionality

**Test Scenario:** Verify cart operations and item management

- TC1: Cart: Navigate to cart with single item - Cart page displays the added product
- TC2: Cart: Navigate to cart with multiple items - Cart page displays all added products
- TC3: Cart: View item name in cart - Product name is displayed correctly
- TC4: Cart: View item price in cart - Product price is displayed correctly
- TC5: Cart: View item quantity in cart - Quantity defaults to 1 for each added item
- TC6: Cart: Click remove button on item - Item disappears from cart list
- TC7: Cart: Click continue shopping button - User navigates back to inventory page
- TC8: Cart: Remove item and verify badge - Cart badge decreases when item is removed
- TC9: Cart: Click checkout button from cart - User navigates to checkout step one page
- TC10: Cart: Click continue shopping button - User goes back to the Products Page (Cart Items remain)

### Checkout Flow

**Test Scenario:** Verify checkout process step one

- TC1: Checkout: Click continue with empty fields - Validation error displays each field
- TC2: Checkout: Complete all fields and click continue - User proceeds to checkout step two overview page
- TC3: Checkout: Click cancel button - User goes back to the Cart Page (Cart Items remain)

**Test Scenario:** Verify complete checkout process step 2 (Checkout Overvie)

- TC1: Overview: View checkout overview page - All cart items are displayed with correct details
- TC2: Overview: Verify subtotal on overview - Subtotal matches cart total
- TC3: Overview: Verify subtotal after adding multiple items - Cart calculates subtotal correctly
- TC4: Overview: Verify tax - Tax is calculated and displayed
- TC5: Overview: Verify total on overview - Total equals subtotal plus tax
- TC6: Overview: Click finish button - Order is submitted and navigates to checkout complete page
- TC7: Overview: Click cancel button - User goes back to the Products Page (Cart Items remain)

**Test Scenario:** Verify Checkout Complete Page

- TC1: Overview: View checkout complete page - Page displays success message
- TC2: Overview: Click back home button - User returns to inventory page
- TC3: Overview: Verify cart after order completion - Cart is empty and badge is removed

---

## High-Risk Workflow Tests
> **Priority:** automate-now | **Purpose:** Validate critical business paths that impact revenue

### End-to-End Purchase Flow

**Test Scenario:** Verify complete purchase journey from login to order confirmation

- TC1: E2E: Complete full purchase flow - User logs in, adds item to cart, completes checkout, and receives order confirmation
- TC2: E2E: Complete checkout with multiple items - Totals are calculated correctly and order completes
- TC3: Cart: Refresh page with items in cart - Cart contents persist after page refresh
- TC3: E2E: Click checkout with empty cart - User goes to the flow and is charged zero (This can also be considered a BUG depeding on the ACs)

## Edge Case Tests
> **Priority:** automate-later | **Purpose:** Handle unusual inputs and boundary conditions

### Form Input Edge Cases

**Test Scenario:** Verify checkout form handles various input formats

- TC1: Checkout: Enter special characters in name fields - System accepts special characters in first/last name 
- TC2: Checkout: Enter very long name string - Form handles unusually long input without errors 
- TC3: Checkout: Enter postal code with spaces - Postal code field accepts spaces 
- TC4: Checkout: Enter numeric postal code only - Postal code field accepts numbers only 

### Cart & Navigation Edge Cases

**Test Scenario:** Verify cart behavior with unusual interactions

- TC1: Inventory: Add same product twice - Cart shows quantity of 2 or two separate entries
- TC2: Checkout: Refresh browser during checkout step one - Form data is NOT preserved (no state persistence)
- TC3: Cart: Navigate to cart via direct URL after login - Cart page loads and displays contents
- TC4: Navigation: Navigate between inventory and cart - Cart badge persists across navigation
- TC5: Inventory: Sort products, add item, sort again - Sort state changes do not affect cart functionality

---

## User Type Specific Tests
> **Priority:** automate-later | **Purpose:** Verify behavior with special test user accounts

**Test Scenario:** Verify special test user accounts exhibit expected behaviors

- TC1: problem_user: Log in and view inventory - Images appear broken or incorrect as expected
- TC2: performance_glitch_user: Log in and navigate - Intentional performance delay is present
- TC3: error_user: Add items and proceed to checkout - Errors occur during cart/checkout flow
- TC4: visual_user: Log in and browse products - Layout renders correctly for visual comparison testing

---

## Manual-Only Tests for Now
> **Priority:** manual-for-now | **Purpose:** Tests requiring human judgment or physical devices

**Test Scenario:** Tests currently designated for manual execution

- TC1: Visual: Compare product images across browsers - Product images require visual comparison for consistency
- TC2: Mobile: Test responsive design on real devices - Mobile layout requires visual inspection on actual devices

---
