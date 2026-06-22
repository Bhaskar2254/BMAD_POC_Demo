---
project_name: FirstDemoProject
user_name: Bhaskar
date: 2026-06-22
sections_completed: ['technology_stack', 'project_structure', 'critical_implementation_rules']
framework_type: Playwright Test Automation
language: JavaScript (ES Modules)
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Core Framework
- **Playwright Test**: `^1.61.0` - Test runner and browser automation
- **Node.js**: `>=18.0.0` - Runtime environment
- **npm**: `>=9.0.0` - Package manager
- **Module Type**: ES Modules (`"type": "module"` in package.json)

### Dependencies
- **dotenv**: `^16.6.1` - Environment configuration loading
- **@types/node**: `^25.9.3` - TypeScript type definitions for Node.js

### Dev Dependencies & Tools
- **eslint**: `^8.54.0` - Code linting
- **prettier**: `^3.1.0` - Code formatting
- **allure-commandline**: `^2.42.1` - Allure report generation CLI
- **allure-playwright**: `^2.15.1` - Allure reporting integration

### Browser Support
- **Chrome/Chromium** (Desktop)
- **Firefox** (Desktop)
- **Safari/WebKit** (Desktop)
- **Pixel 5** (Android Mobile)
- **iPhone 12** (iOS Mobile)

### Reporting
- **HTML Report** - Playwright's built-in HTML reporter (`playwright-report/`)
- **Allure Report** - Enterprise test analytics (`allure-report/`)
- **JUnit XML** - CI/CD integration (`test-results/junit.xml`)

---

## Critical Implementation Rules

### 1. **Module System & Import/Export**

#### RULE: Always use ES Module syntax
```javascript
// ✅ CORRECT
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
export class MyPage { }

// ❌ WRONG - Do NOT use CommonJS
const { test } = require('@playwright/test');
module.exports = MyPage;
```

#### RULE: File extensions MUST be included in imports
```javascript
// ✅ CORRECT - Include .js extension
import { LoginPage } from '../pages/LoginPage.js';
import { testData } from '../helpers/testData.js';

// ❌ WRONG - No .js extension
import { LoginPage } from '../pages/LoginPage';
```

### 2. **Page Object Model (POM) Architecture**

#### RULE: All page objects MUST extend BasePage
```javascript
// ✅ CORRECT
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }
  
  async login(username, password) {
    // implementation
  }
}

// ❌ WRONG - Standalone class without BasePage
export class LoginPage {
  constructor(page) {
    this.page = page;
  }
}
```

#### RULE: Selectors defined as class properties in constructor
```javascript
// ✅ CORRECT
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define all selectors here as properties
    this.usernameInput = 'input[data-test="username"]';
    this.passwordInput = 'input[data-test="password"]';
    this.loginButton = 'button[name="login-button"]';
  }
  
  async login(username, password) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}

// ❌ WRONG - Selectors hardcoded in methods
export class LoginPage extends BasePage {
  async login(username, password) {
    await this.fillInput('input[data-test="username"]', username);
  }
}
```

#### RULE: Page object methods use descriptive names matching business actions
```javascript
// ✅ CORRECT - Business action names
async login(username, password) { }
async addProductToCart(productName) { }
async proceedToCheckout() { }

// ❌ WRONG - Generic/technical names
async fillLoginForm(username, password) { }
async clickAddButton(productName) { }
async clickButton() { }
```

### 3. **Test Fixture Patterns**

#### RULE: Use test.extend() for page object fixtures
```javascript
// ✅ CORRECT - Playwright fixture pattern
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

// Then in tests:
test('my test', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
});

// ❌ WRONG - Instantiating page objects in tests
test('my test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  // This couples the test to page object instantiation
});
```

#### RULE: Always import fixtures from testFixtures.js
```javascript
// ✅ CORRECT
import { test, expect } from '../../src/fixtures/testFixtures.js';

test('example', async ({ loginPage, inventoryPage }) => {
  // Page objects provided by fixtures
});

// ❌ WRONG - Using base Playwright test
import { test, expect } from '@playwright/test';
```

### 4. **Test Data Management**

#### RULE: Never hardcode test data - use testData helper
```javascript
// ✅ CORRECT - Import from testData
import { testData } from '../../src/helpers/testData.js';

test('login', async ({ loginPage }) => {
  const { username, password } = testData.users.standard_user;
  await loginPage.login(username, password);
});

// ❌ WRONG - Hardcoded values
test('login', async ({ loginPage }) => {
  await loginPage.login('standard_user', 'secret_sauce');
});
```

