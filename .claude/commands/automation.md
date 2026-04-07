---
description: Complete test automation workflow - analyze, create POMs, create tests, validate, run
---

# /automation

Complete test automation orchestrator — analyzes, creates Page Objects, generates tests, validates, and executes.

## Usage

```
/automation [--auto] [what to automate]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--auto` | Off | Run without checkpoint approvals |
| `[what to automate]` | Entire application | Specific feature or flow (optional) |

**Examples:**
- `/automation` - Entire application, interactive with checkpoints
- `/automation --auto` - Entire application, fully automated
- `/automation checkout flow` - Specific feature, interactive
- `/automation --auto cart and checkout` - Specific flow, fully automated

## Prerequisites

Before running `/automation`, read:
- `CLAUDE.md` - Project overview and rules
- `.claude/workflows/automation-workflow.md` - Detailed workflow

## Output

After completion, you get:
- **Assessment matrix** - What existed vs. what was created
- **Validation report** - `validation-report.md` with quality checks
- **Test results** - Pass/fail counts and duration
- **File manifest** - All created/updated files
- **Next steps** - Actions based on results

## See Also

- `/analyze` - Individual analysis step
- `/pom-update` - Individual POM creation
- `/create-test` - Individual test creation
- `/validate` - Individual validation step
