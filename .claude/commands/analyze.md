---
description: Analyzes web application for new development and updates documentation
---

# /analyze

Analyzes the web application to detect new development work and update documentation. Integrates with existing docs/app-knowledge/ and docs/snapshots/ structure.

## Usage

```
/analyze [optional: specific page or feature description]
```

**Examples:**
- `/analyze` - Analyzes entire application (baseURL from config)
- `/analyze new order confirmation page` - Analyzes specific page
- `/analyze the new guest checkout flow` - Analyzes feature
- `/analyze new sidebar menu component` - Analyzes component

## What It Does

1. Check Existing Documentation - List what's already documented in docs/app-knowledge/ and docs/snapshots/
2. Use Playwright CLI - Invoke pom-analyzer agent to discover application structure using Playwright codegen, document all pages with data-test selectors, record interactions and navigation, create .md and .yaml files
3. Compare and Detect - Identify what's new or changed compared to existing docs
4. Create/Update Documentation - Generate docs/app-knowledge/{page}.md and docs/snapshots/{page}.yaml
5. Report Findings - Summary of new pages, updated pages, and next steps

## Output Format

```markdown
# Analysis Complete! ✅

## Target Analyzed
{URL or page description}

## New Pages Discovered
- **{PageName}**: {description}
  - Docs: `docs/app-knowledge/{page}.md`

## Existing Pages Updated
- **{PageName}**: {what changed}
  - Docs: `docs/app-knowledge/{page}.md`

## Documentation Created/Updated
- `docs/app-knowledge/{new-page}.md` - NEW
- `docs/snapshots/{new-page}.yaml` - NEW

## Next Steps
1. Review the generated documentation
2. Run `/pom-update` to create page objects
3. Run `/create-test` to create tests
```

## When To Use

- **After development sprints**: When new features have been added
- **Before creating tests**: To ensure documentation is current
- **When POMs feel outdated**: To refresh page structure knowledge
- **Onboarding new team members**: To document current state

## See Also

- `/pom-update` - Create or update page objects from documentation
- `/create-test` - Create tests from page objects
- `/automation` - Complete workflow (analyze + POM + tests + validate)
