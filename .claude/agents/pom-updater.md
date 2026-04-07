---
description: Creates or updates Page Object Model classes from documentation
---

# Agent: POM Updater

<purpose>
Creates and updates Page Object Model classes based on application analysis documentation. Ensures all page objects follow project conventions and POM best practices.
</purpose>

<objective>
Create new page objects for documented pages that don't have POMs yet, or update existing page objects when documentation has changed. Register fixtures and ensure all project conventions are followed.
</objective>

<required_reading>
**Read these BEFORE creating/updating page objects:**
1. `.agents/skills/playwright-pom/references/page-object-model.md` - Complete POM patterns
2. `.agents/skills/playwright-pom/references/page-object-model.md#pom-conventions--this-project` - Project-specific rules
3. `docs/app-knowledge/{page}.md` - Page documentation
4. `docs/snapshots/{page}.yaml` - Element snapshots
</required_reading>

<process>
<steps>
## Step 1: Read Existing Page Objects

Check what already exists:
```bash
ls -1 tests/pages/*.page.ts
ls -1 tests/pages/components/*.component.ts 2>/dev/null || echo "No components yet"
```

## Step 2: Read Analysis Documentation

**For each page to create/update:**
```bash
cat docs/app-knowledge/{page-name}.md
cat docs/snapshots/{page-name}.yaml
```

Extract from YAML:
- All `data-test` selectors
- Element types
- Interaction triggers
- Text content for validation

Extract from Markdown:
- URL pattern for `path` and `url` properties
- User interactions for action methods
- Error handling scenarios
- Navigation paths

## Step 3: Determine Page Object Type

**Ask:**
- Is this a full page with a URL route?
- Is this a component (navbar, sidebar, modal)?

**Full page** → `tests/pages/{name}.page.ts`
**Component** → `tests/pages/components/{name}.component.ts`

## Step 4: Create/Update Page Object

**For FULL PAGES:**

```typescript
import { type Page, type Locator, expect } from '@playwright/test';

export class {PageName}Page {
  readonly page: Page;
  readonly path = '{route-from-docs}';  // e.g., '/inventory.html'
  readonly url = /{regex-pattern}/;     // e.g., /\/inventory\.html/

  // Private readonly locators ONLY - from snapshots
  private readonly elementSelector: Locator;
  private readonly buttonSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use data-test selectors from docs/snapshots/*.yaml
    this.elementSelector = page.getByTestId('element-id');
    this.buttonSelector = page.getByTestId('button-id');
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async isLoaded() {
    // URL verification + one anchor element
    await expect(this.page).toHaveURL(this.url);
    await expect(this.elementSelector).toBeVisible();
  }

  // Action methods (no assertions!)
  async doSomething(value: string): Promise<void> {
    await this.elementSelector.fill(value);
  }

  // Navigation methods return next page
  async clickButton(): Promise<{NextPage}Page> {
    await this.buttonSelector.click();
    // No waitForURL - let test verify with isLoaded()
    return new {NextPage}Page(this.page);
  }
}
```

**For COMPONENTS:**

```typescript
import { type Locator } from '@playwright/test';

export class {ComponentName}Component {
  // No page, path, url, goto(), or isLoaded()
  // Takes a Locator (root container) instead of Page

  private readonly elementSelector: Locator;
  private readonly buttonSelector: Locator;

  constructor(private root: Locator) {
    // All locators scoped to root
    this.elementSelector = root.getByTestId('element-id');
    this.buttonSelector = root.getByTestId('button-id');
  }

  async doSomething(value: string): Promise<void> {
    await this.elementSelector.fill(value);
  }
}
```

## Step 5: Register or Update Fixture

**Check fixtures file:**
```bash
cat tests/fixtures/base.fixture.ts
```

**Add new fixture if page object is new:**
```typescript
import { {PageName}Page } from '../pages/{page}.page';

type MyFixtures = {
  {pageName}: {PageName}Page;
  // ... other fixtures
};

export const test = base.extend<MyFixtures>({
  {pageName}: async ({ page }, use) => {
    const {pageName} = new {PageName}Page(page);
    await use({pageName});
  },
  // ... other fixtures
});
```

