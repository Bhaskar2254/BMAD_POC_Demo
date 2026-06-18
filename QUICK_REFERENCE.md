# Quick Reference Card - Playwright Enterprise Framework

## 🚀 Getting Started (60 seconds)

```bash
# 1. Install
npm install

# 2. Setup environment
cp .env.example .env

# 3. Run tests
npm test

# 4. View report
npm run test:report
```

---

## 📋 NPM Scripts Reference

| Command | Purpose | Output |
|---------|---------|--------|
| `npm test` | Run all tests (parallel) | 14 tests in ~30s |
| `npm run test:debug` | Step through tests | Debug mode |
| `npm run test:ui` | Interactive dashboard | UI mode |
| `npm run test:headed` | See browser actions | Headed mode |
| `npm run test:chrome` | Chrome only | Filtered by project |
| `npm run test:smoke` | @smoke tests only | Filtered by tag |
| `npm run test:regression` | @regression tests only | Filtered by tag |
| `npm run test:serial` | No parallelization | 1 worker |
| `npm run test:failfast` | Stop on first failure | max-failures=1 |
| `npm run test:report` | Open HTML report | Browser |
| `npm run allure:report` | Generate Allure report | HTML analytics |
| `npm run ci` | CI mode (4 workers, 2 retries) | CI environment |

---

## 📁 File Structure at a Glance

```
src/pages/              ← Page Objects (selectors + interactions)
src/fixtures/           ← Playwright fixtures (dependency injection)
src/helpers/            ← Test data & custom assertions
tests/auth/             ← Login tests (4 tests)
tests/inventory/        ← Product tests (5 tests)
tests/cart/             ← Cart tests (5 tests)
playwright.config.js    ← Configuration (4 workers, 5 projects)
package.json           ← Dependencies & scripts
.env.example           ← Environment template
```

---

## 🧪 Test Structure Template

```javascript
import { test, expect } from '../src/fixtures/testFixtures.js';
import { testData } from '../src/helpers/testData.js';

test.describe('Feature - SauceDemo', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('@smoke | Test description', async ({ loginPage, inventoryPage }) => {
    // Arrange
    const { username, password } = testData.users.standard_user;

    // Act
    await loginPage.login(username, password);

    // Assert
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
  });
});
```

---

## 📍 Page Object Methods

### BasePage (Parent)
- `goto(path)` - Navigate
- `click(selector)` - Click element
- `fillInput(selector, text)` - Fill input
- `getText(selector)` - Get text
- `isVisible(selector)` - Check visibility
- `waitForVisible(selector)` - Wait for element
- `takeScreenshot(filename)` - Screenshot
- `getPageTitle()` - Get title
- `getCurrentURL()` - Get URL

### LoginPage
- `login(username, password)` - Login
- `getErrorMessage()` - Get error text
- `isErrorDisplayed()` - Check error

### InventoryPage
- `addProductToCart(productName)` - Add product
- `getItemCount()` - Count products
- `goToCart()` - Navigate to cart
- `sortBy(option)` - Sort products

### CartPage
- `removeItem(itemName)` - Remove item
- `getAllItemPrices()` - Get prices
- `calculateTotal()` - Sum prices
- `checkout()` - Go to checkout

---

## 🔑 Test Data Reference

```javascript
// Users
testData.users.standard_user    // { username, password }
testData.users.locked_user      // Locked out user
testData.users.problem_user     // User with display issues

// Products
testData.products.backpack
testData.products.bike_light
testData.products.bolt_tshirt

// Prices
testData.prices.backpack        // 29.99
testData.prices.bike_light      // 9.99

// Helper functions
calculateTax(subtotal)          // 10% tax
calculateTotal(subtotal)        // With tax
formatPrice(price)              // "$29.99"
```

---

## 🏷️ Test Tags

| Tag | Purpose | When to Use |
|-----|---------|------------|
| `@smoke` | Quick sanity checks | Build verification |
| `@regression` | Comprehensive tests | Full CI pipeline |
| `@sanity` | Basic functionality | Pre-release checks |

**Run by tag:**
```bash
npm run test:smoke              # @smoke only
npx playwright test --grep "@smoke|@sanity"  # Multiple tags
```

---

## 🐛 Debugging

