---
description: Creates test specifications from page objects and user requirements
---

# Agent: Test Creator

<purpose>
Creates Playwright test specifications based on page objects and user requirements. Ensures all tests follow project conventions and best practices.
</purpose>

<objective>
Generate test specifications that:
- Follow AAA pattern (Arrange, Act, Assert)
- Use fixtures (not manual page object instantiation)
- Use test data from files (no hardcoded values)
- Are independent (no shared state)
- Have descriptive names ("should {expected behavior}")
- Are properly tagged per project conventions
</objective>

<required_reading>
**Read these BEFORE creating tests:**
1. `.agents/skills/playwright-pom/references/page-object-model.md` - POM patterns and test usage
2. `.agents/skills/playwright-pom/references/pom-vs-fixtures-vs-helpers.md` - When to use fixtures vs helpers
3. `docs/conventions/test-data.md` - Test data conventions
4. `docs/conventions/tagging.md` - Tagging strategy
5. `tests/helpers/credentials.ts` - Available credential helpers
6. `tests/test-data/*.json` - Available test data
</required_reading>

<process>
<steps>
## Step 1: Understand User Requirement

Parse the user's request into testable scenarios:

**Example:** "test that user can add items to cart and checkout"

Break down into:
1. Add item to cart
2. View cart with item
3. Proceed to checkout
4. Fill checkout information
5. Complete checkout
6. See order confirmation

## Step 2: Identify Required Page Objects and Fixtures

**CRITICAL: Always use fixtures from tests/fixtures/base.fixture.ts**

The project uses fixtures to provide pre-configured page objects. Check available fixtures:
```bash
cat tests/fixtures/base.fixture.ts
```

**Common fixtures:**
- `authenticatedInventoryPage` - Already logged in and on inventory page
- `authenticatedInventoryItemPage` - Already logged in and on product detail page
- `cartWithItemPage` - Already logged in with item in cart
- `checkoutStepOnePageWithData` - Already at checkout step one with item in cart
- `checkoutStepTwoPageReady` - Already at checkout step two with info filled
- `checkoutCompletePageReady` - Already at order confirmation page

**Check available page objects to understand available actions:**
```bash
cat tests/pages/inventory.page.ts
cat tests/pages/cart.page.ts
cat tests/pages/checkout-*.page.ts
```

**Pattern to follow:**
```bash
# Look at existing tests to understand the pattern
cat tests/tests/inventory/inventory.spec.ts
cat tests/tests/cart/cart.spec.ts
```

## Step 3: Check Existing Tests

**Avoid duplication - search for similar tests:**
```bash
grep -r "add to cart" tests/tests/
grep -r "checkout" tests/tests/
```

## Step 4: Read Test Data

**Check available test data:**
```bash
cat tests/helpers/credentials.ts
cat tests/test-data/inventory.json
cat tests/test-data/checkout.json
```

**Never hardcode values in tests!**

## Step 5: Determine Test File Location

**Organize by feature domain:**
```
tests/tests/
├── auth/              # Login, logout
├── inventory/         # Browse, filter, sort
├── cart/              # Add to cart, view cart
├── checkout/          # Checkout flow
│   ├── checkout-step-one/
│   ├── checkout-step-two/
│   └── checkout-complete/
├── navigation/        # Navbar, sidebar
└── E2E/              # Critical user paths
```

## Step 6: Create Test Specification

**CRITICAL: Use fixtures - NEVER manually instantiate page objects or login**

❌ **WRONG - Manual instantiation:**
```typescript
test('should display products', async ({ page }) => {
  const loginPage = new LoginPage(page); // WRONG
  await loginPage.goto();
  await loginPage.loginWithDefaults();
  // ...
});
```

✅ **CORRECT - Use fixtures:**
```typescript
test('should display products', async ({ authenticatedInventoryPage }) => {
  // authenticatedInventoryPage is already logged in and ready!
  const productCount = await authenticatedInventoryPage.getProductCount();
  expect(productCount).toBeGreaterThan(0);
});
```

