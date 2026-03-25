# Test Inventory - Organized by Page
**Swag Labs (SauceDemo)**

**Total Test Cases: 56**

## Login Page
**Tests: 7**

### Page Navigation
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| LOG-001 | P0 | P | Navigate to login page - Login page loads successfully with username and password fields visible | @smoke @regression |

### Authentication - Valid Credentials
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| LOG-002 | P0 | P | Log in with standard_user credentials - User is authenticated and redirected to inventory page | @smoke @regression |
| LOG-003 | P2 | P | Verify session persistence after login - User remains authenticated when navigating between pages | |

### Authentication - Invalid Credentials
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| LOG-004 | P2 | N | Log in with locked_out_user credentials - Error message "Sorry, this user has been locked out" displays | |
| LOG-005 | P1 | N | Attempt login with empty field/s - Validation error displays or user stays on login page | @regression |
| LOG-006 | P1 | N | Log in with incorrect credentials - Error message "Username and password do not match" displays | @regression |

### Security & Redirects
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| LOG-007 | P1 | N | Navigate to any url other than login without logging in - User is redirected to login page | @regression |

---

## Inventory Page
**Tests: 8**

### Page Display
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| INV-001 | P0 | P | View inventory page - Page displays 6 available products | @smoke @regression |

### Add to Cart
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| INV-002 | P0 | P | Add multiple different products to cart - All selected products are added and cart badge increments | @smoke @regression |

### Remove from Cart
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| INV-003 | P1 | P | Remove product from inventory page - Product is removed from cart and badge decrements | @regression |
| INV-008 | P2 | P | Add same product twice to cart - Cart shows quantity of 2 or two separate entries |

### Sorting
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| INV-004 | P1 | P | Select sort by name (A-Z) - Products are sorted alphabetically from A to Z | @regression |
| INV-005 | P1 | P | Select sort by name (Z-A) - Products are sorted alphabetically from Z to A | @regression |
| INV-006 | P1 | P | Select sort by price (low to high) - Products are sorted by price ascending | @regression |
| INV-007 | P1 | P | Select sort by price (high to low) - Products are sorted by price descending | @regression |

---

## Cart Page
**Tests: 7**

### Cart Contents
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CRT-001 | P2 | P | Navigate to cart with single item - Cart page displays the added product | |
| CRT-002 | P2 | P | Navigate to cart with multiple items - Cart page displays all added products | |

### Cart Actions
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CRT-004 | P1 | P | Click remove button on item - Item disappears from cart list and badge decreases | @regression |
| CRT-005 | P0 | P | Click checkout button from cart - User navigates to checkout step one page | @smoke @regression |
| CRT-006 | P1 | P | Click continue shopping button - User navigates back to inventory page | @regression |

### State Persistence
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CRT-007 | P1 | P | Refresh page with items in cart - Cart contents persist after page refresh | @regression |
| CRT-008 | P2 | P | Navigate to cart via direct URL after login - Cart page loads and displays contents

---

## Checkout Step One (Your Information)
**Tests: 6**

### Form Submission - Valid Data
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO1-001 | P2 | P | Complete all fields and click continue - User proceeds to checkout step two overview page | |

### Form Submission - Invalid Data
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO1-002 | P1 | N | Click continue with empty fields - Validation error displays for each required field | @regression |

### Form Input Edge Cases
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO1-003 | P2 | N | Enter very long name string (100+ chars) - Form handles unusually long input without errors |
| CO1-004 | P2 | P | Enter special characters in name fields - System accepts special characters in first/last name |
| CO1-005 | P2 | P | Enter postal code with spaces and various formats - Postal code field accepts multiple formats |

### State Persistence
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO1-006 | P2 | P | Refresh browser during checkout step one - Form data is NOT preserved (no state persistence) |

---

## Checkout Step Two (Overview)
**Tests: 3**

### Page Display
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO2-001 | P2 | P | View checkout overview page - All cart items are displayed with correct details | |

### Price Calculations
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO2-002 | P0 | P | Verify subtotal, tax, and total on overview - Calculations are correct (subtotal + tax = total) | @smoke @regression|

### Complete Order
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CO2-003 | P0 | P | Click finish button - Order is submitted and navigates to checkout complete page | @smoke @regression |

---

## Checkout Complete
**Tests: 2**

### Order Confirmation
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CCO-001 | P2 | P | Verify order confirmation page displays - Confirmation page loads with success message | |

### Cart State After Order
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| CCO-002 | P2 | P | Verify cart after order completion - Cart is empty and badge is removed | |

---

## E2E Workflows
**Tests: 3**

### Full Purchase Flow
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| E2E-001 | P1 | P | Complete full purchase flow - User logs in, adds item to cart, completes checkout, and receives order confirmation | @regression |
| E2E-003 | P1 | P | Complete checkout with multiple items - Totals are calculated correctly and order completes | @regression |

### Edge Cases
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| E2E-005 | P2 | N | Click checkout with empty cart - User goes to the flow and is charged zero (potential bug depending on ACs) |

---

## Navbar
**Tests: 8**

### Visibility
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| NAV-001 | P2 | P | Verify primary header is visible - Header displays correctly on page load | |

