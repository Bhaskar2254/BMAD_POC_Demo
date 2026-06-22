# Test Data & Fixtures - Data Management & Setup

## 📋 Test Data Management

### testData.js - Centralized Data

**Location:** `src/helpers/testData.js`

**Purpose:** Single source of truth for all test data - credentials, products, constants, and data generators.

---

## 👥 User Credentials

SauceDemo provides predefined test users with specific behaviors:

### Standard User

```javascript
const standardUser = {
  username: 'standard_user',
  password: 'secret_sauce',
  behavior: 'Normal user - all features work'
};

// Usage:
const { username, password } = testData.users.standard;
await loginPage.login(username, password);
```

### Locked Out User

```javascript
const lockedOutUser = {
  username: 'locked_out_user',
  password: 'secret_sauce',
  behavior: 'Cannot login - shows error'
};

// Usage:
const { username, password } = testData.users.lockedOut;
await loginPage.login(username, password);
// Expect error message
```

### Problem User

```javascript
const problemUser = {
  username: 'problem_user',
  password: 'secret_sauce',
  behavior: 'Images load incorrectly'
};

// Usage:
// For testing image handling/fallbacks
```

### Performance Glitch User

```javascript
const perfUser = {
  username: 'performance_glitch_user',
  password: 'secret_sauce',
  behavior: 'Slow page loads - tests responses to delays'
};

// Usage:
// For testing timeout handling
```

### Error User

```javascript
const errorUser = {
  username: 'error_user',
  password: 'secret_sauce',
  behavior: 'Returns 500 errors on server calls'
};

// Usage:
// For testing error handling
```

### Visual User

```javascript
const visualUser = {
  username: 'visual_user',
  password: 'secret_sauce',
  behavior: 'Different visual styling'
};

// Usage:
// For visual regression testing
```

---

## 🛍️ Product Data

### Product List

```javascript
const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTshirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  testShirt: 'Test.allTheThings() T-Shirt (Red)'
};

// Usage:
await inventoryPage.addToCart(testData.products.backpack);
```

### Product Prices

```javascript
const prices = {
  backpack: '$29.99',
  bikeLight: '$9.99',
  boltTshirt: '$15.99',
  fleeceJacket: '$49.99',
  onesie: '$7.99',
  testShirt: '$15.99'
};

// Usage:
const itemPrice = testData.prices.backpack;
expect(cartPrice).toContain(itemPrice);
```

### Product IDs

```javascript
const productIds = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
  boltTshirt: 'sauce-labs-bolt-t-shirt',
  fleeceJacket: 'sauce-labs-fleece-jacket',
  onesie: 'sauce-labs-onesie',
  testShirt: 'test.allthethings()-t-shirt-(red)'
};

// Usage:
// For data-test attributes
```

---

## 📍 Location Data

### Checkout Information

```javascript
const checkoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345'
};

// Usage:
await checkoutPage.fillCheckoutInfo(
  testData.checkoutInfo.firstName,
  testData.checkoutInfo.lastName,
  testData.checkoutInfo.postalCode
);
```

### Different Location Scenarios

```javascript
const locations = {
  domestic: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345'
  },
  international: {
    firstName: 'Jean',
    lastName: 'Dupont',
    postalCode: '75001'
  },
  specialChars: {
    firstName: "O'Brien",
    lastName: "D'Arcy",
    postalCode: 'SW1A 1AA' // UK format
  }
};

// Usage:
await checkoutPage.fillCheckoutInfo(
  testData.locations.domestic.firstName,
  testData.locations.domestic.lastName,
  testData.locations.domestic.postalCode
);
```

---

## 🔢 Constants & Settings

### URLs

```javascript
const urls = {
  base: 'https://www.saucedemo.com',
  login: 'https://www.saucedemo.com/',
  inventory: 'https://www.saucedemo.com/inventory.html',
  cart: 'https://www.saucedemo.com/cart.html',
  checkout: 'https://www.saucedemo.com/checkout-step-one.html'
};

// Usage:
await page.goto(testData.urls.inventory);
```

### Error Messages

```javascript
const errorMessages = {
  invalidCredentials: 'Username and password do not match any user in this service',
  lockedOut: 'Sorry, this user has been locked out.',
  requiredField: 'Error: required'
};

// Usage:
const error = await loginPage.getErrorMessage();
expect(error).toContain(testData.errorMessages.invalidCredentials);
```

