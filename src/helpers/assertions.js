/**
 * Assertion helpers for cleaner test assertions
 */

export const assertions = {
  /**
   * Assert page has loaded
   * @param {Page} page
   * @param {string} expectedUrl
   */
  async pageLoaded(page, expectedUrl) {
    const currentUrl = page.url();
    console.log(`Expected: ${expectedUrl}, Got: ${currentUrl}`);
    if (!currentUrl.includes(expectedUrl)) {
      throw new Error(`Page did not load. Expected ${expectedUrl}, got ${currentUrl}`);
    }
  },

  /**
   * Assert multiple elements are visible
   * @param {Page} page
   * @param {string[]} selectors
   */
  async elementsVisible(page, selectors) {
    for (const selector of selectors) {
      const visible = await page.isVisible(selector);
      if (!visible) {
        throw new Error(`Element not visible: ${selector}`);
      }
    }
  },

  /**
   * Assert multiple elements are not visible
   * @param {Page} page
   * @param {string[]} selectors
   */
  async elementsNotVisible(page, selectors) {
    for (const selector of selectors) {
      const visible = await page.isVisible(selector);
      if (visible) {
        throw new Error(`Element should not be visible: ${selector}`);
      }
    }
  },

  /**
   * Assert element text matches
   * @param {Page} page
   * @param {string} selector
   * @param {string} expectedText
   */
  async elementTextMatches(page, selector, expectedText) {
    const text = await page.textContent(selector);
    if (!text?.includes(expectedText)) {
      throw new Error(`Expected text "${expectedText}", got "${text}"`);
    }
  },

  /**
   * Assert element count
   * @param {Page} page
   * @param {string} selector
   * @param {number} expectedCount
   */
  async elementCount(page, selector, expectedCount) {
    const count = await page.locator(selector).count();
    if (count !== expectedCount) {
      throw new Error(`Expected ${expectedCount} elements, found ${count}`);
    }
  },
};

/**
 * Wait helpers for common scenarios
 */
export const waits = {
  /**
   * Wait for element and get text
   * @param {Page} page
   * @param {string} selector
   * @returns {Promise<string>}
   */
  async textContent(page, selector) {
    await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
    return page.textContent(selector);
  },

  /**
   * Wait for multiple elements to appear
   * @param {Page} page
   * @param {string[]} selectors
   */
  async allElementsVisible(page, selectors) {
    for (const selector of selectors) {
      await page.waitForSelector(selector, { state: 'visible', timeout: 10000 });
    }
  },

  /**
   * Wait for any element to appear
   * @param {Page} page
   * @param {string[]} selectors
   * @returns {Promise<string>} The selector that appeared first
   */
  async anyElementVisible(page, selectors) {
    return Promise.race(
      selectors.map((selector) =>
        page.waitForSelector(selector, { state: 'visible', timeout: 10000 }).then(() => selector)
      )
    );
  },
};

/**
 * API helpers (if testing with API calls)
 */
export const apiHelpers = {
  /**
   * Get auth token from local storage
   * @param {Page} page
   * @returns {Promise<string|null>}
   */
  async getAuthToken(page) {
    return page.evaluate(() => localStorage.getItem('auth_token'));
  },

  /**
   * Set auth token in local storage
   * @param {Page} page
   * @param {string} token
   */
  async setAuthToken(page, token) {
    await page.evaluate((t) => localStorage.setItem('auth_token', t), token);
  },

  /**
   * Clear all local storage
   * @param {Page} page
   */
  async clearStorage(page) {
    await page.evaluate(() => localStorage.clear());
  },
};
