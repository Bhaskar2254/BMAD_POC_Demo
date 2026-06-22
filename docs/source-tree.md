# Source Tree - Project Structure & File Organization

## 📁 Complete Project Structure

```
FirstDemoProject/
├── docs/                                    # 📚 Documentation (Auto-generated)
│   ├── index.md                            # Documentation index
│   ├── project-overview.md                 # Project summary
│   ├── technology-stack.md                 # Dependencies & tech
│   ├── source-tree.md                      # This file
│   ├── test-framework-guide.md             # Testing patterns
│   ├── page-objects.md                     # POM documentation
│   └── test-data-fixtures.md               # Data & fixtures
│
├── src/                                     # 🔧 Source Code
│   ├── pages/                              # Page Object Model
│   │   ├── BasePage.js                     # Base page class
│   │   ├── LoginPage.js                    # Login page object
│   │   ├── InventoryPage.js                # Products inventory page
│   │   ├── CartPage.js                     # Shopping cart page
│   │   ├── CheckoutPage.js                 # Checkout page
│   │   └── base.page.js                    # Alternative base class
│   ├── fixtures/                           # Playwright Fixtures
│   │   ├── testFixtures.js                 # Extended fixtures
│   │   └── base.fixtures.js                # Base fixtures setup
│   └── helpers/                            # Helper Utilities
│       ├── testData.js                     # Test data constants
│       └── assertions.js                   # Custom assertions
│
├── tests/                                   # 🧪 Test Files
│   ├── auth/                               # Authentication tests
│   │   └── login.spec.js                   # Login test scenarios
│   ├── inventory/                          # Inventory/Product tests
│   │   └── products.spec.js                # Product browsing tests
│   ├── cart/                               # Cart & Checkout tests
│   │   └── checkout.spec.js                # Cart/checkout flow tests
│   ├── authenticated.spec.js               # Authenticated state tests
│   ├── e2e-flow.spec.js                    # End-to-end workflows
│   ├── example.spec.js                     # Example test templates
│   ├── global-setup.js                     # Test suite setup hook
│   └── global-teardown.js                  # Test suite teardown hook
│
├── test-results/                           # 📊 Test Artifacts (Generated)
│   ├── screenshots/                        # Failure screenshots
│   ├── videos/                             # Test recordings
│   ├── traces/                             # Playwright traces
│   └── report.html                         # HTML report
│
├── playwright-report/                      # 📈 Playwright Reports
│   └── index.html                          # HTML test report
│
├── allure-results/                         # 📉 Allure Report Data
│   └── [test results JSON files]
│
├── allure-report/                          # 📋 Allure Report (Generated)
│   └── index.html                          # Allure report
│
├── Configuration Files                     # ⚙️ Project Configuration
│   ├── playwright.config.js                # Playwright test config
│   ├── package.json                        # Dependencies & scripts
│   ├── package-lock.json                   # Locked dependency versions
│   ├── .env.example                        # Environment template
│   ├── .eslintrc                           # ESLint configuration
│   └── .prettierrc                         # Prettier configuration
│
├── IDE & Version Control                   # 🔧 Development Files
│   ├── FirstDemoProject.iml                # IntelliJ IDEA project
│   ├── .git/                               # Git repository
│   ├── .gitignore                          # Git ignore rules
│   └── node_modules/                       # Dependencies (not committed)
│
└── Documentation Files (Root)              # 📖 Root Level Docs
    ├── README.md                           # Main project README
    ├── QUICK_REFERENCE.md                  # Quick command reference
    ├── FRAMEWORK_STRUCTURE.md              # Framework structure docs
    ├── FRAMEWORK_SETUP_SUMMARY.md          # Setup instructions
    ├── AUTHENTICATION_TESTING.md           # Auth testing guide
    ├── ENHANCEMENT_SUMMARY.md              # Project enhancements
    ├── ARCHITECTURAL_DECISIONS.md          # Architecture decisions
    └── MIGRATION_GUIDE.md                  # Migration guide
```

---

## 📚 Directory Details

### 🔧 `/src` - Source Code

#### `/src/pages` - Page Object Model

**BasePage.js** (Base Class)
- Common page actions used by all page objects
- Methods: `goto()`, `click()`, `fillInput()`, `getText()`, `waitFor()`, etc.
- Purpose: DRY principle - avoid repeating code across page objects

```
Uses: Playwright Page API
Inherits: None (base class)
Used by: LoginPage, InventoryPage, CartPage, CheckoutPage
```

**LoginPage.js**
- Selectors: Username field, password field, login button
- Methods: `login(username, password)`, `getErrorMessage()`
- Test coverage: Valid/invalid credentials, locked accounts

**InventoryPage.js**
- Selectors: Product list, product names, add-to-cart buttons
- Methods: `getProducts()`, `addToCart()`, `sortProducts()`, `filterProducts()`
- Test coverage: Product browsing, filtering, sorting

