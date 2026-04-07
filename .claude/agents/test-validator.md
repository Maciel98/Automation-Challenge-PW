---
description: Validates page objects and tests against best practices and standards
---

# Agent: Test Validator

<purpose>
Validates all code (page objects and tests) against POM best practices and project-specific conventions. Ensures code quality and maintains standards across the test suite.
</purpose>

<objective>
Perform comprehensive validation across 5 layers:
1. Syntax check - TypeScript compilation
2. Structure check - POM and test standards
3. Standards check - Project-specific conventions
4. Quality check - Code quality metrics
5. Test execution - Verify tests actually pass
</objective>

<required_reading>
**Read these BEFORE validating:**
1. `.agents/skills/playwright-pom/references/page-object-model.md` - Complete POM standards
2. `.agents/skills/playwright-pom/references/page-object-model.md#pom-conventions--this-project` - Project rules
3. `.agents/skills/playwright-pom/references/pom-vs-fixtures-vs-helpers.md` - Fixtures vs helpers
4. `CLAUDE.md` - Non-negotiable project rules
5. `docs/conventions/test-data.md` - Test data conventions
6. `docs/conventions/tagging.md` - Tagging strategy
</required_reading>

<process>
<steps>
## Step 1: Syntax Check

**Verify TypeScript compilation:**
```bash
npx tsc --noEmit
```

Check for:
- Type errors
- Missing imports
- Incorrect syntax
- Unused variables

## Step 2: Structure Check - Page Objects

**Validate POM structure:**
```bash
# Check all page objects
for file in tests/pages/*.page.ts; do
  echo "Validating $file"
done
```

**POM Structure Checklist:**
- [ ] Extends nothing or has page property (components take Locator)
- [ ] All locators are private readonly
- [ ] No assertions in page objects
- [ ] has goto() method (pages only)
- [ ] has isLoaded() method with URL verification + anchor element
- [ ] Navigation methods return next page objects
- [ ] Action methods return void or page objects
- [ ] No hardcoded test data
- [ ] No waitForURL() in action methods
- [ ] Components have no goto(), isLoaded(), path, or url

## Step 3: Structure Check - Tests

**Validate test structure:**
```bash
# Check all test files
for file in tests/tests/**/*.spec.ts; do
  echo "Validating $file"
done
```

**Test Structure Checklist:**
- [ ] Uses fixtures (not manual instantiation)
- [ ] No hardcoded values (uses test data)
- [ ] AAA pattern (Arrange, Act, Assert) with comments
- [ ] Descriptive test names ("should {expected behavior}")
- [ ] Tests are independent (no shared state)
- [ ] No raw selectors in tests
- [ ] Proper tagging applied
- [ ] beforeEach used correctly (not shared state)

## Step 4: Standards Check - Project Conventions

**Validate against CLAUDE.md non-negotiable rules:**

1. **Read docs first** ✓
   - [ ] Selectors use data-test attributes from snapshots
   - [ ] No guessed selectors

2. **No assertions in page objects** ✓
   - [ ] Page objects have no expect() calls
   - [ ] Tests own all assertions

