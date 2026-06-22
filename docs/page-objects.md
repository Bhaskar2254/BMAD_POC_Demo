# Page Objects - SauceDemo POM Documentation

## 📖 Page Object Model Overview

The Page Object Model (POM) encapsulates all selectors and page-specific interactions into dedicated classes. Each page class extends `BasePage` and provides methods for interacting with that page.

---

## 🏛️ BasePage - Base Class

**Location:** `src/pages/BasePage.js`

**Purpose:** Provides common methods and utilities used by all page objects.

### Common Methods

#### Navigation
```javascript
async goto(path)
// Navigate to specified path
// Example: await page.goto('/inventory.html')

async getCurrentUrl()
// Get current page URL
// Returns: string
```

#### Element Interaction
```javascript
async click(selector)
// Click element
// Example: await page.click('button[data-test="logout"]')

async fillInput(selector, value)
// Fill input field
// Example: await page.fillInput('input[name="email"]', 'user@example.com')

async getText(selector)
// Get element text content
// Returns: string

async getAttribute(selector, attr)
// Get element attribute value
// Returns: string
```

#### Waiting & Visibility
```javascript
async waitFor(selector, timeout = 5000)
// Wait for element to be visible
// Example: await page.waitFor('text=Loading complete')

async isVisible(selector)
// Check if element is visible
// Returns: boolean

async isPresent(selector)
// Check if element exists in DOM
// Returns: boolean
```

#### Advanced
```javascript
async selectDropdown(selector, value)
// Select option from dropdown
// Example: await page.selectDropdown('select', 'Option 1')

async getCount(selector)
// Count matching elements
// Returns: number
```

---

## 🔐 LoginPage - Authentication

**Location:** `src/pages/LoginPage.js`

**Purpose:** Handles login page interactions

### Selectors
```javascript
this.usernameInput = 'input[data-test="username"]'
this.passwordInput = 'input[data-test="password"]'
this.loginButton = 'button[name="login-button"]'
this.errorMessage = '[data-test="error"]'
this.logoImage = '.login_logo'
```

### Methods

#### login(username, password)
```javascript
async login(username, password)

// Fills username and password, clicks login button
// Parameters:
//   username (string) - Username to enter
//   password (string) - Password to enter
// Returns: Promise<void>

// Example:
await loginPage.login('standard_user', 'secret_sauce');
```

#### getErrorMessage()
```javascript
async getErrorMessage()

// Retrieves login error message
// Returns: Promise<string> - Error message text
// Throws: Error if no error message visible

// Example:
const error = await loginPage.getErrorMessage();
expect(error).toContain('Username and password');
```

#### isLogoVisible()
```javascript
async isLogoVisible()

// Checks if login logo is visible
// Returns: Promise<boolean>

// Example:
expect(await loginPage.isLogoVisible()).toBe(true);
```

### Common Test Scenarios

```javascript
// Valid login
test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory/);
});

// Invalid credentials
test('shows error with invalid password', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'wrong_pass');
  
  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Username and password');
});

// Locked out user
test('shows error for locked user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('locked_out_user', 'secret_sauce');
  
  const error = await loginPage.getErrorMessage();
  expect(error).toContain('locked');
});
```

---

## 🛍️ InventoryPage - Product Listing

**Location:** `src/pages/InventoryPage.js`

**Purpose:** Handles product inventory page interactions

### Selectors
```javascript
this.productList = '[data-test="inventory-list"]'
this.productItem = '[data-test="inventory-item"]'
this.productName = '[data-test="inventory-item-name"]'
this.productPrice = '[data-test="inventory-item-price"]'
this.addToCartButton = '[data-test="add-to-cart"]'
this.cartBadge = '[data-test="shopping-cart-badge"]'
this.sortDropdown = '[data-test="product-sort-container"]'
```

### Methods

#### getProducts()
```javascript
async getProducts()

// Gets all visible products
// Returns: Promise<Array> - Product objects
// Structure: [{ name, price, description }, ...]

// Example:
const products = await inventoryPage.getProducts();
expect(products.length).toBeGreaterThan(0);
```

#### addToCart(productName)
```javascript
async addToCart(productName)

// Adds product to cart by name
// Parameters:
//   productName (string) - Name of product to add
// Returns: Promise<void>
// Throws: Error if product not found

// Example:
await inventoryPage.addToCart('Sauce Labs Backpack');
```

