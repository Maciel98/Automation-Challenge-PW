---
description: Complete test automation workflow - analyze, create POMs, create tests, validate, run
---

# Workflow: Complete Automation

<purpose>
Main orchestrator workflow that handles complete test automation from analysis to execution. Intelligently determines what needs to be done and skips unnecessary work.
</purpose>

<objective>
Orchestrate the complete automation process:
1. Assessment - Determine what exists
2. Analyze - If documentation missing (skip if exists)
3. Update POMs - If page objects missing or outdated (skip if current)
4. Create Tests - If test scenarios missing (skip if covered)
5. Validate - Always run quality checks
6. Run Tests - Verify everything works
7. Report - Complete summary with next steps
</objective>

<required_reading>
**Read these BEFORE starting:**
1. `.claude/agents/pom-analyzer.md` - Analysis agent
2. `.claude/agents/pom-updater.md` - POM update agent
3. `.claude/agents/test-creator.md` - Test creation agent
4. `.claude/agents/test-validator.md` - Validation agent
5. `.agents/skills/playwright-pom/references/page-object-model.md` - POM patterns
</required_reading>

<process>
<steps>
## Step 1: Assessment

**Determine what needs to be done:**

```bash
# Check existing documentation
ls -1 docs/app-knowledge/
echo "Pages documented: $(ls -1 docs/app-knowledge/ | wc -l)"

# Check existing page objects
ls -1 tests/pages/*.page.ts 2>/dev/null | wc -l
echo "Page objects: $(ls -1 tests/pages/*.page.ts 2>/dev/null | wc -l)"

# Check existing tests
find tests/tests/ -name "*.spec.ts" | wc -l
echo "Test files: $(find tests/tests/ -name "*.spec.ts" | wc -l)"

# Check fixtures
grep -c "Page<" tests/fixtures/base.fixture.ts
echo "Fixtures registered"
```

**Create assessment matrix:**

| Component | Exists? | Up to Date? | Action Needed |
|-----------|---------|-------------|---------------|
| Documentation | ✅/❌ | ✅/❌ | Analyze if missing |
| Page Objects | ✅/❌ | ✅/❌ | Create/update POMs |
| Tests | ✅/❌ | ✅/❌ | Create/update tests |
| Fixtures | ✅/❌ | ✅/❌ | Register if needed |

## Step 2: Analyze (If Needed)

**When to analyze:**
- Documentation missing for required pages
- User mentions "new" features or pages
- Recent development work mentioned

**When to skip:**
- Documentation exists and is current
- User only wants tests for existing features

**Invoke:** `pom-analyzer` agent

**Output:** Updated docs/app-knowledge/ and docs/snapshots/

## Step 3: Update POMs (If Needed)

**When to update:**
- Page objects missing for documented pages
- Documentation has new elements not in POMs
- New pages discovered in analysis

**When to skip:**
- All required page objects exist
- Page objects match current documentation

**Invoke:** `pom-updater` agent

**Output:** Updated tests/pages/ and tests/fixtures/

## Step 4: Create Tests (If Needed)

**When to create:**
- User requests test scenarios
- New features need test coverage
- Existing tests missing for documented features

**When to skip:**
- Tests already cover the requirement
- User only wants POMs or validation

**Invoke:** `test-creator` agent

**Output:** New/updated test files in tests/tests/

## Step 5: Validate

**Always run** - even if nothing was created

**Invoke:** `test-validator` agent

**Validation layers:**
1. Syntax check - TypeScript compilation
2. Structure check - POM and test standards
3. Standards check - Project conventions
4. Quality check - Code quality

**Output:** validation-report.md

## Step 6: Run Tests

**Execute the test suite:**

```bash
# Run all tests
npm test

# Run specific tests if targeted
npx playwright test tests/tests/{specific-folder}

# Run with coverage if available
npm run test:coverage
```

**Capture results:**
- Pass/fail counts
- Duration
- Any failures or errors

## Step 7: Final Report

**Generate comprehensive summary:**

