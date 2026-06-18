import { BasePage } from './BasePage.js';

/**
 * InventoryPage - Page Object for SauceDemo inventory/products page
 */
export class InventoryPage extends BasePage {

  // Selectors
  // Selectors as getters
  get productItems() {
    return '.inventory_item';
  }

  get sortDropdown() {
    return '.product_sort_container';
  }

  get cartBadge() {
    return '.shopping_cart_badge';
  }

  get cartLink() {
    return 'a.shopping_cart_link';
  }

  get container() {
    return '.inventory_container';
  }

  get inventoryItems() {
    return '.inventory_item';
  }

  get inventoryItemNames() {
    return '.inventory_item_name';
  }

  get addToCartButtons() {
    return 'button[data-test*="add-to-cart"]';
  }

  get cartBadge() {
    return '.shopping_cart_badge';
  }

  get cartLink() {
    return 'a.shopping_cart_link';
  }

  get sortDropdown() {
    return '[data-test="product-sort-container"]';
  }

  /**
   * Navigate to inventory page
   */
  async goto() {
    await super.goto('/inventory.html');
  }

  /**
   * Get count of inventory items
   * @returns {Promise<number>}
   */
  async getItemCount() {
    const items = await this.page.locator(this.inventoryItems).count();
    return items;
  }

  /**
   * Get all product names
   * @returns {Promise<string[]>}
   */
  async getAllProductNames() {
    const names = await this.page.locator(this.inventoryItemNames).allTextContents();
    return names;
  }

  /**
   * Add product to cart by name
   * @param {string} productName
   */
  async addProductToCart(productName) {
    const locator = this.page.locator(this.inventoryItems);
    const count = await locator.count();

    for (let i = 0; i < count; i++) {
      const item = locator.nth(i);
      const name = await item.locator('.inventory_item_name').textContent();

      if (name.trim() === productName) {
        await item.locator('button[data-test*="add-to-cart"]').click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Get cart item count from badge
   * @returns {Promise<string>}
   */
  async getCartBadgeCount() {
    return this.getText(this.cartBadge);
  }

  /**
   * Check if cart badge is visible
   * @returns {Promise<boolean>}
   */
  async isCartBadgeVisible() {
    return this.isVisible(this.cartBadge);
  }

  /**
   * Click on cart link to navigate to cart
   */
  async goToCart() {
    await this.click(this.cartLink);
  }

  /**
   * Sort products by option
   * @param {string} option - e.g., 'az', 'za', 'lohi', 'hilo'
   */
  async sortBy(option) {
    await this.click(this.sortDropdown);
    await this.click(`[data-test-id="${option}"]`);
  }

  /**
   * Check if inventory page is loaded
   * @returns {Promise<boolean>}
   */
  async isPageLoaded() {
    return this.isVisible(this.container);
  }

  /**
   * Add item to cart by product name
   * @param {string} productName
   */
  async addItemToCart(productName) {
    const items = await this.page.locator(this.productItems).all();

    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      if (name?.trim() === productName) {
        await item.locator('button[data-test*="add-to-cart"]').click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Remove item from cart by product name
   * @param {string} productName
   */
  async removeItemFromCart(productName) {
    const items = await this.page.locator(this.productItems).all();

    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      if (name?.trim() === productName) {
        await item.locator('button[data-test*="remove"]').click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Sort products by option
   * @param {string} option - e.g., 'az', 'za', 'lohi', 'hilo'
   */
  async sortBy(option) {
    await this.click(this.sortDropdown);
    await this.page.selectOption(this.sortDropdown + ' select', option);
  }

  /**
   * Get count of products on the page
   * @returns {Promise<number>}
   */
  async getProductCount() {
    return this.page.locator(this.productItems).count();
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart() {
    await this.click(this.cartLink);
  }
}
