# POM Prompting Guide

This guide explains how to effectively prompt for Page Object Model patterns in Playwright.

## 🎯 Key Principles

### 1. **Be Explicit About POM Structure**
Always mention "POM" or "Page Object Model" to ensure proper structure.

**Good:**
```
"Create a checkout test using the Page Object Model pattern"
```

**Less effective:**
```
"Create a checkout test"
```

### 2. **Specify the Components You Need**

When you know what you want, ask for it specifically:

```
"Create a CheckoutPage page object with:
- Locators for card number, expiry, CVC
- A fillPaymentDetails() method
- A pay() method that waits for confirmation
- Navigation methods"
```

### 3. **Describe Your Application Context**

Provide information about your app to get better results:

```
"I need to test a dashboard with:
- Sidebar navigation (Dashboard, Users, Settings)
- Data table with pagination
- Filter controls
- Action buttons on each row

Create page objects following POM best practices."
```

### 4. **Request Tests with Proper Structure**

```
"Write tests for the user profile update flow using POM:
1. Create a ProfilePage page object
2. Create a test spec with fixture integration
3. Include assertions in tests (not page objects)
4. Add validation tests"
```

## 📝 Effective Prompt Templates

### For New Page Objects

```
"Create a {PageName} page object for {URL/path} with:
- Locator selectors using getByRole/getByLabel
- Intent-revealing methods (not just clicks)
- Methods for navigation and form filling
- Error handling methods
- Follow POM best practices - no assertions inside"
```

**Example:**
```
"Create a CartPage page object for /cart with:
- Locators for cart items, quantities, remove buttons
- Methods: updateQuantity(), removeItem(), proceedToCheckout()
- Use data-testid selectors where available
- Follow POM conventions"
```

### For Test Cases

```
"Write {number} tests for {feature} using POM:
- Use fixtures from tests/fixtures/
- Import page objects, don't create them inline
- Keep assertions in test files
- Include positive and negative test cases
- Add proper test organization with describe blocks"
```

**Example:**
```
"Write 5 tests for password reset flow:
1. Request reset with valid email
2. Show error for non-existent email
3. Navigate to reset page from link
4. Update password with valid token
5. Show error for expired token

Use the POM pattern with fixtures."
```

### For Fixtures

```
"Create a custom fixture for {purpose}:
- Use test.extend() pattern
- Include setup and teardown
- Depend on page or other fixtures as needed
- Export both test and expect"
```

**Example:**
```
"Create an authenticatedUser fixture that:
- Creates a test user via API
- Logs them in via LoginPage
- Cleans up the user after test
- Returns the user data and page"
```

## 🚫 What NOT to Do

### Don't mix concerns
```
❌ "Create a page object that logs in AND creates test data AND cleans the database"
✅ "Create a LoginPage object and a separate fixture for user management"
```

### Don't put assertions in page objects
```
❌ "Add a method that verifies the user is logged in"
✅ "Create a login() method, let the test verify the result"
```

### Don't create god objects
```
❌ "Create an AppPage object for the entire application"
✅ "Create separate page objects: LoginPage, DashboardPage, SettingsPage"
```

## 🎨 Common Patterns

### 1. Page with Navigation
```
"Create a LoginPage that returns DashboardPage after successful login"
```

### 2. Component Composition
```
"Create a NavbarComponent that can be used across multiple page objects"
```

### 3. Error Handling
```
"Add methods for loginExpectingError() to test invalid credentials"
```

### 4. Dynamic Locators
```
"Use getter pattern for locators that depend on dynamic content"
```

## 💡 Pro Tips

1. **Specify your locator preference**: "Use data-testid selectors" or "Use aria labels"
2. **Mention TypeScript**: "Use TypeScript with proper type definitions"
3. **Request validation**: "Include TypeScript strict mode compliance"
4. **Ask for examples**: "Show both the page object and example test usage"
5. **Reference existing code**: "Follow the same pattern as LoginPage"

## 📚 Example Complete Prompt

```
I need to test the checkout flow for my e-commerce site.

Create:
1. A CheckoutPage page object with:
   - Locators for shipping form, payment form, order summary
   - Methods: fillShipping(), fillPayment(), placeOrder()
   - Use getByRole and getByLabel selectors
   - No assertions inside

2. A fixture that creates an authenticated session

3. A test spec with 3 scenarios:
   - Guest checkout
   - Logged-in user checkout
   - Invalid payment details

Use the same POM structure as the existing login tests.
Use TypeScript and follow Playwright best practices.
```

This gives clear context, specifies the exact components needed, and references existing patterns for consistency.
