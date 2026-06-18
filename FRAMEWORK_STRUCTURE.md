# Playwright Enterprise Framework - Folder Structure

```
saucedemo-playwright-tests/
│
├── src/
│   ├── pages/
│   │   ├── BasePage.js              # ⚙️  Abstract base class with common methods
│   │   │                               # - goto, click, fillInput, getText
│   │   │                               # - isVisible, waitForVisible, waitForHidden
│   │   │                               # - takeScreenshot, reload, close
│   │   │
│   │   ├── LoginPage.js             # 🔐 Login page object
│   │   │                               # - login(username, password)
│   │   │                               # - getErrorMessage()
│   │   │                               # - isErrorDisplayed()
│   │   │
│   │   ├── InventoryPage.js         # 📦 Products/inventory page object
│   │   │                               # - addProductToCart(name)
│   │   │                               # - getItemCount(), getAllProductNames()
│   │   │                               # - sortBy(), goToCart()
│   │   │
│   │   └── CartPage.js              # 🛒 Shopping cart page object
│   │                                   # - removeItem(name), checkout()
│   │                                   # - getAllItemPrices(), calculateTotal()
│   │
│   ├── fixtures/
│   │   └── testFixtures.js          # 🔌 Playwright test.extend() fixtures
│   │                                   # - Provides: loginPage, inventoryPage, cartPage
│   │                                   # - Dependency injection for page objects
│   │
│   └── helpers/
│       ├── testData.js              # 📊 Test data & generators
│       │                               # - User credentials (users object)
│       │                               # - Products catalog (products object)
│       │                               # - Price data (prices object)
│       │                               # - Helpers: generateTestData(), calculateTax(), etc.
│       │
│       └── assertions.js            # ✅ Custom assertion & wait helpers
│                                       # - assertions: pageLoaded, elementsVisible, etc.
│                                       # - waits: textContent, allElementsVisible, etc.
│                                       # - apiHelpers: getAuthToken, setAuthToken, etc.
│
├── tests/
│   ├── auth/
│   │   └── login.spec.js            # 🧪 Login test cases (4 tests)
│   │                                   # @smoke @sanity tags
│   │
│   ├── inventory/
│   │   └── products.spec.js         # 🧪 Inventory/product test cases (5 tests)
│   │                                   # @smoke @regression tags
│   │
│   ├── cart/
│   │   └── checkout.spec.js         # 🧪 Cart & checkout test cases (5 tests)
│   │                                   # @smoke @regression tags
│   │
│   ├── global-setup.js              # 🚀 Pre-test hooks
│   │                                   # - Validate environment variables
│   │                                   # - Create required directories
│   │                                   # - Database seeding (optional)
│   │
│   └── global-teardown.js           # 🧹 Post-test cleanup
│
├── playwright.config.js             # ⚙️  Playwright configuration
│                                       # - fullyParallel: true
│                                       # - workers: 4 on CI, 1 locally
│                                       # - retries: 2 on CI
│                                       # - Projects: Chrome, Firefox, Safari, Mobile
│                                       # - Reporters: HTML, Allure, JUnit
│
├── package.json                     # 📦 Dependencies & npm scripts
│                                       # Scripts: test, test:debug, test:ui, ci, etc.
│
├── .env.example                     # 📝 Environment template
│                                       # - BASE_URL, TEST_USERNAME, TEST_PASSWORD
│
├── .env                             # 🔑 Environment variables (NOT in git)
│
├── README.md                        # 📖 Documentation
│
├── playwright-report/               # 📊 HTML reports (generated)
├── allure-results/                  # 📊 Allure data (generated)
├── allure-report/                   # 📊 Allure HTML report (generated)
├── test-results/                    # 📊 JUnit XML output (generated)
├── screenshots/                     # 📸 Test screenshots (generated)
└── traces/                          # 📹 Playwright traces (generated)

────────────────────────────────────────────────────────────────────

## Layer Architecture

┌─────────────────────────────────────────────────────┐
│                   TEST FILES (tests/)                │
│              ✅ Login, Products, Cart tests         │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                  FIXTURES (src/fixtures/)            │
│    🔌 Dependency injection of page objects          │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│               PAGE OBJECTS (src/pages/)              │
│    📍 Encapsulate selectors & page interactions    │
└────────────────┬────────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼──────────┐  ┌──────▼─────────┐
│   HELPERS      │  │  PLAYWRIGHT    │
│ (src/helpers/)│  │     API        │
│  Test Data    │  │  page.click()  │
│  Assertions   │  │  page.goto()   │
│  Wait Helpers │  │   expect()     │
└───────────────┘  └────────────────┘

────────────────────────────────────────────────────────────────────

## Test Execution Flow

1️⃣  playwright.config.js loaded
    ├─ Environment variables read
    ├─ Workers configured (4 on CI, 1 locally)
    └─ Reporters configured (HTML, Allure, JUnit)

2️⃣  global-setup.js runs ONCE
    ├─ Validates environment
    ├─ Creates directories
    └─ Optional: Seed database

3️⃣  Tests execute in parallel
    ├─ test.beforeEach() runs for each test
    ├─ Fixtures provide page objects
    ├─ Tests interact with application
    └─ Screenshots/traces captured on failure

4️⃣  global-teardown.js runs ONCE
    └─ Cleanup, reporting, notifications

5️⃣  Reports generated
    ├─ HTML Report (playwright-report/)
    ├─ Allure Report (allure-results/ → allure-report/)
    └─ JUnit (test-results/junit.xml)

────────────────────────────────────────────────────────────────────

## Key Files Summary

| File | Purpose |
|------|---------|
| BasePage.js | Abstract base with common methods |
| LoginPage.js | Login selectors & login() action |
| InventoryPage.js | Products page with addToCart() |
| CartPage.js | Cart operations with pricing |
| testFixtures.js | Provides page objects to tests |
| testData.js | Credentials, products, constants |
| assertions.js | Custom assertion helpers |
| login.spec.js | 4 login test cases |
| products.spec.js | 5 inventory test cases |
| checkout.spec.js | 5 cart test cases |
| playwright.config.js | Test configuration |
| .env.example | Environment template |

────────────────────────────────────────────────────────────────────

## Development Workflow

### Writing a New Test

1. Create test file: `tests/feature/feature.spec.js`
2. Import fixtures: `import { test, expect } from '../src/fixtures/testFixtures.js'`
3. Import test data: `import { testData } from '../src/helpers/testData.js'`
4. Write test using page objects

### Adding a New Page

1. Create file: `src/pages/NewPage.js`
2. Extend BasePage: `export class NewPage extends BasePage`
3. Add selectors as getters
4. Add methods for page interactions
5. Add fixture in testFixtures.js

### Adding Test Data

1. Add to `src/helpers/testData.js` in testData object
2. Import in tests: `import { testData } from '../src/helpers/testData.js'`
3. Use: `testData.users.standard_user`

────────────────────────────────────────────────────────────────────

Generated: 2026-06-18
Framework: Playwright Enterprise v1.0.0
```
