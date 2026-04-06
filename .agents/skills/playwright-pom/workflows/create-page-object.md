# Workflow: Create Page Object

<required_reading>
**Read these reference files NOW:**
1. ../references/page-object-model.md
2. ../references/page-object-model.md#pom-conventions--this-project
</required_reading>

<process>
## Step 1: Determine Page Object Type

Ask yourself:
- Is this a full page (has a URL route)?
- Is this a component (embedded in multiple pages)?

**Full page**: Create in `tests/pages/` with `*.page.ts` naming
**Component**: Create in `tests/pages/components/` with `*.component.ts` naming

## Step 2: Define Basic Structure

For a **full page**:
```typescript
export class YourPage {
  readonly page: Page;
  readonly path = '/your-route.html';  // For goto()
  readonly url = /\/your-route\.html/; // For isLoaded()

  constructor(page: Page) {
    this.page = page;
    // Define locators here
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async isLoaded() {
    await expect(this.page).toHaveURL(this.url);
    await expect(this.anchorElement).toBeVisible();
  }
}
```

For a **component**:
```typescript
export class YourComponent {
  constructor(private root: Locator) {
    // Define locators using root
  }

  // Action methods only - no goto(), no isLoaded(), no path/url
}
```

## Step 3: Add Locators

Use `data-test` attributes from snapshots in `docs/snapshots/`:
```typescript
constructor(page: Page) {
  this.page = page;
  this.submitButton = page.getByTestId('login-button');
  this.usernameInput = page.getByTestId('username');
}
```

## Step 4: Add Action Methods

Methods should:
- Represent user intent (`login`, `addToCart`, `proceedToCheckout`)
- NOT call `waitForURL()`
- NOT call `isLoaded()`
- NOT contain assertions
- NOT verify navigation

```typescript
async login(username: string, password: string) {
  await this.usernameInput.fill(username);
  await this.passwordInput.fill(password);
  await this.submitButton.click();
  // That's it - test verifies with isLoaded()
}
```

## Step 5: Register in Fixtures

Add to `tests/fixtures/base.fixture.ts`:
```typescript
type MyFixtures = {
  yourPage: YourPage;
};

export const test = base.extend<MyFixtures>({
  yourPage: async ({ page }, use) => {
    await use(new YourPage(page));
  },
});
```

## Step 6: Write Test Using Fixture

```typescript
test('test description', async ({ yourPage }) => {
  await yourPage.goto();
  await yourPage.isLoaded();
  // Use action methods
  await yourPage.doSomething();
  // Assertions in test, not page object
  await expect(someLocator).toBeVisible();
});
```
</process>

<success_criteria>
Page object is complete when:
- [ ] File created in correct location (pages/ or pages/components/)
- [ ] Has `path` and `url` properties (pages only)
- [ ] Has `goto()` method (pages only)
- [ ] Has `isLoaded()` with URL check + one anchor element
- [ ] Action methods don't call waitForURL or isLoaded
- [ ] No assertions in page object methods
- [ ] Registered in fixtures/base.fixture.ts
- [ ] Test can use it via fixture injection
</success_criteria>
