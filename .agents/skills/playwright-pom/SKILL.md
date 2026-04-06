---
name: playwright-pom
description: Page Object Model patterns for Playwright — when to use POM, how to structure page objects, and when fixtures or helpers are a better fit. Use when creating page objects, fixing POM violations, choosing between POM/fixtures/helpers, or structuring Playwright test code.
---

<essential_principles>
## Core POM Principles

These principles apply to ALL workflows in this skill and cannot be skipped.

### Principle 1: Page Objects Encapsulate Actions, Not Locators

Page objects should read like user intent, not like low-level UI manipulation.

✅ **Good - intent-revealing:**
```typescript
await loginPage.login('admin', 'secret');
```

❌ **Bad - locator manipulation:**
```typescript
await loginPage.usernameInput.fill('admin');
await loginPage.passwordInput.fill('secret');
await loginPage.submitButton.click();
```

### Principle 2: Assertions Stay in Tests

Tests own all `expect()` calls. Page objects perform actions only.

✅ **Good - test asserts:**
```typescript
await loginPage.login('admin', 'secret');
await expect(page).toHaveURL('/dashboard');
```

❌ **Bad - page object asserts:**
```typescript
class LoginPage {
  async loginAndVerify(username: string, password: string) {
    // ... action ...
    await expect(this.page).toHaveURL('/dashboard'); // ← belongs in test
  }
}
```

### Principle 3: Action Methods Don't Verify Navigation

Methods that trigger navigation only perform the action. Tests verify with `isLoaded()`.

✅ **Good - action only:**
```typescript
async proceedToCheckout() {
  await this.checkoutButton.click();
}
```

❌ **Bad - action verifies:**
```typescript
async proceedToCheckout() {
  await this.checkoutButton.click();
  await this.page.waitForURL(/checkout/); // ← not this method's job
}
```

### Principle 4: Fixtures Are Required

All page objects are injected via fixtures. Never instantiate with `new` in tests.

✅ **Good - via fixture:**
```typescript
test('example', async ({ loginPage }) => {
  await loginPage.goto();
});
```

❌ **Bad - direct instantiation:**
```typescript
test('example', async ({ page }) => {
  const loginPage = new LoginPage(page); // ← use fixtures instead
});
```
</essential_principles>

<intake>
**What would you like to do?**

1. Create a new page object or component
2. Fix POM violations in existing code
3. Choose between POM, fixtures, or helpers
4. Something else

**Wait for response before proceeding.**
</intake>

<routing>
| Response | Next Action | Workflow |
|----------|-------------|----------|
| 1, "create", "new", "add", "make" | Guide through creating page object | `workflows/create-page-object.md` |
| 2, "fix", "violation", "refactor", "clean" | Guide through fixing violations | `workflows/fix-pom-violations.md` |
| 3, "choose", "decide", "when", "which" | Decision framework for patterns | `workflows/choose-pattern.md` |
| 4, other | Clarify intent, then select | Ask follow-up question |

**Intent-based routing:**
- "I need a LoginPage" → `workflows/create-page-object.md`
- "Remove waitForURL from methods" → `workflows/fix-pom-violations.md`
- "Should I use POM or helper?" → `workflows/choose-pattern.md`
- "Best way to organize tests" → `workflows/choose-pattern.md`

**After reading the workflow, follow it exactly.**
</routing>

<reference_index>
## Domain Knowledge

All reference files are in `references/`:

**Patterns & Structure:**
- `references/page-object-model.md` - Complete POM patterns, examples, and project conventions
- `references/pom-vs-fixtures-vs-helpers.md` - Decision framework for choosing between patterns

**Key sections in references:**
- Project-specific conventions (path/url, isLoaded, goto, fixtures)
- Anti-patterns to avoid
- Common patterns and recipes
- Troubleshooting guide
</reference_index>

<workflows_index>
## Workflows

All workflows are in `workflows/`:

| Workflow | Purpose | When to Use |
|----------|---------|-------------|
| `create-page-object.md` | Create new page objects or components | Building new pages/components, adding to test suite |
| `fix-pom-violations.md` | Fix common POM anti-patterns | Refactoring existing code, cleaning up violations |
| `choose-pattern.md` | Decide between POM/fixtures/helpers | Starting new feature, organizing test code |

Each workflow specifies which references to read and provides step-by-step procedures.
</workflows_index>

<project_overview>
## This Project's POM Structure

This project extends base POM patterns with specific rules:

**Required properties:**
- `path` - Route for `goto()` (e.g., `/inventory.html`)
- `url` - Regex for `isLoaded()` (e.g., `/\/inventory\.html/`)

**Required methods:**
- `goto()` - Navigate to page using `path`
- `isLoaded()` - Verify URL + one anchor element visible

**Action methods:**
- No `waitForURL()` calls
- No assertions
- No navigation verification
- Tests call `isLoaded()` after actions

**Fixtures:**
- All page objects registered in `tests/fixtures/base.fixture.ts`
- Tests receive page objects via fixture parameters
- Never use `new ClassName()` in tests

**Components:**
- Live in `tests/pages/components/`
- Composed inside page objects
- No `goto()`, `isLoaded()`, `path`, or `url`

See `references/page-object-model.md#pom-conventions--this-project` for complete details.
</project_overview>

<quick_examples>
## Common Quick Wins

**Create a basic page object:**
```typescript
export class YourPage {
  readonly page: Page;
  readonly path = '/your-route.html';
  readonly url = /\/your-route\.html/;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.mainElement).toBeVisible();
  }
}
```

**Use in test:**
```typescript
test('example', async ({ yourPage }) => {
  await yourPage.goto();
  await yourPage.isLoaded();
  // Do actions
  // Assertions in test
});
```

For complete patterns, see `workflows/create-page-object.md`
</quick_examples>

<success_criteria>
This skill is working correctly when:
- [ ] User receives intake question and routing happens automatically
- [ ] Workflows are loaded only when needed (progressive disclosure)
- [ ] References are read only when specified by workflow
- [ ] Core principles are always followed (not skipped)
- [ ] Page objects follow project conventions (path/url, isLoaded, fixtures)
- [ ] Tests use fixtures, not direct instantiation
- [ ] No waitForURL in action methods
- [ ] No assertions in page objects
- [ ] All navigation verified by tests calling isLoaded()
</success_criteria>
