# Test Scenario Inventory
**Swag Labs (SauceDemo)**

## Priority Levels Reference

| Priority | Level | Description | Automation Timeline |
|----------|-------|-------------|---------------------|
| **P0** | Critical | Core application functionality - blocking issues if failed | Automate-now |
| **P1** | High | Important features - significant impact if failed | Automate-now |
| **P2** | Medium | Edge cases, special user types - moderate impact | Automate-later |
| **P3** | Low | Visual checks, manual-only - low automation priority | Manual-for-now |

## Test Case Types

| Type | Description | Marker |
|------|-------------|--------|
| **Positive (P)** | Valid inputs and expected happy paths | Path: P |
| **Negative (N)** | Invalid inputs, error conditions, edge cases | Path: N |

## Overview

This inventory categorizes test scenarios for the Swag Labs e-commerce application at https://www.saucedemo.com.

**Application Type:** Product inventory and checkout system
**Test URL:** https://www.saucedemo.com/
**Total Test Cases:** 42 primary scenarios + 22 deferred scenarios

---

## 1. Smoke Tests
> **Automation:** Automate-now | **Priority:** P0 (Critical) | **Purpose:** Quick health checks for critical application paths

**Test Scenario:** Verify the application and basic authentication works

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC001 | P0 | P | Login: Navigate to login page - Login page loads successfully with username and password fields visible |
| TC002 | P0 | P | Login: Log in with standard_user credentials - User is authenticated and redirected to inventory page |
| TC003 | P0 | P | Inventory: View inventory page - Page displays 6 available products |
| TC004 | P0 | P | Checkout: Complete checkout flow with valid information - Order completes with confirmation page |

---

## 2. Core Regression Tests
> **Automation:** Automate-now | **Priority:** P0-P1 (Critical-High) | **Purpose:** Validate core functionality after code changes

#### OBS: Important to adress that Regression tests are selected based on the following:
- Impact
- Historical Failures
- Business Critical
- Frequency of use

### Authentication

**Test Scenario:** Verify all login authentication paths work correctly

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC007 | P0 | P | Authentication: Log in with valid standard_user credentials - User reaches inventory page successfully |
| TC008 | P1 | N | Authentication: Log in with locked_out_user credentials - Error message "Sorry, this user has been locked out" displays |
| TC009 | P1 | N | Authentication: Attempt login with empty field/s - Validation error displays or user stays on login page |
| TC010 | P1 | N | Authentication: Log in with incorrect credentials - Error message "Username and password do not match" displays |
| TC011 | P1 | N | Authentication: Navigate to any url other than login without logging in - User is redirected to login page |
| TC012 | P1 | P | Authentication: Click logout - User is redirected to login page |

### Inventory & Products

**Test Scenario:** Verify product browsing and cart operations

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC013 | P0 | P | Inventory: Navigate to inventory page - All 6 products are displayed correctly |
| TC014 | P0 | P | Inventory: Click "Add to cart" on single product - Product is added and cart badge shows count of 1 |
| TC015 | P0 | P | Inventory: Add multiple different products to cart - All selected products are added and cart badge increments |
| TC016 | P1 | P | Inventory: Remove product from inventory page - Product is removed from cart and badge decrements |
| TC017 | P1 | P | Inventory: Select sort by name (A-Z) - Products are sorted alphabetically from A to Z |
| TC018 | P1 | P | Inventory: Select sort by name (Z-A) - Products are sorted alphabetically from Z to A |
| TC019 | P1 | P | Inventory: Select sort by price (low to high) - Products are sorted by price ascending |
| TC020 | P1 | P | Inventory: Select sort by price (high to low) - Products are sorted by price descending |

### Cart Functionality

**Test Scenario:** Verify cart operations and item management

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC021 | P0 | P | Cart: Navigate to cart with single item - Cart page displays the added product |
| TC022 | P0 | P | Cart: Navigate to cart with multiple items - Cart page displays all added products |
| TC023 | P1 | P | Cart: View item name, price, and quantity in cart - Product details are displayed correctly |
| TC024 | P1 | P | Cart: Click remove button on item - Item disappears from cart list and badge decreases |
| TC025 | P0 | P | Cart: Click checkout button from cart - User navigates to checkout step one page |
| TC026 | P1 | P | Cart: Click continue shopping button - User navigates back to inventory page |