#### RULE: testData exports an object with properties, not default export
```javascript
// ✅ CORRECT - Named export as object
export const testData = {
  users: {
    standard_user: { username: 'standard_user', password: 'secret_sauce' },
    locked_user: { username: 'locked_out_user', password: 'secret_sauce' }
  },
  products: {
    backpack: 'Sauce Labs Backpack',
    bikeLight: 'Sauce Labs Bike Light'
  }
};

// Usage:
testData.users.standard_user.username
testData.products.backpack
```

### 5. **Test File Structure (AAA Pattern)**

#### RULE: Follow Arrange-Act-Assert pattern strictly
```javascript
// ✅ CORRECT - Clear AAA sections
test('@smoke | User can login', async ({ loginPage, inventoryPage }) => {
  // ARRANGE
  const { username, password } = testData.users.standard_user;
  
  // ACT
  await loginPage.goto();
  await loginPage.login(username, password);
  
  // ASSERT
  expect(await inventoryPage.isPageLoaded()).toBeTruthy();
  const url = await inventoryPage.getCurrentURL();
  expect(url).toContain('inventory');
});

// ❌ WRONG - Mixed or missing sections
test('User can login', async ({ loginPage }) => {
  await loginPage.goto();
  const { username } = testData.users.standard_user;
  await loginPage.login(username, 'secret_sauce');
  expect(await loginPage.isErrorDisplayed()).toBeFalsy();
  // Arrangement scattered throughout
});
```

### 6. **Test Organization & Naming**

#### RULE: Test files named `*.spec.js` only
```javascript
// ✅ CORRECT filenames
login.spec.js
products.spec.js
checkout.spec.js

// ❌ WRONG
login.test.js
loginTests.js
login.js
```

#### RULE: Tests organized by feature in folders
```
tests/
├── auth/              # Authentication related tests
│   └── login.spec.js
├── inventory/         # Product inventory tests
│   └── products.spec.js
├── cart/              # Cart & checkout tests
│   └── checkout.spec.js
└── authenticated.spec.js  # Cross-feature authenticated tests
```

#### RULE: Test names follow pattern: `@tags | Business Description`
```javascript
// ✅ CORRECT
test('@smoke @sanity | User can login with valid credentials', async ({ loginPage }) => { });
test('@regression | Invalid password shows error message', async ({ loginPage }) => { });
test('@smoke @regression | Product can be added to cart', async ({ inventoryPage }) => { });

// ❌ WRONG
test('Login test', async ({ loginPage }) => { });
test('test 1', async ({ loginPage }) => { });
test('Error message', async ({ loginPage }) => { });
```

### 7. **Assertion Patterns**

#### RULE: Use Playwright expect() assertions, not plain JavaScript
```javascript
// ✅ CORRECT - Playwright assertions
expect(await loginPage.isErrorDisplayed()).toBeTruthy();
expect(await inventoryPage.getItemCount()).toBe(6);
expect(await page).toHaveURL(/inventory/);
expect(locator).toBeVisible();
expect(locator).toHaveText('Expected Text');

// ❌ WRONG - Generic assertions
const isVisible = await loginPage.isErrorDisplayed();
if (!isVisible) throw new Error('Error not visible');

// ❌ WRONG - Assertions in helper methods
// Don't do: function verifyError() { expect(...).toBeTruthy(); }
```

### 8. **Waits & Synchronization**

#### RULE: Rely on Playwright's built-in auto-waiting, avoid explicit waits
```javascript
// ✅ CORRECT - Playwright auto-waits
await loginPage.click(this.loginButton);  // Waits for element first
await loginPage.fillInput(selector, text); // Waits before filling
await page.goto(url, { waitUntil: 'networkidle' });

// ❌ WRONG - Explicit sleep
await page.waitForTimeout(1000);  // Brittle and slow
await new Promise(r => setTimeout(r, 500));

// ⚠️ ONLY use if truly necessary:
await expect(page.locator('text=Loaded')).toBeVisible({ timeout: 5000 });
```

### 9. **Error Handling**

#### RULE: No try-catch in tests - let Playwright errors propagate
```javascript
// ✅ CORRECT - Let assertion errors propagate
test('login fails with invalid password', async ({ loginPage }) => {
  await loginPage.login('user', 'wrong_pass');
  const errorText = await loginPage.getErrorMessage();
  expect(errorText).toContain('Username and password');
});

// ❌ WRONG - Catching errors hides failures
test('login fails', async ({ loginPage }) => {
  try {
    await loginPage.login('user', 'wrong_pass');
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password');
  } catch (e) {
    console.log('Error caught: ' + e); // Hides the failure
  }
});
```

