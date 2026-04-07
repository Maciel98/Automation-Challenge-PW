---
description: Analyzes web application for new development and updates documentation
---

# Workflow: Analyze Application

<purpose>
Orchestrates the analysis of web applications to detect new development and update documentation. Integrates with existing docs/app-knowledge/ and docs/snapshots/ structure.
</purpose>

<objective>
Discover and document:
- New pages not yet in docs/
- Modified elements on existing pages
- New components (modals, sidebars, etc.)
- Navigation paths and user interactions

Create documentation files:
- `docs/app-knowledge/{page-name}.md` - Human-readable
- `docs/snapshots/{page-name}.yaml` - Machine-readable
</objective>

<required_reading>
**Read these BEFORE starting:**
1. `.claude/agents/pom-analyzer.md` - Analyzer agent specification
2. `.agents/skills/playwright-pom/references/page-object-model.md` - POM patterns
</required_reading>

<process>
<steps>
## Step 1: Initialize

**Determine target:**
- If user provided URL: use that
- If user provided page description: analyze that specific page
- If no URL: read `baseURL` from `playwright.config.ts`

**Check existing documentation:**
```bash
# List all existing pages
ls -1 docs/app-knowledge/
ls -1 docs/snapshots/

# Count what exists
echo "Pages documented: $(ls -1 docs/app-knowledge/ | wc -l)"
```

## Step 2: Run POM Analyzer Agent

**Invoke:** `pom-analyzer` agent

**Agent task:**
- Use Playwright CLI to discover application structure
- Document all pages with data-test selectors
- Record interactions and navigation
- Create .md and .yaml files

**If analyzing specific page:**
1. Navigate to that page in Playwright codegen
2. Document all elements with data-test selectors
3. Record interactions and navigation

**If analyzing entire application:**
1. Start at base URL
2. Follow all navigation links (max depth: 3 levels)
3. Document each page discovered
4. Focus on main user flows

## Step 3: Compare and Detect Changes

**Compare new analysis with existing docs:**

```bash
# Check if page already exists
if [ -f "docs/app-knowledge/new-page.md" ]; then
  echo "Page already exists, checking for changes..."
  # Compare elements, interactions, etc.
else
  echo "New page discovered!"
fi
```

**Detect:**
- New pages (not in docs/)
- Modified elements on existing pages
- New interactions
- New navigation paths
- New components (modals, sidebars, etc.)

## Step 4: Generate Documentation

**For new pages:**
1. Create `docs/app-knowledge/{page-name}.md`
   - Page overview
   - Element locator tables
   - User interactions
   - Error handling
   - Navigation paths

2. Create `docs/snapshots/{page-name}.yaml`
   - All data-test selectors
   - Element types
   - Interaction triggers
   - Text content

**For existing pages with changes:**
1. Update `docs/app-knowledge/{page-name}.md`
   - Add new elements
   - Update interactions
   - Note changes

2. Update `docs/snapshots/{page-name}.yaml`
   - Add new selectors
   - Update existing ones if changed

## Step 5: Report Findings

**Generate summary:**
```markdown
# Analysis Complete! ✅

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

## Next Steps
1. Review the generated documentation
2. Run /pom-update to create page objects
3. Run /create-test to create tests for new features
```
</steps>
</process>

<success_criteria>
Analysis is complete when:
- [ ] All new pages have both .md and .yaml files
- [ ] All modified pages have updated .md and .yaml files
- [ ] All selectors use data-test attributes
- [ ] Interactions and navigation paths documented
- [ ] Error handling scenarios documented
- [ ] Summary report generated with findings
- [ ] User knows what's next (POM update, test creation)
</success_criteria>

<workflow_variations>
**Variation 1: Analyze Specific Page**
```
User: /analyze new order confirmation page

1. Check if docs exist
2. Use Playwright CLI to analyze
3. Create/update docs
4. Report findings
```

**Variation 2: Analyze Entire Application**
```
User: /analyze

1. Check existing docs
2. Navigate all pages from base URL
3. Document all pages
4. Compare with existing
5. Report new/updated pages
```

**Variation 3: Analyze After Development**
```
User: /analyze we added a new sidebar menu

1. Check if sidebar-menu.md exists
2. Analyze sidebar component
3. Create/update component docs
4. Report findings
```
</workflow_variations>

<error_handling>
If analysis fails:
1. Report which step failed
2. Show what was completed
3. Suggest manual investigation
4. Provide error details

**Common issues:**
- Can't access URL → Try in browser first
- Locators not found → May need manual review
- Too many pages → Focus on main flows
</error_handling>

<dependencies>
- Playwright CLI installed
- Access to target URL
- Write permissions to docs/
- pom-analyzer agent available
</dependencies>