### Checkout Flow

**Test Scenario:** Verify complete checkout process

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC027 | P0 | P | Checkout: Complete all fields and click continue - User proceeds to checkout step two overview page |
| TC028 | P0 | P | Overview: View checkout overview page - All cart items are displayed with correct details |
| TC029 | P0 | P | Overview: Verify subtotal, tax, and total on overview - Calculations are correct (subtotal + tax = total) |
| TC030 | P0 | P | Overview: Click finish button - Order is submitted and navigates to checkout complete page |
| TC031 | P0 | P | Complete: Verify order confirmation page displays - Confirmation page loads with success message |
| TC032 | P0 | P | Complete: Verify cart after order completion - Cart is empty and badge is removed |

---

## 3. High-Risk Workflow Tests
> **Automation:** Automate-now | **Priority:** P0 (Critical) | **Purpose:** Validate critical business paths that impact revenue

**Test Scenario:** Verify complete purchase journey from login to order confirmation

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC033 | P0 | P | E2E: Complete full purchase flow - User logs in, adds item to cart, completes checkout, and receives order confirmation |
| TC034 | P0 | P | E2E: Complete checkout with multiple items - Totals are calculated correctly and order completes |
| TC035 | P1 | P | Cart: Refresh page with items in cart - Cart contents persist after page refresh |
| TC036 | P1 | P | E2E: Add to cart from inventory, remove from cart, then checkout - Cart operations work correctly across navigation |

---

## 4. Negative Paths
> **Automation:** Automate-now | **Priority:** P0-P1 (Critical-High) | **Purpose:** Verify error handling and validation

### Authentication Negative Paths

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC037 | P1 | N | Authentication: Log in with locked_out_user credentials - Error message "Sorry, this user has been locked out" displays |
| TC038 | P1 | N | Authentication: Attempt login with empty field/s - Validation error displays or user stays on login page |
| TC039 | P1 | N | Authentication: Log in with incorrect credentials - Error message "Username and password do not match" displays |
| TC040 | P1 | N | Authentication: Navigate to any url other than login without logging in - User is redirected to login page |

### Checkout Negative Paths

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC041 | P0 | N | Checkout: Click continue with empty fields - Validation error displays for each required field |
| TC042 | P2 | N | E2E: Click checkout with empty cart - User goes to the flow and is charged zero (potential bug depending on ACs) |

### Special User Type Negative Paths

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC043 | P2 | N | problem_user: Log in and view inventory - Images appear broken or incorrect as expected |
| TC044 | P2 | N | error_user: Add items and proceed to checkout - Errors occur during cart/checkout flow |

---

## 5. Edge Cases
> **Automation:** Automate-later | **Priority:** P2 (Medium) | **Purpose:** Handle unusual inputs and boundary conditions

### Form Input Edge Cases

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC045 | P2 | N | Checkout: Enter very long name string (100+ chars) - Form handles unusually long input without errors |
| TC046 | P2 | P | Checkout: Enter special characters in name fields - System accepts special characters in first/last name |
| TC047 | P2 | P | Checkout: Enter postal code with spaces and various formats - Postal code field accepts multiple formats |

### Cart & Navigation Edge Cases

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC048 | P2 | P | Inventory: Add same product twice - Cart shows quantity of 2 or two separate entries |
| TC049 | P2 | P | Checkout: Refresh browser during checkout step one - Form data is NOT preserved (no state persistence) |
| TC050 | P2 | P | Cart: Navigate to cart via direct URL after login - Cart page loads and displays contents |

### Performance & Special User Edge Cases

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC051 | P2 | P | performance_glitch_user: Log in and navigate - Intentional performance delay is present |
| TC052 | P2 | P | visual_user: Log in and browse products - Layout renders correctly for visual comparison testing |

---

## 6. Manual-Only Tests
> **Automation:** Manual-for-now | **Priority:** P3 (Low) | **Purpose:** Tests requiring human judgment or physical devices