### 10. **Playwright Configuration Rules**

#### RULE: Environment variables MUST be loaded via dotenv
```javascript
// ✅ CORRECT - In playwright.config.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';

// ❌ WRONG - Hardcoded URLs
const BASE_URL = 'https://www.saucedemo.com';
```

#### RULE: CI detection for parallel/retry configuration
```javascript
// ✅ CORRECT - Adapt to CI environment
const IS_CI = !!process.env.CI;
export default defineConfig({
  workers: IS_CI ? 4 : 1,
  retries: IS_CI ? 2 : 0,
  fullyParallel: true,
});

// ❌ WRONG - Same config everywhere
export default defineConfig({
  workers: 4,  // Consumes resources locally
  retries: 2,  // Wastes time on local machine
});
```

### 11. **BasePage Method Usage**

#### RULE: Page objects use BasePage methods, not raw Playwright
```javascript
// ✅ CORRECT - Use inherited methods
await this.click(this.loginButton);
await this.fillInput(this.usernameInput, username);
const text = await this.getText(this.errorMessage);
const isVisible = await this.isVisible(this.errorMessage);

// ❌ WRONG - Raw Playwright API
await this.page.click(selector);
await this.page.fill(selector, text);
```

#### RULE: Access page object instance via `this.page`
```javascript
// ✅ CORRECT
export class LoginPage extends BasePage {
  async goto() {
    await this.page.goto('https://www.saucedemo.com');
  }
  
  async isErrorDisplayed() {
    return await this.page.isVisible(this.errorMessage);
  }
}

// ❌ WRONG - Using passed page directly
export class LoginPage {
  constructor(page) {
    this.page = page;
  }
  
  async goto(page) {  // Redundant parameter
    await page.goto(url);
  }
}
```

### 12. **Comment & Documentation Rules**

#### RULE: JSDoc comments for page object methods
```javascript
// ✅ CORRECT
/**
 * Login to the application
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Promise<void>}
 */
async login(username, password) {
  await this.fillInput(this.usernameInput, username);
  await this.fillInput(this.passwordInput, password);
  await this.click(this.loginButton);
}

// ✅ ALSO OK - Class-level docs
/**
 * LoginPage - Handles login page interactions
 * Selectors and methods for: login form, error messages, etc.
 */
export class LoginPage extends BasePage {
}
```

### 13. **Global Setup/Teardown**

#### RULE: global-setup.js runs once before all tests
```javascript
// global-setup.js
import { chromium } from '@playwright/test';

async function globalSetup() {
  // Setup: Create directories, validate env vars, etc.
  const browser = await chromium.launch();
  // ... perform setup ...
  await browser.close();
}

export default globalSetup;
```

#### RULE: global-teardown.js runs once after all tests
```javascript
// global-teardown.js
async function globalTeardown() {
  // Cleanup: Archive logs, cleanup temp files, etc.
}

export default globalTeardown;
```

### 14. **Code Organization - No "utility" catch-all**

#### RULE: Helpers split by purpose
```
src/helpers/
├── testData.js          # Test data constants and generators
├── assertions.js        # Custom assertion helpers
└── (NO misc.js or utils.js)
```

#### RULE: Keep helpers focused on one concern
```javascript
// ✅ CORRECT - testData.js focused on data
export const testData = {
  users: { },
  products: { },
  generateRandomUser() { }
};

// ❌ WRONG - testData.js doing too much
export const testData = {
  users: { },
  products: { },
  async delay(ms) { },  // Should not be here
  getCurrentDate() { }, // Should not be here
};
```

---

## Project Structure Summary

```
FirstDemoProject/
├── src/
│   ├── pages/              # Page Object Model classes
│   │   ├── BasePage.js     # Abstract base class (DO NOT instantiate)
│   │   ├── LoginPage.js    # Login page object
│   │   ├── InventoryPage.js
│   │   └── CartPage.js
│   ├── fixtures/           # Test fixtures
│   │   └── testFixtures.js # Provides page objects to tests
│   └── helpers/            # Helper utilities
│       ├── testData.js     # Test data (users, products, etc.)
│       └── assertions.js   # Custom assertions
├── tests/
│   ├── auth/               # Authentication tests
│   ├── inventory/          # Product tests
│   ├── cart/               # Cart/checkout tests
│   ├── global-setup.js     # Pre-test setup (runs once)
│   └── global-teardown.js  # Post-test cleanup (runs once)
├── playwright.config.js    # Playwright configuration
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .env                    # Environment variables (NOT in git)
└── docs/                   # Documentation
```

