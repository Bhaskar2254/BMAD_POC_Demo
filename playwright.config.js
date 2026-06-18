import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

/**
 * Enterprise-grade Playwright configuration for SauceDemo
 * 
 * Features:
 * - Multi-browser testing (Chrome, Firefox, Safari, Mobile)
 * - Allure, HTML, and JUnit reporters for enterprise CI/CD
 * - Smart retries on CI with 4 parallel workers
 * - Environment-driven BASE_URL configuration
 * - Screenshot and trace artifacts for debugging
 */

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';
const IS_CI = !!process.env.CI;
const WORKERS_CI = 4;
const WORKERS_LOCAL = 1;

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  
  /* Shared settings for all tests */
  use: {
    baseURL: BASE_URL,
    trace: IS_CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: IS_CI ? 'only-on-failure' : 'off',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
    /* Use stored authentication state for all tests by default */
    storageState: '.auth/state.json',
    headless: true,
  },

  /* Shared timeout settings */
  timeout: 60 * 1000,
  expect: {
    timeout: 10000,
  },

  /* Test execution settings */
  fullyParallel: true,
  workers: IS_CI ? WORKERS_CI : WORKERS_LOCAL,
  maxFailures: IS_CI ? 5 : undefined,
  retries: IS_CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  /* Reporter configuration */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright'],
    ['list'],
  ],

  /* Global setup and teardown */
  globalSetup: './tests/global-setup.js',
  globalTeardown: './tests/global-teardown.js',

  /* Projects: Browser matrix for CI/CD */
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    }
  ],

  /* Web server (optional) */
  webServer: process.env.START_SERVER
    ? {
        command: 'npm run start:server',
        port: 3000,
        reuseExistingServer: !IS_CI,
        timeout: 120 * 1000,
      }
    : undefined,
});