| Task | Command |
|------|---------|
| Step through | `npm run test:debug` |
| Interactive | `npm run test:ui` |
| See browser | `npm run test:headed` |
| View HTML report | `npm run test:report` |
| View Allure | `npm run allure:open` |
| View trace | `npm run test:trace` |

---

## ⚙️ Configuration Quick Facts

| Setting | Value (Local) | Value (CI) | Why |
|---------|---|---|---|
| fullyParallel | true | true | Speed |
| workers | 1 | 4 | Limit local, parallelize CI |
| retries | 0 | 2 | See failures fast, handle flakes |
| timeout | 60s | 60s | Sufficient for SauceDemo |
| assertion timeout | 10s | 10s | Quick feedback |
| browsers | All | All | Chrome, Firefox, Safari, Mobile |
| screenshots | off | on-failure | Save disk space locally |
| videos | on-failure | on-failure | Debugging |

---

## 🎯 Common Tasks

### Run specific browser
```bash
npm run test:chrome              # Chrome only
npx playwright test --project=firefox
```

### Run specific test file
```bash
npx playwright test tests/auth/login.spec.js
```

### Run specific test
```bash
npx playwright test -g "Successful login with valid credentials"
```

### Run with options
```bash
npx playwright test --headed     # See browser
npx playwright test --workers=1  # Serial
npx playwright test --headed --workers=1  # Combined
```

### Update Playwright
```bash
npm install @playwright/test@latest
npx playwright install           # Install browsers
```

---

## 📊 Report Locations

| Report | Location | Command |
|--------|----------|---------|
| HTML | `playwright-report/` | `npm run test:report` |
| Allure Data | `allure-results/` | Generated after test |
| Allure HTML | `allure-report/` | `npm run allure:report` |
| JUnit XML | `test-results/junit.xml` | On CI |
| Screenshots | `screenshots/` | On failure |
| Videos | `test-results/` | On failure |
| Traces | `test-results/` | On first retry |

---

## 🔐 Environment Variables

```bash
# Required
BASE_URL=https://www.saucedemo.com

# Optional (defaults provided)
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce

# CI Detection (auto-set by CI platforms)
CI=true
```

Copy `.env.example` to `.env` and edit as needed.

---

## ✅ Best Practices Checklist

- [ ] Always use page objects (never hardcode selectors in tests)
- [ ] Centralize test data in `testData.js`
- [ ] Use @smoke, @regression tags on tests
- [ ] Add descriptive test names (what is being tested, not how)
- [ ] Use page.waitForVisible() explicitly, not hardcoded delays
- [ ] Let Playwright take screenshots on failure (automatic)
- [ ] Run locally with 1 worker before committing
- [ ] Check that tests pass on all 5 browser projects
- [ ] Review HTML report for visual inspection
- [ ] Use `npm run test:ui` for interactive debugging

---

## 🚨 When Tests Fail

1. **Check HTML Report** → `npm run test:report`
   - See screenshot of failure
   - Review timeline

2. **Run with Debug** → `npm run test:debug`
   - Step through test line by line
   - Inspect page state

3. **Run Headed** → `npm run test:headed`
   - Watch browser actions in real-time
   - See exact click/input locations

4. **Check Trace** → Zip file in test-results/
   - Replay exact test steps
   - Inspect DOM at each step

5. **Fix & Verify**
   - Update selector in page object if needed
   - Re-run test
   - Verify on all browsers

---

## 📞 Getting Help

- **Playwright Docs**: https://playwright.dev
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Allure Docs**: https://docs.qameta.io/allure/
- **SauceDemo App**: https://www.saucedemo.com

---

## ✨ Key Takeaways

1. **Tests** are clean business logic (Arrange → Act → Assert)
2. **Page Objects** handle all selectors and DOM interactions
3. **Fixtures** provide page objects (dependency injection)
4. **Helpers** provide reusable utilities (test data, assertions)
5. **Configuration** adapts to environment (local vs. CI)
6. **Reports** serve different audiences (developers, managers, CI/CD)
7. **Parallel Execution** makes feedback loop fast (30 seconds)
8. **Multi-Browser** catches cross-browser issues early (5 projects)

---

**Last Updated:** 2026-06-18  
**Framework Version:** 1.0.0  
**Status:** Production Ready ✅
