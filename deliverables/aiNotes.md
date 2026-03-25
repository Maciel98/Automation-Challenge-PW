# Part 4: AI Usage Notes

## Tools Used

**Claude Code** (Anthropic's Sonnet 4.6) with Playwright skills:
- `playwright-pom` - Page Object Model patterns
- `playwright-core` - Playwright fundamentals
- `playwright-cli` - Browser exploration and snapshots

---

## How I Prompted

I refined my prompting approach specifically for this project to match the Playwright patterns. Even with clear documentation in CLAUDE.md, I found that being more explicit about documentation references and existing code examples helped the AI stay aligned with the project's conventions.

**What worked best:**
> "Use the playwright-pom skill to create the InventoryPage. Read docs/app-knowledge/inventory-page.md and docs/snapshots/inventory-page.yaml first. Use ONLY data-test selectors from the snapshot. Follow the pattern in tests/pages/login.page.ts."

The key was providing documentation references and existing code examples so the AI had everything it needed to follow the established patterns.

---

## What Was AI-Generated

Most of the repetitive stuff:
- **Page Objects:** InventoryPage, CartPage, all 3 Checkout pages
- **Test Specs:** 57 tests across 9 spec files (checkout flows, product catalog, navigation)
- **Test Data:** JSON files with product data, error messages, form labels
- **Components:** Navbar and Sidebar page objects

The AI was really good at taking a pattern I established (like the LoginPage) and scaling it across the entire application.

What I wrote myself:
- Initial infrastructure (playwright.config.ts, fixtures)
- LoginPage and login tests - this established the pattern
- Project documentation (CLAUDE.md, inventory.md, testStrategy.md, this document). Obviously with some tweaks from AI

---

## What the Model Got Wrong

**1. Selector Issues (Multiple Times)**
The AI kept using generic selectors like `getByRole('button', { name: 'Login' })` that matched multiple elements instead of the specific data-test selectors. I had to keep correcting it to use `[data-test="login-button"]` style selectors.

**2. Missing Steps**
Sometimes the AI would generate code that filled a form but forgot to click the submit button. It would fill in username and password but never actually submit the form.

**3. Hardcoded Values**
Even though I had test data files, the AI kept hardcoding expected values in tests like `expect(price).toBe('$29.99')` instead of using the JSON data.

**4. Assertions in Page Objects**
The AI occasionally put assertions inside page objects, which violates POM principles. I had to keep moving assertions to the test specs.

**5. Not Following CLAUDE.md Guidelines**
Sometimes the AI didn't take into account stuff from CLAUDE.md that was specified and had some hiccups. Even with clear documentation, it would occasionally use role-based selectors instead of data-test attributes, hardcode values when test data files existed, or put assertions in page objects despite the POM guidelines. Running tests immediately after generation caught these issues quickly.

---

## What I Had to Fix

**Selector Precision:** Changed from generic role-based selectors to specific data-test attributes. This made tests way more reliable.

**Pattern Enforcement:** Established the LoginPage as the canonical example that all other pages should follow. Once the AI had this to reference, it made much better decisions.

**Documentation-First Approach:** Created the `docs/app-knowledge/` and `docs/snapshots/` folders before having the AI write any tests. This gave it a reliable reference point instead of guessing.

**Component Extraction:** The AI initially duplicated navbar/sidebar code in every page object. I refactored these into reusable component page objects that get composed into the page objects.

---

## Validation

I validated everything by running the tests.

I also did code reviews checking for:
- No assertions in page objects (POM violation)
- All selectors using data-test attributes
- No hardcoded values
- Proper fixture usage

The documentation in `docs/app-knowledge/` was crucial - I cross-referenced every selector against the YAML snapshots to make sure they were correct.

---

## Lessons Learned

### Exploration First

It takes a lot of time the first time you run it since there's nothing created yet. Let the AI explore the app first before writing tests. Otherwise it generates code from assumptions, then you spend way more time debugging wrong selectors and incorrect flows.

Quick exploration saves hours of debugging.

I used the playwright-cli skill to explore each page and capture snapshots. This created `docs/snapshots/*.yaml` files with confirmed selectors and `docs/app-knowledge/*.md` files with behavior documentation. The AI then used these as reference instead of guessing.

### Code One Example First

Even when you explain everything in docs, it can be good practice to code one test yourself first. The AI picks up on your actual patterns and conventions from that example, then scales it correctly to the other scenarios.

One working example = 20 correct tests.

I manually created the LoginPage and login.spec.ts first. This established the pattern of using data-test selectors, intent-revealing methods, no assertions in page objects, and proper fixture integration. The AI followed this pattern perfectly for the rest of the project.

### Approve in Small Batches

Don't let AI generate everything then review it all at once. Build checkpoints:

- Generate spec → approve → write tests
- Write tests → review → fix if needed

Catch wrong assumptions early instead of throwing away hours of work.

I learned this the hard way when the AI generated 5 page objects with wrong selectors. Had to fix all 5. After that, I reviewed each file immediately and fixed issues before moving to the next one.

### Always Check AI Results

It's important to check AI results because sometimes it forgets, even when using CLAUDE.md and extra docs.

The AI would sometimes:
- Use role-based selectors despite docs saying to use data-test
- Hardcode values even when test data files existed
- Put assertions in page objects despite POM guidelines

Running tests immediately after generation caught these issues quickly.

---

## Example Prompts

### Prompt 1: App Exploration (AI-Refined)

I had Claude help me refine this prompt to be clearer:

```
You are exploring my app to build a knowledge base for writing Playwright tests.

Use the playwright-cli skill to explore each page of my app.

For each page follow this exact process:
1. playwright-cli open <url>
2. playwright-cli snapshot
3. Save the snapshot YAML output to docs/snapshots/<page-name>.yaml
4. Note the element references (e1, e2, etc.) and what they map to
5. Document any key interactions (clicks, form fills) and what they trigger

Start with these pages in this order:
- saucedemo.com/
- /inventory
- /cart
- /checkout-step-one
- /checkout-step-two
- /checkout-complete

After exploring all pages, create docs/app-knowledge/<page-name>.md for each page with:
- Confirmed element locators mapped from the snapshot
- Auth flow if applicable
- Key user interactions
- Any API calls triggered

Do not write any .spec.ts files yet.
Focus only on exploration and documentation.
```

### Prompt 2: Page Object Creation (AI-Refined)

```
Create the missing page files for the app

Context: I have a Playwright test suite for SauceDemo
(https://www.saucedemo.com) using the Page Object Model pattern.
The LoginPage is already implemented at tests/pages/login.page.ts
and I need to create the remaining page objects.

Existing Pattern to Follow: Use tests/pages/login.page.ts
as the template - it uses data-test attributes, has
intent-revealing methods, no assertions, and proper TypeScript typing.

Available Documentation:
Before creating each page, read:
- docs/app-knowledge/<page-name>.md - Page behavior and interactions
- docs/snapshots/<page-name>.yaml - Confirmed data-test selectors

Pages to Create (in this order):
1. InventoryPage (tests/pages/inventory.page.ts)
2. CartPage (tests/pages/cart.page.ts)
3. CheckoutStepOnePage (tests/pages/checkout-step-one.page.ts)
4. CheckoutStepTwoPage (tests/pages/checkout-step-two.page.ts)
5. CheckoutCompletePage (tests/pages/checkout-complete.page.ts)

Each page object should:
- Use only data-test selectors from the snapshot files
- Include intent-revealing methods (no assertions)
- Follow the LoginPage pattern for consistency
- Be fully typed with TypeScript
```

---

## Artifacts Created

**Documentation:**
- `docs/app-knowledge/` - Detailed page behavior docs (5 pages)
- `docs/snapshots/` - YAML element snapshots with confirmed selectors
- `CLAUDE.md` - AI usage guidelines and project patterns
- `.github/workflows/pipeline.yml` - CI/CD pipeline configuration

**Test Results:**
- HTML report - Comprehensive test execution report

---

## Future Improvements to Scale Faster

**User Story Dump:**
Add a `docs/user-stories/` folder where I can dump raw user stories from Jira/Linear in plain text. The AI could then parse these and generate test scenarios directly from the stories. Would be faster than manually translating stories to test specs.

**API Testing:**
Would be great to add API-level tests alongside the UI tests. They're faster and more reliable. Could use Playwright's `request` context to test:
- Authentication endpoints
- Product catalog API
- Cart operations
- Checkout flow

**Database Testing:**
SauceDemo doesn't have a real database, but in a real app I'd want to verify:
- Order persistence in the database
- User account creation
- Cart state management
- Transaction integrity

**Other Areas:**
- **Performance Testing:** Add Lighthouse CI to catch performance regressions
- **Accessibility Testing:** Use axe-core to catch a11y issues
- **Visual Regression:** Screenshot comparison for unintended visual changes
- **Contract Testing:** Verify API response schemas match documentation

---

## CI/CD Pipeline

See the pipeline configuration in [`.github/workflows/pipeline.yml`](../.github/workflows/pipeline.yml)

---


