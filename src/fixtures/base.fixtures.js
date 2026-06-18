/**
 * Base Fixtures - Extended Playwright test fixtures
 * 
 * Provides:
 * - Page objects (loginPage, inventoryPage, cartPage, checkoutPage)
 * - Authenticated context (authenticatedPage)
 * - Browser context with stored authentication state
 * 
 * Usage:
 * test('authenticated test', async ({ authenticatedPage, inventoryPage }) => {
 *   // User is already logged in via storageState
 *   await inventoryPage.navigate('/inventory.html');
 * });
 */

import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import CartPage from '../pages/CartPage.js';

/**
 * CheckoutPage - Page Object for checkout flow
 * (Added here as a new fixture-provided page)
 */
class CheckoutPage {
  constructor(page) {
    this.page = page;
  }

  get firstNameInput() {
    return 'input[data-test="firstName"]';
  }

  get lastNameInput() {
    return 'input[data-test="lastName"]';
  }

  get postalCodeInput() {
    return 'input[data-test="postalCode"]';
  }

  get continueButton() {
    return 'input[data-test="continue"]';
  }

  get finishButton() {
    return 'button[data-test="finish"]';
  }

  get successMessage() {
    return '.complete-header';
  }

  async fillCheckoutInfo(firstName, lastName, postalCode) {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
  }

  // Alias expected by some tests: keep backward compatibility
  async fillShippingInfo(firstNameOrObj, lastName, postalCode) {
    // Accept either (firstName, lastName, postalCode) or a single object { firstName, lastName, zip }
    if (firstNameOrObj && typeof firstNameOrObj === 'object') {
      const { firstName, lastName: ln, zip, postalCode: pc } = firstNameOrObj;
      const zipOrPostal = zip || pc;
      return this.fillCheckoutInfo(firstName, ln, zipOrPostal);
    }
    return this.fillCheckoutInfo(firstNameOrObj, lastName, postalCode);
  }

  async continueCheckout() {
    await this.page.click(this.continueButton);
  }

  // New API expected by tests: continue to order summary
  async continueToSummary() {
    return this.continueCheckout();
  }

  async finishCheckout() {
    await this.page.click(this.finishButton);
  }

  // New API expected by tests: complete the order
  async completeOrder() {
    return this.finishCheckout();
  }

  async isSuccessDisplayed() {
    return this.page.isVisible(this.successMessage);
  }

  // New API expected by tests: get confirmation message text
  async getConfirmationMessage() {
    const txt = await this.page.textContent(this.successMessage);
    if (!txt) return txt;
    return txt.trim().toUpperCase();
  }

  // New API expected by tests: read order total from summary page
  async getOrderTotal() {
    // Sauce demo uses .summary_total_label for total text like "Total: $xx.xx"
    return this.page.textContent('.summary_total_label');
  }
}

/**
 * Extended test fixture with page objects and authentication
 * 
 * Provides both:
 * - Unauthenticated page objects (require manual login)
 * - Authenticated page objects (with stored session state)
 */
export const test = baseTest.extend({
  /**
   * Login Page Object
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Inventory Page Object
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Cart Page Object
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Checkout Page Object
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  /**
   * Authenticated Page - Pre-authenticated context using stored state
   * 
   * This fixture:
   * - Uses storageState from global setup
   * - User is already logged in (session persisted)
   * - No manual login required in test
   * 
   * Note: Already injected by playwright.config.js in most test files
   */
  authenticatedPage: async ({ page }, use) => {
    // By the time this fixture runs, storageState has already been applied
    // by the browser context (via playwright.config.js)
    // This fixture is mainly for clarity and documentation
    await use(page);
  },

  /**
   * Page Objects with Authenticated Context
   * Useful when you need both page objects AND pre-authenticated state
   */
  authenticatedInventory: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  authenticatedCart: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  authenticatedCheckout: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

/**
 * Re-export expect for convenience
 */
export { expect };
