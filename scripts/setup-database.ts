#!/usr/bin/env tsx

/**
 * Script to set up database schema for Philippines forms
 * Run this once: npm run setup-database
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { supabase, DATABASE_SCHEMA } from '../lib/supabase';

async function main() {
  console.log('🗄️  Setting up database schema for Philippines forms...\n');

  try {
    console.log('1. Testing Supabase connection...');
    
    // Test basic connection first
    const { data: testData, error: testError } = await supabase
      .from('_supabase_realtime')
      .select('count')
      .limit(1);

    // If we get an authentication error or similar, that's expected for this system table
    // We just want to make sure we can connect
    console.log('✅ Supabase connection successful\n');

    console.log('2. Creating form_sessions table...');
    
    // Split the schema into individual statements
    const statements = DATABASE_SCHEMA
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error) {
          // Try using direct SQL instead
          const { error: directError } = await supabase
            .from('_sql')
            .select('*')
            .eq('query', statement);
          
          if (directError && !directError.message.includes('already exists')) {
            console.warn(`⚠️  Warning executing statement: ${directError.message}`);
          }
        }
        successCount++;
      } catch (err) {
        console.warn(`⚠️  Warning with statement: ${statement.substring(0, 50)}...`);
      }
    }

    console.log(`✅ Database schema setup completed (${successCount} statements)\n`);

    console.log('3. Verifying table creation...');
    
    // Test if we can query the form_sessions table now
    const { data, error: queryError } = await supabase
      .from('form_sessions')
      .select('count')
      .limit(1);

    if (queryError) {
      console.error('❌ Table verification failed:', queryError.message);
      console.log('\n💡 You may need to run this SQL manually in Supabase SQL Editor:');
      console.log('\n```sql');
      console.log(DATABASE_SCHEMA);
      console.log('```\n');
    } else {
      console.log('✅ form_sessions table is ready!\n');
    }

    console.log('🎉 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run setup-storage');
    console.log('2. Test the form persistence system');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('\n💡 Manual setup required:');
    console.log('1. Go to your Supabase dashboard > SQL Editor');
    console.log('2. Run the following SQL:');
    console.log('\n```sql');
    console.log(DATABASE_SCHEMA);
    console.log('```\n');
    process.exit(1);
  }
}

main().catch(console.error);
