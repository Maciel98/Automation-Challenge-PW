---
description: Creates test specifications from page objects and requirements
---

# /create-test

Creates test specifications based on page objects and user requirements. Ensures all tests follow project conventions and best practices.

## Usage

```
/create-test [what to test]
```

**Examples:**
- `/create-test user can add items to cart and checkout` - Complete flow
- `/create-test login page authentication` - Page tests
- `/create-test error handling when checkout form is incomplete` - Error scenarios
- `/create-test complete user journey from login to order confirmation` - E2E test

## What It Does

1. **Understand Requirement** - Break down user request into testable scenarios
2. **Identify Fixtures** - Check which fixtures from tests/fixtures/base.fixture.ts are needed
3. **Check Existing Tests** - Search for similar tests to avoid duplication and understand patterns
4. **Read Test Data** - Check available test data in tests/test-data/*.json
5. **Create Test Specifications** - Invoke test-creator agent to generate test files following AAA pattern
6. **Apply Tags** - Apply appropriate tags per project conventions

**CRITICAL: Fixtures-First Approach**
This command follows the project's fixture-first approach:
- Always use fixtures from `tests/fixtures/base.fixture.ts`
- Never manually instantiate page objects or perform login in tests
- Follow patterns from existing test files (e.g., `tests/tests/inventory/inventory.spec.ts`)
- Create new fixtures only when existing ones don't meet the test's preconditions

## Output Format

```markdown
# Test Creation Complete! ✅

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

## Next Steps
1. Review the generated tests
2. Run tests: npm test
3. Run /validate to check quality
```

## Test Categories

**Happy Path Tests:**
- Normal user flows
- Successful operations
- Expected outcomes

**Error Handling Tests:**
- Invalid inputs
- Missing required fields
- Edge cases

**Navigation Tests:**
- Page transitions
- URL verification
- Back/forward navigation

**E2E Tests:**
- Complete user journeys
- Multi-page workflows
- Critical business paths

## Standards Followed

All tests follow:
- **AAA Pattern** - Arrange, Act, Assert
- **Fixtures only** - Always use fixtures from tests/fixtures/base.fixture.ts (NEVER manual instantiation or login)
- **Test data** - No hardcoded values (all from tests/test-data/*.json)
- **Independence** - No shared state between tests
- **Tagging** - Per project conventions
- **Pattern matching** - Follow existing test patterns (see tests/tests/inventory/inventory.spec.ts as reference)

**Example fixture usage:**
```typescript
// ✅ CORRECT - Use fixtures
test('should display products', async ({ authenticatedInventoryPage }) => {
  const count = await authenticatedInventoryPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});

// ❌ WRONG - Manual instantiation
test('should display products', async ({ page }) => {
  const loginPage = new LoginPage(page); // WRONG!
  await loginPage.goto();
  await loginPage.loginWithDefaults();
  // ...
});
```

## When To Use

- **After `/pom-update`**: When page objects are ready
- **For new features**: To add test coverage
- **For existing features**: To improve test coverage
- **Before deploying**: To ensure critical paths are tested

## See Also

- `/pom-update` - Create page objects before creating tests
- `/validate` - Validate test quality after creation
- `/automation` - Complete workflow (analyze + POM + tests + validate)