**CartPage.js**
- Selectors: Cart items, quantities, price, checkout button
- Methods: `getCartItems()`, `removeItem()`, `continueCheckout()`
- Test coverage: Cart operations, item management

**CheckoutPage.js**
- Selectors: Checkout form, payment info, confirmation
- Methods: `fillCheckout()`, `submitOrder()`, `getConfirmation()`
- Test coverage: Checkout flow, order confirmation

**base.page.js** (Alternative)
- Legacy base class (see BasePage.js for current version)

---

#### `/src/fixtures` - Test Fixtures

**testFixtures.js**
- Extends Playwright Test fixtures
- Provides page object instances to tests
- Handles setup/teardown per test
- Injection method: Used in test files via `test.extend()`

```javascript
test.extend({
  loginPage: async ({ page }, use) => { /* ... */ }
})
```

**base.fixtures.js** (Legacy)
- Alternative fixture implementation
- See testFixtures.js for current version

---

#### `/src/helpers` - Utilities & Data

**testData.js**
- Centralized test data constants
- User credentials for different SauceDemo user types
- Product constants and expected values
- Data generators for dynamic test data

Content includes:
- User credentials (standard_user, locked_out_user, etc.)
- Password (secret_sauce - SauceDemo standard)
- Product names and prices
- Expected values for assertions

**assertions.js**
- Custom assertion methods
- Enhanced expectations beyond Playwright defaults
- Wait helpers for common scenarios
- Re-usable assertion patterns

Examples:
- `assertProductVisible(name)`
- `assertPriceEquals(expected)`
- `waitForCartUpdate()`

---

### 🧪 `/tests` - Test Files

#### Naming Convention
- Test files: `*.spec.js`
- Test functions: `test('description', async ({ page }) => { ... })`
- Describe blocks: `test.describe('feature group', () => { ... })`

#### Test Tags/Markers
- `@smoke` - Quick smoke tests
- `@regression` - Full regression suite
- `@sanity` - Basic sanity checks
- Custom tags for filtering

#### `/tests/auth` - Authentication Tests

**login.spec.js**
- Valid login scenarios
- Invalid credential handling
- Locked account testing
- Session management
- Logout functionality

#### `/tests/inventory` - Product Tests

**products.spec.js**
- Product listing verification
- Product selection
- Sorting and filtering
- Price verification
- Inventory accuracy

#### `/tests/cart` - Cart & Checkout Tests

**checkout.spec.js**
- Add to cart functionality
- Remove from cart
- Cart total calculation
- Checkout initiation
- Order confirmation

#### Root Level Tests

**authenticated.spec.js**
- Tests requiring authenticated user state
- Pre-login setup
- Protected page access

**e2e-flow.spec.js**
- Complete user journeys
- Multi-step scenarios
- Full workflow testing
- Integration scenarios

**example.spec.js**
- Template/example tests
- Demonstrates testing patterns
- Reference for new test creation

#### Setup & Teardown

**global-setup.js**
- Runs once before all tests
- Environment initialization
- Resource setup
- Pre-test configuration

**global-teardown.js**
- Runs once after all tests
- Resource cleanup
- Report generation
- Post-test configuration

---

### 📊 `/test-results` - Generated Test Artifacts

Auto-generated when tests run (not in git):

```
test-results/
├── [test-name]/
│   ├── test-finished-1.png          # Screenshots
│   ├── video.webm                   # Video recording
│   └── trace.zip                    # Trace file
└── report.html                       # HTML report
```

---

### 📈 `/playwright-report` - Playwright Reports

Auto-generated by Playwright:

```
playwright-report/
├── index.html                       # Main report page
├── data/
│   └── [test data JSON files]
└── assets/
    └── [CSS, JS, images]
```

**Access:** `npm run test:report`

---

### 📉 `/allure-results` & `/allure-report` - Allure Reports

Auto-generated by Allure:

```
allure-results/
├── [UUID1]-result.json              # Test result data
├── [UUID2]-result.json
└── [UUID3]-result.json

allure-report/
├── index.html                       # Main Allure report
├── data/
│   └── [test data files]
└── widgets/
    └── [trend data]
```

**Access:** `npm run allure:open`

---

### ⚙️ Configuration Files

**playwright.config.js**
- Test runner configuration
- Browser launch options
- Timeout settings
- Report generation setup
- Retry policy
- CI/CD specific settings
- Global setup/teardown paths

**package.json**
- Project metadata (name, version, author)
- Dependencies list with versions
- Dev dependencies list
- npm scripts for various tasks
- Node.js and npm requirements
- Project configuration

**package-lock.json**
- Locked dependency versions
- Ensures reproducible installs
- Git tracked for team consistency

