# SauceDemo Login Automation - Playwright POM

A robust Playwright test suite implementing the Page Object Model (POM) pattern for testing the SauceDemo login functionality at https://www.saucedemo.com/.

## 🏗️ Project Structure

This project follows POM best practices with a clear separation of concerns:

```
automation-challenge-pw/
├── tests/
│   ├── e2e/
│   │   └── login/
│   │       └── login.spec.ts          # Login test cases
│   ├── fixtures/
│   │   └── base.fixture.ts            # Custom Playwright fixtures
│   ├── pages/
│   │   └── login.page.ts              # LoginPage page object
│   └── helpers/
│       ├── assertions.ts              # Reusable assertion helpers
│       └── credentials.ts             # Credential management
├── playwright.config.ts                # Playwright configuration
├── tsconfig.json                       # TypeScript configuration
├── .env                                # Environment variables (not in git)
├── .env.example                        # Environment variable template
└── package.json                        # Project dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Maciel98/Automation-Challenge-PW.git
cd Automation-Challenge-PW
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your test credentials (or use defaults):
```env
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
TEST_PASSWORD=secret_sauce
```

## 🧪 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests with Playwright Inspector
```bash
npm run test:debug
```

### Run tests with Playwright UI
```bash
npm run test:ui
```

### View HTML test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/e2e/login/login.spec.ts
```

## 📝 Page Object Model Implementation

### LoginPage ([`tests/pages/login.page.ts`](tests/pages/login.page.ts))

The LoginPage encapsulates all login interactions:

```typescript
import { LoginPage } from '../pages/login.page';

// Navigate to login
await loginPage.goto();

// Login with credentials
await loginPage.login(email, password);

// Login and wait for navigation
await loginPage.loginAndWaitForNavigation(email, password);

// Check for errors
const hasError = await loginPage.hasErrorMessage();
```

**Key Features:**
- ✅ Single class per page
- ✅ Locators as readonly properties
- ✅ Methods represent user intent (not low-level clicks)
- ✅ No assertions inside page object
- ✅ Stateless design

### Fixtures ([`tests/fixtures/base.fixture.ts`](tests/fixtures/base.fixture.ts))

Custom fixtures integrate POMs with Playwright's test framework:

```typescript
import { test, expect } from '../fixtures/base.fixture';

test('login test', async ({ loginPage }) => {
  await loginPage.goto();
  // loginPage is automatically created
});
```

**Benefits:**
- 🔄 Automatic lifecycle management
- 🎯 Clean test code with dependency injection
- 🧩 Composable fixtures

## 📁 Test Organization

### Test Structure

Tests follow the Arrange-Act-Assert (AAA) pattern:

```typescript
test('should login with valid credentials', async ({ loginPage, page }) => {
  // Arrange
  await loginPage.goto();

  // Act
  await loginPage.loginAndWaitForNavigation(email, password);

  // Assert
  await expect(page).toHaveURL(/\/account/);
});
```

### Helper Functions

**Credential Management** ([`tests/helpers/credentials.ts`](tests/helpers/credentials.ts)):
```typescript
import { getTestCredentials } from '../helpers/credentials';

const { email, password } = getTestCredentials();
```

**Assertion Helpers** ([`tests/helpers/assertions.ts`](tests/helpers/assertions.ts)):
```typescript
import { expectErrorMessage, expectURL } from '../helpers/assertions';

await expectErrorMessage(page, 'Invalid credentials');
await expectURL(page, /\/account/);
```

## 🎯 POM Best Practices Applied

| Pattern | Implementation |
|---------|---------------|
| **One class per page** | `LoginPage` for login page interactions |
| **Intent-revealing methods** | `login()`, `loginAndWaitForNavigation()` |
| **No assertions in POM** | All `expect()` calls in test files |
| **Stateless design** | Page objects don't cache data |
| **Fixture integration** | POMs available as test fixtures |
| **Proper locator strategy** | Role-based and attribute selectors |

## 🔧 Configuration

### Playwright Config ([`playwright.config.ts`](playwright.config.ts))

- **Test directory**: `./tests`
- **Parallel execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML (with trace on retry)

### TypeScript Config ([`tsconfig.json`](tsconfig.json))

- **Target**: ES2022
- **Module**: CommonJS
- **Strict mode**: Enabled
- **Type checking**: Full with Playwright types

## 📊 Test Coverage

Current test scenarios:

**Standard User (Valid Login):**
1. ✅ Navigate to login page
2. ✅ Login with valid credentials
3. ✅ Session persistence after login

**Locked Out User:**
4. ✅ Show error for locked_out_user
5. ✅ Prevent navigation to dashboard when locked

**Invalid Credentials:**
6. ✅ Show error with wrong username
7. ✅ Show error with wrong password
8. ✅ Show error with empty fields

**Error Banner Interactions:**
9. ✅ Dismiss error banner

**Total: 9 test scenarios**

## 🎨 How to Prompt for POM

When requesting new tests or features, use these patterns:

### For new page objects:
```
"Create a CheckoutPage page object using POM best practices with:
- Locator selectors for form fields
- Intent-revealing action methods
- No assertions inside the page object"
```

### For test cases:
```
"Write tests for the password reset flow using the POM pattern.
Use fixtures for setup and helpers for assertions."
```

### For enhancements:
```
"Add error validation tests to the login spec.
Follow POM conventions - keep assertions in tests, not page objects."
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Best Practices](.claude/skills/playwright-pom/page-object-model.md)

## 🤝 Contributing

1. Create a feature branch
2. Add page objects to `tests/pages/`
3. Write tests in `tests/e2e/`
4. Use fixtures from `tests/fixtures/`
5. Keep POMs stateless and assertion-free

## 📄 License

ISC
