# Tagging Strategy

Tags are added inline in test titles using `@` syntax.

```typescript
test('should complete checkout @smoke @P0', async ({ ... }) => { ... });
```

---

## Tag Definitions

| Tag          | Meaning                                                  | When to apply                         |
|--------------|----------------------------------------------------------|---------------------------------------|
| `@smoke`     | Critical path — runs on every push                       | Login, add to cart, checkout flow     |
| `@E2E`       | Full end-to-end journey spanning multiple pages          | Complete purchase flows               |
| `@regression`| Guards against previously fixed bugs                     | After a bug fix                       |

---

## Running by Tag

```bash
npx playwright test --grep @smoke           # Smoke tests only
npx playwright test --grep @P0             # Highest priority only
npx playwright test --grep @E2E            # End-to-end tests
npx playwright test --grep-invert @slow    # Exclude slow tests
```

---

## Rules

- `@E2E` tests are excluded from smoke (too broad / too slow for every-push runs)
- Tags go at the **end** of the test title string
