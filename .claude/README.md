# Test Automation Orchestrator

Complete test automation system for the SauceDemo Playwright project with intelligent agents and workflows.

## Quick Start

```
/automation [--auto] [what to automate]
```

### Examples

```bash
# Automate entire application (interactive with checkpoints)
/automation

# Automate entire application (fully automated)
/automation --auto

# Automate a specific feature (interactive)
/automation checkout flow

# Automate a specific flow (fully automated)
/automation --auto cart and checkout
```

## Available Commands

### Main Orchestrator

**`/automation [--auto]`** - Complete workflow (analyze → POM → tests → validate → run)

The main command that handles everything from analysis to test execution.

| Option | Description |
|--------|-------------|
| (no flag) | Interactive mode with checkpoint approvals |
| `--auto` | Fully automated without checkpoint approvals |

### Individual Commands

**`/analyze`** - Analyze application and create documentation
```
/analyze [specific page or feature]
```

**`/pom-update`** - Create or update page objects
```
/pom-update [specific page or feature]
```

**`/create-test`** - Create test specifications
```
/create-test [what to test]
```

**`/validate`** - Validate code quality and standards
```
/validate [optional: path or "pom" or "tests"]
```

## How It Works

```
┌─────────────────┐
│  /automation    │  ← One command does everything
│  "checkout"     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ 1. Assessment              │  ← What exists?
│    Check docs, POMs, tests  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ 2. Analyze      │ NO  │ Skip if docs │
│    if needed    ├─────┤    exist     │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│ 3. Update POMs  │  ← Create/update page objects
│    if needed    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. Create Tests │  ← Generate test specifications
│    if needed    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. Validate     │  ← Check all standards
│    everything   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. Run Tests    │  ← Verify everything works
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 7. Report       │  ← Complete summary
└─────────────────┘
```

## Directory Structure

```
.claude/
├── agents/                    # Agent specifications
│   ├── pom-analyzer.md       # Analyzes applications
│   ├── pom-updater.md        # Creates/updates POMs
│   ├── test-creator.md       # Creates tests
│   └── test-validator.md     # Validates code
├── commands/                  # User-facing commands
│   ├── analyze.md           # /analyze
│   ├── pom-update.md        # /pom-update
│   ├── create-test.md       # /create-test
│   ├── validate.md          # /validate
│   └── automation.md        # /automation (main)
├── workflows/                 # Orchestration logic
│   ├── analyze-workflow.md  # Analysis workflow
│   └── automation-workflow.md # Complete workflow
├── settings.json             # Permissions
└── README.md                 # This file
```

## Project Structure (Existing)

```
tests/
├── pages/                      # Page objects
├── fixtures/                   # Custom fixtures
├── tests/                      # Test specifications
├── helpers/                    # Helper functions
└── test-data/                  # Test data (no hardcoded values)

docs/
├── app-knowledge/              # Page documentation
│   ├── login-page.md
│   ├── inventory-page.md
│   └── ...
└── snapshots/                  # Element snapshots
    ├── login-page.yaml
    ├── inventory-page.yaml
    └── ...

.agents/skills/                 # Skills for detailed guidance
└── playwright-pom/             # POM patterns and best practices
    ├── SKILL.md                # Main skill file
    ├── references/             # Detailed references
    │   ├── page-object-model.md
    │   └── pom-vs-fixtures-vs-helpers.md
    └── workflows/              # Skill-specific workflows
```

## When to Use Each Command

| Command | Use When |
|---------|----------|
| `/automation` | You want complete automation in one command (interactive) |
| `/automation --auto` | You want complete automation without checkpoint approvals |
| `/analyze` | New development was added |
| `/pom-update` | Page objects need updating |
| `/create-test` | You want to add test scenarios |
| `/validate` | Before committing code |

## Example Workflows

### New Feature Development

```bash
# Team adds new "guest checkout" feature
/automation --auto new guest checkout flow

# System automatically:
# 1. Analyzes the new feature
# 2. Creates page objects
# 3. Creates tests
# 4. Validates everything
# 5. Runs tests
# 6. Reports results
```

### Test Creation for Existing Features

```bash
# Page objects exist, need tests
/create-test user can add items to cart and checkout

# System automatically:
# 1. Identifies required page objects
# 2. Creates test scenarios
# 3. Validates test quality
# 4. Reports what was created
```

### Automated Full Workflow

```bash
# Completely automate a feature from scratch
/automation --auto new guest checkout flow

# System automatically handles everything without checkpoint approvals:
# 1. Analyzes the new feature
# 2. Creates page objects
# 3. Creates tests
# 4. Validates everything
# 5. Runs tests
# 6. Reports results
```

### After Development Sprint

```bash
# Multiple features added
/analyze

# System discovers all new/changed pages
# Then:
/pom-update

# System creates/updates all page objects
# Then:
/create-test [each feature]

# System creates tests for each
```

