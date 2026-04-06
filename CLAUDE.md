# Project Guidelines — Automation Challenge PW

## Project Overview

Playwright + TypeScript E2E test suite for SauceDemo ([saucedemo.com](https://www.saucedemo.com/)),
built with Page Object Model, custom fixtures, and AI-assisted generation via Claude Code.

---

## Knowledge Base

Read the relevant docs **before writing any test or page object**.

| Page         | App Knowledge                            | Snapshot                              |
|--------------|------------------------------------------|---------------------------------------|
| Login        | `docs/app-knowledge/login-page.md`       | `docs/snapshots/login-page.yaml`      |
| Inventory    | `docs/app-knowledge/inventory-page.md`   | `docs/snapshots/inventory-page.yaml`  |
| Cart         | `docs/app-knowledge/cart-page.md`        | `docs/snapshots/cart-page.yaml`       |
| Checkout     | `docs/app-knowledge/checkout-pages.md`   | `docs/snapshots/checkout-*.yaml`      |
| Navbar       | `docs/app-knowledge/navbar.md`           | `docs/snapshots/navbar.yaml`          |
| Sidebar      | `docs/app-knowledge/sidebar-menu.md`     | `docs/snapshots/sidebar-menu.yaml`    |

---

## Skills

| Task                               | Skill                                      |
|------------------------------------|--------------------------------------------|
| Creating / editing page objects    | `.agents/skills/playwright-pom/SKILL.md`   |
| Writing test specs                 | `.agents/skills/playwright-pom/SKILL.md`   |
| Project setup / config / debugging | `.agents/skills/playwright-core/SKILL.md`  |
| CI/CD pipeline / GitHub Actions    | `.agents/skills/playwright-ci/SKILL.md`    |

---

## Skill Maintenance

When editing skills in `.agents/skills/`, use `/create-agent-skills` to follow proper structure and avoid information overload.

**Key principle:** Keep skills concise — reference existing docs instead of duplicating.

---

## Project-Specific Conventions

These files define how **this project** extends or constrains the base skills.
Always read the relevant convention file alongside the skill.

| Convention             | File                                |
|------------------------|-------------------------------------|
| Test data & credentials| `docs/conventions/test-data.md`     |
| Tagging strategy       | `docs/conventions/tagging.md`       |

---

## Non-Negotiable Rules

1. **Read docs first.** Never guess selectors — use `data-test` attributes from `docs/snapshots/`.
2. **No assertions inside page objects.** Page objects perform actions; tests assert outcomes.
3. **No hardcoded values in tests.** Test data lives in `tests/test-data/*.json`. Credentials via `tests/helpers/credentials.ts`.
4. **Use fixtures.** Never instantiate page objects manually in tests or `beforeEach`.
5. **`isLoaded()` owns URL verification.** Never hardcode URL patterns in test files.
6. **Tests must be independent.** No shared state between tests; each test sets up its own preconditions.

> For full detail on each rule see `.agents/skills/playwright-pom/SKILL.md`.

---

## Test Creation Workflow

1. Read `docs/app-knowledge/<page>.md` and `docs/snapshots/<page>.yaml`
2. Check `tests/test-data/<page>.json` for available data
3. Read `.agents/skills/playwright-pom/SKILL.md`
4. Create or update the page object under `tests/pages/`
5. Register the fixture in `tests/fixtures/base.fixture.ts` if new page
6. Write the test spec under `tests/tests/<feature>/`
7. Tag the test appropriately (see `docs/conventions/tagging.md`)
8. Run `npm test` to verify

---

## Project Structure

```
tests/
├── tests/                      # Specs organized by feature domain
│   ├── auth/login.spec.ts
│   ├── inventory/inventory.spec.ts
│   ├── cart/cart.spec.ts
│   ├── checkout/
│   │   ├── checkout-step-one/
│   │   ├── checkout-step-two/
│   │   └── checkout-complete/
│   ├── navigation/
│   │   ├── navbar.spec.ts
│   │   └── sidebar.spec.ts
│   └── E2E/critical-paths.spec.ts
├── pages/                      # Page objects — mirrors UI structure
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   ├── checkout-step-one.page.ts
│   ├── checkout-step-two.page.ts
│   ├── checkout-complete.page.ts
│   ├── navbar.page.ts
│   └── sidebar.page.ts
├── fixtures/base.fixture.ts    # Custom fixtures with page objects
├── helpers/
│   ├── credentials.ts
│   ├── assertions.ts
│   └── checkout-setup.ts
└── test-data/                  # JSON files — no hardcoded values in tests

docs/
├── app-knowledge/              # Page documentation
├── snapshots/                  # Element snapshots (confirmed selectors)
│   ├── login-page.yaml
│   ├── inventory-page.yaml
│   ├── cart-page.yaml
│   ├── checkout-step-one.yaml
│   ├── checkout-step-two.yaml
│   ├── checkout-complete.yaml
│   ├── navbar.yaml
│   └── sidebar-menu.yaml
└── conventions/                # Project-specific rules (read alongside skills)
    ├── test-data.md
    └── tagging.md
```

---
