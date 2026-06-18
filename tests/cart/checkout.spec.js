import { test, expect } from '../../src/fixtures/testFixtures.js';
import { testData, calculateTotal } from '../../src/helpers/testData.js';

/**
 * Shopping Cart Tests - @smoke @regression
 */

test.describe('Shopping Cart - SauceDemo', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.standard_user.username, testData.users.standard_user.password);
    //await inventoryPage.waitForPageLoad();
    await inventoryPage.isPageLoaded();

    // Add products to cart
    await inventoryPage.addProductToCart(testData.products.backpack);
    await inventoryPage.addProductToCart(testData.products.bike_light);
  });

  test('@smoke | View cart with items', async ({ inventoryPage, cartPage }) => {
    // Act
    await inventoryPage.goToCart();

    // Assert
    expect(await cartPage.isPageLoaded()).toBeTruthy();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);
  });

  test('@regression | Remove item from cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.goToCart();

    // Act
    await cartPage.removeItem(testData.products.backpack);

    // Assert
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    const itemNames = await cartPage.getAllItemNames();
    expect(itemNames).not.toContain(testData.products.backpack);
  });

  test('@regression | Calculate cart total', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.goToCart();

    // Act
    const prices = await cartPage.getAllItemPrices();
    const cartTotal = await cartPage.calculateTotal();

    // Assert
    expect(prices).toHaveLength(2);
    expect(prices[0]).toBe(testData.prices.backpack);
    expect(prices[1]).toBe(testData.prices.bike_light);
    expect(cartTotal).toBe(testData.prices.backpack + testData.prices.bike_light);
  });

  test('Continue shopping from cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.goToCart();

    // Act
    await cartPage.continueShopping();

    // Assert
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
  });

  test('Proceed to checkout from cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.goToCart();

    // Act
    await cartPage.checkout();

    // Assert
    const url = await cartPage.getCurrentURL();
    expect(url).toContain('checkout');
  });
});
