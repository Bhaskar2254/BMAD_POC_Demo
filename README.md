# SauceDemo Playwright Test Framework

Enterprise-grade test automation framework for [SauceDemo](https://www.saucedemo.com) using Playwright with Page Object Model pattern.

## 🏗️ Architecture Overview

```
saucedemo-playwright-tests/
├── src/
│   ├── pages/
│   │   ├── BasePage.js          # Base class with common actions
│   │   ├── LoginPage.js         # Login page object
│   │   ├── InventoryPage.js     # Products/inventory page object
│   │   └── CartPage.js          # Shopping cart page object
│   ├── fixtures/
│   │   └── testFixtures.js      # Playwright test.extend() fixtures
│   └── helpers/
│       ├── testData.js          # Test data generators & constants
│       └── assertions.js        # Custom assertion & wait helpers
├── tests/
│   ├── auth/
│   │   └── login.spec.js        # Login test cases
│   ├── inventory/
│   │   └── products.spec.js     # Inventory test cases
│   ├── cart/
│   │   └── checkout.spec.js     # Cart & checkout test cases
│   ├── global-setup.js          # Setup hook
│   └── global-teardown.js       # Teardown hook
├── playwright.config.js         # Test configuration
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment template
└── README.md                    # This file
```

## ✨ Key Features

### Page Object Model (POM)
- **BasePage**: Abstract base class with reusable methods (click, fillInput, getText, waitFor, etc.)
- **Page-specific objects**: LoginPage, InventoryPage, CartPage encapsulate selectors and actions
- **Maintainability**: Selector changes in one place, automatically reflected in all tests

### Fixtures & Setup
- **testFixtures.js**: Extended Playwright fixtures providing page objects
- **global-setup.js / global-teardown.js**: Run once before/after all tests
- Clean test file setup with dependency injection

### Test Data & Helpers
- **testData.js**: Centralized user credentials, products, and constants
- **assertions.js**: Custom assertion and wait helpers for cleaner tests
- **Environment-driven**: Configuration via `.env` file

### Enterprise Reporting
- **Allure**: Detailed analytics and test metrics
- **HTML**: Beautiful visual reports with screenshots/videos
- **JUnit**: CI/CD integration (GitHub Actions, Jenkins, etc.)

### Multi-Browser Testing
- **Chrome, Firefox, Safari**: Desktop browsers
- **Pixel 5, iPhone 12**: Mobile devices
- **Parallel execution**: 4 workers on CI for faster test runs
- **Smart retries**: 2 retries on CI for flaky test handling

### CI/CD Ready
- Environment variable configuration
- Artifact collection (screenshots, traces, videos)
- Fail-fast and max-failures options
- JUnit output for CI integration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Chrome, Firefox, Safari browsers (Playwright will install them on first run)

### Installation

```bash
# Clone or navigate to the project
cd saucedemo-playwright-tests

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Running Tests

```bash
# Run all tests in parallel
npm test

# Run tests in specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:mobile

# Run with headed browser (see what's happening)
npm run test:headed

# Run with UI mode (interactive dashboard)
npm run test:ui

# Run debug mode (step through tests)
npm run test:debug

# Run specific tags
npm run test:smoke      # @smoke tests only
npm run test:regression # @regression tests only
npm run test:sanity     # @sanity tests only

# Run serially (no parallelization)
npm run test:serial

# Stop on first failure
npm run test:failfast

# CI environment
npm run ci              # Runs with CI=true, 4 workers, 2 retries
npm run ci:report       # CI run + generate Allure report
```

---

## 📊 Reports

### HTML Report
Generated after every test run to `playwright-report/`

```bash
npm run test:report  # Opens in browser
```

### Allure Report
Enterprise-grade analytics and metrics

```bash
npm run allure:report   # Generate report
npm run allure:open     # Open in browser
npm run allure:clean    # Clear previous results
```

### JUnit Report
For CI/CD integration: `test-results/junit.xml`

---

## ✍️ Writing Tests

### Test Structure

```javascript
import { test, expect } from '../src/fixtures/testFixtures.js';
import { testData } from '../src/helpers/testData.js';

test.describe('Feature - SauceDemo', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Setup runs before each test
    await loginPage.goto();
  });

  test('@smoke @sanity | Descriptive test name', async ({ 
    loginPage, 
    inventoryPage, 
    cartPage 
  }) => {
    // Arrange
    const { username, password } = testData.users.standard_user;

    // Act
    await loginPage.login(username, password);
    await inventoryPage.addProductToCart(testData.products.backpack);

    // Assert
    expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
  });
});
```

### Using Page Objects

```javascript
// Page objects provide clean, readable interactions
await loginPage.login('user', 'pass');           // vs. manual selectors
await inventoryPage.addProductToCart(productName);
await cartPage.removeItem(itemName);
const total = await cartPage.calculateTotal();
```

### Test Tags

Use `@tag` prefix in test name for filtering:
- `@smoke` - Quick smoke tests
- `@sanity` - Sanity/basic functionality
- `@regression` - Full regression suite

Run specific tags:
```bash
npm run test:smoke        # Only @smoke tests
npx playwright test --grep "@smoke|@sanity"  # Multiple tags
```

### Custom Assertions

```javascript
import { assertions, waits } from '../src/helpers/assertions.js';

