---
description: Creates test specifications from page objects and requirements
---

# Command: /create-test

<purpose>
Creates test specifications based on page objects and user requirements. Ensures all tests follow project conventions and best practices.
</purpose>

<usage>
```
/create-test [what to test]
```

**Examples:**
- `/create-test user can add items to cart and checkout` - Complete flow
- `/create-test login page authentication` - Page tests
- `/create-test error handling when checkout form is incomplete` - Error scenarios
- `/create-test complete user journey from login to order confirmation` - E2E test
</usage>

<process>
<steps>
## Step 1: Understand Requirement

Break down user request into testable scenarios

## Step 2: Identify Page Objects

Check which page objects are needed and available

## Step 3: Check Existing Tests

Search for similar tests to avoid duplication

## Step 4: Read Test Data

Check available test data in tests/test-data/*.json

## Step 5: Create Test Specifications

Invoke test-creator agent to generate test files following AAA pattern

## Step 6: Apply Tags

Apply appropriate tags per project conventions
</steps>
</process>

<output_format>
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
</output_format>

<when_to_use>
- **After `/pom-update`**: When page objects are ready
- **For new features**: To add test coverage
- **For existing features**: To improve test coverage
- **Before deploying**: To ensure critical paths are tested
</when_to_use>

<test_categories>
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
</test_categories>

<standards_followed>
All tests follow:
- **AAA Pattern** - Arrange, Act, Assert
- **Fixtures only** - No manual page object instantiation
- **Test data** - No hardcoded values
- **Independence** - No shared state between tests
- **Tagging** - Per project conventions
</standards_followed>

<see_also>
- `/pom-update` - Create page objects before creating tests
- `/validate` - Validate test quality after creation
- `/automation` - Complete workflow (analyze + POM + tests + validate)
</see_also>
