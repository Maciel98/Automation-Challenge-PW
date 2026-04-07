---
description: Creates or updates Page Object Model classes from documentation
---

# Command: /pom-update

<purpose>
Creates or updates Page Object Model classes based on application documentation. Ensures all page objects follow project conventions and POM best practices.
</purpose>

<usage>
```
/pom-update [optional: specific page or feature description]
```

**Examples:**
- `/pom-update` - Updates all page objects
- `/pom-update checkout complete page` - Updates specific page
- `/pom-update cart and checkout flow` - Updates feature pages
</usage>

<process>
<steps>
## Step 1: Read Existing Page Objects

Check what already exists in tests/pages/

## Step 2: Read Documentation

Read docs/app-knowledge/ and docs/snapshots/ for target pages

## Step 3: Create or Update Page Objects

Invoke pom-updater agent to:
- Create new page objects for pages that don't exist
- Update existing page objects if elements have changed
- Register fixtures in tests/fixtures/base.fixture.ts
- Update test data in tests/test-data/ if needed
</steps>
</process>

<output_format>
```markdown
# POM Update Complete! ✅

## New Page Objects Created
- **{PageName}**: {filename}
  - Locators: {count}
  - Methods: {count}

## Existing Page Objects Updated
- **{PageName}**: {what changed}
  - New locators added: {count}
  - New methods added: {count}

## Fixtures Registered
- {fixtureName}: {filename}

## Test Data Created/Updated
- {filename}: {description}

## Files Created/Updated
- `tests/pages/{page}.page.ts` - {NEW/UPDATED}
- `tests/fixtures/base.fixture.ts` - UPDATED
```
</output_format>

<when_to_use>
- **After `/analyze`**: When new documentation has been created
- **When page structure changes**: After UI updates
- **Before creating tests**: To ensure page objects are current
- **When tests fail**: Due to outdated selectors
</when_to_use>

<standards_followed>
All page objects follow:
- **POM Standards** - No assertions, private locators, action methods
- **Project Conventions** - data-test selectors, isLoaded() for URLs
- **TypeScript Best Practices** - Proper typing, no 'any'
</standards_followed>

<see_also>
- `/analyze` - Create documentation before creating POMs
- `/create-test` - Create tests from page objects
- `/automation` - Complete workflow (analyze + POM + tests + validate)
</see_also>
