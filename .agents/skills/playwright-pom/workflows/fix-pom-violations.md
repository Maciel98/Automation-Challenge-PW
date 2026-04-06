# Workflow: Fix POM Violations

<required_reading>
**Read these reference files NOW:**
1. ../references/page-object-model.md#pom-conventions--this-project
2. ../references/page-object-model.md#anti-patterns
</required_reading>

<process>
## Step 1: Identify Violation Type

Read the page object file and check for:

**Common violations:**
- `waitForURL()` calls in action methods
- Assertions inside page object methods
- Hardcoded credentials or test data
- Missing `isLoaded()` method
- Missing `path` and `url` properties
- Direct instantiation with `new` in tests
- Methods that span multiple pages

## Step 2: Remove waitForURL from Actions

**Before:**
```typescript
async proceedToCheckout() {
  await this.checkoutButton.click();
  await this.page.waitForURL(/checkout/); // ❌ Violation
}
```

**After:**
```typescript
async proceedToCheckout() {
  await this.checkoutButton.click();
  // ✅ Test verifies with isLoaded()
}
```

## Step 3: Move Assertions to Tests

**Before:**
```typescript
// ❌ In page object
async loginAndVerify(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
  await expect(this.page).toHaveURL('/dashboard'); // ❌ Assertion
}
```

**After:**
```typescript
// ✅ In page object - action only
async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
}

// ✅ In test - assertions
await loginPage.login('user', 'pass');
await expect(page).toHaveURL('/dashboard');
```

## Step 4: Replace Hardcoded Values

**Before:**
```typescript
// ❌ Hardcoded in test
await loginPage.login('standard_user', 'secret_sauce');
```

**After:**
```typescript
// ✅ Use helper
await loginPage.loginWithDefaults();

// Or for specific user type:
const { username, password } = getLockedOutUserCredentials();
await loginPage.loginExpectingError(username, password);
```

## Step 5: Add Missing isLoaded Method

```typescript
async isLoaded() {
  await expect(this.page).toHaveURL(this.url);
  await expect(this.anchorElement).toBeVisible(); // One stable element
}
```

Choose anchor element:
- Always present when page loads
- Represents primary content
- Uses `data-test` locator
- ONE element only

## Step 6: Add path and url Properties

```typescript
// For goto() - relative path
readonly path = '/inventory.html';

// For isLoaded() - regex for verification
readonly url = /\/inventory\.html/;

async goto() {
  await this.page.goto(this.path);
}
```

## Step 7: Ensure Fixture Injection

**Before:**
```typescript
// ❌ Direct instantiation in test
test('example', async ({ page }) => {
  const loginPage = new LoginPage(page);
});
```

**After:**
```typescript
// ✅ Via fixture
test('example', async ({ loginPage }) => {
  // Already instantiated
});
```

Register in `tests/fixtures/base.fixture.ts` if not present.

## Step 8: Remove Cross-Domain Methods

**Before:**
```typescript
// ❌ Method that crosses page boundaries
async loginAndAddToCart(item: string) {
  await this.login();
  await this.inventoryPage.addToCart(item); // Violates SRP
}
```

**After:**
```typescript
// ✅ Chain in test
await loginPage.goto();
await loginPage.loginWithDefaults();
await inventoryPage.isLoaded();
await inventoryPage.addToCart('item');
```
</process>

<success_criteria>
Violations fixed when:
- [ ] No `waitForURL()` in action methods
- [ ] No assertions in page object methods
- [ ] No hardcoded credentials or test data
- [ ] All pages have `isLoaded()` method
- [ ] All pages have `path` and `url` properties
- [ ] Tests use fixtures, not `new ClassName()`
- [ ] No methods span multiple page objects
- [ ] Components don't have `goto()`, `isLoaded()`, `path`, or `url`
</success_criteria>
