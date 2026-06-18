import { test, expect } from '../../src/fixtures/testFixtures.js';
import { testData } from '../../src/helpers/testData.js';

/**
 * Inventory Tests - @smoke @regression
 */

test.describe('Inventory - SauceDemo', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.standard_user.username, testData.users.standard_user.password);
    await inventoryPage.isPageLoaded();
  });

  test('@smoke | Display all inventory items', async ({ inventoryPage }) => {
    // Act
    const itemCount = await inventoryPage.getItemCount();

    // Assert
    expect(itemCount).toBeGreaterThan(0);
    expect(itemCount).toBe(6); // SauceDemo has 6 products
  });

  test('@regression | Add single product to cart', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.addProductToCart(testData.products.backpack);

    // Assert
    const badgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(badgeVisible).toBeTruthy();

    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toContain('1');
  });

  test('@regression | Add multiple products to cart', async ({ inventoryPage }) => {
    // Act
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.addProductToCart(testData.products.bike_light);

    // Assert
    const cartCount = await inventoryPage.getCartBadgeCount();
    expect(cartCount).toContain('2');
  });

  test('Get all product names', async ({ inventoryPage }) => {
    // Act
    const productNames = await inventoryPage.getAllProductNames();

    // Assert
    expect(productNames.length).toBe(6);
    expect(productNames).toContain('Sauce Labs Backpack');
  });

  test('Navigate to cart from inventory', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.addProductToCart(testData.products.backpack);

    // Act
    await inventoryPage.goToCart();

    // Assert
    expect(await cartPage.isPageLoaded()).toBeTruthy();
  });
});