### Quality Check

```bash
# Before committing
/validate

# System checks:
# - Syntax (TypeScript compilation)
# - Structure (POM and test standards)
# - Standards (project conventions)
# - Quality (code quality metrics)
```

## Standards Enforced

The orchestrator ensures:

✅ **POM Standards**
- No assertions in page objects
- Private readonly locators only
- Navigation methods return next page
- isLoaded() handles URL verification

✅ **Test Standards**
- Use fixtures only (no manual instantiation)
- No hardcoded values (test data from files)
- AAA pattern (Arrange, Act, Assert)
- Independent tests (no shared state)

✅ **Project Conventions**
- data-test selectors from snapshots
- Test data from tests/test-data/*.json
- Credentials from tests/helpers/credentials.ts
- Proper tagging per conventions

## Output Artifacts

### Documentation
- `docs/app-knowledge/{page}.md` - Human-readable docs
- `docs/snapshots/{page}.yaml` - Machine-readable snapshots

### Page Objects
- `tests/pages/{page}.page.ts` - Page object classes
- `tests/fixtures/base.fixture.ts` - Fixture registrations

### Tests
- `tests/tests/{feature}/{spec}.spec.ts` - Test specifications
- `tests/test-data/{feature}.json` - Test data

### Reports
- `validation-report.md` - Validation results
- Console summary - Complete workflow report

## Advantages Over Manual Approach

### Manual (Old Way)
```
1. Read docs manually
2. Decide which skill to use
3. Call skill manually
4. Create POM manually
5. Create test manually
6. Validate manually
7. Run tests manually
8. Fix issues manually
```

### Orchestrator (New Way)
```
1. /automation --auto checkout flow
   → Everything happens automatically
   → No checkpoint approvals needed
   → Smart decisions (skip what's done)
   → Comprehensive report

OR

1. /automation checkout flow
   → Everything happens automatically
   → Checkpoint approvals at key steps
   → Smart decisions (skip what's done)
   → Comprehensive report
```

## Skills vs Commands

### Skills (Still Available)

The project still has all the original skills in `.agents/skills/`:
- `playwright-pom` - POM best practices
- `playwright-core` - Core Playwright patterns
- `playwright-ci` - CI/CD configurations
- `playwright-cli` - CLI usage

Skills are useful for:
- Learning about specific topics
- Getting detailed guidance
- Manual control over specific tasks

### Commands (New)

Commands are useful for:
- Complete workflows
- Automatic orchestration
- Less manual work
- Consistent processes

## Documentation References

**Orchestrator System:**
- **[This README](.claude/README.md)** - Complete orchestrator guide
- **[agents/](agents/)** - Agent specifications
- **[commands/](commands/)** - Command documentation
- **[workflows/](workflows/)** - Workflow details

**POM and Testing Standards:**
- **[.agents/skills/playwright-pom/SKILL.md](../agents/skills/playwright-pom/SKILL.md)** - Main POM skill
- **[page-object-model.md](../agents/skills/playwright-pom/references/page-object-model.md)** - Complete POM patterns
- **[pom-vs-fixtures-vs-helpers.md](../agents/skills/playwright-pom/references/pom-vs-fixtures-vs-helpers.md)** - Decision framework

**Project Guidelines:**
- **[CLAUDE.md](../CLAUDE.md)** - Project guidelines and overview
- **[docs/conventions/test-data.md](../docs/conventions/test-data.md)** - Test data conventions
- **[docs/conventions/tagging.md](../docs/conventions/tagging.md)** - Tagging strategy

## Getting Started

### First Time Setup

```bash
# Ensure dependencies are installed
npm install

# Run the orchestrator for a simple feature (interactive)
/automation login functionality

# Or run fully automated
/automation --auto login functionality

# Review what was created
# - Check docs/app-knowledge/
# - Check tests/pages/
# - Check tests/tests/
# - Check validation report
```

### Daily Usage

```bash
# Team adds new feature (interactive)
/automation new feature name

# Team adds new feature (fully automated)
/automation --auto new feature name

# Just need tests for existing feature
/create-test what you want to test

# Check quality before committing
/validate

# Full report (interactive)
/automation

# Full report (fully automated)
/automation --auto
```

## Support

For questions or issues:
1. Check the relevant agent documentation in `agents/`
2. Check the command documentation in `commands/`
3. Review the workflow in `workflows/`
4. Consult POM skill references in `.agents/skills/playwright-pom/references/`

## Tips

1. **Be specific** - Better results with specific requirements
2. **Review docs first** - Check docs/app-knowledge/ exists
3. **Start small** - Begin with happy paths, add edge cases
4. **Use iteratively** - Build up coverage over time
5. **Review reports** - Check what was created before committing
