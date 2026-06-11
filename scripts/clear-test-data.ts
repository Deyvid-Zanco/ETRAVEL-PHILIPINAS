#!/usr/bin/env tsx

/**
 * Script to clear existing test data
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';

async function clearTestData() {
  console.log('🗑️ Clearing existing test data...');

  try {
    const { error } = await supabase
      .from('application_sessions')
      .delete()
      .like('stripe_session_id', 'cs_test_%');

    if (error) {
      console.error('❌ Error clearing test data:', error);
      return;
    }

    console.log('✅ Existing test data cleared successfully!\n');
  } catch (error: any) {
    console.error('❌ Error clearing test data:', error.message);
  }
}

clearTestData();
