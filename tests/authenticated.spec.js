/**
 * Authenticated Tests - Using Pre-Authenticated Context
 * 
 * These tests use storageState saved during global-setup.js
 * No manual login required - user is already authenticated
 * 
 * Benefits:
 * - Faster test execution (skip login each time)
 * - More reliable (login happens once in setup)
 * - Focus on testing features, not authentication
 */

import { test, expect } from '../src/fixtures/base.fixtures.js';
import { testData } from '../src/helpers/testData.js';

test.describe('Authenticated - Direct Feature Testing', () => {
  test('@smoke | Navigate to inventory when already authenticated', async ({
    inventoryPage,
    page,
  }) => {
    // Arrange - User is already logged in via storageState
    // No manual login needed!

    // Act
    await inventoryPage.goto();

    // Assert
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
    const url = await page.url();
    expect(url).toContain('inventory');
  });

  test('@regression | Add products from authenticated state', async ({
    inventoryPage,
    cartPage,
  }) => {
    // Arrange - Already authenticated
    await inventoryPage.goto();

    // Act
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.addProductToCart(testData.products.bike_light);

    // Assert
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toContain('2');

    // Verify in cart
    await inventoryPage.goToCart();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test('@regression | Complete checkout flow', async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // Arrange - Already authenticated
    await inventoryPage.goto();
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.goToCart();

    // Act - Proceed to checkout
    await cartPage.checkout();

    // Fill checkout info
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continueCheckout();

    // Complete purchase
    await checkoutPage.finishCheckout();

    // Assert
    expect(await checkoutPage.isSuccessDisplayed()).toBeTruthy();
  });

  test('Verify cart is empty before starting', async ({ cartPage }) => {
    // Arrange & Act
    await cartPage.goto();

    // Assert
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();
  });
});
