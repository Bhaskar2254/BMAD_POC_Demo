/**
 * E2E Flow Test - Complete Purchase Journey
 * 
 * Tests complete end-to-end user journey:
 * Login → Add Products → Verify Cart → Checkout → Complete Purchase → Verify Confirmation
 * 
 * Uses all four page objects: LoginPage, InventoryPage, CartPage, CheckoutPage
 */

import { test, expect } from '../src/fixtures/base.fixtures.js';
import { allure } from 'allure-playwright';
import fs from 'fs';
import path from 'path';

test.describe('@smoke @e2e | Complete Purchase Flow', () => {
  // Test data
  const PRODUCT_ONE = 'Sauce Labs Backpack';
  const PRODUCT_TWO = 'Sauce Labs Bike Light';
  const TEST_USER = 'standard_user';
  const TEST_PASSWORD = 'secret_sauce';
  const SHIPPING_INFO = {
    firstName: 'John',
    lastName: 'Doe',
    zip: '12345',
  };

  test.beforeAll(async () => {
    // Ensure screenshots directory exists
    const screenshotDir = './screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
  });

  test('Complete end-to-end purchase of two items', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // ========== PHASE 1: LOGIN ==========
    await allure.step('Login to application', async () => {
      await loginPage.goto();
      await loginPage.login(TEST_USER, TEST_PASSWORD);
      // Wait for navigation to inventory
      await page.waitForURL('**/inventory.html');
    });

    // ========== PHASE 2: ADD PRODUCTS TO CART ==========
    await allure.step('Add first product to cart', async () => {
      await inventoryPage.goto();
      await inventoryPage.addProductToCart(PRODUCT_ONE);
      
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `screenshots/product-1-added_${timestamp}.png` });
    });

    await allure.step('Add second product to cart', async () => {
      await inventoryPage.addProductToCart(PRODUCT_TWO);
      
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `screenshots/product-2-added_${timestamp}.png` });
    });

    // ========== PHASE 3: VERIFY CART COUNT ==========
    await allure.step('Verify cart item count', async () => {
      const cartBadge = await inventoryPage.page.locator('.shopping_cart_badge').textContent();
      expect(cartBadge).toBe('2');
    });

    // ========== PHASE 4: NAVIGATE TO CART AND VERIFY ITEMS ==========
    await allure.step('Navigate to cart page', async () => {
      await inventoryPage.navigateToCart();
      await page.waitForURL('**/cart.html');
    });

    await allure.step('Verify item names in cart', async () => {
      const itemNames = await cartPage.getItemNames();
      expect(itemNames).toContain(PRODUCT_ONE);
      expect(itemNames).toContain(PRODUCT_TWO);
    });

    await allure.step('Verify cart item count in cart page', async () => {
      const count = await cartPage.getCartItemCount();
      expect(count).toBe(2);
      
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `screenshots/cart-items_${timestamp}.png` });
    });

    // ========== PHASE 5: PROCEED TO CHECKOUT ==========
    await allure.step('Proceed to checkout', async () => {
      await cartPage.proceedToCheckout();
      await page.waitForURL('**/checkout-step-one.html');
    });

    // ========== PHASE 6: FILL SHIPPING INFORMATION ==========
    await allure.step('Fill shipping information', async () => {
      await checkoutPage.fillShippingInfo(SHIPPING_INFO);
      
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `screenshots/checkout-step-1_${timestamp}.png` });
    });

    // ========== PHASE 7: CONTINUE TO ORDER SUMMARY ==========
    await allure.step('Continue to order summary', async () => {
      await checkoutPage.continueToSummary();
      await page.waitForURL('**/checkout-step-two.html');
    });

    // ========== PHASE 8: VERIFY ORDER TOTAL ==========
    await allure.step('Verify order total contains dollar sign', async () => {
      const orderTotal = await checkoutPage.getOrderTotal();
      expect(orderTotal).toContain('$');
      
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `screenshots/order-summary_${timestamp}.png` });
    });

    // ========== PHASE 9: COMPLETE ORDER ==========
    await allure.step('Complete order', async () => {
      await checkoutPage.completeOrder();
      await page.waitForURL('**/checkout-complete.html');
    });

    // ========== PHASE 10: VERIFY CONFIRMATION MESSAGE ==========
    await allure.step('Verify confirmation message', async () => {
      const confirmationMessage = await checkoutPage.getConfirmationMessage();
      expect(confirmationMessage).toContain('THANK YOU FOR YOUR ORDER');
      
      // Take screenshot
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `screenshots/order-complete_${timestamp}.png` });
    });
  });
});
