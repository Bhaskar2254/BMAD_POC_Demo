/**
 * Test data helpers for SauceDemo
 */

export const testData = {
  // User credentials
  users: {
    standard_user: {
      username: process.env.TEST_USERNAME || 'standard_user',
      password: process.env.TEST_PASSWORD || 'secret_sauce',
    },
    locked_user: {
      username: 'locked_out_user',
      password: 'secret_sauce',
    },
    problem_user: {
      username: 'problem_user',
      password: 'secret_sauce',
    },
  },

  // Products
  products: {
    backpack: 'Sauce Labs Backpack',
    bike_light: 'Sauce Labs Bike Light',
    bolt_tshirt: 'Sauce Labs Bolt T-Shirt',
    fleece_jacket: 'Sauce Labs Fleece Jacket',
    onesie: 'Sauce Labs Onesie',
    red_tshirt: 'Test.allTheThings() T-Shirt (Red)',
  },

  // Price data (can be updated)
  prices: {
    backpack: 29.99,
    bike_light: 9.99,
    bolt_tshirt: 15.99,
    fleece_jacket: 49.99,
    onesie: 7.99,
    red_tshirt: 15.99,
  },
};

/**
 * Generate random test data
 */
export function generateTestData() {
  const timestamp = Date.now();
  return {
    username: `user_${timestamp}`,
    email: `test_${timestamp}@example.com`,
    uniqueId: timestamp,
  };
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format price as USD
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculate tax (assuming 10% tax rate)
 * @param {number} subtotal
 * @returns {number}
 */
export function calculateTax(subtotal) {
  return parseFloat((subtotal * 0.1).toFixed(2));
}

/**
 * Calculate total with tax
 * @param {number} subtotal
 * @returns {number}
 */
export function calculateTotal(subtotal) {
  return parseFloat((subtotal + calculateTax(subtotal)).toFixed(2));
}
