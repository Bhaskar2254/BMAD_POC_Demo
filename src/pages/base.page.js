/**
 * BasePage - Abstract base class for all page objects
 * 
 * Provides common functionality for all pages:
 * - Navigation with explicit wait conditions
 * - Page state validation
 * - Screenshot capture for debugging
 * - Utility methods for element interactions
 */
export class BasePage {
  /**
   * @param {Page} page - Playwright Page instance
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a path and wait for page load
   * @param {string} path - Relative path or absolute URL
   * @param {object} options - Navigation options
   */
  async navigate(path = '') {
    await this.page.goto(path, { waitUntil: 'networkidle' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load (override in subclasses)
   * @returns {Promise<void>}
   */
  async waitForPageLoad() {
    // Base implementation: wait for page to be ready
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getTitle() {
    return this.page.title();
  }

  /**
   * Take screenshot for debugging
   * @param {string} name - Screenshot filename (without extension)
   * @returns {Promise<void>}
   */
  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `screenshots/${name}_${timestamp}.png`;
    
    try {
      await this.page.screenshot({ path: filename });
      console.log(`📸 Screenshot saved: ${filename}`);
    } catch (error) {
      console.warn(`⚠️  Could not save screenshot: ${error.message}`);
    }
  }

  /**
   * Click an element
   * @param {string} selector - CSS selector
   * @param {object} options - Playwright click options
   */
  async click(selector, options = {}) {
    await this.page.click(selector, options);
  }

  /**
   * Fill an input field
   * @param {string} selector - CSS selector
   * @param {string} text - Text to enter
   */
  async fillInput(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Get text from an element
   * @param {string} selector - CSS selector
   * @returns {Promise<string>} Element text content
   */
  async getText(selector) {
    return this.page.textContent(selector);
  }

  /**
   * Check if element is visible
   * @param {string} selector - CSS selector
   * @returns {Promise<boolean>}
   */
  async isVisible(selector) {
    return this.page.isVisible(selector);
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in ms
   */
  async waitForVisible(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in ms
   */
  async waitForHidden(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  /**
   * Get current URL
   * @returns {Promise<string>}
   */
  async getCurrentURL() {
    return this.page.url();
  }

  /**
   * Switch to new tab/window
   * @returns {Promise<Page>}
   */
  async switchToNewTab() {
    const context = this.page.context();
    const newPage = await context.waitForEvent('page');
    return newPage;
  }

  /**
   * Close current page
   */
  async close() {
    await this.page.close();
  }

  /**
   * Reload page
   */
  async reload() {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Wait for navigation to complete
   * @param {Function} action - Action that triggers navigation
   */
  async waitForNavigation(action) {
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'networkidle' }),
      action(),
    ]);
  }

  /**
   * Get local storage value
   * @param {string} key - Storage key
   * @returns {Promise<string|null>}
   */
  async getLocalStorageValue(key) {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  /**
   * Set local storage value
   * @param {string} key - Storage key
   * @param {string} value - Storage value
   */
  async setLocalStorageValue(key, value) {
    await this.page.evaluate(
      ({ k, v }) => localStorage.setItem(k, v),
      { k: key, v: value }
    );
  }

  /**
   * Clear all local storage
   */
  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}