**Test structure with fixtures:**
```typescript
import { test, expect } from '../../fixtures/base.fixture';
import testData from '../../test-data/{page}.json';

test.describe('{Feature Name}', () => {
  test('should {expected behavior}', async ({ fixtureName }) => {
    // Arrange - Set up the test (fixture provides pre-configured page objects)
    const expectedValue = testData.validValue;

    // Act - Execute the behavior
    await fixtureName.action(testData.valid);

    // Assert - Verify the outcome
    await expect(fixtureName.element).toBeVisible();
  });
});
```

## Step 7: Apply Tags

**Read tagging conventions:**
```bash
cat docs/conventions/tagging.md
```

**Apply appropriate tags:**
```typescript
test('should add item to cart', async ({ }) => {
  // test implementation
});
```

## Step 8: Common Test Patterns

**Happy Path Tests:**
```typescript
test('should complete checkout successfully', async ({
  inventory,
  cart,
  checkoutStepOne,
  checkoutStepTwo,
  checkoutComplete
}) => {
  // Arrange
  const testData = {
    item: 'Sauce Labs Backpack',
    ...checkoutData.valid
  };

  // Act
  await inventory.addItemToCart(testData.item);
  await inventory.goToCart();
  await cart.proceedToCheckout();
  await checkoutStepOne.fillInformation(testData);
  await checkoutStepOne.continue();
  await checkoutStepTwo.finish();

  // Assert
  await expect(checkoutComplete.message).toBeVisible();
});
```

**Error Handling Tests:**
```typescript
test('should show error with empty first name', async ({
  checkoutStepOne
}) => {
  // Arrange
  const testData = checkoutData.missingFirstName;

  // Act
  await checkoutStepOne.fillInformation(testData);
  await checkoutStepOne.continue();

  // Assert
  await expect(checkoutStepOne.errorMessage).toContain('First Name is required');
});
```

**Navigation Tests:**
```typescript
test('should navigate from inventory to cart', async ({
  inventory,
  cart
}) => {
  // Arrange - None needed

  // Act
  await inventory.goToCart();

  // Assert
  await expect(cart.page).toHaveURL(/.*cart.html/);
});
```
</steps>
</process>

<success_criteria>
Test creation is complete when:
- [ ] Test file created in correct feature folder
- [ ] **Tests use fixtures from base.fixture.ts (CRITICAL - no manual login or instantiation)**
- [ ] No hardcoded values (all from test-data files)
- [ ] AAA pattern with clear comments
- [ ] Descriptive test names ("should {expected behavior}")
- [ ] Tests are independent (no shared state)
- [ ] No raw selectors in tests
- [ ] Proper tags applied
- [ ] Each test uses appropriate fixtures for preconditions
- [ ] Pattern follows existing test files (e.g., tests/tests/inventory/inventory.spec.ts)
</success_criteria>

<output_format>
Return summary with:
```markdown
## Test Creation Complete! ✅

## Test Files Created
- `tests/tests/{feature}/{filename}.spec.ts`

## Test Scenarios Covered
1. **should {expected behavior}**: {description}
2. **should {expected behavior}**: {description}
3. **should {expected behavior}**: {description}

## Page Objects Used
- {PageName}: {how it was used}
- {PageName}: {how it was used}

## Test Data Used
- {filename}: {what data}

## Tags Applied
- {tag}: {reason}
- {tag}: {reason}

## Next Steps
1. Review the generated tests
2. Run tests: `npm test`
3. Run /validate to check quality
```
</output_format>

<anti_patterns>
**Avoid these common mistakes:**

❌ **Hardcoded test data:**
```typescript
await loginPage.login('standard_user', 'secret_sauce'); // WRONG
```
✅ Use test data files and credential helpers

❌ **Manual page object instantiation:**
```typescript
const login = new LoginPage(page); // WRONG
await login.goto();
await login.loginWithDefaults();
```
✅ **Use fixtures:**
```typescript
test('example', async ({ authenticatedInventoryPage }) => {
  // authenticatedInventoryPage is already logged in and ready!
});
```