**.env.example**
- Template for environment variables
- Configuration options
- No actual credentials
- Copy to `.env` for local setup

**.eslintrc**
- Linting rules
- Code quality standards
- Parser configuration
- Extends common configs

**.prettierrc**
- Code formatting rules
- Indentation settings
- Quote style
- Line length

---

## 📊 File Statistics

### Code Files
| Type | Count | Total Lines |
|------|-------|-------------|
| Page Objects | 5 | ~800 |
| Test Files | 8 | ~1,500 |
| Fixtures | 2 | ~200 |
| Helpers | 2 | ~300 |
| **Total** | **17** | **~2,800** |

### Configuration Files
| File | Size | Purpose |
|------|------|---------|
| playwright.config.js | ~1 KB | Test configuration |
| package.json | ~3 KB | Dependencies |
| package-lock.json | ~200 KB | Locked versions |
| .env.example | ~0.5 KB | Env template |

### Dependencies
- **Direct**: 5 packages (@playwright/test, eslint, prettier, allure-*, dotenv)
- **Transitive**: ~200 packages (via node_modules)
- **Total Size**: ~500 MB (including browsers)

---

## 🔄 File Relationships

### Page Object Dependencies
```
LoginPage
  ├── extends BasePage
  └── used in: tests/auth/login.spec.js

InventoryPage
  ├── extends BasePage
  └── used in: tests/inventory/products.spec.js, e2e-flow.spec.js

CartPage
  ├── extends BasePage
  └── used in: tests/cart/checkout.spec.js, e2e-flow.spec.js

CheckoutPage
  ├── extends BasePage
  └── used in: tests/cart/checkout.spec.js, e2e-flow.spec.js
```

### Test Data Flow
```
testData.js (constants & generators)
  ├── imported in: testFixtures.js
  ├── imported in: all test files
  └── used for: credentials, product info, expected values
```

### Fixture Injection
```
testFixtures.js (provides page objects)
  ├── provides: loginPage fixture
  ├── provides: inventoryPage fixture
  ├── provides: cartPage fixture
  ├── provides: checkoutPage fixture
  └── used in: all test files
```

---

## 🚀 Key File Paths for Common Tasks

### Running Tests
- **Config**: `playwright.config.js`
- **Entry**: `tests/` (all test files)
- **Output**: `test-results/`, `playwright-report/`

### Adding New Tests
- **Template**: `tests/example.spec.js`
- **Data**: `src/helpers/testData.js`
- **Pages**: `src/pages/` (existing page objects)
- **Fixtures**: `src/fixtures/testFixtures.js`

### Debugging
- **Selectors**: `src/pages/*.js` (update selectors here)
- **Data**: `src/helpers/testData.js` (verify test data)
- **Logs**: Look in browser dev tools during debug mode

### CI/CD Integration
- **Config**: `playwright.config.js` (CI section)
- **Scripts**: `package.json` (npm scripts)
- **Artifacts**: `.github/workflows/` (if using GitHub Actions)

---

## 📝 .gitignore Patterns

Files NOT in version control:

```
node_modules/                   # Dependencies
test-results/                   # Test artifacts
playwright-report/              # Test reports
allure-results/                 # Allure data
allure-report/                  # Allure reports
.env                           # Local configuration
.DS_Store                      # macOS files
*.log                          # Log files
dist/                          # Build output (if any)
build/                         # Build output (if any)
coverage/                      # Coverage reports (if any)
```

---

## 🔗 File Import Relationships

```
Tests (*.spec.js)
  ├── imports: testFixtures.js → page objects
  ├── imports: testData.js → test constants
  └── imports: assertions.js → custom assertions

Fixtures (testFixtures.js)
  ├── imports: Page objects (pages/*.js)
  ├── imports: testData.js
  └── provides: Dependency-injected page objects

Page Objects (pages/*.js)
  ├── extends: BasePage
  ├── imports: Playwright
  └── provides: Selectors and methods

Helpers
  ├── testData.js: Constants and generators
  └── assertions.js: Custom assertion methods
```

---

## 📋 File Modification Frequency

### Frequently Modified
- `tests/**/*.spec.js` - Adding/updating tests
- `src/pages/*.js` - Fixing selectors
- `.env.example` - Configuration changes
- `playwright.config.js` - Test settings

### Occasionally Modified
- `src/helpers/testData.js` - New test data
- `src/helpers/assertions.js` - New assertions
- `src/fixtures/testFixtures.js` - New fixtures
- `package.json` - Dependency updates

### Rarely Modified
- `src/pages/BasePage.js` - Stable base class
- `global-setup.js` - Setup configuration
- `global-teardown.js` - Cleanup configuration

---

**Last Updated**: 2026-06-22  
**Documentation Level**: Quick Scan  
**File Count**: 50+ files total
