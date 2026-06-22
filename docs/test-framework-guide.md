# Test Framework Guide - Patterns & Best Practices

## 📖 Introduction

This guide covers the testing patterns, best practices, and frameworks used in this Playwright automation suite.

---

## 🏗️ Test Structure & Organization

### Basic Test Template

```javascript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.describe('Feature Area', () => {
  test('@smoke @regression Test description', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Assert
    expect(page).toHaveURL(/inventory/);
  });
});
```

### Test Anatomy

1. **Imports** - Page objects, fixtures, utilities
2. **Describe Block** - Groups related tests
3. **Test Function** - Individual test case
4. **Tags/Markers** - @smoke, @regression for filtering
5. **Setup (Arrange)** - Initialize test data
6. **Actions (Act)** - Perform test steps
7. **Assertions (Assert)** - Verify results

---

## 🎯 Test Patterns

### Page Object Model (POM)

**Benefits:**
- Maintainability - Selectors in one place
- Reusability - Actions shared across tests
- Readability - Clear test intent
- Scalability - Easy to extend

**Structure:**
```javascript
// Page class
class LoginPage {
  constructor(page) {
    this.page = page;
    // Selectors
    this.usernameInput = 'input[data-test="username"]';
    this.passwordInput = 'input[data-test="password"]';
    this.loginButton = 'button[name="login-button"]';
  }
  
  // Methods
  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}
```

### Fixture Pattern

**Fixtures:** Pre-configured test dependencies injected per test

```javascript
// Define fixture
test.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    // Cleanup if needed
  }
});

// Use fixture
test('test with fixture', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
});
```

### Async/Await Pattern

**Playwright uses modern async/await:**
```javascript
test('async test', async ({ page }) => {
  await page.goto('https://example.com');  // Wait for navigation
  await page.click('button');              // Wait for action
  const text = await page.textContent('h1'); // Get text
  expect(text).toContain('Expected');
});
```

---

## 🏆 Best Practices

### 1. Selectors

**Good - Specific, stable selectors:**
```javascript
// ✅ Data attributes (most stable)
button[data-test="login"]

// ✅ Semantic selectors
'input[type="email"]'

// ✅ ARIA attributes
'[aria-label="Close"]'
```

**Avoid - Fragile selectors:**
```javascript
// ❌ DOM hierarchy (changes with redesign)
'div > div > div > button'

// ❌ Text content (breaks with translations)
'button:has-text("Sign In")'

// ❌ Indices (fragile)
'button:nth-child(3)'
```

### 2. Assertions

**Good - Specific assertions:**
```javascript
// ✅ Direct element assertion
expect(locator).toBeVisible();
expect(locator).toHaveText('Expected');
expect(locator).toHaveAttribute('href', '/path');

// ✅ Explicit success state
await expect(page).toHaveURL(/inventory/);
```

**Avoid - Generic checks:**
```javascript
// ❌ Just checking if page loads
expect(page).toBeDefined();

// ❌ Generic element existence
expect(await page.$('button')).toBeTruthy();
```

### 3. Waits & Synchronization

**Good - Automatic waits:**
```javascript
// ✅ Playwright waits automatically
await page.click('button');           // Waits for button
await page.fill('input', 'text');     // Waits for input
await page.textContent('selector');   // Waits for element
```

**Avoid - Explicit sleeps:**
```javascript
// ❌ Brittle - may wait too long or too short
await page.waitForTimeout(1000);
```

**When manual wait is needed:**
```javascript
// ⚠️ Use expectation-based waits
await expect(page.locator('text=Loaded')).toBeVisible({ timeout: 5000 });
```

### 4. Test Data

**Good - Centralized data:**
```javascript
// src/helpers/testData.js
export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  }
};

// In tests
import { users } from '../src/helpers/testData';
await loginPage.login(users.standard.username, users.standard.password);
```

**Avoid - Hardcoded data:**
```javascript
// ❌ Hardcoded values scattered
await loginPage.login('standard_user', 'secret_sauce');
```

### 5. Error Handling

**Good - Meaningful errors:**
```javascript
test('login with valid credentials', async ({ loginPage }) => {
  await loginPage.login('standard_user', 'secret_sauce');
  
  // Clear assertion message
  await expect(page).toHaveURL('/inventory.html', {
    timeout: 5000
  });
});
```

**Avoid - Vague errors:**
```javascript
// ❌ Unclear what failed
expect(await page.url()).toBe('/inventory.html');
```

---

## 📋 Test Organization

### By Feature (Recommended)

```
tests/
├── auth/
│   └── login.spec.js           # Login functionality
├── inventory/
│   └── products.spec.js        # Product browsing
├── cart/
│   └── checkout.spec.js        # Cart & checkout
├── authenticated.spec.js       # Authenticated scenarios
├── e2e-flow.spec.js            # End-to-end flows
└── example.spec.js             # Examples
```

### Test File Naming
- `feature.spec.js` - Test file
- `Feature` class in page objects
- `feature` folder in `/tests`

---

## 🏷️ Test Tags & Categorization

### Tag Usage

```javascript
test('@smoke @regression Login success', async () => {
  // Test code
});

test('@sanity Only @sanity tests', async () => {
  // Test code
});
```

### Running Tagged Tests

```bash
npm run test:smoke             # Run @smoke tests
npm run test:regression        # Run @regression tests
npm run test:sanity            # Run @sanity tests
```

### Tag Meaning

| Tag | Purpose | Frequency |
|-----|---------|-----------|
| **@smoke** | Quick validation | Daily |
| **@regression** | Full test suite | Before release |
| **@sanity** | Basic functionality | Every PR |
| **@wip** | Work in progress | Development |
| **@skip** | Skip test | Temporarily disabled |