```markdown
# Automation Complete! ✅

## Summary
- **Requirement**: {user requirement}
- **Duration**: {time taken}
- **Status**: {overall status}

## What Was Done

### 1. Assessment
- Documentation: {count} pages
- Page Objects: {count} objects
- Tests: {count} test files

### 2. Analysis
- Status: {Completed/Skipped}
- New pages: {count}
- Docs updated: {files}

### 3. Page Objects
- Status: {Created/Updated/Skipped}
- New POMs: {count}
- Updated POMs: {count}

### 4. Tests
- Status: {Created/Updated/Skipped}
- New tests: {count}
- Scenarios: {count}

### 5. Validation
- Status: {Passed/Failed}
- Issues: {count}
- See: validation-report.md

### 6. Test Execution
- Status: {Passed/Failed}
- Tests run: {count}
- Passed: {count}
- Failed: {count}
- Duration: {time}

## Files Created/Updated

### Documentation
- `docs/app-knowledge/{file}.md` - {NEW/UPDATED}
- `docs/snapshots/{file}.yaml` - {NEW/UPDATED}

### Page Objects
- `tests/pages/{file}.page.ts` - {NEW/UPDATED}
- `tests/fixtures/base.fixture.ts` - UPDATED

### Tests
- `tests/tests/{feature}/{file}.spec.ts` - {NEW/UPDATED}

### Test Data
- `tests/test-data/{file}.json` - {NEW/UPDATED}

## Next Steps

### If Validation Failed
1. Review validation-report.md
2. Fix reported issues
3. Re-run validation

### If Tests Failed
1. Review test output
2. Fix failing tests
3. Re-run tests

### To Extend Coverage
1. Run /automation for additional features
2. Add more test scenarios
3. Improve test data

### To Deploy
1. All tests passing ✅
2. Ready for CI/CD integration
3. Review docs/conventions/tagging.md for test runs

## Issues Requiring Attention

### High Priority
{any high priority issues}

### Medium Priority
{any medium priority issues}

### Low Priority
{any low priority issues}
```
</steps>
</process>

<success_criteria>
Automation is complete when:
- [ ] Assessment completed - know what exists
- [ ] Analysis completed (if needed) or skipped with reason
- [ ] POMs created/updated (if needed) or skipped with reason
- [ ] Tests created (if needed) or skipped with reason
- [ ] Validation completed - all layers checked
- [ ] Tests executed - results captured
- [ ] Final report generated with clear status and next steps
</success_criteria>

<workflow_variations>
**Variation 1: New Feature (Everything New)**
```
User: /automate new guest checkout

1. Assessment: Nothing exists
2. Analyze: ✅ (discover and document)
3. Update POMs: ✅ (create page objects)
4. Create Tests: ✅ (create all tests)
5. Validate: ✅ (check everything)
6. Run Tests: ✅ (verify they work)
7. Report
```

**Variation 2: Existing Feature (Create Tests Only)**
```
User: /automate shopping cart tests

1. Assessment: POMs exist, tests missing
2. Analyze: Skip (docs exist)
3. Update POMs: Skip (POMs exist)
4. Create Tests: ✅ (create test scenarios)
5. Validate: ✅ (check test quality)
6. Run Tests: ✅ (verify they pass)
7. Report
```

**Variation 3: Validation Only**
```
User: /automate validate checkout tests

1. Assessment: Everything exists
2. Analyze: Skip
3. Update POMs: Skip
4. Create Tests: Skip
5. Validate: ✅ (comprehensive check)
6. Run Tests: ✅ (ensure they pass)
7. Report
```

**Variation 4: Full Application**
```
User: /automate the entire saucedemo application

1. Assessment: Check all pages
2. Analyze: ✅ (fill gaps in docs)
3. Update POMs: ✅ (create/update all POMs)
4. Create Tests: ✅ (comprehensive coverage)
5. Validate: ✅ (full validation)
6. Run Tests: ✅ (complete test suite)
7. Report
```
</workflow_variations>

<error_handling>
If any step fails:
1. **Stop the workflow** - Don't continue cascading failures
2. **Report the error** - Clear explanation of what failed
3. **Show progress** - What was completed successfully
4. **Suggest fixes** - How to resolve the issue
5. **Don't waste time** - Stop early on critical failures

**Example error handling:**
```
❌ Validation Failed

Step 5 of 7: Validation
Status: FAILED

Error: TypeScript compilation failed
tests/pages/checkout.page.ts:25: Type error...

What was completed:
✅ Assessment - 8 pages documented, 6 POMs exist
✅ Analysis - 2 new pages discovered
✅ POM Update - Created 2 new page objects
✅ Test Creation - Created 5 test files

What failed:
❌ Validation - TypeScript compilation errors

Suggested fix:
Fix the type error in tests/pages/checkout.page.ts:25
Then run: /validate to continue

Workflow stopped at step 5 to prevent cascading failures.
```
</error_handling>

<dependencies>
- All agents available (pom-analyzer, pom-updater, test-creator, test-validator)
- Playwright installed
- TypeScript compiler
- Access to application URL
- Write permissions to project
</dependencies>

<success_criteria>
Workflow is successful when:
1. All requested components exist
2. Validation passes all layers
3. Tests execute successfully
4. No critical issues found
5. Report generated with clear status
6. User knows next steps
</success_criteria>