### Success Messages

```javascript
const successMessages = {
  orderComplete: 'Thank you for your order!',
  itemAddedToCart: 'Product added to shopping cart.',
  logoutSuccess: 'Logged out'
};

// Usage:
const confirmation = await checkoutPage.getOrderConfirmation();
expect(confirmation).toContain(testData.successMessages.orderComplete);
```

### Timeouts

```javascript
const timeouts = {
  elementVisible: 5000,      // 5 seconds
  pageLoad: 10000,           // 10 seconds
  apiCall: 30000,            // 30 seconds
  default: 30000             // 30 seconds (Playwright default)
};

// Usage:
await expect(element).toBeVisible({ timeout: testData.timeouts.elementVisible });
```

---

## 🔧 Data Generators

### Random User Generator

```javascript
function generateRandomUser() {
  return {
    username: `user_${Date.now()}`,
    password: 'secret_sauce',
    email: `test_${Date.now()}@example.com`
  };
}

// Usage:
const randomUser = testData.generateRandomUser();
```

### Random Product Generator

```javascript
function generateRandomProduct() {
  const products = Object.values(testData.products);
  return products[Math.floor(Math.random() * products.length)];
}

// Usage:
const randomProduct = testData.generateRandomProduct();
await inventoryPage.addToCart(randomProduct);
```

### Random Address Generator

```javascript
function generateRandomAddress() {
  return {
    firstName: `First_${Date.now()}`,
    lastName: `Last_${Date.now()}`,
    postalCode: String(Math.floor(Math.random() * 100000))
  };
}

// Usage:
const randomAddress = testData.generateRandomAddress();
await checkoutPage.fillCheckoutInfo(
  randomAddress.firstName,
  randomAddress.lastName,
  randomAddress.postalCode
);
```

---

## 📚 Fixtures - Test Setup

### testFixtures.js - Playwright Fixtures

**Location:** `src/fixtures/testFixtures.js`

**Purpose:** Extends Playwright test fixtures to provide page objects automatically.

### Available Fixtures

#### loginPage Fixture

```javascript
test.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    // Cleanup if needed
  }
})('test', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
  // loginPage automatically provided
});
```

#### inventoryPage Fixture

```javascript
test.extend({
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  }
})('test', async ({ inventoryPage }) => {
  const products = await inventoryPage.getProducts();
  // inventoryPage automatically provided
});
```

#### cartPage Fixture

```javascript
test.extend({
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  }
})('test', async ({ cartPage }) => {
  const items = await cartPage.getCartItems();
  // cartPage automatically provided
});
```

#### checkoutPage Fixture

```javascript
test.extend({
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  }
})('test', async ({ checkoutPage }) => {
  await checkoutPage.fillCheckoutInfo(...);
  // checkoutPage automatically provided
});
```

### Using Fixtures in Tests

```javascript
import { test } from '@playwright/test';
import { testFixtures } from '../src/fixtures/testFixtures';

// Extend test with custom fixtures
const extendedTest = test.extend(testFixtures);

extendedTest('login flow', async ({ loginPage, inventoryPage }) => {
  // All page objects automatically injected
  await loginPage.login('standard_user', 'secret_sauce');
  const products = await inventoryPage.getProducts();
  expect(products.length).toBeGreaterThan(0);
});
```

---

## 🛠️ Custom Fixtures - Creating New Ones

### Pattern for New Fixture

```javascript
// Define fixture
test.extend({
  myFixture: async ({ page }, use) => {
    // Setup phase
    const fixture = new MyClass(page);
    await fixture.initialize();
    
    // Use in test
    await use(fixture);
    
    // Cleanup phase
    await fixture.cleanup();
  }
});

// Use in test
test('my test', async ({ myFixture }) => {
  // myFixture available here
});
```

### Fixture Dependencies

```javascript
test.extend({
  // dependsOn depends on loginPage
  authenticatedPage: async ({ page, loginPage }, use) => {
    // loginPage already set up
    await loginPage.login('standard_user', 'secret_sauce');
    
    // Now create dependent fixture
    const authPage = new AuthenticatedPage(page);
    await use(authPage);
  }
});
```

---

## 📊 Test Data Organization

### By Feature