❌ **Shared state between tests:**
```typescript
let cart: CartPage;
test.beforeAll(async ({ }) => {
  cart = await setupCart(); // WRONG - shared state
});
```
✅ Each test sets up its own data

❌ **Raw selectors in tests:**
```typescript
await page.getByTestId('username').fill('user'); // WRONG
```
✅ Use page object methods

❌ **Non-descriptive test names:**
```typescript
test('test1', async ({ }) => { }); // WRONG
test('login', async ({ }) => { }); // WRONG
```
✅ Use "should {expected behavior}"

❌ **Not using existing fixtures:**
```typescript
test('view product', async ({ inventoryItemPage }) => {
  const loginPage = new LoginPage(page); // WRONG - manually logging in
  await loginPage.goto();
  await loginPage.loginWithDefaults();
  await inventoryItemPage.goto(0);
});
```
✅ **Use appropriate fixture or create one if needed:**
```typescript
test('view product', async ({ authenticatedInventoryItemPage }) => {
  // Already logged in and on product detail page!
  const name = await authenticatedInventoryItemPage.getProductName();
  expect(name).toBeTruthy();
});
```

❌ **Action methods returning page objects:**
```typescript
// In page object:
async navigateToDetail(): Promise<DetailPage> { // WRONG - don't return page objects
  await this.click();
  return new DetailPage(this.page);
}
```
✅ **Action methods return void, tests create page objects:**
```typescript
// In page object:
async navigateToDetail() { // CORRECT - return void
  await this.click();
}

// In test:
test('navigates to detail', async ({ inventoryPage }) => {
  await inventoryPage.navigateToDetail(); // Action method
  const detailPage = new DetailPage(inventoryPage.page); // Test creates PO
  await detailPage.isLoaded();
});
```

**When to create new fixtures:**
- When you find yourself repeating the same setup code across multiple tests
- When tests need a specific pre-configured state (e.g., logged in, on a specific page, with items in cart)
- Pattern: Check `tests/fixtures/base.fixture.ts` and add new fixtures following the existing pattern
- Example: `authenticatedInventoryItemPage` was added to avoid manual login in every inventory-item test

**Page Object Method Patterns:**
- **Action methods (click, navigate, etc.)**: Return `void` or `Promise<void>` - NOT page objects
  - ✅ `async clickProductNameByIndex(index: number) { ... }`
  - ✅ `async backToProducts() { ... }`
  - ✅ `async proceedToCheckout() { ... }`
- **Get methods**: Return data values
  - ✅ `async getProductName(): Promise<string> { ... }`
  - ✅ `async getCartItemCount(): Promise<number> { ... }`
- **Navigation**: Tests create page objects manually, don't return from action methods
  - ❌ `async navigateToDetail(): Promise<DetailPage> { ... }` // WRONG!
  - ✅ `async clickDetail() { ... }` // Tests do: `const detailPage = new DetailPage(page)`

❌ **Missing AAA structure:**
```typescript
test('adds item', async ({ }) => {
  await addItem();
  await expect(cart).toHaveCount(1); // Unclear what's Arrange/Act/Assert
});
```
✅ Comment each phase clearly
</anti_patterns>

<test_categories>
**Types of tests to create:**

1. **Happy Path Tests** - Normal user flows with valid data
2. **Error Handling Tests** - Invalid inputs, missing required fields
3. **Navigation Tests** - Page transitions and URL verification
4. **E2E Tests** - Complete user journeys across multiple pages
5. **Edge Cases** - Boundary conditions, special characters, unicode
</test_categories>

<troubleshooting>
| Issue | Solution |
|-------|----------|
| "Page object not available" | Check if it's registered in fixtures/base.fixture.ts |
| "Test data missing" | Create tests/test-data/{feature}.json file |
| "Can't use fixture" | Ensure test imports from fixtures/base.fixture.ts |
| "Tests are duplicating" | Search existing tests before creating new ones |
| "Tag unclear" | Check docs/conventions/tagging.md for guidance |
</troubleshooting>
