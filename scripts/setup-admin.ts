#!/usr/bin/env tsx

/**
 * Script to set up admin system for Philippines forms
 * Run this once: npm run setup-admin
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';
import { adminAuth, ADMIN_SCHEMA } from '../lib/auth';

async function setupAdminSystem() {
  console.log('🔐 Setting up Admin System...\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    const { error: testError } = await supabase.from('form_sessions').select('count').limit(1);
    if (testError && !testError.message.includes('does not exist')) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    console.log('✅ Database connection successful\n');

    // Create admin tables (this will be done via SQL)
    console.log('2. Admin tables setup...');
    console.log('⚠️  Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('```sql');
    console.log(ADMIN_SCHEMA);
    console.log('```\n');
    
    // Try to create initial admin user
    console.log('3. Creating initial admin user...');
    const adminEmail = 'admin@immi-center.com';
    const adminPassword = 'admin123';
    const adminName = 'System Administrator';

    const result = await adminAuth.createInitialAdmin(adminEmail, adminPassword, adminName);
    
    if (result.success) {
      console.log('✅ Initial admin user created successfully');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log('   ⚠️  Please change this password after first login!\n');
    } else {
      if (result.error?.includes('duplicate') || result.error?.includes('unique')) {
        console.log('ℹ️  Admin user already exists, skipping creation\n');
      } else {
        console.warn('⚠️  Could not create admin user automatically:', result.error);
        console.log('   This is normal if the tables don\'t exist yet');
        console.log('   Run the SQL schema first, then try again\n');
      }
    }

    console.log('4. Testing admin authentication...');
    try {
      const loginResult = await adminAuth.login(adminEmail, adminPassword);
      if (loginResult.success) {
        console.log('✅ Admin authentication working');
        await adminAuth.logout(); // Clean up test session
      }
    } catch (error) {
      console.log('ℹ️  Admin auth test skipped (tables may not exist yet)');
    }

    console.log('\n🎉 Admin system setup completed!\n');
    
    console.log('📋 Next steps:');
    console.log('1. Run the SQL schema in Supabase SQL Editor (shown above)');
    console.log('2. Visit: http://localhost:3000/admin');
    console.log(`3. Login with: ${adminEmail} / ${adminPassword}`);
    console.log('4. Change the default password');
    console.log('5. Start managing customer applications!\n');
    
    console.log('🔗 Admin URLs:');
    console.log('• Login: /admin');
    console.log('• Dashboard: /admin/dashboard');
    console.log('• Applications: /admin/applications/[id]');

  } catch (error: any) {
    console.error('❌ Admin setup failed:', error.message);
    console.log('\n💡 Manual setup required:');
    console.log('1. Run the SQL schema in Supabase SQL Editor');
    console.log('2. Create admin user manually');
    process.exit(1);
  }
}

setupAdminSystem();
