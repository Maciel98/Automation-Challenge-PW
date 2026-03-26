# Automation-Challenge

## Test Strategy (Swag Labs / SauceDemo)

### A. Test Types and Coverage Model

#### Smoke Tests
Verify the application is operational and critical pages are reachable. Covers: login page loads, standard_user can authenticate, inventory page displays products, and basic cart functionality works. These run fast and act as the first gate before anything else.

#### End-to-End Tests
E2E tests are the primary way to validate that the full journey works: login → browse inventory → add to cart → checkout (information, overview, complete). These cover both happy paths and key failure paths.

#### Regression Tests
A curated suite of E2E and smoke tests run together to confirm that nothing already working has broken. Not a separate test type structurally, it's a label for how the full suite is run on a schedule or before a release.

#### Exploratory / Manual Tests
Exploratory and manual testing are always important, especially at the beginning, so automation can later take over the core functionalities. However, there are key scenarios where manual testing remains necessary even when automation is mature:

- Visual and layout validation across browsers and screen sizes
- Edge cases that are too costly to automate but worth a one-time manual verification
- Final pre-release sanity check to catch anything automation may have missed

#### Data / Setup Validation
Before any test flow runs, preconditions must be verified to ensure failures are caused by the application and not by a broken test setup. For this application that means confirming the test user credentials are valid, the session is authenticated, and the cart is in a known empty state before each test.

#### Excluded and why

- **Integration tests:** SauceDemo is a complete front-end application without accessible service boundaries for integration testing.
- **API / service-level tests:** There is no documented API available for this demo application. All interactions happen through the UI.
- **Database tests:** The application uses in-memory state; there is no persistent database to test.

---

### B. Where, How, and When Tests Run

#### Which tests run locally?

Smoke tests and what the QA is actively writing. Not the full suite, fast feedback only.

For example, if you are working on the login flow, you run the login smoke test and the new test you just wrote, not the entire checkout regression.

#### Which run in CI?

Everything. Smoke on every PR, full regression post-merge and on a schedule.

For example, a PR that changes the add to cart button triggers smoke, and once merged the full suite runs including inventory, cart, and checkout flows.

#### Pre-merge vs post-merge?

Smoke pre-merge, full regression post-merge.

For example, before merging a fix for the cart page, smoke confirms login and cart still work. After merging, the full regression verifies nothing downstream was affected, like the checkout flow or inventory sorting.

#### On a schedule or before releases?

Full regression runs nightly. Scheduled runs ensure nothing regresses over time. Before a release, smoke runs as a hard gate plus a manual pass on the checkout complete page and inventory sorting.

#### Blocking vs non-blocking?

**Blocking** means the pipeline stops and nothing moves forward until it is fixed. These are smoke tests covering the core functionality of the app. If a user cannot log in, add a product to the cart, or reach checkout, there is no point releasing.

**Non-blocking** means a failure is a known bug that gets logged and investigated, but it does not halt the team because the core functionality is still working. A broken sort filter or a minor UI inconsistency is not a reason to stop a release.

---

### C. Business Criteria and Scenario Definition

#### How do you extract criteria from the business?

For this app the flows are well defined by the purchase journey itself: login, browse inventory, add to cart, checkout. Criteria comes from walking the application as a user, mapping each step, and asking "what must be true here for this to work?"

That said, in a real project this also means reviewing acceptance criteria on user stories, sitting with the product owner to understand edge cases they have already thought about, and reviewing any past bugs or support tickets which are often the best source of what actually breaks in production.

#### How do you identify happy paths, edge cases, and failure paths?

For each flow you start with the happy path, the exact steps a user follows when everything goes right. Then you stress each step: what if the input is wrong, what if the session expires, what if the cart is empty.

For this app specifically:

- **Happy path:** Valid credentials (standard_user) → login succeeds, item added → cart badge updates, checkout with valid info → confirmation displayed
- **Edge cases:** Adding the same product twice, sorting products then adding, navigating back mid-checkout, browser refresh during checkout
- **Failure paths:** Wrong password, locked_out_user, attempting checkout with an empty cart, missing required fields

