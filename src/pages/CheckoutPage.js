import { BasePage } from './BasePage.js';

/**
 * CheckoutPage - Page Object for saucedemo.com checkout flow
 * 
 * Handles 2-step checkout process + order confirmation
 * Step 1: Shipping information
 * Step 2: Order review & finish
 * Confirmation: Order completion
 */
export class CheckoutPage extends BasePage {
  // Step 1 Selectors - Shipping Information
  get firstNameInput() {
    return '#first-name';
  }

  get lastNameInput() {
    return '#last-name';
  }

  get zipCodeInput() {
    return '#postal-code';
  }

  get continueButton() {
    return '#continue';
  }

  // Step 2 Selectors - Order Summary
  get summaryTotal() {
    return '.summary_total_label';
  }

  get finishButton() {
    return '#finish';
  }

  // Confirmation Selectors
  get confirmationMessage() {
    return '.complete-header';
  }

  get confirmationContainer() {
    return '.checkout_complete_container';
  }

  /**
   * Navigate to checkout page
   */
  async goto() {
    await super.goto('/checkout-step-one.html');
  }

  /**
   * Fill shipping information on Step 1
   * @param {object} info - Shipping info object
   * @param {string} info.firstName
   * @param {string} info.lastName
   * @param {string} info.zip
   */
  async fillShippingInfo(info) {
    const { firstName, lastName, zip } = info;
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.zipCodeInput, zip);
  }

  /**
   * Click continue button to proceed to Step 2
   */
  async continueToSummary() {
    await this.click(this.continueButton);
  }

  /**
   * Get order total from Step 2 summary
   * @returns {Promise<string>}
   */
  async getOrderTotal() {
    return this.getText(this.summaryTotal);
  }

  /**
   * Click finish button to complete order
   */
  async completeOrder() {
    await this.click(this.finishButton);
  }

  /**
   * Get confirmation message text
   * @returns {Promise<string>}
   */
  async getConfirmationMessage() {
    return this.getText(this.confirmationMessage);
  }
}
