---
description: Complete test automation workflow - analyze, create POMs, create tests, validate, run
---

# Command: /automation

<purpose>
Main orchestrator command that handles complete test automation from analysis to execution. Intelligently determines what needs to be done and skips unnecessary work.
</purpose>

<usage>
```
/automation [what to automate]
```

**Examples:**
- `/automate user can add items to cart and checkout` - Complete user flow
- `/automate new guest checkout flow` - New feature automation
- `/automate the entire application` - Full application coverage
- `/automate shopping cart functionality` - Existing feature tests
</usage>

<objective>
Orchestrate complete automation:
1. Assessment - Determine what exists
2. Analyze - If documentation missing (skip if exists)
3. Update POMs - If page objects missing/outdated (skip if current)
4. Create Tests - If test scenarios missing (skip if covered)
5. Validate - Always run quality checks
6. Run Tests - Verify everything works
7. Report - Complete summary with next steps
</objective>

<process>
<steps>
## Step 1: Assessment

Check existing documentation, page objects, tests, and fixtures

## Step 2: Analyze (If Needed)

Invoke pom-analyzer if documentation is missing or outdated

## Step 3: Update POMs (If Needed)

Invoke pom-updater if page objects are missing or outdated

## Step 4: Create Tests (If Needed)

Invoke test-creator based on user requirements

## Step 5: Validate

Invoke test-validator for comprehensive quality checks

## Step 6: Run Tests

Execute test suite and capture results

## Step 7: Final Report

Generate comprehensive summary with findings and next steps
</steps>
</process>

<output_format>
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

### 3. Page Objects
- Status: {Created/Updated/Skipped}

### 4. Tests
- Status: {Created/Updated/Skipped}

### 5. Validation
- Status: {Passed/Failed}
- See: validation-report.md

### 6. Test Execution
- Status: {Passed/Failed}
- Tests run: {count}

## Files Created/Updated
- docs/app-knowledge/{file}.md - {NEW/UPDATED}
- tests/pages/{file}.page.ts - {NEW/UPDATED}
- tests/tests/{feature}/{file}.spec.ts - {NEW/UPDATED}

## Next Steps
{Based on results}
```
</output_format>

<workflow_variations>
**New Feature (Everything New):**
```
/automate new guest checkout flow

→ Assessment: Nothing exists
→ Analyze: ✅
→ POM Update: ✅
→ Create Tests: ✅
→ Validate: ✅
→ Run Tests: ✅
→ Report
```

**Existing Feature (Tests Only):**
```
/automate shopping cart tests

→ Assessment: POMs exist, tests missing
→ Analyze: Skip
→ POM Update: Skip
→ Create Tests: ✅
→ Validate: ✅
→ Run Tests: ✅
→ Report
```

**Validation Only:**
```
/automate validate checkout tests

→ Assessment: Everything exists
→ Analyze: Skip
→ POM Update: Skip
→ Create Tests: Skip
→ Validate: ✅
→ Run Tests: ✅
→ Report
```
</workflow_variations>

<advantages_over_individual_commands>
**Individual Commands:**
```
/analyze → /pom-update → /create-test → /validate → npm test
```
- Requires multiple commands
- Manual coordination between steps

**Orchestrator Command:**
```
/automate checkout flow
```
- Single command
- Automatic workflow
- Smart decisions (skip what's done)
- Comprehensive report
</advantages_over_individual_commands>

<when_to_use>
- **New feature development**: Complete automation in one command
- **Sprint completion**: Automate all features from a sprint
- **Test suite creation**: Build complete test coverage
- **Onboarding**: Get up to speed with automation
- **Quality gates**: Ensure everything is working before deploy
</when_to_use>

<see_also>
- `/analyze` - Individual analysis step
- `/pom-update` - Individual POM creation
- `/create-test` - Individual test creation
- `/validate` - Individual validation step
</see_also>