#### How do you turn product behavior into test scenarios?

Each scenario follows a simple structure: given a starting state, when an action is performed, then a specific outcome is expected.

For example:

- Given the user is on the login page, when they enter invalid credentials, then an error message is displayed and they remain on the login page
- Given the user has an item in the cart, when they proceed to checkout and complete all steps, then the checkout complete page is displayed with "Thank you for your order!" and the cart is empty

This keeps scenarios concrete, testable, and directly tied to what the application is supposed to do.

---

### D. Test Data Strategy

#### What baseline data is required?

This app needs valid test user credentials. That is the single most critical piece of data, without it nothing else runs. The application provides 6 pre-configured test users (standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user) all with the same password (secret_sauce). The product catalog is fixed with 6 products and can be treated as read-only reference data.

#### How is user and account setup handled?

Test credentials are stored in environment variables, never hardcoded. Authentication state is established per test since sessions are short-lived and SauceDemo does not maintain persistent sessions across test runs. Each test logs in fresh to ensure clean state.

#### Should data be seeded, mocked, reused, or created during tests?

For this app cart state is created during tests through UI actions since there is no accessible API. Authentication state is created per test to avoid cross-test contamination. The product catalog is static and requires no seeding.

In other contexts the approach changes: seeding via API or database scripts is preferred when you need large volumes of consistent data across environments, mocking is used when an external dependency is unreliable or costly to call, and static fixtures are used for reference data that never changes like a country list or product catalog.

#### What are the risks around brittle or environment-dependent data?

  Two key risks to watch for:       

  1. Test contamination - If tests don't properly log out, cart items from one test can leak into the 
  next, causing false failures or passes.
  2. Brittle tests - When tests hardcode values like product names ("Sauce Labs Backpack"), any change
   to the application breaks the test. Better to reference products by ID or use test data files. 

The mitigation is to:
 - **Leverage Playwright's built-in isolation** - Each test automatically gets a new browser context,preventing cookie/session leakage between tests
  - **Use test data files** - Centralize values in tests/test-data/*.json rather than hardcoding across tests
  - **Use data-test attributes** - Select by stable test attributes rather than text-based selectors
  - **Explicitly log out when needed** - Browser contexts are isolated by default, but log out explicitly when testing logout flows or when sharing contexts 

---

### E. Prioritization

#### When starting from scratch

The first question is not "what do I test" but "what costs the most when it goes wrong." For this app the answer is clear: if a user cannot log in, add items to cart, or complete checkout, the application does not work. Everything else is secondary.

#### What gets built first and why?

The foundation comes before any test scenarios. That means the test framework is configured, the page objects are created, and CI is running even if only one test exists. A single reliable test in a working pipeline is worth more than twenty tests that only run locally.

#### How is the work sequenced?

The flows have natural dependencies that dictate the order. Login must work before anything else can run. Add to cart depends on a working login. Checkout depends on a working cart. The sequence follows the purchase journey itself, each phase unblocks the next.

1. **First:** Login happy path and failure path (every other test depends on this)
   - standard_user login success
   - Wrong password / empty fields validation

2. **Second:** Inventory and add to cart (confirms the core shopping action works)
   - View all 6 products
   - Add single item to cart
   - Verify cart badge updates
   - Navigate to cart page

3. **Third:** Full checkout flow (the highest business value scenario and the most complex to automate)

4. **Last:** Edge cases and failure paths within each flow
   - Sort products functionality
   - Remove items from cart
   - Empty cart checkout prevention
   - Missing required fields validation
   - Other user types (problem_user, performance_glitch_user, etc.)

#### What gets deprioritized early on?

Edge cases and failure paths wait until the happy paths are stable. There is no value in testing what happens when checkout fails if you have not yet confirmed that checkout succeeds.