#### removeFromCart(productName)
```javascript
async removeFromCart(productName)

// Removes product from cart by name
// Parameters:
//   productName (string) - Name of product to remove
// Returns: Promise<void>

// Example:
await inventoryPage.removeFromCart('Sauce Labs Backpack');
```

#### sortProducts(sortOption)
```javascript
async sortProducts(sortOption)

// Sorts products by option
// Parameters:
//   sortOption (string) - 'name-asc', 'name-desc', 'price-asc', 'price-desc'
// Returns: Promise<void>

// Example:
await inventoryPage.sortProducts('price-asc');
```

#### getCartBadgeCount()
```javascript
async getCartBadgeCount()

// Gets cart item count from badge
// Returns: Promise<number> - Number of items in cart
// Returns: 0 if badge not visible

// Example:
const count = await inventoryPage.getCartBadgeCount();
expect(count).toBe(2);
```

#### navigateToCart()
```javascript
async navigateToCart()

// Clicks cart icon to navigate to cart
// Returns: Promise<void>

// Example:
await inventoryPage.navigateToCart();
```

### Common Test Scenarios

```javascript
// Browse products
test('can view all products', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  const products = await inventoryPage.getProducts();
  
  expect(products.length).toBe(6); // SauceDemo has 6 products
  expect(products[0]).toHaveProperty('name');
  expect(products[0]).toHaveProperty('price');
});

// Add to cart
test('can add product to cart', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  
  await inventoryPage.addToCart('Sauce Labs Backpack');
  
  const count = await inventoryPage.getCartBadgeCount();
  expect(count).toBe(1);
});

// Sort products
test('can sort by price', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  
  await inventoryPage.sortProducts('price-asc');
  const products = await inventoryPage.getProducts();
  
  const prices = products.map(p => parseFloat(p.price.replace('$', '')));
  expect(prices[0]).toBeLessThan(prices[1]);
});
```

---

## 🛒 CartPage - Shopping Cart

**Location:** `src/pages/CartPage.js`

**Purpose:** Handles shopping cart page interactions

### Selectors
```javascript
this.cartContainer = '[data-test="cart-contents"]'
this.cartItem = '[data-test="cart-item"]'
this.cartItemName = '[data-test="inventory-item-name"]'
this.cartItemPrice = '[data-test="inventory-item-price"]'
this.cartItemQuantity = '[data-test="item-quantity"]'
this.removeButton = '[data-test="remove-button"]'
this.cartTotal = '[data-test="cart-total"]'
this.checkoutButton = '[data-test="checkout"]'
this.continueShoppingButton = '[data-test="continue-shopping"]'
```

### Methods

#### getCartItems()
```javascript
async getCartItems()

// Gets all items in cart
// Returns: Promise<Array> - Cart item objects
// Structure: [{ name, price, quantity }, ...]

// Example:
const items = await cartPage.getCartItems();
expect(items.length).toBeGreaterThan(0);
```

#### getCartTotal()
```javascript
async getCartTotal()

// Gets cart subtotal
// Returns: Promise<number> - Total price

// Example:
const total = await cartPage.getCartTotal();
expect(total).toBeGreaterThan(0);
```

#### removeItem(itemName)
```javascript
async removeItem(itemName)

// Removes item from cart
// Parameters:
//   itemName (string) - Name of item to remove
// Returns: Promise<void>

// Example:
await cartPage.removeItem('Sauce Labs Backpack');
```

#### continueCheckout()
```javascript
async continueCheckout()

// Clicks checkout button to proceed to checkout
// Returns: Promise<void>

// Example:
await cartPage.continueCheckout();
```

#### continueShopping()
```javascript
async continueShopping()

// Returns to inventory page
// Returns: Promise<void>

// Example:
await cartPage.continueShopping();
```

### Common Test Scenarios

```javascript
// View cart
test('displays cart items', async ({ page }) => {
  const cartPage = new CartPage(page);
  
  const items = await cartPage.getCartItems();
  expect(items.length).toBe(1);
  expect(items[0].name).toBe('Sauce Labs Backpack');
});

// Calculate total
test('calculates cart total', async ({ page }) => {
  const cartPage = new CartPage(page);
  
  const total = await cartPage.getCartTotal();
  expect(total).toBeGreaterThan(0);
});

// Remove item
test('can remove item from cart', async ({ page }) => {
  const cartPage = new CartPage(page);
  
  await cartPage.removeItem('Sauce Labs Backpack');
  
  const items = await cartPage.getCartItems();
  expect(items.length).toBe(0);
});
```