---

## 🔄 Test Lifecycle

### Before Each Test

**Setup via Fixtures:**
```javascript
test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
  // Initialize page objects
});
```

### After Each Test

**Cleanup:**
```javascript
test.afterEach(async ({ page }) => {
  // Close any dialogs
  // Logout if needed
  // Clear state
});
```

### Global Setup

**Once before all tests (`global-setup.js`):**
```javascript
async function globalSetup() {
  // Start services
  // Setup database
  // Configure environment
}
```

### Global Teardown

**Once after all tests (`global-teardown.js`):**
```javascript
async function globalTeardown() {
  // Stop services
  // Cleanup resources
  // Archive logs
}
```

---

## 🧪 Common Test Scenarios

### Login Workflow

```javascript
test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  // Navigate to login
  await page.goto('https://www.saucedemo.com');
  
  // Login
  await loginPage.login('standard_user', 'secret_sauce');
  
  // Verify logged in
  await expect(page).toHaveURL(/inventory/);
  await expect(inventoryPage.productList).toBeVisible();
});
```

### Shopping Workflow

```javascript
test('user can add product to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  
  // Login
  await loginPage.login('standard_user', 'secret_sauce');
  
  // Add to cart
  await inventoryPage.addToCart('Sauce Labs Backpack');
  
  // Verify cart updated
  const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  await expect(cartBadge).toHaveText('1');
  
  // Go to cart
  await cartPage.navigateToCart();
  await expect(cartPage.cartItems).toHaveCount(1);
});
```

### Error Handling

```javascript
test('user sees error with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.login('invalid_user', 'wrong_password');
  
  // Verify error message
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain('Username and password do not match');
});
```

---

## 🐛 Debugging Tests

### Debug Mode

```bash
npm run test:debug

# Or for specific test
npx playwright test tests/auth/login.spec.js --debug
```

**In Debug Mode:**
- Step through test line by line
- Inspect elements
- Execute JavaScript in console
- Check network requests

### Console Logging

```javascript
test('test with logging', async ({ page }) => {
  console.log('Starting test');
  await page.goto(url);
  console.log('Page loaded:', page.url());
  
  const title = await page.title();
  console.log('Page title:', title);
});
```

### Visual Debugging

```bash
npm run test:headed         # See browser
npm run test:ui             # Interactive UI mode
npm run test:report         # View failures with screenshots
```

### Trace Viewer

```bash
npm run test:trace
# Detailed execution trace with DOM snapshots
```

---

## ⚡ Performance Tips

### Parallel Execution
- Default: 4 workers
- Edit `playwright.config.js` to change
- Tests run in parallel automatically

### Efficient Selectors
```javascript
// ✅ Fast - Direct selector
page.locator('button[data-test="login"]')

// ⚠️ Slower - Complex selector
page.locator('div.container >> button >> text=Login')
```

### Minimize Navigation
```javascript
// ✅ Better - Reuse page
test('multiple actions', async ({ page }) => {
  await page.goto(url);
  // Multiple actions on same page
});

// ❌ Slower - Navigate repeatedly
test.beforeEach(async ({ page }) => {
  await page.goto(url); // Each test reloads
});
```

---

## 🔒 Secure Test Practices

### Credentials

**Good - Environment variables:**
```javascript
const username = process.env.TEST_USER;
const password = process.env.TEST_PASSWORD;
```

**Never hardcode sensitive data:**
```javascript
// ❌ DON'T do this
const password = 'actual_password';
```

### Sensitive Data

```javascript
test('sensitive operation', async ({ page }) => {
  // Don't log sensitive values
  const password = getPassword(); // Secret
  
  // Use masking if logging
  console.log('Password:', '****');
  
  // Don't capture in screenshots
  // Set sensitive fields to not-visible for reporting
});
```

---

## 📊 Test Metrics

### Good Test Metrics
- **Pass Rate**: 95%+ consistently
- **Duration**: 2-5 seconds per test
- **Flakiness**: <1% rerun needed
- **Coverage**: Key user flows

### Bad Signs
- **Flaky Tests**: Fail intermittently
- **Long Tests**: >30 seconds indicates complex test
- **Hardcoded Waits**: `await page.waitForTimeout()`
- **Many Assertions**: Test does too much

---

## 🚀 Continuous Improvement

### Code Review Checklist

- [ ] Follows POM pattern
- [ ] No hardcoded test data
- [ ] Appropriate tags (@smoke, etc.)
- [ ] Clear test description
- [ ] No unnecessary waits
- [ ] Proper error assertions
- [ ] Handles cleanup

### Refactoring Old Tests

```javascript
// ❌ Before - Procedural
test('login', async ({ page }) => {
  await page.goto('https://saucedemo.com');
  await page.fill('input[name="user-name"]', 'user');
  await page.fill('input[name="password"]', 'pass');
  await page.click('button[name="login-button"]');
  // More assertions...
});

// ✅ After - Using POM
test('login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});
```

---

## 📚 Additional Resources

### Playwright Documentation
- [Playwright Test](https://playwright.dev/docs/intro)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Debugging](https://playwright.dev/docs/debug)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Testing Principles
- **AAA Pattern** - Arrange, Act, Assert
- **Single Responsibility** - One assertion per test
- **Clear Naming** - Test name describes what is tested
- **DRY Principle** - Don't repeat yourself (POM pattern)

---

**Last Updated**: 2026-06-22  
**Test Framework**: Playwright 1.61.0+
