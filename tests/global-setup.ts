/**
 * Global Test Setup
 *
 * This file runs before all tests to set up Allure metadata.
 * Configured in playwright.config.ts via globalSetup option.
 */

import { setupAllureMetadata } from './helpers/allure-setup';

async function globalSetup() {
  console.log('📊 Setting up Allure metadata...');

  try {
    await setupAllureMetadata();
    console.log('✅ Allure metadata configured successfully');
  } catch (error) {
    console.error('❌ Failed to setup Allure metadata:', error);
    // Don't fail the tests if metadata setup fails
  }
}

export default globalSetup;
