# Project Guidelines for Claude AI

## Project Overview

**SauceDemo E2E Test Automation** - Playwright test suite implementing Page Object Model (POM) pattern for Swag Labs (https://www.saucedemo.com/).

---

## Knowledge Base Location

**CRITICAL:** Before writing any tests, read the application knowledge from:

- **`docs/app-knowledge/`** - Detailed page documentation with confirmed selectors, interactions, and flows
- **`docs/snapshots/`** - YAML snapshots with element locators and behaviors

### Available Documentation

| Page | Knowledge File | Snapshot File |
|------|----------------|---------------|
| Login | [docs/app-knowledge/login-page.md](docs/app-knowledge/login-page.md) | [docs/snapshots/login-page.yaml](docs/snapshots/login-page.yaml) |
| Inventory | [docs/app-knowledge/inventory-page.md](docs/app-knowledge/inventory-page.md) | [docs/snapshots/inventory-page.yaml](docs/snapshots/inventory-page.yaml) |
| Cart | [docs/app-knowledge/cart-page.md](docs/app-knowledge/cart-page.md) | [docs/snapshots/cart-page.yaml](docs/snapshots/cart-page.yaml) |
| Checkout | [docs/app-knowledge/checkout-pages.md](docs/app-knowledge/checkout-pages.md) | [docs/snapshots/checkout-*.yaml](docs/snapshots/) |

---

## Skills Usage Guidelines

### Test Structure: **playwright-pom** (Primary)

**ALWAYS use the `playwright-pom` skill for test creation and structure.**

When to use:
- ✅ Creating new page objects
- ✅ Writing test specs
- ✅ Structuring test files
- ✅ Implementing fixtures
- ✅ Creating helpers

How to invoke:
```
Use the playwright-pom skill to structure this test.
Follow POM best practices: intent-revealing methods, no assertions in page objects, fixture integration.
```

**Key POM Principles:**
1. One class per page
2. Intent-revealing methods (e.g., `login()`, `addToCart()`)
3. No assertions inside page objects
4. Stateless design
5. Use `data-test` attribute selectors
6. Fixture integration for dependency injection

**Component Composition:**
- Extract reusable UI components (navbar, modals, sidebars) into `pages/components/`
- Compose components inside page objects
- Example: `inventoryPage.navbar.navigateToCart()`

**Organization Rule:**
- `pages/` mirrors UI structure
- `tests/` mirrors user behavior/feature domains (auth/, checkout/, smoke/)
- They don't need to match 1:1

**Fixture Usage:**
- Use Playwright fixtures to instantiate page objects
- Avoid `beforeEach` for fixture setup

### Foundation: **playwright-core**

Use for:
- Project setup and configuration
- Playwright installation
- TypeScript configuration
- Reporter setup
- Debugging techniques
- Best practices for locators, assertions, network mocking

When to use:
- Initial project setup
- Configuring playwright.config.ts
- Setting up reporters (HTML, trace, etc.)
- Debugging test failures
- Understanding Playwright fundamentals

### CI/CD: **playwright-cli**

Use for:
- GitHub Actions setup
- CI/CD pipeline configuration
- Parallel sharding
- Test reporting in CI
- Deployment workflows

When to use:
- Setting up GitHub Actions workflows
- Configuring CI test runs
- Setting up artifact reporting
- Parallel execution configuration

---

## Test Creation Workflow

When asked to create tests:

### 1. Read Knowledge Base First

```bash
# Always read the relevant documentation files
Read docs/app-knowledge/<page-name>.md
Read docs/snapshots/<page-name>.yaml
```

### 2. Use Documented Selectors

**IMPORTANT:** Only use `data-test` attribute selectors documented in the knowledge base.

✅ **Correct:**
```typescript
this.usernameInput = page.locator('[data-test="username"]');
this.loginButton = page.locator('[data-test="login-button"]');
```

❌ **Avoid:**
```typescript
// Don't use text-based or role-based selectors unless data-test unavailable
this.loginButton = page.getByRole('button', { name: 'Login' });
```

### 3. Follow POM Structure

**Page Object Structure:**
```typescript
export class PageName {
  readonly page: Page;

  // Locators as readonly properties
  readonly elementName: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize locators
  }

  // Intent-revealing methods (no assertions)
  async actionMethod() {
    // Perform action
  }
}
```

**Test Structure:**
```typescript
import { test, expect } from '../fixtures/base.fixture';

test('scenario name', async ({ pageObject }) => {
  // Arrange
  await pageObject.goto();

  // Act
  await pageObject.performAction();

  // Assert
  await expect(page).toHaveURL(/expected-url/);
});
```

### 4. Fixture Integration

Use custom fixtures from `tests/fixtures/base.fixture.ts`:

```typescript
export const test = base.extend<MyFixtures>({
  // Page objects as fixtures
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});
```

---

## Test Tags

Playwright supports test tagging using `@` syntax in test titles. Tags enable filtering tests for different scenarios (smoke tests, regression, etc.).

### Tag Standards

```typescript
// Smoke tests - critical paths that must pass
test('should login @smoke @critical @P0', async ({ page }) => { });

// Feature-specific tags
test('should add to cart @smoke @cart @P0', async ({ page }) => { });
test('should complete checkout @smoke @checkout @P0', async ({ page }) => { });

// Priority levels
test('critical feature @P0', async ({ page }) => { });
test('important feature @P1', async ({ page }) => { });
test('nice to have @P2', async ({ page }) => { });

// Test types
test('full user journey @E2E @regression', async ({ page }) => { });
test('form validation @validation @negative', async ({ page }) => { });
```

### Running Tests by Tag

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run critical P0 tests
npx playwright test --grep @P0

# Run smoke tests for authentication only
npx playwright test --grep "@smoke and @auth"

# Run all E2E tests
npx playwright test --grep @E2E

# Exclude specific tags
npx playwright test --grep-invert @slow
```

### Tag Definitions

| Tag | Usage | Examples |
|-----|-------|----------|
| `@smoke` | Critical path tests that run on every commit | Login, add to cart, checkout |
| `@critical` | High-priority business-critical features | Payment flow, authentication |
| `@P0`, `@P1`, `@P2` | Priority levels (0=highest) | P0: blocking issues, P1: important, P2: nice-to-have |
| `@E2E` | End-to-end journey tests spanning multiple features | Complete purchase flow |
| `@regression` | Tests for regression prevention | Previously fixed bugs |
| `@auth`, `@cart`, `@checkout` | Feature-specific tags | Feature area categorization |
| `@validation` | Form validation and error handling | Required field validation |
| `@negative` | Negative test scenarios | Invalid inputs, error cases |

---

## Project Structure

```
tests/
├── tests/                  # Test specs organized by feature/domain
│   ├── auth/               # Authentication tests
│   │   └── login.spec.ts
│   ├── product/            # Product catalog tests
│   │   └── (product listing, filtering, sorting)
│   ├── cart/               # Shopping cart tests
│   │   └── (cart operations, calculations)
│   ├── checkout/           # Checkout flow tests
│   │   └── checkout-flow.spec.ts
│   ├── navigation/         # Navigation component tests
│   │   ├── navbar.spec.ts
│   │   └── sidebar.spec.ts
│   └── E2E/                # End-to-end critical path tests
│       └── critical-paths.spec.ts (tagged with @smoke)
├── pages/                  # Page objects (POM) - mirrors UI structure
│   ├── components/         # Reusable UI components
│   │   ├── navbar.page.ts
│   │   └── sidebar.page.ts
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   └── checkout*.page.ts
├── fixtures/               # Custom fixtures
│   └── base.fixture.ts
├── helpers/                # Helper functions
│   ├── credentials.ts
│   └── assertions.ts
└── test-data/              # Test data JSON files (no hardcoded values)
    ├── login.json
    ├── inventory.json
    ├── cart.json
    ├── checkout-step-one.json
    ├── checkout-step-two.json
    └── checkout-complete.json

docs/                       # Knowledge base (READ BEFORE CREATING TESTS)
├── app-knowledge/          # Page documentation
└── snapshots/              # Element snapshots
```

---

## Test Data

**CRITICAL:** All test data (except credentials) must be stored in `tests/test-data/` JSON files. **No hardcoded values in tests.**

### Test Data Location

**Directory:** `tests/test-data/`

**Available Test Data Files:**

| Page | Test Data File | Contains |
|------|----------------|----------|
| Login | `login.json` | Error messages, form labels |
| Inventory | `inventory.json` | Product list with IDs, names, prices, descriptions |
| Cart | `cart.json` | Cart labels, button text |
| Checkout Step 1 | `checkout-step-one.json` | Form labels, error messages |
| Checkout Step 2 | `checkout-step-two.json` | Summary labels, tax rate |
| Checkout Complete | `checkout-complete.json` | Success messages, labels |

### Using Test Data in Tests

**✅ CORRECT:**
```typescript
// Load test data from JSON
import inventoryData from '../../test-data/inventory.json';

test('verify product prices', async ({ inventoryPage }) => {
  await inventoryPage.goto();

  for (const product of inventoryData.products) {
    const price = await inventoryPage.getProductPrice(product.id);
    expect(price).toBe(product.price);
  }
});
```

**❌ WRONG:**
```typescript
// Don't hardcode values in tests
test('verify product prices', async ({ inventoryPage }) => {
  await inventoryPage.goto();
  const price = await inventoryPage.getProductPrice('sauce-labs-backpack');
  expect(price).toBe(29.99); // ❌ Hardcoded value
});
```

### Available Product Data

**File:** `tests/test-data/inventory.json`

```json
{
  "products": [
    { "id": "sauce-labs-backpack", "name": "Sauce Labs Backpack", "price": 29.99 },
    { "id": "sauce-labs-bike-light", "name": "Sauce Labs Bike Light", "price": 9.99 },
    { "id": "sauce-labs-bolt-t-shirt", "name": "Sauce Labs Bolt T-Shirt", "price": 15.99 },
    { "id": "sauce-labs-fleece-jacket", "name": "Sauce Labs Fleece Jacket", "price": 49.99 },
    { "id": "sauce-labs-onesie", "name": "Sauce Labs Onesie", "price": 7.99 },
    { "id": "test.allthethings()-t-shirt-(red)", "name": "Test.allTheThings() T-Shirt (Red)", "price": 15.99 }
  ]
}
```

### Adding New Test Data

When creating new tests:

1. **Check if test data exists:**
   ```bash
   ls tests/test-data/
   ```

2. **If file exists:** Add data to appropriate section
3. **If file doesn't exist:** Create new JSON file with meaningful structure
4. **Update CLAUDE.md:** Document the new test data file

### Credentials (Exception)

**Credentials are the ONLY exception** - stored in `.env` file:
- `STANDARD_USER=standard_user`
- `LOCKED_OUT_USER=locked_out_user`
- `TEST_PASSWORD=secret_sauce`

**Available Test Users:**
- `standard_user` - Normal user, full access
- `locked_out_user` - Locked account
- `problem_user` - Login works, images broken
- `performance_glitch_user` - Intentional delays
- `error_user` - Errors during cart/checkout
- `visual_user` - For visual testing

---

## Locator Strategy for SauceDemo

> **When to use**: Every time you need to find an element on the page. Start with documented `data-test` attributes.

### Quick Reference

```typescript
// Priority order for SauceDemo:
page.locator('[data-test="username"]')           // 1. data-test (always available)
page.locator('[data-test="login-button"]')       // 2. data-test for actions
page.locator('[data-test="inventory-item"]')     // 3. data-test for containers
page.getByRole('button', { name: '...' })        // 4. Only when data-test unavailable
page.getByText('...')                            // 5. Only for non-interactive content
```

### Decision Matrix

| Element Type | Recommended Locator | Example |
|---|---|---|
| Login inputs | `[data-test="username"]` | `page.locator('[data-test="username"]')` |
| Login button | `[data-test="login-button"]` | `page.locator('[data-test="login-button"]')` |
| Product items | `[data-test="inventory-item"]` | `page.locator('[data-test="inventory-item"]')` |
| Add to cart | `[data-test="add-to-cart-*"]` | `page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')` |
| Cart badge | `[data-test="shopping-cart-badge"]` | `page.locator('[data-test="shopping-cart-badge"]')` |
| Checkout fields | `[data-test="firstName"]` | `page.locator('[data-test="firstName"]')` |
| Action buttons | `[data-test="continue"]` | `page.locator('[data-test="continue"]')` |

### Real-World Examples

**TypeScript**
```typescript
// Login flow
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();

// Add to cart
await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

// Navigate to cart
await page.locator('[data-test="shopping-cart-link"]').click();

// Checkout flow
await page.locator('[data-test="firstName"]').fill('John');
await page.locator('[data-test="lastName"]').fill('Doe');
await page.locator('[data-test="postalCode"]').fill('12345');
await page.locator('[data-test="continue"]').click();
await page.locator('[data-test="finish"]').click();
```

**JavaScript**
```javascript
// Login flow
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();

// Add to cart
await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

// Navigate to cart
await page.locator('[data-test="shopping-cart-link"]').click();

// Checkout flow
await page.locator('[data-test="firstName"]').fill('John');
await page.locator('[data-test="lastName"]').fill('Doe');
await page.locator('[data-test="postalCode"]').fill('12345');
await page.locator('[data-test="continue"]').click();
await page.locator('[data-test="finish"]').click();
```

### Anti-Patterns to Avoid

| Don't Do This | Problem | Do This Instead |
|---|---|---|
| `page.getByRole('button', { name: 'Login' })` | Less stable than data-test | `page.locator('[data-test="login-button"]')` |
| `page.locator('.login-button')` | CSS classes can change | `page.locator('[data-test="login-button"]')` |
| `page.locator('#username')` | IDs are implementation details | `page.locator('[data-test="username"]')` |
| `page.getByText('Add to cart')` | Text may change or duplicate | `page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')` |
| `page.locator('input').nth(0)` | Fragile index-based selector | `page.locator('[data-test="username"]')` |

---

## Common Patterns

### Login Flow
```typescript
import { test } from '../../fixtures/base.fixture';

test('authenticated flow', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(username, password);
  // Continue with authenticated actions
});
```

### Navigation Between Pages
```typescript
// Use page objects to navigate
await inventoryPage.addToCart('sauce-labs-backpack');
await inventoryPage.navigateToCart();
// Now on cart page, use cartPage object
```

### Waiting for Navigation
```typescript
async loginAndWaitForDashboard(username: string, password: string) {
  await this.login(username, password);
  await this.page.waitForURL(/\/inventory\.html/, { timeout: 10000 });
}
```

---

## Test Creation Workflow

> **When to use**: Every time you create new tests or page objects.

### Quick Reference

```typescript
// Step 1: Read knowledge base
Read docs/app-knowledge/<page-name>.md
Read docs/snapshots/<page-name>.yaml

// Step 2: Use playwright-pom skill
Use the playwright-pom skill to structure this test

// Step 3: Create page object
export class PageName {
  readonly page: Page;
  readonly elementName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.elementName = page.locator('[data-test="..."]');
  }

  async intentRevealingMethod() {
    // Perform action (no assertions)
  }
}

// Step 4: Write test spec
test('scenario name', async ({ pageObject }) => {
  // Arrange
  await pageObject.goto();

  // Act
  await pageObject.performAction();

  // Assert
  await expect(page).toHaveURL(/expected-url/);
});
```

### Test Creation Checklist

| Step | Action | Verify |
|------|--------|--------|
| 1 | Read `docs/app-knowledge/<page>.md` | ✅ Understand page interactions |
| 2 | Read `docs/snapshots/<page>.yaml` | ✅ Get confirmed selectors |
| 3 | Check `tests/test-data/<page>.json` | ✅ Use test data, no hardcoding |
| 4 | Use `playwright-pom` skill | ✅ Follow POM structure |
| 5 | Create page object | ✅ No assertions inside |
| 6 | Use `data-test` selectors | ✅ From knowledge base |
| 7 | Write test spec | ✅ AAA pattern, use test data |
| 8 | Use fixtures | ✅ Dependency injection |
| 9 | Run tests | ✅ `npm test` passes |

### Common Patterns

**Login Flow Pattern**
```typescript
// TypeScript
test('authenticated flow', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(username, password);
  // Continue with authenticated actions
});
```

```javascript
// JavaScript
test('authenticated flow', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(username, password);
  // Continue with authenticated actions
});
```

**Navigation Between Pages Pattern**
```typescript
// TypeScript
// Use page objects to navigate
await inventoryPage.addToCart('sauce-labs-backpack');
await inventoryPage.navigateToCart();
// Now on cart page, use cartPage object
```

```javascript
// JavaScript
// Use page objects to navigate
await inventoryPage.addToCart('sauce-labs-backpack');
await inventoryPage.navigateToCart();
// Now on cart page, use cartPage object
```

**Waiting for Navigation Pattern**
```typescript
// TypeScript
async loginAndWaitForDashboard(username: string, password: string) {
  await this.login(username, password);
  await this.page.waitForURL(/\/inventory\.html/, { timeout: 10000 });
}
```

```javascript
// JavaScript
async loginAndWaitForDashboard(username, password) {
  await this.login(username, password);
  await this.page.waitForURL(/\/inventory\.html/, { timeout: 10000 });
}
```

---

## Getting Started Commands

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View HTML report
npm run test:report

# Run specific test file
npx playwright test tests/e2e/login/login.spec.ts
```

---

## Important Notes

- **SauceDemo is a demo app** - No real payments, no persistent database
- **All state is client-side** - Cart clears on logout, no order history
- **6 products available** - Documented in inventory-page.md
- **3-step checkout** - Information → Overview → Complete
- **Tax rate ~8%** - Calculated automatically
- **No API testing** - All interactions through UI

---

## Summary

✅ **Always read `docs/app-knowledge/` before creating tests**
✅ **Use `playwright-pom` skill for test structure**
✅ **Use documented `data-test` selectors from `docs/snapshots/`**
✅ **Use test data from `tests/test-data/` - no hardcoded values**
✅ **Follow POM best practices: no assertions in page objects**
✅ **Use fixtures for clean test code**

❌ **Don't skip reading the knowledge base**
❌ **Don't guess selectors - use documented ones**
❌ **Don't hardcode test data - use JSON files**
❌ **Don't put assertions in page objects**
❌ **Don't use text-based selectors when `data-test` available**

---

## Related

- [Knowledge Base](docs/app-knowledge/) - Detailed page documentation with selectors and interactions
- [Snapshots](docs/snapshots/) - YAML files with element locators and behaviors
- [.agents/skills/playwright-pom/](.agents/skills/playwright-pom/) - Page Object Model patterns and best practices
- [.agents/skills/playwright-core/](.agents/skills/playwright-core/) - Playwright fundamentals, locators, assertions
- [.agents/skills/playwright-ci/](.agents/skills/playwright-ci/) - CI/CD setup with GitHub Actions
- [Playwright Documentation](https://playwright.dev) - Official Playwright docs
- [deliverables/inventory.md](deliverables/inventory.md) - Test scenario inventory for SauceDemo
- [deliverables/testStrategy.md](deliverables/testStrategy.md) - Test strategy and coverage model

