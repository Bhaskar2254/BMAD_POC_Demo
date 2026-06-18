import { test, expect } from '../../src/fixtures/testFixtures.js';
import { testData } from '../../src/helpers/testData.js';

/**
 * Login Tests - @smoke @sanity
 */

test.describe('Login - SauceDemo', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('@smoke @sanity | Successful login with valid credentials', async ({
    loginPage,
    inventoryPage,
  }) => {
    // Arrange
    const { username, password } = testData.users.standard_user;

    // Act
    await loginPage.login(username, password);

    // Assert
    expect(await inventoryPage.isPageLoaded()).toBeTruthy();
    const url = await inventoryPage.getCurrentURL();
    expect(url).toContain('inventory');
  });

  test('@sanity | Login fails with invalid password', async ({ loginPage }) => {
    // Arrange
    const { username } = testData.users.standard_user;

    // Act
    await loginPage.login(username, 'wrong_password');

    // Assert
    const errorVisible = await loginPage.isErrorDisplayed();
    expect(errorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Username and password do not match');
  });

  test('@sanity | Login fails with locked out user', async ({ loginPage }) => {
    // Arrange
    const { username, password } = testData.users.locked_user;

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorVisible = await loginPage.isErrorDisplayed();
    expect(errorVisible).toBeTruthy();

    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('locked out');
  });

  test('Login page displays required elements', async ({ loginPage, page }) => {
    // Assert
    expect(await page.isVisible(loginPage.usernameInput)).toBeTruthy();
    expect(await page.isVisible(loginPage.passwordInput)).toBeTruthy();
    expect(await page.isVisible(loginPage.loginButton)).toBeTruthy();
  });
});
