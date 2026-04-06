# Workflow: Choose Between POM, Fixtures, or Helpers

<required_reading>
**Read these reference files NOW:**
1. ../references/pom-vs-fixtures-vs-helpers.md
2. ../references/pom-vs-fixtures-vs-helpers.md#project-specific-conditions
</required_reading>

<process>
## Step 1: Answer the Decision Questions

**What kind of reusable code are you writing?**

### Does it interact with a page/component in the browser?
- **YES**: Go to Step 2
- **NO**: Go to Step 3

### Does the page/component have 5+ interactions?
- **YES**: Go to Step 4
- **NO (1-4 interactions)**: Use a **helper function**

### Is it used in 3+ test files?
- **YES**: Create a **page object**
- **NO (1-2 files)**: Use a **helper function** or inline locators

### Does it need setup AND teardown (lifecycle)?
- **YES**: Create a **custom fixture**
- **NO**: Use page object or helper

### Is it a stateless utility (no browser, no side effects)?
- **YES**: Use a **helper function**
- **NO**: Consider page object or fixture

## Step 2: Quick Decision Flow

```
Browser interaction needed?
│
├── NO → Helper function (stateless utility)
│
└── YES
    │
    ├── 5+ interactions AND 3+ files?
    │   ├── YES → Page object + fixture
    │   └── NO → Helper function or inline
    │
    ├── Needs lifecycle (setup/teardown)?
    │   ├── YES → Custom fixture
    │   └── NO → Page object method or helper
    │
    └── Stateless (no browser)?
        └── Helper function
```

## Step 3: Helper Functions

**Best for:**
- Generating test data (emails, names, IDs)
- Formatting values (dates, currency)
- Building URLs or API payloads
- Pure functions with no side effects

**Example:**
```typescript
// helpers/test-data.ts
export function generateEmail(prefix = 'test'): string {
  return `${prefix}-${Date.now()}@example.com`;
}

// helpers/assertions.ts
export async function expectToast(page: Page, message: string) {
  const toast = page.getByRole('status').filter({ hasText: message });
  await expect(toast).toBeVisible();
}
```

**Use when:**
- Operation is stateless
- No browser interaction needed
- Simple, reusable logic
- No setup/teardown required

## Step 4: Page Objects

**Best for:**
- Pages with 5+ interactions
- Used across 3+ test files
- Need to compose components
- Complex user flows

**Example:**
```typescript
// tests/pages/checkout.page.ts
export class CheckoutPage {
  readonly path = '/checkout.html';
  readonly url = /\/checkout\.html/;

  async goto() {
    await this.page.goto(this.path);
  }

  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.form).toBeVisible();
  }

  async fillPaymentDetails(details: PaymentDetails) {
    // Multi-step interaction
  }
}
```

**Use when:**
- UI has many interactions
- Multiple tests need same actions
- Need component composition
- Navigation patterns

## Step 5: Custom Fixtures

**Best for:**
- Resources with lifecycle (create/destroy)
- Authentication state
- Database connections
- API clients
- Test data setup/teardown

**Example:**
```typescript
// fixtures/base.fixture.ts
export const test = base.extend<{
  authenticatedPage: Page;
  testUser: User;
}>({
  authenticatedPage: async ({ page, testUser }, use) => {
    // Setup: login
    await page.goto('/login');
    await login(page, testUser);

    await use(page);

    // Teardown: logout (automatic)
  },

  testUser: async ({ request }, use) => {
    const user = await createUser(request);

    await use(user);

    await deleteUser(request, user.id); // Runs even if test fails
  },
});
```

**Use when:**
- Need setup AND teardown
- Resource lifecycle management
- Wrapping page objects with auth
- Creating test data that needs cleanup

## Step 6: Project-Specific Rules

This project **requires**:
- All page objects injected via fixtures (never `new`)
- No `waitForURL()` in action methods
- Tests call `isLoaded()` to verify navigation
- Credentials via helpers, never hardcoded
- Components have no `path`, `url`, or `isLoaded()`

When in doubt:
1. Start with helper function
2. Promote to page object when interactions grow
3. Wrap in fixture when lifecycle needed
</process>

<success_criteria>
Pattern chosen when:
- [ ] Answered all decision questions
- [ ] Chosen pattern matches complexity level
- [ ] Project-specific rules applied
- [ ] Can justify why this pattern over others
- [ ] Implementation follows project conventions
</success_criteria>
