# Test Data & Credentials

---

## Test Data

All test data lives in `tests/test-data/*.json`. No hardcoded values in test files.

```typescript
// ✅ Correct
import inventoryData from '../../test-data/inventory.json';
const product = inventoryData.products[0];
expect(price).toBe(product.price);

// ❌ Wrong
expect(price).toBe(29.99);
```

### Available Files

| File                       | Contains                                      |
|----------------------------|-----------------------------------------------|
| `login.json`               | Error messages, form labels                   |
| `inventory.json`           | Products (id, name, price, description)       |
| `cart.json`                | Cart labels, button text                      |
| `checkout-step-one.json`   | Form labels, error messages                   |
| `checkout-step-two.json`   | Summary labels, tax rate                      |
| `checkout-complete.json`   | Success messages, labels                      |

When adding new test data: add to the relevant file, or create a new JSON if the domain doesn't exist yet.

---

## Credentials

Credentials are the **only exception** to the JSON rule — they live in `.env` and are accessed exclusively through centralized helpers.

### Pattern

```typescript
// ✅ Default (standard_user) — use loginWithDefaults()
await loginPage.goto();
await loginPage.loginWithDefaults();

// ✅ Specific user type — use helpers
import { getLockedOutUserCredentials } from '../../helpers/credentials';
const { username, password } = getLockedOutUserCredentials();

// ❌ Never in tests
import dotenv from 'dotenv';
const user = process.env.STANDARD_USER || 'standard_user';
await loginPage.login('standard_user', 'secret_sauce');
```

### Available Users

| User                    | Use case                                  |
|-------------------------|-------------------------------------------|
| `standard_user`         | Normal flow tests (default)               |
| `locked_out_user`       | Auth error scenarios                      |
| `problem_user`          | Broken image / UI defect scenarios        |
| `performance_glitch_user` | Slow response / timeout scenarios       |
| `error_user`            | Cart and checkout error scenarios         |
| `visual_user`           | Visual regression tests                   |

### Adding a New User Type

1. Add a `loginWithXxx()` method to `tests/pages/login.page.ts`
2. Add a `getXxxCredentials()` helper to `tests/helpers/credentials.ts`
3. Do not add fallback hardcoded strings (e.g. `|| 'standard_user'`) anywhere
