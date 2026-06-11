#!/usr/bin/env tsx

/**
 * Script to set up Supabase storage for Philippines forms
 * Run this once: npm run setup-storage
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { createStorageBucket, testStorageBucket, getStorageStats } from '../lib/storage-setup';
import { supabase } from '../lib/supabase';

async function main() {
  console.log('🚀 Setting up Supabase storage for Philippines forms...\n');

  // Check connection
  console.log('1. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('form_sessions').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connection successful\n');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    console.log('\n💡 Make sure your .env.local has:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n');
    process.exit(1);
  }

  // Create storage bucket
  console.log('2. Creating storage bucket...');
  const bucketResult = await createStorageBucket();
  if (!bucketResult.success) {
    console.error('❌ Failed to create bucket:', bucketResult.error);
    process.exit(1);
  }
  console.log('✅ Storage bucket ready\n');

  // Test storage
  console.log('3. Testing file upload...');
  const testResult = await testStorageBucket();
  if (!testResult.success) {
    console.error('❌ Storage test failed:', testResult.error);
    process.exit(1);
  }
  console.log('✅ File upload working\n');

  // Show storage stats
  console.log('4. Checking storage status...');
  const statsResult = await getStorageStats();
  if (statsResult.success) {
    console.log(`✅ Storage initialized: ${statsResult.totalFiles} files`);
  }

  console.log('\n🎉 Storage setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your forms to use the new file upload system');
  console.log('2. Test the form persistence with image uploads');
  console.log('3. Set up periodic cleanup of expired files');
  console.log('\n💾 Storage limits:');
  console.log('- Free tier: 1GB total storage');
  console.log('- Pro tier: 100GB ($0.021/GB after 100GB)');
  console.log('- Each form: ~5-10MB (selfie + documents)');
  console.log('- Estimated capacity: ~100-200 customers on free tier');
}

main().catch(console.error);
