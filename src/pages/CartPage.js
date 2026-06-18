import { BasePage } from './BasePage.js';

/**
 * CartPage - Page Object for SauceDemo shopping cart page
 */
class CartPage extends BasePage {
  // Selectors as getters
  get cartItems() {
    return '.cart_item';
  }

  get cartContainer() {
    return '.cart_container';
  }
  // Selectors
  get container() {
    //return '.cart_container';
    return '.header_secondary_container';
  }

  get cartItemNames() {
    return '.inventory_item_name';
  }

  get cartItemPrices() {
    return '.inventory_item_price';
  }

  get removeButtons() {
    return 'button[data-test*="remove"]';
  }

  get continueShoppingButton() {
    return '[data-test="continue-shopping"]';
  }

  get checkoutButton() {
    return '[data-test="checkout"]';
  }

  get cartBadge() {
    return '.shopping_cart_badge';
  }

  /**
   * Navigate to cart page
   */
  async goto() {
    await super.goto('/cart.html');
  }

  /**
   * Remove item from cart by name
   * @param {string} itemName
   */
  async removeItem(itemName) {
    const items = await this.page.locator(this.cartItems).all();

    for (const item of items) {
      const name = await item.locator(this.cartItemNames).textContent();

      if (name?.trim() === itemName) {
        await item.locator('button[data-test*="remove"]').click();
        return;
      }
    }

    throw new Error(`Item "${itemName}" not found in cart`);
  }

  /**
   * Click checkout button to proceed to checkout
   */
  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }

  /**
   * Get all item names in cart
   * @returns {Promise<string[]>}
   */
  async getItemNames() {
    const items = await this.page.locator(this.cartItems).all();
    const names = [];

    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      names.push(name?.trim());
    }

    return names;
  }


  /**
   * Get count of items in cart
   * @returns {Promise<number>}
   */
  async getCartItemCount() {
    return this.page.locator(this.cartItems).count();
  }

  /**
   * Get all item names in cart
   * @returns {Promise<string[]>}
   */
  async getAllItemNames() {
    const items = await this.page.locator(this.cartItems).all();
    const names = [];

    for (const item of items) {
      const name = await item.locator(this.cartItemNames).textContent();
      names.push(name?.trim());
    }

    return names;
  }

  /**
   * Get all item prices in cart
   * @returns {Promise<number[]>}
   */
  async getAllItemPrices() {
    const priceTexts = await this.page.locator(this.cartItemPrices).allTextContents();
    return priceTexts.map((price) => parseFloat(price.replace('$', '')));
  }



  /**
   * Calculate total from item prices
   * @returns {Promise<number>}
   */
  async calculateTotal() {
    const prices = await this.getAllItemPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  /**
   * Click continue shopping button
   */
  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }

  /**
   * Click checkout button
   */
  async checkout() {
    await this.click(this.checkoutButton);
  }

  /**
   * Check if cart is empty
   * @returns {Promise<boolean>}
   */
  async isCartEmpty() {
    const itemCount = await this.getCartItemCount();
    return itemCount === 0;
  }

  /**
   * Check if cart page is loaded
   * @returns {Promise<boolean>}
   */
  async isPageLoaded() {
    return this.isVisible(this.container);
  }
}

export default CartPage