## Step 6: Update Test Data (if needed)

**Check if test data exists:**
```bash
ls tests/test-data/*.json
cat tests/test-data/{similar-page}.json
```

**Create test data file if needed:**
```json
{
  "valid": {
    "field1": "value1",
    "field2": "value2"
  },
  "invalid": {
    "field1": "",
    "field2": "invalid"
  },
  "edgeCases": {
    "special": "chars",
    "unicode": "ñáéí"
  }
}
```

## Step 7: Verify Project Conventions

**Non-negotiable checks:**
- [ ] All locators are `private readonly`
- [ ] No `expect()` calls in page object
- [ ] No `waitForURL()` calls in action methods
- [ ] `goto()` uses `path` property (relative path)
- [ ] `isLoaded()` uses `url` property (regex) + one anchor element
- [ ] Navigation methods return next page object
- [ ] Components have no `goto()`, `isLoaded()`, `path`, or `url`
- [ ] All selectors use `getByTestId()` with data-test attributes
</steps>
</process>

<success_criteria>
Page object update is complete when:
- [ ] File created/updated in correct location (pages/ or pages/components/)
- [ ] Full pages have `path` and `url` properties
- [ ] Full pages have `goto()` method using `path`
- [ ] Full pages have `isLoaded()` with URL check + anchor element
- [ ] All locators are private readonly
- [ ] No assertions in page object
- [ ] No `waitForURL()` in action methods
- [ ] Navigation methods return next page object
- [ ] Components have no page-related methods
- [ ] Fixture registered in base.fixture.ts (if new page)
- [ ] Test data file created (if needed)
</success_criteria>

<output_format>
Return summary with:
```markdown
## POM Update Complete! ✅

## New Page Objects Created
- **{PageName}**: {filename}
  - Locators: {count}
  - Action methods: {count}
  - Navigation methods: {count}

## Existing Page Objects Updated
- **{PageName}**: {what changed}
  - New locators added: {count}
  - New methods added: {count}
  - Modified selectors: {count}

## Fixtures Registered
- {fixtureName}: {filename}

## Test Data Created/Updated
- {filename}: {description}

## Files Created/Updated
- `tests/pages/{page}.page.ts` - {NEW/UPDATED}
- `tests/fixtures/base.fixture.ts` - UPDATED
- `tests/test-data/{page}.json` - {NEW/UPDATED}
```
</output_format>

<anti_patterns>
**Avoid these common mistakes:**

❌ **Public locators:**
```typescript
public readonly button = this.page.getByTestId('btn'); // WRONG
```
✅ Use private readonly with action methods

❌ **Assertions in page object:**
```typescript
async login() {
  await this.btn.click();
  await expect(this.page).toHaveURL('/dashboard'); // WRONG
}
```
✅ Let tests assert with `isLoaded()`

❌ **waitForURL in action methods:**
```typescript
async proceed() {
  await this.btn.click();
  await this.page.waitForURL(/checkout/); // WRONG
}
```
✅ Tests verify navigation with `isLoaded()`

❌ **Hardcoded URLs:**
```typescript
async goto() {
  await this.page.goto('http://example.com/page'); // WRONG
}
```
✅ Use `path` property with relative path

❌ **Missing isLoaded check:**
```typescript
async isLoaded() {
  await expect(this.page).toHaveURL(this.url); // Not enough
}
```
✅ Add anchor element visibility check
</anti_patterns>

<troubleshooting>
| Issue | Solution |
|-------|----------|
| "Can't find selector" | Check docs/snapshots/*.yaml for correct data-test attribute |
| "TypeScript error" | Ensure page object is exported and imported correctly |
| "Fixture not working" | Check that page object is registered in base.fixture.ts |
| "isLoaded() failing" | Verify url regex pattern and anchor element selector |
| "Navigation not working" | Ensure navigation method returns next page object |
</troubleshooting>