```
testData/
├── auth/
│   ├── users.js           # User credentials
│   └── messages.js        # Auth messages
├── inventory/
│   ├── products.js        # Product data
│   └── filters.js         # Filter options
└── checkout/
    ├── locations.js       # Address data
    └── messages.js        # Checkout messages
```

### By Type

```
testData/
├── constants/
│   ├── urls.js            # Application URLs
│   ├── timeouts.js        # Timeout values
│   └── messages.js        # All messages
├── credentials/
│   └── users.js           # User data
└── generators/
    ├── randomUser.js      # User generator
    └── randomProduct.js   # Product generator
```

---

## ✅ Best Practices

### 1. No Hardcoded Data

**Good:**
```javascript
// Use constants
await loginPage.login(testData.users.standard.username, testData.users.standard.password);
```

**Avoid:**
```javascript
// Hardcoded values
await loginPage.login('standard_user', 'secret_sauce');
```

### 2. Single Source of Truth

**Good:**
```javascript
// All product data in one place
const productName = testData.products.backpack;
const productPrice = testData.prices.backpack;
```

**Avoid:**
```javascript
// Scattered data
const productName = 'Sauce Labs Backpack';
const productPrice = '$29.99';
```

### 3. Descriptive Names

**Good:**
```javascript
const standardUserWithFullAccess = testData.users.standard;
```

**Avoid:**
```javascript
const user1 = testData.users[0];
```

### 4. Use Generators for Dynamic Data

**Good:**
```javascript
const randomUser = testData.generateRandomUser();
const randomProduct = testData.generateRandomProduct();
```

**Avoid:**
```javascript
// Static data repeated in tests
const timestamp = Date.now();
const user = `user_${timestamp}`;
```

---

## 🔐 Sensitive Data Handling

### Credentials

```javascript
// ✅ Use environment variables
const password = process.env.TEST_PASSWORD;

// ✅ Or from secure config
const credentials = testData.users.standard;

// ❌ Never hardcode
// const password = 'actual_password';
```

### Sensitive Test Data

```javascript
// Don't log sensitive data
test('sensitive', async ({ page }) => {
  const password = getPassword(); // Secret
  
  // Don't include in logs
  console.log('Password:', '[REDACTED]');
  
  // Use only where needed
  await page.fill('input[type="password"]', password);
});
```

---

## 🔄 Fixture Lifecycle

### Setup Phase
```javascript
async ({ page }, use) => {
  // ✅ Setup happens here
  const fixture = new MyClass(page);
  await fixture.initialize();
  
  // Fixture ready
  await use(fixture);
  
  // Cleanup happens here
  await fixture.cleanup();
}
```

### Test Execution
```javascript
test('my test', async ({ fixture }) => {
  // ✅ Fixture fully initialized and ready
  // ✅ Can use fixture
  await fixture.doSomething();
})
```

### Cleanup Phase
```javascript
// ✅ Automatic cleanup after test
// Even if test fails
```

---

## 📝 Common Test Data Patterns

### Setup with Test Data

```javascript
test('complete flow with test data', async ({ loginPage, inventoryPage, cartPage }) => {
  // Use predefined data
  const user = testData.users.standard;
  const product = testData.products.backpack;
  
  // Execute with data
  await loginPage.login(user.username, user.password);
  await inventoryPage.addToCart(product);
  
  // Verify results
  const items = await cartPage.getCartItems();
  expect(items[0].name).toBe(product);
});
```

### Parameterized Tests

```javascript
// Test multiple users
const testUsers = [
  testData.users.standard,
  testData.users.problemUser
];

for (const user of testUsers) {
  test(`login as ${user.username}`, async ({ loginPage }) => {
    await loginPage.login(user.username, user.password);
    // assertions...
  });
}
```

### Data-Driven Tests

```javascript
// Test multiple products
test.describe('product tests', () => {
  for (const [key, product] of Object.entries(testData.products)) {
    test(`add ${key} to cart`, async ({ inventoryPage }) => {
      await inventoryPage.addToCart(product);
      // assertions...
    });
  }
});
```

---

## 📚 Additional Resources

### Data Management Best Practices
- Keep data organized by feature/domain
- Use generators for dynamic data
- Avoid hardcoding values
- Document data semantics

### Fixture Best Practices
- One responsibility per fixture
- Use dependency injection
- Proper cleanup on exit
- Handle errors gracefully

---

**Last Updated**: 2026-06-22  
**Test Framework**: Playwright 1.61.0+
