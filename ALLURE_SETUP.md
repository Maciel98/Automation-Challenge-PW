# Allure Reporting Setup - Quick Start

## ✅ What Was Installed

1. **Allure Playwright Reporter** - Generates test data in Allure format
2. **Playwright Config Update** - Allure reporter added to all test runs
3. **GitHub Actions Integration** - Allure reports generated and uploaded as artifacts
4. **GitHub Pages Workflow** - Automatic dashboard deployment
5. **Helper Functions** - Convenient TypeScript helpers for Allure metadata

## 🚀 Quick Start

### View Reports Locally

```bash
# Run tests (Allure data is automatically collected)
npm test

# View the Allure report
npx allure open allure-report

# Or serve with live reload
npx allure serve allure-results
```

### Enable GitHub Pages Dashboard

1. Go to **Repository Settings** > **Pages**
2. Set **Source** to **GitHub Actions**
3. Wait for the next test run to complete
4. Access your dashboard at:
   ```
   https://<your-username>.github.io/<repository-name>/
   ```

## 📊 What You Get

### Beautiful Dashboard
- Test history and trends over time
- Filter by status, severity, suite, and tags
- Detailed test logs, screenshots, and traces
- Compare builds and track flaky tests
- Beautiful graphs and statistics

### CI/CD Artifacts
After each GitHub Actions run, download:
- `*-allure-results` - Raw Allure data
- `*-allure-report` - Generated HTML report

## 🏷️ Adding Test Metadata

### Quick Example

```typescript
import { test, expect } from '@playwright/test';
import { Allure, Severity, Tags } from '../helpers/allure';

test('should login successfully @smoke', async ({ page }) => {
  // Add Allure metadata
  Allure.epic('Authentication');
  Allure.feature('Login');
  Allure.story('User logs in with valid credentials');
  Allure.severity(Severity.CRITICAL);
  Allure.tag(Tags.SMOKE, Tags.AUTH);

  // Your test code...
  await page.goto('/login');
  // ... test implementation
});
```

## 📁 Files Created/Modified

### Created
- `tests/helpers/allure.ts` - Helper functions for Allure metadata
- `docs/ALLURE_GUIDE.md` - Complete usage guide
- `.github/workflows/allure-report.yml` - GitHub Pages deployment workflow

### Modified
- `playwright.config.ts` - Added Allure reporter configuration
- `.github/workflows/pipeline.yml` - Added Allure report generation steps

## 🎯 Next Steps

1. **Run tests locally** to see Allure in action
2. **Add metadata** to your existing tests (see `ALLURE_GUIDE.md`)
3. **Enable GitHub Pages** for the persistent dashboard
4. **Share the dashboard URL** with your team

## 📖 Documentation

See [`docs/ALLURE_GUIDE.md`](docs/ALLURE_GUIDE.md) for:
- Complete API reference
- Advanced examples
- Best practices
- Troubleshooting

## 🎨 Dashboard Preview

Once enabled, your dashboard will include:
- **Overview** - Pass/fail trends, duration, severity breakdown
- **Suites** - Tests grouped by file/describe blocks
- **Behaviors** - Epic > Feature > Story hierarchy
- **Graphs** - Duration trends, severity distribution, tag frequency
- **Timeline** - Test execution order and parallelization

## 🔥 Quick Reference

| Task | Command |
|------|---------|
| View local report | `npx allure open allure-report` |
| Serve with live reload | `npx allure serve allure-results` |
| Generate clean report | `npx allure generate allure-results --clean -o allure-report` |
| Clean history | `rm -rf allure-history` |

## 💡 Tips

1. **Start simple** - Add epic, feature, and severity to critical tests first
2. **Use tags** - `@smoke` and `@regression` already on your tests work great
3. **Link tickets** - Connect failed tests to JIRA/GitHub issues
4. **Add owners** - Know who to contact when tests fail
5. **Use steps** - Break complex tests into named steps for clarity

---

**Questions?** Check [`docs/ALLURE_GUIDE.md`](docs/ALLURE_GUIDE.md) or the [Allure Playwright docs](https://github.com/allure-framework/allure-js/tree/master/packages/allure-playwright)
