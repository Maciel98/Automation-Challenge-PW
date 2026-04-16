# Allure Reporting Guide

This guide explains how to use Allure reporting in your Playwright test suite.

## 🚀 Quick Start

### View Reports Locally

```bash
# Run tests with Allure reporter
npm test

# Generate and view Allure report
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report

# Or use Allure CLI (auto-regenerates on changes)
npx allure serve allure-results
```

### View Reports in CI

1. **Artifacts**: After each GitHub Actions run, download the `*-allure-report` artifact
2. **GitHub Pages Dashboard**: Enable GitHub Pages to get a persistent dashboard URL

## 📊 GitHub Pages Dashboard Setup

### Enable GitHub Pages

1. Go to **Settings** > **Pages**
2. Set **Source** to **GitHub Actions**
3. Your dashboard will be available at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

### Features

- ✅ Test history and trends over time
- 🔍 Filter by status, severity, suite, and more
- 📸 Detailed test logs, screenshots, and traces
- 📈 Compare builds and track flaky tests
- 🎨 Beautiful graphs and statistics

## 🏷️ Adding Allure Metadata to Tests

### Basic Usage

```typescript
import { test, expect } from '@playwright/test';
import { Allure, Severity, Tags } from '../helpers/allure';

test('should login successfully', async ({ page }) => {
  // Add Allure metadata
  Allure.epic('Authentication');
  Allure.feature('Login');
  Allure.story('User logs in with valid credentials');
  Allure.severity(Severity.CRITICAL);
  Allure.tag(Tags.SMOKE, Tags.AUTH);
  Allure.owner('QA Team');

  // Test implementation...
  await page.goto('/login');
  // ... test code
});
```

### Complete Example

```typescript
import { test, expect } from '@playwright/test';
import { Allure, Severity, Tags } from '../helpers/allure';

test.describe('Shopping Cart', () => {
  test('should add item to cart @smoke @regression', async ({ page, loginPage, inventoryPage }) => {
    // Allure metadata
    Allure.epic('E-Commerce');
    Allure.feature('Shopping Cart');
    Allure.story('User adds product to cart');
    Allure.severity(Severity.CRITICAL);
    Allure.tag(Tags.SMOKE, Tags.CART, Tags.HAPPY_PATH);
    Allure.description('Verifies that a standard user can add items to the shopping cart');
    Allure.owner('Alejandro');

    // Test implementation
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addItemToCart('sauce-labs-backpack');

    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
  });

  test('should remove item from cart @regression', async ({ page, cartPage }) => {
    Allure.epic('E-Commerce');
    Allure.feature('Shopping Cart');
    Allure.story('User removes product from cart');
    Allure.severity(Severity.NORMAL);
    Allure.tag(Tags.REGRESSION, Tags.CART);
    Allure.issue('https://github.com/org/repo/issues/123', 'Bug-123');

    // Test implementation...
  });
});
```

### Using Allure Steps

```typescript
test('checkout flow', async ({ page }) => {
  Allure.epic('E-Commerce');
  Allure.feature('Checkout');

  await Allure.step('Navigate to checkout', async () => {
    await page.goto('/checkout');
  });

  await Allure.step('Fill checkout information', async () => {
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '90210');
  });

  await Allure.step('Complete checkout', async () => {
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');
  });
});
```

### Attaching Files and Screenshots

```typescript
test('with attachments', async ({ page }) => {
  Allure.epic('Debugging');

  // Take and attach screenshot
  await page.screenshot({ path: 'screenshot.png' });
  await Allure.attachScreenshot('Login Page', 'screenshot.png');

  // Attach JSON data
  const testData = { user: 'test', items: [1, 2, 3] };
  await Allure.attachFile('Test Data', JSON.stringify(testData, null, 2), 'application/json');

  // Attach text log
  await Allure.attachFile('Debug Log', 'Some debug information', 'text/plain');
});
```

