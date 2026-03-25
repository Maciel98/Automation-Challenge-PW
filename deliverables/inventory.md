# Test Scenario Inventory
**Swag Labs (SauceDemo)**

## Automation Timeline Legend
| Status | Abbreviation | Description |
|--------|--------------|-------------|
| **Automate-now** | Auto | Implement immediately - critical for regression |
| **Automate-later** | Later | Implement in future iteration - lower priority |
| **Manual-for-now** | Manual | Manual testing - requires human judgment |

## Overview

This inventory categorizes test scenarios for the Swag Labs e-commerce application at https://www.saucedemo.com.
**Application Type:** Product inventory and checkout system

---

## 1. Smoke Tests
> **Automation:** Automate-now | **Purpose:** Quick health checks for critical application paths

**Test Scenario:** Verify the application and basic authentication works

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| LOG-001 | Auto | Navigate to login page - Login page loads successfully with username and password fields visible |
| LOG-002 | Auto | Log in with standard_user credentials - User is authenticated and redirected to inventory page |
| INV-001 | Auto | View inventory page - Page displays 6 available products |
| E2E-001 | Auto | Complete full purchase flow - User logs in, adds item to cart, completes checkout, and receives order confirmation |
| INV-002 | Later | Add multiple different products to cart - All selected products are added and cart badge increments |

---

## 2. Core Regression Tests
> **Automation:** Automate-now | **Purpose:** Validate core functionality after code changes

#### OBS: Important to address that Regression tests are selected based on the following:
- Impact
- Historical Failures
- Business Critical
- Frequency of use

### Authentication

**Test Scenario:** Verify all login authentication paths work correctly

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| LOG-003 | Later | Verify session persistence after login - User remains authenticated when navigating between pages |
| LOG-004 | Later | Log in with locked_out_user credentials - Error message "Sorry, this user has been locked out" displays |
| LOG-005 | Auto | Attempt login with empty field/s - Validation error displays or user stays on login page |
| LOG-006 | Auto | Log in with incorrect credentials - Error message "Username and password do not match" displays |
| LOG-007 | Later | Navigate to any url other than login without logging in - User is redirected to login page |

### Inventory & Products

**Test Scenario:** Verify product browsing and cart operations

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| INV-003 | Later | Remove product from inventory page - Product is removed from cart and badge decrements |
| INV-004 | Later | Select sort by name (A-Z) - Products are sorted alphabetically from A to Z |
| INV-005 | Later | Select sort by name (Z-A) - Products are sorted alphabetically from Z to A |
| INV-006 | Later | Select sort by price (low to high) - Products are sorted by price ascending |
| INV-007 | Later | Select sort by price (high to low) - Products are sorted by price descending |

### Cart Functionality

**Test Scenario:** Verify cart operations and item management

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| CRT-001 | Later | Navigate to cart with single item - Cart page displays the added product |
| CRT-002 | Later | Navigate to cart with multiple items - Cart page displays all added products |
| CRT-004 | Later | Click remove button on item - Item disappears from cart list and badge decreases |
| CRT-005 | Later | Click checkout button from cart - User navigates to checkout step one page |
| CRT-006 | Later | Click continue shopping button - User navigates back to inventory page |
| CRT-007 | Later | Refresh page with items in cart - Cart contents persist after page refresh |

### Checkout Flow

**Test Scenario:** Verify complete checkout process

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| CO1-001 | Later | Complete all fields and click continue - User proceeds to checkout step two overview page |
| CO2-001 | Later | View checkout overview page - All cart items are displayed with correct details |
| CO2-002 | Later | Verify subtotal, tax, and total on overview - Calculations are correct (subtotal + tax = total) |
| CO2-003 | Later | Click finish button - Order is submitted and navigates to checkout complete page |
| CCO-001 | Later | Verify order confirmation page displays - Confirmation page loads with success message |
| CCO-002 | Later | Verify cart after order completion - Cart is empty and badge is removed |
| NAV-002 | Later | Cart badge shows count when items added - Badge displays correct number of items in cart |
| NAV-003 | Later | Cart badge increments when items added - Badge count increases with each added item |
| NAV-004 | Later | Cart badge decrements when items removed - Badge count decreases when items are removed |
| NAV-005 | Later | Cart badge not visible when cart is empty - Badge is hidden when no items in cart |
| NAV-006 | Later | Click cart icon to navigate to cart page - Cart page loads |
| SID-001 | Auto | Click logout - User is redirected to login page |
| SID-002 | Later | Verify all menu items are visible - All navigation options are displayed |
| SID-003 | Later | Click close button - Sidebar collapses and returns to previous page |
| NAV-001 | Later | Verify primary header is visible - Header displays correctly on page load |
| NAV-007 | Later | Click hamburger menu to open sidebar - Sidebar expands when menu clicked |

