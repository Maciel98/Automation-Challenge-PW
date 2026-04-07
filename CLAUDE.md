# Project Guidelines — Automation Challenge PW

## Project Overview

Playwright + TypeScript E2E test suite for SauceDemo (saucedemo.com).
Built with Page Object Model (POM) pattern and AI-assisted generation via Claude Code.

---

## Tech Stack

- **Playwright** - Test automation framework
- **TypeScript** - Type-safe test code
- **Page Object Model** - UI abstraction pattern
- **Custom fixtures** - Test setup via `tests/fixtures/`
- **JSON test data** - External data in `tests/test-data/`

---

## How This Project Works

### AI-Assisted Workflow
This project uses custom Claude Code skills and commands located in `.claude/`:

| Command | Purpose |
|---------|---------|
| `/analyze` | Explore app and generate documentation |
| `/pom-update` | Create/update Page Object Model classes |
| `/create-test` | Generate test specs from page objects |
| `/validate` | Verify POM best practices |
| `/automation` | Full end-to-end workflow |

### Project Structure
- `.claude/` - Custom commands, workflows, skills, agents
- `docs/` - AI-generated app knowledge (selectors, interactions)
- `tests/pages/` - Page objects (POM pattern)
- `tests/tests/` - Test specs organized by feature
- `tests/test-data/` - Test data JSON files
- `tests/fixtures/` - Custom Playwright fixtures

---

## Before Working on Tests

**Always read the relevant documentation first:**

1. **Page docs** - `docs/app-knowledge/<page>.md` (selectors, interactions)
2. **Snapshots** - `docs/snapshots/<page>.yaml` (confirmed locators)
3. **POM skill** - `.claude/skills/playwright-pom/SKILL.md` (POM rules)
4. **Conventions** - `docs/conventions/*.md` (project-specific rules)

---

## Core Rules (Universally Applicable)

1. **Never guess selectors** — use `data-test` attributes from `docs/snapshots/`
2. **No assertions in page objects** — page objects perform actions, tests assert outcomes
3. **No hardcoded values** — test data lives in `tests/test-data/*.json`
4. **Use fixtures** — never instantiate page objects manually
5. **Tests must be independent** — each test sets up its own preconditions

> See `.claude/skills/playwright-pom/SKILL.md` for complete POM rules.

---

## Running & Verifying

```bash
npm test              # Run all tests
npm run test:headed   # Run tests in headed mode
npm run test:debug    # Debug with Playwright Inspector
npm run test:report   # View HTML report
```

---

## Progressive Disclosure

Task-specific documentation (read only when relevant):

- `docs/conventions/test-data.md` — Test data management rules
- `docs/conventions/tagging.md` — Test tagging strategy
- `.claude/skills/playwright-pom/SKILL.md` — Page Object Model patterns
- `.claude/skills/playwright-core/SKILL.md` — Project setup & debugging
- `.claude/skills/playwright-ci/SKILL.md` — CI/CD configuration

---

## Skill Maintenance

When editing skills in `.claude/skills/`, use `/create-agent-skills` to follow proper structure.
**Key principle:** Keep skills concise — reference existing docs instead of duplicating content.
