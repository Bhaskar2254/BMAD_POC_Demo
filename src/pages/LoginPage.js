import { BasePage } from './BasePage.js';

/**
 * LoginPage - Page Object for SauceDemo login page
 * 
 * Encapsulates all login-related selectors and interactions
 */
export class LoginPage extends BasePage {
  // Selectors
  get usernameInput() {
    return 'input[data-test="username"]';
  }

  get passwordInput() {
    return 'input[data-test="password"]';
  }

  get loginButton() {
    return 'input[data-test="login-button"]';
  }

  get errorMessage() {
    return '[data-test="error"]';
  }

  get container() {
    return '.login_container';
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await super.goto('/');
  }

  /**
   * Perform login with username and password
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    return this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   * @returns {Promise<boolean>}
   */
  async isErrorDisplayed() {
    return this.isVisible(this.errorMessage);
  }

  /**
   * Check if login page is loaded
   * @returns {Promise<boolean>}
   */
  async isPageLoaded() {
    return this.isVisible(this.container);
  }

  /**
   * Wait for login page to be fully loaded
   */
  async waitForPageLoad() {
    await this.waitForVisible(this.container);
  }
  /**
   * Login as standard user with default credentials
   */
  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  /**
   * Login as locked user
   */
  async loginAsLockedUser() {
    await this.login('locked_out_user', 'secret_sauce');
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorText() {
    return this.getText(this.errorMessage);
  }
}