---

## 3. High-Risk Workflow Tests
> **Automation:** Automate-now | **Purpose:** Validate critical business paths that impact revenue

**Test Scenario:** Verify complete purchase journey from login to order confirmation

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| E2E-003 | Auto | Complete checkout with multiple items - Totals are calculated correctly and order completes |

---

## 4. Negative Paths
> **Automation:** Automate-now | **Purpose:** Verify error handling and validation

### Authentication Negative Paths

> **Note:** All authentication negative path tests are already covered in the Core Regression > Authentication section above (LOG-004, LOG-005, LOG-006, LOG-007).

### Checkout Negative Paths

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| CO1-002 | Auto | Click continue with empty fields - Validation error displays for each required field |
| E2E-005 | Later | Click checkout with empty cart - User goes to the flow and is charged zero (potential bug depending on ACs) |

### Performance & Special User Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| USR-001 | Later | Log in with problem_user and view inventory - Images appear broken or incorrect as expected |
| USR-002 | Later | Log in with error_user, add items and proceed to checkout - Errors occur during cart/checkout flow |
| USR-003 | Later | Log in with performance_glitch_user and navigate - Intentional performance delay is present |
| USR-004 | Later | Log in with visual_user and browse products - Layout renders correctly for visual comparison testing |

---

## 5. Edge Cases
> **Automation:** Automate-later | **Purpose:** Handle unusual inputs and boundary conditions

### Form Input Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| CO1-003 | Later | Enter very long name string (100+ chars) - Form handles unusually long input without errors |
| CO1-004 | Later | Enter special characters in name fields - System accepts special characters in first/last name |
| CO1-005 | Later | Enter postal code with spaces and various formats - Postal code field accepts multiple formats |

### Cart & Navigation Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| CRT-008 | Later | Navigate to cart via direct URL after login - Cart page loads and displays contents |
| CO1-006 | Later | Refresh browser during checkout step one - Form data is NOT preserved (no state persistence) |

### Inventory Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| INV-008 | Later | Add same product twice to cart - Cart shows quantity of 2 or two separate entries |

### Sidebar Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| SID-004 | Later | Click "All Items" menu item - Sidebar expands and shows all menu options |
| SID-005 | Later | Click "About" menu item - External link to Sauce Labs website opens |
| SID-006 | Later | Click "Reset App State" menu item - Application resets to initial state |

### Navbar Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| NAV-008 | Later | Click cart with 0 items - Cart page loads empty |

### Special User Edge Cases

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| USR-001 | Later | Log in with problem_user and view inventory - Images appear broken or incorrect as expected |
| USR-002 | Later | Log in with error_user, add items and proceed to checkout - Errors occur during cart/checkout flow |
| USR-003 | Later | Log in with performance_glitch_user and navigate - Intentional performance delay is present |
| USR-004 | Later | Log in with visual_user and browse products - Layout renders correctly for visual comparison testing |

---

## 6. Manual-Only Tests
> **Automation:** Manual-for-now | **Purpose:** Tests requiring human judgment or physical devices

| Test ID | Automation | Test Case |
|---------|------------|-----------|
| MAN-001 | Manual | Visual: Compare product images across browsers - Product images require visual comparison for consistency |
| MAN-002 | Manual | Mobile: Test responsive design on real devices - Mobile layout requires visual inspection on actual devices |

---

## Cross Reference

**For detailed test information organized by page, see: [inventoryList.md](./inventoryList.md)**

The inventoryList.md file contains:
- Tests organized by page (Login, Inventory, Cart, Checkout, E2E, Navbar, Sidebar)
- Complete test descriptions with tags
- Unique test IDs (LOG-001, INV-001, etc.)
- Full test coverage: 59 tests

## EXTRA

## Sample E2E Test Case Example

### Complete Purchase Flow - Detailed Step-by-Step

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