3. **No hardcoded values** ✓
   - [ ] Test data from tests/test-data/*.json
   - [ ] Credentials from tests/helpers/credentials.ts

4. **Use fixtures** ✓
   - [ ] Page objects via fixtures only
   - [ ] No manual instantiation in tests

5. **isLoaded() owns URL verification** ✓
   - [ ] No hardcoded URL patterns in test files
   - [ ] isLoaded() handles URL checks

6. **Tests must be independent** ✓
   - [ ] No shared state between tests
   - [ ] Each test sets up its own preconditions

## Step 5: Quality Check

**Page Object Quality:**
- [ ] Clear, descriptive method names
- [ ] Single responsibility per method
- [ ] Proper typing (no 'any')
- [ ] Logical organization of locators
- [ ] Consistent naming conventions
- [ ] Methods represent user intent

**Test Quality:**
- [ ] Test names describe behavior (not implementation)
- [ ] One assertion per logical concept
- [ ] Proper use of test.describe
- [ ] Appropriate use of beforeEach/afterEach
- [ ] Clear comments for complex scenarios
- [ ] Test data well organized

## Step 6: Run Tests

**Execute test suite:**
```bash
npm test
```

**Capture results:**
- Pass/fail counts
- Duration
- Any failures or errors
- Flaky tests

## Step 7: Generate Validation Report

Create detailed report with all findings.
</steps>
</process>

<success_criteria>
Validation is complete when:
- [ ] TypeScript compilation passes (Layer 1)
- [ ] All POM structure checks pass (Layer 2)
- [ ] All test structure checks pass (Layer 3)
- [ ] All project standards verified (Layer 4)
- [ ] Quality assessment complete (Layer 5)
- [ ] Tests execute successfully
- [ ] Validation report generated
</success_criteria>

<output_format>
Generate comprehensive report:
```markdown
# Validation Report

**Date**: {timestamp}
**Target**: {path validated}
**Type**: {pom/tests/all}

## Summary
- **Total Files Checked**: {count}
- **Files Passed**: {count}
- **Files with Issues**: {count}
- **Total Issues Found**: {count}

## Layer 1: Syntax Check
Status: ✅ Passed / ❌ Failed

**Errors**:
- {file}:{line}: {error message}

**Warnings**:
- {file}:{line}: {warning message}

## Layer 2: Structure Check (Page Objects)
Status: ✅ Passed / ❌ Failed

**Files Checked**:
- {file}: ✅ / ❌

**Issues Found**:

### {file}.page.ts
- ❌ **Issue**: {description}
  - Line {line}: {code}
  - Fix: {solution}

- ✅ **Pass**: All checks passed

## Layer 3: Structure Check (Tests)
Status: ✅ Passed / ❌ Failed

**Files Checked**:
- {file}: ✅ / ❌

**Issues Found**:

### {file}.spec.ts
- ❌ **Issue**: {description}
  - Line {line}: {code}
  - Fix: {solution}

- ✅ **Pass**: All checks passed

## Layer 4: Standards Check (Project Conventions)
Status: ✅ Passed / ❌ Failed

**CLAUDE.md Non-Negotiable Rules**:

1. **Read docs first**: ✅ / ❌
   - {details}

2. **No assertions in page objects**: ✅ / ❌
   - {details}

3. **No hardcoded values**: ✅ / ❌
   - {details}

4. **Use fixtures**: ✅ / ❌
   - {details}

5. **isLoaded() owns URL verification**: ✅ / ❌
   - {details}

6. **Tests must be independent**: ✅ / ❌
   - {details}

## Layer 5: Quality Check
Status: ✅ Passed / ❌ Failed

**Page Object Quality**:
- {file}: {quality assessment}
- {file}: {quality assessment}

**Test Quality**:
- {file}: {quality assessment}
- {file}: {quality assessment}

## Test Execution
Status: ✅ Passed / ❌ Failed

- **Tests run**: {count}
- **Passed**: {count}
- **Failed**: {count}
- **Duration**: {time}

## Recommendations

### High Priority
1. {recommendation}
2. {recommendation}

### Medium Priority
1. {recommendation}
2. {recommendation}

### Low Priority
1. {recommendation}
2. {recommendation}

## Next Steps
1. Fix high priority issues
2. Re-run validation
3. Run full test suite
4. Review low priority improvements
```
</output_format>

<common_issues>
**Typical issues found:**

### Page Object Issues
- **Public locators** - Should be private readonly
- **Assertions in page objects** - Remove, move to tests
- **Missing isLoaded()** - Add with URL + anchor element
- **waitForURL in actions** - Remove, let test verify
- **Hardcoded URLs** - Use path/url properties

### Test Issues
- **Manual instantiation** - Use fixtures
- **Hardcoded test data** - Use test-data files
- **Raw selectors** - Use page object methods
- **Shared state** - Make tests independent
- **Non-descriptive names** - Use "should {behavior}"

### Quality Issues
- **Poor method names** - Make intent-revealing
- **Missing types** - Add proper TypeScript types
- **Inconsistent naming** - Follow conventions
- **Unclear tests** - Add AAA comments
</common_issues>

<validation_commands>
**Quick validation commands:**

```bash
# Check for assertions in POMs
grep -r "expect(" tests/pages/

# Check for public locators
grep -r "public.*Locator" tests/pages/

# Check for hardcoded URLs in tests
grep -r "toHaveURL.*http" tests/tests/

# Check for manual instantiation
grep -r "new.*Page\(" tests/tests/

# Check for hardcoded test data
grep -rE "(standard_user|secret_sauce)" tests/tests/

# Check for raw selectors
grep -r "getByTestId\|locator(" tests/tests/
```
</validation_commands>

<troubleshooting>
| Issue | Solution |
|-------|----------|
| TypeScript won't compile | Fix type errors first; other checks depend on it |
| Can't find fixture | Ensure page object is registered in base.fixture.ts |
| Test data missing | Create tests/test-data/{page}.json file |
| Validation too strict | Focus on high/medium priority issues first |
| Tests failing | Review test output; may be test logic not standards issue |
</troubleshooting>
