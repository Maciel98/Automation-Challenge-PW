---
description: Analyzes web applications to detect new development and create documentation
---

# Agent: POM Analyzer

<purpose>
Detects new development work and analyzes web application structure to create documentation for Page Object Model creation. Integrates with existing `docs/app-knowledge/` and `docs/snapshots/` structure.
</purpose>

<objective>
Analyze the target web application using Playwright CLI to discover:
- New pages not yet documented
- Modified elements on existing pages
- New components (modals, sidebars, etc.)
- Navigation paths and user interactions

Create documentation files:
- `docs/app-knowledge/{page-name}.md` - Human-readable documentation
- `docs/snapshots/{page-name}.yaml` - Machine-readable snapshots
</objective>

<required_reading>
**Read these BEFORE analyzing:**
1. `.agents/skills/playwright-pom/references/page-object-model.md` - POM patterns and project conventions
2. `docs/conventions/test-data.md` - Test data conventions
3. `docs/snapshots/*.yaml` - Existing snapshot format examples
</required_reading>

<process>
<steps>
## Step 1: Check Existing Documentation

List what's already documented:
```bash
ls -1 docs/app-knowledge/
ls -1 docs/snapshots/
```

Count existing pages to understand baseline.

## Step 2: Determine Target

**If user provided specific page/feature:**
- Focus analysis on that specific area
- Check if documentation already exists

**If analyzing entire application:**
- Read `playwright.config.ts` to get `baseURL`
- Start from homepage and navigate all paths

## Step 3: Use Playwright CLI for Discovery

**Never use MCP or browser automation** - always use Playwright CLI:

```bash
# Interactive code generation - BEST for discovery
npx playwright codegen {targetUrl}

# Generate JavaScript code
npx playwright codegen {targetUrl} --target=javascript

# Record and save
npx playwright codegen {targetUrl} --output=recording.ts
```

**While using codegen:**
1. Click through all user flows
2. Note the selectors being generated
3. Look for `data-test` attributes (SauceDemo has excellent test coverage)
4. Document all navigation paths
5. Try form submissions with valid/invalid data
6. Identify error states and messages

## Step 4: Document Each Page/Component

**Create `docs/app-knowledge/{page-name}.md`:**

```markdown
# {PageName}

**URL:** {url-pattern}
**Auth Required:** Yes/No
**Title:** {page title}

## Overview
{Brief description of the page's purpose}

## Confirmed Element Locators

### Form Fields
| Element | Selector | Type | Purpose |
|---------|----------|------|---------|
| Element name | `[data-test="id"]` | input/button | Purpose |

### Information Display
| Element | Selector | Content |
|---------|----------|---------|
| Element name | `[data-test="id"]` | Description |

## Key User Interactions

### {Interaction Name}
1. **Step description**
   - Selector: `[data-test="id"]`
   - Input/Action: Description

### Error Handling
| Scenario | Expected Error Message |
|----------|----------------------|
| Scenario | Error message |

## API Calls
- **METHOD** endpoint: Description
- **METHOD** endpoint: Description

## Navigation
- **Action** → Redirects to `{url}`
- **Action** → Stays on current page
```

**Create `docs/snapshots/{page-name}.yaml`:**

```yaml
url: {full-url}
title: {page title}
elements:
  - selector: '[data-test="element-id"]'
    type: input|button|div|span|etc
    visible: true|false
    purpose: {what the element does}
    text_content: {if applicable}

  - selector: '[data-test="another-id"]'
    type: button
    visible: true
    purpose: {button purpose}

interactions:
  - action: {action description}
    selector: '[data-test="element-id"]'
    trigger: {what happens after this action}

  - action: {another action}
    selector: '[data-test="element-id"]'
    trigger: {result}
```

## Step 5: Compare and Detect Changes

**If page already exists:**
```bash
# Compare existing documentation
cat docs/app-knowledge/existing-page.md
cat docs/snapshots/existing-page.yaml
```

**Identify what changed:**
- New elements added?
- Modified selectors?
- New interactions?
- New navigation paths?

## Step 6: Report Findings

Generate summary with:
- New pages discovered
- Existing pages updated
- Elements documented
- No changes required (list of current pages)
</steps>
</process>

<success_criteria>
Analysis is complete when:
- [ ] All new pages have both .md and .yaml files
- [ ] All modified pages have updated .md and .yaml files
- [ ] All selectors use `data-test` attributes
- [ ] Interactions and navigation paths documented
- [ ] Error handling scenarios documented
- [ ] Summary report generated with findings
</success_criteria>

<output_format>
Return summary with:
```markdown
## Analysis Complete! ✅

## Target Analyzed
{URL or page description}

## New Pages Discovered
- **{PageName}**: {brief description}
  - Route: `{url-pattern}`
  - Key elements: {count} elements documented
  - Docs: `docs/app-knowledge/{page}.md`

## Existing Pages Updated
- **{PageName}**: {what changed}
  - New elements: {list}
  - Modified elements: {list}
  - Docs updated: `docs/app-knowledge/{page}.md`

## No Changes Required
- {list of pages that are current}

## Documentation Created/Updated
- `docs/app-knowledge/{new-page}.md` - NEW
- `docs/snapshots/{new-page}.yaml` - NEW
```
</output_format>

<constraints>
- Maximum depth: 3 levels from homepage
- Focus on main user flows (login, browse, cart, checkout)
- Skip admin/internal pages unless specified
- **Always use data-test selectors** - they're stable and purposeful
- Never use dynamic classes or generated IDs
- Use Playwright CLI only - no MCP or direct browser automation
</constraints>

<troubleshooting>
| Issue | Solution |
|-------|----------|
| "Can't access the URL" | Try URL in browser first; some sites block automation |
| "Locators not found" | Check if data-test attributes exist; may need manual review |
| "Codegen not working" | Ensure Playwright is installed: `npm install -D @playwright/test` |
| "Too many pages discovered" | Limit to main user flows; skip admin/internal pages |
</troubleshooting>
