#!/usr/bin/env tsx

/**
 * Script to clean up expired files from Supabase storage
 * Run this periodically: npm run cleanup-storage
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { cleanupExpiredFiles, getStorageStats } from '../lib/storage-setup';

async function main() {
  console.log('🧹 Cleaning up expired files from storage...\n');

  // Show storage stats before cleanup
  console.log('📊 Storage stats before cleanup:');
  const statsBefore = await getStorageStats();
  if (statsBefore.success) {
    console.log(`   Files: ${statsBefore.totalFiles}`);
  }
  console.log('');

  // Run cleanup
  console.log('🗑️  Removing files from expired sessions...');
  const cleanupResult = await cleanupExpiredFiles();
  
  if (!cleanupResult.success) {
    console.error('❌ Cleanup failed:', cleanupResult.error);
    process.exit(1);
  }

  // Show storage stats after cleanup
  console.log('\n📊 Storage stats after cleanup:');
  const statsAfter = await getStorageStats();
  if (statsAfter.success && statsBefore.success) {
    const filesRemoved = (statsBefore.totalFiles || 0) - (statsAfter.totalFiles || 0);
    console.log(`   Files: ${statsAfter.totalFiles}`);
    console.log(`   Removed: ${filesRemoved} files`);
  }

  console.log('\n✅ Cleanup completed!');
  console.log('\n💡 Tip: Set up a cron job to run this script daily:');
  console.log('   0 2 * * * cd /path/to/your/project && npm run cleanup-storage');
}

main().catch(console.error);
