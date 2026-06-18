/**
 * Global setup - runs ONCE before all tests
 * 
 * Responsibilities:
 * - Validate environment variables
 * - Create required directories
 * - Authenticate user and save session state to .auth/state.json
 * - Database seeding (optional)
 * - Server health checks (optional)
 */

import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Authenticate and save session state
 * Runs ONCE - all tests then reuse this stored state
 */
async function authenticateAndSaveState(baseURL, username, password) {
  const fs = await import('fs').then((m) => m.promises);
  const authDir = path.join(__dirname, '..', '.auth');
  const authFile = path.join(authDir, 'state.json');

  console.log(`🔐 Authenticating user: ${username}...`);

  // Create browser and context
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login
    await page.goto(baseURL, { waitUntil: 'networkidle' });

    // Perform login
    await page.fill('input[data-test="username"]', username);
    await page.fill('input[data-test="password"]', password);
    await page.click('input[data-test="login-button"]');

    // Wait for navigation to inventory (sign of successful login)
    await page.waitForURL(/inventory/, { timeout: 10000 });
    console.log('✅ Login successful');

    // Save storage state (cookies, localStorage, sessionStorage)
    await context.storageState({ path: authFile });
    console.log(`✅ Auth state saved to: ${authFile}`);

  } catch (error) {
    console.error(`❌ Authentication failed: ${error.message}`);
    throw error;

  } finally {
    // Cleanup
    await context.close();
    await browser.close();
  }
}

/**
 * Main global setup function
 */
export default async function globalSetup(config) {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  🚀 GLOBAL SETUP - Running Once            ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const fs = await import('fs').then((m) => m.promises);
  const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';
  const username = process.env.TEST_USERNAME || 'standard_user';
  const password = process.env.TEST_PASSWORD || 'secret_sauce';

  // ─── Validate Environment ───────────────────────────────────────
  console.log('📋 Validating environment...');
  if (!baseURL.startsWith('http')) {
    console.warn('⚠️  BASE_URL should be absolute URL');
  } else {
    console.log(`   BASE_URL: ${baseURL}`);
  }
  console.log(`   TEST_USERNAME: ${username}`);
  console.log(`   TEST_PASSWORD: [REDACTED]\n`);

  // ─── Create Required Directories ────────────────────────────────
  console.log('📁 Creating directories...');
  const dirs = [
    'allure-results',
    'test-results',
    'screenshots',
    'traces',
    '.auth', // For storing authentication state
  ];

  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`   ✅ ${dir}/`);
    } catch (error) {
      console.warn(`   ⚠️  Could not create ${dir}: ${error.message}`);
    }
  }
  console.log();

  // ─── Authenticate and Save State ────────────────────────────────
  console.log('🔐 Setting up authentication...');
  try {
    await authenticateAndSaveState(baseURL, username, password);
    console.log('   ✅ Auth state ready for all tests\n');
  } catch (error) {
    console.error('\n❌ Global setup failed during authentication');
    process.exit(1);
  }

  // ─── Completion ─────────────────────────────────────────────────
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  ✅ GLOBAL SETUP COMPLETE                 ║');
  console.log('║     All tests will use saved auth state    ║');
  console.log('╚════════════════════════════════════════════╝\n');
}
