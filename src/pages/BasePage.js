/**
 * BasePage - Abstract base class for all page objects
 * 
 * Provides common functionality for all pages:
 * - Navigation
 * - Element interactions
 * - Waits and assertions
 * - Screenshot capture
 * - Error handling
 */
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL (relative to baseURL in config)
   * @param {string} path - Relative path or absolute URL
   */
  async goto(path = '') {
    await this.page.goto(path, { waitUntil: 'networkidle' });
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
   * Take screenshot for debugging
   * @param {string} filename - Screenshot filename
   */
  async takeScreenshot(filename) {
    await this.page.screenshot({ path: `screenshots/${filename}.png` });
  }

  /**
   * Get page title
   * @returns {Promise<string>}
   */
  async getPageTitle() {
    return this.page.title();
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
    await this.page.reload();
  }
}
