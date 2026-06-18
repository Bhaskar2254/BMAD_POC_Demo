/**
 * Global Teardown - Runs ONCE after all tests
 * 
 * Use for:
 * - Final cleanup
 * - Report generation
 * - Notification sending
 * - Database cleanup
 */

export default async function globalTeardown(config) {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  🧹 GLOBAL TEARDOWN - Running Once         ║');
  console.log('╚════════════════════════════════════════════╝\n');

  console.log('✅ All tests completed');
  console.log('📊 Reports available at:');
  console.log('   • HTML:    playwright-report/');
  console.log('   • Allure:  npm run allure:report');
  console.log('   • JUnit:   test-results/junit.xml\n');
}