| TC ID | Priority | Path | Test Case |
|-------|----------|------|-----------|
| TC053 | P3 | P | Visual: Compare product images across browsers - Product images require visual comparison for consistency |
| TC054 | P3 | P | Mobile: Test responsive design on real devices - Mobile layout requires visual inspection on actual devices |

---

## Deferred Test Cases
> **Note:** These test scenarios were considered but deferred to focus on high-priority, high-impact test cases. Can be revisited based on project needs.

### Authentication Deferred

| TC ID | Priority | Path | Test Case | Rationale for Deferral |
|-------|----------|------|-----------|------------------------|
| TC-D01 | P1 | P | Authentication: Log in with problem_user credentials - Login succeeds but images may be broken | Covered by visual regression tests; low automation priority |
| TC-D02 | P2 | P | Authentication: Log in with performance_glitch_user credentials - Login succeeds but with intentional delay | Performance testing separate from functional regression |

### Inventory & Products Deferred

| TC ID | Priority | Path | Test Case | Rationale for Deferral |
|-------|----------|------|-----------|------------------------|
| TC-D03 | P2 | P | Inventory: Visualize page - All page elements are displayed correctly | Visual validation better suited for visual regression tools |
| TC-D04 | P2 | P | Inventory: Sort products, add item, sort again - Sort state changes do not affect cart functionality | Edge case with low business impact |

### Cart Functionality Deferred

| TC ID | Priority | Path | Test Case | Rationale for Deferral |
|-------|----------|------|-----------|------------------------|
| TC-D05 | P1 | P | Cart: View item name in cart - Product name is displayed correctly | Covered by TC023 (combined name/price/quantity test) |
| TC-D06 | P1 | P | Cart: View item price in cart - Product price is displayed correctly | Covered by TC023 (combined name/price/quantity test) |
| TC-D07 | P1 | P | Cart: View item quantity in cart - Quantity defaults to 1 for each added item | Covered by TC023 (combined name/price/quantity test) |
| TC-D08 | P1 | P | Cart: Remove item and verify badge - Cart badge decreases when item is removed | Covered by TC024 (remove button test) |
| TC-D09 | P2 | P | Cart: Visualize page - All page elements are displayed correctly | Visual validation better suited for visual regression tools |

### Checkout Flow Deferred

| TC ID | Priority | Path | Test Case | Rationale for Deferral |
|-------|----------|------|-----------|------------------------|
| TC-D10 | P1 | P | Checkout: Click cancel button - User goes back to the Cart Page (Cart Items remain) | Navigation flow already covered in smoke tests |
| TC-D11 | P2 | P | Checkout: Visualize page - All page elements are displayed correctly | Visual validation better suited for visual regression tools |
| TC-D12 | P1 | P | Overview: Verify subtotal on overview - Subtotal matches cart total | Covered by TC029 (combined calculation test) |
| TC-D13 | P0 | P | Overview: Verify subtotal after adding multiple items - Cart calculates subtotal correctly | Covered by TC029 (combined calculation test) |
| TC-D14 | P0 | P | Overview: Verify tax - Tax is calculated and displayed | Covered by TC029 (combined calculation test) |
| TC-D15 | P0 | P | Overview: Verify total on overview - Total equals subtotal plus tax | Covered by TC029 (combined calculation test) |
| TC-D16 | P1 | P | Overview: Click cancel button - User goes back to the Products Page (Cart Items remain) | Navigation flow already covered in smoke tests |
| TC-D17 | P2 | P | Overview: Visualize page - All page elements are displayed correctly | Visual validation better suited for visual regression tools |
| TC-D18 | P2 | P | Complete: Visualize page - All page elements are displayed correctly (Success Message) | Visual validation better suited for visual regression tools |
| TC-D19 | P0 | P | Complete: Click back home button - User returns to inventory page | Navigation flow already covered in smoke tests |

### Edge Cases Deferred

| TC ID | Priority | Path | Test Case | Rationale for Deferral |
|-------|----------|------|-----------|------------------------|
| TC-D20 | P2 | P | Checkout: Enter postal code with spaces - Postal code field accepts spaces | Covered by TC047 (combined postal code format test) |
| TC-D21 | P2 | P | Checkout: Enter numeric postal code only - Postal code field accepts numbers only | Covered by TC047 (combined postal code format test) |
| TC-D22 | P2 | P | Navigation: Navigate between inventory and cart - Cart badge persists across navigation | Low-risk edge case; state persistence covered by TC035 |