---

## Configuration & Environment

### Environment Variables
```bash
BASE_URL=https://www.saucedemo.com
CI=true                          # Set on CI systems
ALLURE_RESULTS_DIR=allure-results
```

### playwright.config.js Key Settings
- **testDir**: `./tests`
- **testMatch**: `**/*.spec.js` (only files)
- **fullyParallel**: `true` - All tests run concurrently
- **workers**: `4` (CI), `1` (local)
- **retries**: `2` (CI), `0` (local)
- **timeout**: `60000ms` (60 seconds per test)
- **expect.timeout**: `10000ms` (10 seconds for assertions)
- **actionTimeout**: `10000ms` (10 seconds for actions)
- **navigationTimeout**: `30000ms` (30 seconds for navigation)

### Reporters
- **HTML**: `playwright-report/`
- **Allure**: `allure-results/` + `allure-report/`
- **JUnit**: `test-results/junit.xml`
- **List**: Console output

---

## CI/CD Integration

### Parallel Execution
- Local: 1 worker (sequential)
- CI: 4 workers (parallel)
- All tests run fully parallel (`fullyParallel: true`)

### Smart Retries
- Local: 0 retries (fail fast for debugging)
- CI: 2 retries (handle flaky tests)

### Fail Fast
- Local: No max failures (run all tests)
- CI: Max 5 failures then stop

### Browser Matrix
- Chrome
- Firefox
- Safari/WebKit
- Android (Pixel 5)
- iOS (iPhone 12)

---

## Test Tags & Filters

### Tag Usage
```javascript
test('@smoke | Quick validation test', async () => { });
test('@regression | Full test suite test', async () => { });
test('@sanity | Basic functionality test', async () => { });
test('@wip | Work in progress', async () => { });
```

### Running Tagged Tests
```bash
npm run test:smoke      # Only @smoke tests
npm run test:regression # Only @regression tests
npm run test:sanity     # Only @sanity tests
```

---

## Common Mistakes to Avoid

### 🚫 Don't:
1. ❌ Mix CommonJS and ES Modules
2. ❌ Omit `.js` file extensions in imports
3. ❌ Create page objects without extending BasePage
4. ❌ Hardcode test data instead of using testData helper
5. ❌ Use explicit `await page.waitForTimeout()` instead of auto-waiting
6. ❌ Catch errors in tests - let assertions propagate
7. ❌ Hardcode URLs - use `process.env.BASE_URL`
8. ❌ Mix page instantiation with test logic
9. ❌ Use raw Playwright API in page objects - use BasePage methods
10. ❌ Name test files anything other than `*.spec.js`

### ✅ Do:
1. ✅ Use ES Modules with `.js` extensions
2. ✅ Always extend BasePage for page objects
3. ✅ Use testData helper for all constants
4. ✅ Follow AAA (Arrange-Act-Assert) pattern
5. ✅ Name tests with `@tags | Business Description`
6. ✅ Use fixtures for dependency injection
7. ✅ Rely on Playwright's auto-waiting
8. ✅ Keep page objects focused and testable
9. ✅ Keep selectors as class properties
10. ✅ Document with JSDoc comments

---

## Performance & Optimization

### Parallel Execution
- Tests run 4 at a time on CI (set in config)
- Local development runs sequentially (1 worker)
- Total test run: ~15-30 seconds (CI), ~60+ seconds (local)

### Retry Strategy
- Flaky tests retried 2x on CI only
- Local runs don't retry (better for debugging)
- Failed screenshots/videos saved automatically

### Resource Management
- Browsers managed by Playwright (auto-reuse)
- Page context cleanup automatic
- No manual browser close needed

---

## Debugging & Troubleshooting

### Debug Mode
```bash
npm run test:debug     # Step through tests
npm run test:ui        # Visual test runner
npm run test:headed    # See browser during test
```

### Artifacts Generated
- **Screenshots**: `test-results/` on failure
- **Videos**: `test-results/` on failure
- **Traces**: `.playwright/traces/` for detailed debugging
- **Reports**: `playwright-report/` and `allure-report/`

### Enable Verbose Logging
```javascript
// In playwright.config.js
use: {
  trace: 'on',           // Full trace every test
  screenshot: 'on',      // Every page state
  video: 'on'            // Full video
}
```

---

**Project Context Last Updated:** 2026-06-22  
**Framework:** Playwright 1.61.0+  
**Node.js Requirement:** >= 18.0.0  
**Module Type:** ES Modules
