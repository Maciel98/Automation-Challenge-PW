---
description: Validates page objects and tests against best practices and standards
---

# /validate

Validates all code (page objects and tests) against best practices and project standards. Ensures code quality and maintains standards across the test suite.

## Usage

```
/validate [optional: specific path or "pom" or "tests"]
```

**Examples:**
- `/validate` - Validates all page objects and tests
- `/validate pom` - Validates only page objects
- `/validate tests` - Validates only test files
- `/validate tests/tests/checkout/` - Validates specific folder

## What It Does

Run 5-layer validation:

1. **Syntax Check** - TypeScript compilation: `npx tsc --noEmit`
2. **Structure Check (Page Objects)** - POM standards: All locators are private readonly, No assertions in page objects, has navigate() method, has isLoaded() method, Navigation methods return next page objects
3. **Structure Check (Tests)** - Test standards: Uses fixtures (not manual instantiation), No hardcoded values, AAA pattern (Arrange, Act, Assert), Descriptive test names, Tests are independent
4. **Standards Check (Project Conventions)** - CLAUDE.md rules: Selectors use data-test attributes from snapshots, No assertions in page objects, Test data from tests/test-data/*.json, Credentials from tests/helpers/credentials.ts, Page objects via fixtures only, isLoaded() owns URL verification, Tests are independent
5. **Quality Check** - Code quality metrics: Clear, descriptive names, Single responsibility per method, Proper typing (no 'any'), Logical organization, Consistent conventions
6. **Generate Report** - Create detailed validation report with findings

## Output Format

```markdown
# Validation Report

**Date**: {timestamp}
**Target**: {path validated}
**Type**: {pom/tests/all}

## Summary
- Total Files Checked: {count}
- Files Passed: {count}
- Files with Issues: {count}
- Total Issues Found: {count}

## Layer 1: Syntax Check
Status: ✅ Passed / ❌ Failed
[Details...]

## Layer 2: Structure Check (Page Objects)
Status: ✅ Passed / ❌ Failed
[Details...]

## Layer 3: Structure Check (Tests)
Status: ✅ Passed / ❌ Failed
[Details...]

## Layer 4: Standards Check (Project Conventions)
Status: ✅ Passed / ❌ Failed
[Details...]

## Layer 5: Quality Check
Status: ✅ Passed / ❌ Failed
[Details...]

## Recommendations
### High Priority
1. {recommendation}

### Medium Priority
1. {recommendation}

### Low Priority
1. {recommendation}
```

## Common Issues Detected

**Page Object Issues:**
- ❌ Public locators (should be private readonly)
- ❌ Assertions in page objects (should be in tests)
- ❌ Missing isLoaded() method
- ❌ Hardcoded URLs (use isLoaded())

**Test Issues:**
- ❌ Manual page object instantiation (use fixtures)
- ❌ Hardcoded test data (use test-data files)
- ❌ Raw selectors in tests (use page object methods)
- ❌ Shared state between tests (make independent)
- ❌ Non-descriptive test names

## When To Use

- **After creating tests**: To ensure quality standards
- **Before committing code**: To catch issues early
- **After refactoring**: To ensure standards maintained
- **During code review**: To get automated feedback
- **Onboarding**: To learn project standards

## Standards Validated Against

- **POM patterns** - Complete POM coding standards
- **Project conventions** - CLAUDE.md non-negotiable rules
- **Test data standards** - Test data conventions
- **Tagging strategy** - Test tagging conventions

## See Also

- `/analyze` - Analyze application before validating
- `/pom-update` - Fix POM issues detected
- `/create-test` - Create better tests after validation
- `/automation` - Complete workflow with validation included