---

## 💳 CheckoutPage - Purchase Checkout

**Location:** `src/pages/CheckoutPage.js`

**Purpose:** Handles checkout process interactions

### Selectors
```javascript
this.firstNameInput = 'input[data-test="firstName"]'
this.lastNameInput = 'input[data-test="lastName"]'
this.postalCodeInput = 'input[data-test="postalCode"]'
this.continueButton = 'input[data-test="continue"]'
this.finishButton = 'button[data-test="finish"]'
this.cancelButton = 'button[data-test="cancel"]'
this.orderComplete = '[data-test="complete-header"]'
this.confirmationMessage = '[data-test="complete-text"]'
this.backButton = 'button[name="back-to-products"]'
```

### Methods

#### fillCheckoutInfo(firstName, lastName, postalCode)
```javascript
async fillCheckoutInfo(firstName, lastName, postalCode)

// Fills checkout information form
// Parameters:
//   firstName (string) - First name
//   lastName (string) - Last name  
//   postalCode (string) - Postal/ZIP code
// Returns: Promise<void>

// Example:
await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
```

#### continueCheckout()
```javascript
async continueCheckout()

// Clicks continue button to proceed to order review
// Returns: Promise<void>

// Example:
await checkoutPage.continueCheckout();
```

#### finishOrder()
```javascript
async finishOrder()

// Clicks finish button to complete purchase
// Returns: Promise<void>

// Example:
await checkoutPage.finishOrder();
```

#### getOrderConfirmation()
```javascript
async getOrderConfirmation()

// Gets order completion message
// Returns: Promise<string> - Confirmation message

// Example:
const message = await checkoutPage.getOrderConfirmation();
expect(message).toContain('Thank you');
```

#### backToProducts()
```javascript
async backToProducts()

// Navigates back to products page
// Returns: Promise<void>

// Example:
await checkoutPage.backToProducts();
```

### Common Test Scenarios

```javascript
// Complete checkout
test('user can complete checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
  await checkoutPage.continueCheckout();
  await checkoutPage.finishOrder();
  
  const message = await checkoutPage.getOrderConfirmation();
  expect(message).toContain('Thank you');
});

// Validate checkout page
test('shows checkout form', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  // Form should be visible
  expect(await checkoutPage.isVisible('[data-test="firstName"]')).toBe(true);
});
```

---

## 🔗 Page Object Relationships

```
BasePage (Abstract)
  ├── LoginPage
  │   └── Used in: auth tests, all tests (for login)
  ├── InventoryPage
  │   └── Used in: inventory tests, e2e tests
  ├── CartPage
  │   └── Used in: cart tests, e2e tests
  └── CheckoutPage
      └── Used in: checkout tests, e2e tests
```

---

## 📝 Creating New Page Objects

### Template

```javascript
import { BasePage } from './BasePage';

export class NewPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Define selectors
    this.element1 = 'selector1';
    this.element2 = 'selector2';
  }
  
  // Define methods
  async doSomething() {
    await this.click(this.element1);
    // More actions
  }
  
  async verify() {
    return await this.getText(this.element2);
  }
}
```

### Best Practices

1. **One selector per line** - Easy to update
2. **Descriptive names** - Clear purpose
3. **Small methods** - Single responsibility
4. **Use BasePage methods** - Don't repeat code
5. **Logical grouping** - Related methods together

---

## 🧪 Using Page Objects in Tests

### Import & Initialize
```javascript
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';

test('test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  // Use page objects
});
```

### Via Fixtures (Recommended)
```javascript
import { testFixtures } from '../src/fixtures/testFixtures';

test.extend(testFixtures)('test', async ({ loginPage, inventoryPage }) => {
  // Page objects provided automatically
  await loginPage.login('user', 'pass');
});
```

---

## 🐛 Debugging Page Objects

### Check Selectors
```javascript
// In test or debug mode
const element = page.locator('selector');
await element.click(); // Will fail if selector wrong
```

### Print Element Text
```javascript
const text = await page.textContent('selector');
console.log('Element text:', text);
```

### Wait & Retry
```javascript
// Page object method with retry
async getElement() {
  await this.page.waitForSelector('selector', { timeout: 5000 });
  return await this.page.$('selector');
}
```

---

**Last Updated**: 2026-06-22  
**Page Object Model**: Standard Implementation  
**Framework**: Playwright 1.61.0+