### Cart Badge
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| NAV-002 | P2 | P | Cart badge shows count when items added - Badge displays correct number of items in cart |  |
| NAV-003 | P2 | P | Cart badge increments when items added - Badge count increases with each added item |  |
| NAV-004 | P2 | P | Cart badge decrements when items removed - Badge count decreases when items are removed |  |
| NAV-005 | P2 | P | Cart badge not visible when cart is empty - Badge is hidden when no items in cart |  |

### Navigation
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| NAV-006 | P2 | P | Click cart icon to navigate to cart page - Cart page loads | |
| NAV-007 | P2 | P | Click hamburger menu to open sidebar - Sidebar expands when menu clicked |  |
| NAV-008 | P2 | P | Click cart with 0 items - Cart page loads empty |

---

## Sidebar
**Tests: 6**

### Logout
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| SID-001 | P0 | P | Click logout - User is redirected to login page | @smoke @regression |

### Menu Display
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| SID-002 | P2 | P | Verify all menu items are visible - All navigation options are displayed | |

### Menu Items
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| SID-004 | P2 | P | Click "All Items" menu item - Sidebar expands and shows all menu options | |
| SID-005 | P2 | P | Click "About" menu item - External link to Sauce Labs website opens | |

### Sidebar Actions
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| SID-003 | P1 | P | Click close button - Sidebar collapses and returns to previous page | @regression |
| SID-006 | P2 | P | Click "Reset App State" menu item - Application resets to initial state | |

---

## Special User Types
**Tests: 4**

### Problem User
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| USR-001 | P2 | N | Log in with problem_user and view inventory - Images appear broken or incorrect as expected |

### Error User
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| USR-002 | P2 | N | Log in with error_user, add items and proceed to checkout - Errors occur during cart/checkout flow |

### Performance Glitch User
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| USR-003 | P2 | P | Log in with performance_glitch_user and navigate - Intentional performance delay is present |

### Visual User
| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| USR-004 | P2 | P | Log in with visual_user and browse products - Layout renders correctly for visual comparison testing |

---

## Manual-Only Tests
**Tests: 2**

| Test ID | Priority | Path | Test Case | Tags |
|---------|----------|------|-----------|------|
| MAN-001 | P3 | P | Visual: Compare product images across browsers - Product images require visual comparison for consistency |
| MAN-002 | P3 | P | Mobile: Test responsive design on real devices - Mobile layout requires visual inspection on actual devices |

---

## Prefix Legend
| Page | Prefix |
|------|--------|
| Login | LOG |
| Inventory | INV |
| Cart | CRT |
| Checkout Step One | CO1 |
| Checkout Step Two | CO2 |
| Checkout Complete | CCO |
| E2E | E2E |
| Navbar | NAV |
| Sidebar | SID |
| Special Users | USR |
| Manual | MAN |

## Tag Legend
| Tag | Description |
|-----|-------------|
| @smoke | Critical path tests - run on every commit |
| @regression | Tests for regression prevention |

## Priority Legend
| Priority | Level | Description | Automation Timeline |
|----------|-------|-------------|---------------------|
| **P0** | Critical | Core application functionality - blocking issues if failed | Automate-now |
| **P1** | High | Important features - significant impact if failed | Automate-now |
| **P2** | Medium | Edge cases, special user types - moderate impact | Automate-later |
| **P3** | Low | Visual checks, manual-only - low automation priority | Manual-for-now |

## Test Path Legend
| Type | Description |
|------|-------------|
| **P** | Positive - Valid inputs and expected happy paths |
| **N** | Negative - Invalid inputs, error conditions, edge cases |

---

## Test Statistics

### Priority Distribution
| Priority | Count | Percentage |
|----------|-------|------------|
| **P0 (Critical)** | 8 | 14% |
| **P1 (High)** | 13 | 23% |
| **P2 (Medium)** | 33 | 59% |
| **P3 (Low)** | 2 | 4% |
| **Total** | **56** | **100%** |

### Test Type Distribution
| Type | Count | Percentage |
|------|-------|------------|
| **Positive (P)** | 47 | 84% |
| **Negative (N)** | 9 | 16% |
| **Total** | **56** | **100%** |

### Tests by Page
| Page | Count | Percentage |
|------|-------|------------|
| Login | 7 | 13% |
| Inventory | 8 | 14% |
| Cart | 7 | 13% |
| Checkout Step One | 6 | 11% |
| Checkout Step Two | 3 | 5% |
| Checkout Complete | 2 | 4% |
| E2E Workflows | 3 | 5% |
| Navbar | 8 | 14% |
| Sidebar | 6 | 11% |
| Special Users | 4 | 7% |
| Manual | 2 | 4% |
| **Total** | **56** | **100%** |

### Tag Usage
| Tag | Count |
|-----|-------|
| @smoke | 9 |
| @regression | 17 |

### Automation Timeline
| Category | Count | Percentage |
|----------|-------|------------|
| **Automate-now** | 21 | 38% |
| **Automate-later** | 33 | 59% |
| **Manual-for-now** | 2 | 3% |
| **Total** | **56** | **100%** |