## 📋 Severity Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| **TRIVIAL** | Cosmetic issues, typos | Spell check on error messages |
| **MINOR** | Minor functionality loss | Secondary navigation broken |
| **NORMAL** | Default for most tests | Standard feature verification |
| **MAJOR** | Core functionality broken | Cannot add items to cart |
| **CRITICAL** | Complete failure point | Login, payment, checkout broken |

## 🏷️ Common Tags

- `@smoke` - Critical path tests (run in all environments)
- `@regression` - Full suite tests (comprehensive validation)
- `@auth` - Authentication-related tests
- `@cart` - Shopping cart tests
- `@checkout` - Checkout process tests
- `@inventory` - Product catalog tests
- `@navigation` - Navigation and routing tests
- `@api` - API integration tests
- `@ui` - UI-specific tests
- `@negative` - Error scenarios and edge cases
- `@happy-path` - Positive test scenarios

## 🔗 External Links

```typescript
// Link to JIRA ticket
Allure.issue('https://jira.company.com/browse/TEST-123', 'TEST-123');

// Link to GitHub Issue
Allure.issue('https://github.com/org/repo/issues/42');

// Link to test documentation
Allure.tms('https://docs.company.com/test-cases/TC-001', 'TC-001');

// Link to requirements
Allure.link('https://docs.company.com/req/REQ-456', 'Requirement', 'REQ-456');
```

## 📱 CI/CD Integration

### GitHub Actions Artifacts

After each test run, three Allure artifacts are available:

1. **`<job>-allure-results`** - Raw Allure data (JSON/XML)
2. **`<job>-allure-report`** - Generated HTML report
3. **`<job>-html-report`** - Playwright's built-in report

### GitHub Pages Deployment

The Allure report workflow automatically deploys to GitHub Pages:

- Runs after every test completion
- Maintains historical data
- Public URL for stakeholders
- Auto-updates on each run

## 🎯 Best Practices

1. **Always add metadata** - Epic, feature, and story help organize reports
2. **Use severity wisely** - Critical = blocks release; Trivial = nice to have
3. **Tag consistently** - Use `@smoke` and `@regression` consistently
4. **Add owners** - Know who to contact when tests fail
5. **Link tickets** - Connect tests to JIRA/GitHub issues
6. **Use steps** - Break complex tests into named steps for clarity
7. **Attach context** - Screenshots, logs, and data help debugging

## 📊 Dashboard Features

### Overview Tab
- Pass/fail rate trends
- Test execution duration
- Severity breakdown
- Tag statistics

### Suites Tab
- Grouped by test file/describe
- Filter by status
- Compare suites

### Behaviors Tab
- Grouped by Epic > Feature > Story
- Filter by status and severity
- Business-facing view

### Graphs Tab
- Duration trends
- Severity distribution
- Tag frequency
- Flaky test detection

### Timeline Tab
- Test execution order
- Parallel execution visualization
- Duration comparison

## 🐛 Troubleshooting

### Report is empty or missing tests

**Cause**: Tests ran but Allure data wasn't generated

**Fix**: Check that Allure reporter is configured in `playwright.config.ts`:
```typescript
reporter: [
  ['dot'],
  ['html'],
  ['allure-playwright'], // ← Required
]
```

### History not showing between runs

**Cause**: History folder not persisted

**Fix**: The GitHub Pages workflow handles this automatically. For local viewing:
```bash
# Copy previous history before generating
cp -r allure-history allure-results/history
npx allure generate allure-results --clean -o allure-report
```

### Screenshots not appearing in Allure report

**Cause**: Screenshots in `test-results/` but not attached

**Fix**:
```typescript
await page.screenshot({ path: 'test-results/screenshot.png' });
await Allure.attachScreenshot('Failure Screenshot', 'test-results/screenshot.png');
```

## 📚 Additional Resources

- [Allure Playwright Documentation](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
- [Allure Report Features](https://docs.qameta.io/allure/)
- [Playwright Reporters](https://playwright.dev/docs/test-reporters)