---

## Test Case Summary Statistics

### Primary Test Cases

| Priority | Count | Percentage |
|----------|-------|------------|
| **P0 (Critical)** | 18 | 43% |
| **P1 (High)** | 16 | 38% |
| **P2 (Medium)** | 6 | 14% |
| **P3 (Low)** | 2 | 5% |
| **Total** | **42** | **100%** |

### Test Case Types

| Type | Count | Percentage |
|------|-------|------------|
| **Positive (P)** | 33 | 79% |
| **Negative (N)** | 9 | 21% |
| **Total** | **42** | **100%** |

### Distribution by Category

| Category | Automate-now | Automate-later | Manual-for-now | Total |
|----------|--------------|-----------------|----------------|-------|
| Smoke Tests | 4 | 0 | 0 | 4 |
| Core Regression | 26 | 0 | 0 | 26 |
| High-Risk Workflows | 4 | 0 | 0 | 4 |
| Negative Paths | 8 | 0 | 0 | 8 |
| Edge Cases | 0 | 6 | 0 | 6 |
| Manual Only | 0 | 0 | 2 | 2 |
| **Total** | **42** | **6** | **2** | **50** |

### Deferred Test Cases

| Category | Count |
|----------|-------|
| Authentication | 2 |
| Inventory & Products | 2 |
| Cart Functionality | 5 |
| Checkout Flow | 10 |
| Edge Cases | 3 |
| **Total** | **22** |

### Path Type Summary

| Category | Positive (P) | Negative (N) |
|----------|--------------|--------------|
| Authentication | 3 | 5 |
| Checkout | 13 | 3 |
| Inventory & Cart | 13 | 0 |
| High-Risk Workflows | 4 | 0 |
| Edge Cases | 6 | 2 |
| Manual Only | 2 | 0 |
| **Total** | **41** | **10** |

---

## Sample E2E Test Case Example

### Complete Purchase Flow - Detailed Step-by-Step

**Test Case ID:** TC033
**Priority:** P0 (Critical)
**Path:** Positive

**Description:** Verify a registered user can log in, browse products, add items to cart, and complete the checkout process.

| Step | Action | Expected Result |
|------|--------|----------------|
| 1 | Navigate to https://www.saucedemo.com | Login page loads with username and password fields visible |
| 2 | Enter username: "standard_user" | Username field accepts input |
| 3 | Enter password: "secret_sauce" | Password field accepts input |
| 4 | Click "Login" button | User is authenticated and redirected to inventory page |
| 5 | Verify inventory page loads | Page displays 6 available products with names and prices |
| 6 | Click "Add to cart" on "Sauce Labs Backpack" | Cart badge updates to show "1" |
| 7 | Click cart icon (shopping cart link) | Cart page loads and displays the added product |
| 8 | Verify cart displays product | Product name "Sauce Labs Backpack" and price "$29.99" are displayed |
| 9 | Verify quantity | Quantity defaults to 1 |
| 10 | Click "Checkout" button | Navigates to checkout step one (your information) |
| 11 | Verify checkout step one page loads | Page displays first name, last name, and postal code fields |
| 12 | Enter first name: "John" | First name field accepts input |
| 13 | Enter last name: "Doe" | Last name field accepts input |
| 14 | Enter postal code: "12345" | Postal code field accepts input |
| 15 | Click "Continue" button | Proceeds to checkout step two (overview) |
| 16 | Verify checkout overview page loads | Page displays item, subtotal, tax, and total |
| 17 | Verify price calculations | Subtotal $29.99 + Tax $2.40 = Total $32.39 |
| 18 | Click "Finish" button | Order is submitted and navigates to checkout complete page |
| 19 | Verify order confirmation page | Confirmation page loads with success message |
| 20 | Verify success message | "Thank you for your order!" header is displayed |
| 21 | Click "Back Home" button | Returns to inventory page |
| 22 | Verify cart is cleared | Cart badge is no longer visible (count = 0) |

---