// Cleaner assertions
await assertions.elementTextMatches(page, '.title', 'Expected Text');
await assertions.elementCount(page, '.item', 5);
await waits.allElementsVisible(page, ['.header', '.footer', '.nav']);
```

---

## 🔧 Configuration

### Environment Variables (`.env`)

```bash
BASE_URL=https://www.saucedemo.com          # Application URL
TEST_USERNAME=standard_user                  # Test user
TEST_PASSWORD=secret_sauce                   # Test password
CI=true                                      # CI environment flag
START_SERVER=false                           # Start local server
ALLURE_RESULTS_DIR=allure-results            # Report output
```

### playwright.config.js

**Key settings:**
- `fullyParallel: true` - All tests run in parallel
- `workers: 4` on CI, `1` locally
- `retries: 2` on CI only
- `timeout: 60s` per test
- `expect.timeout: 10s` for assertions
- `trace: 'on-first-retry'` - Trace failed tests

**Projects:**
- Chrome, Firefox, Safari (desktop)
- Pixel 5, iPhone 12 (mobile)

**Reporters:**
- HTML (default viewer)
- Allure (analytics)
- JUnit (CI/CD)

---

## 📚 Page Object Reference

### BasePage Methods

```javascript
// Navigation
await page.goto(path)

// Interactions
await page.click(selector)
await page.fillInput(selector, text)
await page.getText(selector)
await page.isVisible(selector)

// Waits
await page.waitForVisible(selector)
await page.waitForHidden(selector)

// Utilities
await page.takeScreenshot(filename)
await page.getPageTitle()
await page.getCurrentURL()
```

### LoginPage
- `login(username, password)` - Perform login
- `getErrorMessage()` - Get error text
- `isErrorDisplayed()` - Check error visibility
- `isPageLoaded()` - Verify page loaded

### InventoryPage
- `addProductToCart(productName)` - Add product by name
- `getItemCount()` - Get total products
- `getAllProductNames()` - Get all product names
- `getCartBadgeCount()` - Get cart item count
- `goToCart()` - Navigate to cart
- `sortBy(option)` - Sort products

### CartPage
- `getCartItemCount()` - Count items
- `getAllItemNames()` - Get item names
- `getAllItemPrices()` - Get item prices
- `removeItem(itemName)` - Remove by name
- `calculateTotal()` - Sum all prices
- `checkout()` - Go to checkout
- `continueShopping()` - Return to inventory

---

## 🔍 Debugging

### Debug Mode
```bash
npm run test:debug
```
- Step through tests line by line
- Inspect page state
- Modify selectors on the fly

### Headed Mode
```bash
npm run test:headed
```
- See browser actions in real-time
- Observe test execution visually

### UI Mode
```bash
npm run test:ui
```
- Interactive test exploration
- Run/debug individual tests
- Timeline and logs

### Traces & Videos
Automatically captured for failed tests in CI:
- Traces: `test-results/` (.zip files)
- Videos: Embedded in HTML report
- Screenshots: In HTML report

View traces:
```bash
npm run test:trace
```

---

## 🚦 CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm run ci

- name: Generate Allure report
  if: always()
  run: npm run allure:report
```

### Environment Detection
Tests automatically detect CI:
- `process.env.CI` → enables 4 workers, 2 retries, artifact collection
- JUnit output for CI/CD dashboards
- Screenshots & videos for failed tests

---

## 📝 Best Practices

✅ **DO:**
- Use Page Objects for all selectors
- Centralize test data in `testData.js`
- Add descriptive test names with tags
- Use `beforeEach`/`afterEach` for setup/cleanup
- Await all async operations
- Use `expect()` from Playwright

❌ **DON'T:**
- Hardcode selectors in tests
- Use `page.goto()` directly (use page objects)
- Mix concerns (UI + API in same test)
- Leave debugging code in tests
- Ignore flaky test warnings

---

## 🐛 Troubleshooting

### Tests timing out
- Increase `timeout` in `playwright.config.js`
- Check if element selectors are correct
- Verify application is responding

### Flaky tests
- Add explicit waits: `await page.waitForVisible(selector)`
- Use `waitUntil: 'networkidle'` in navigation
- Avoid hardcoded timeouts; use built-in waits

### Browser crashes
- Run `npx playwright install`
- Check disk space
- Try single-threaded: `npm run test:serial`

### Selector issues
- Use `--debug` mode to inspect DOM
- Verify selectors in browser DevTools
- Check data-test attributes (SauceDemo specific)

---

## 📖 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Allure Documentation](https://docs.qameta.io/allure/)
- [SauceDemo App](https://www.saucedemo.com)

---

## 📋 License

ISC

## 👥 Contributors

QA Team

---

**Last Updated:** 2026-06-18
**Framework Version:** 1.0.0
