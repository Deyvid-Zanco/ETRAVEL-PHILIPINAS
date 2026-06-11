#!/usr/bin/env tsx

/**
 * Script to create test applications for admin panel testing
 * Run this: npm run create-test-data
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { supabase } from '../lib/supabase';

const testApplications = [
  {
    stripe_session_id: 'cs_test_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
    customer_email: 'john.doe@example.com',
    customer_name: 'John Doe',
    travel_method: 'Flight',
    travel_type: 'arrival',
    status: 'pending',
    form_data: {
      // Personal Information
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      passportType: 'foreign',
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Doe',
      sex: 'Male',
      birthMonth: '01',
      birthDay: '15',
      birthYear: '1990',
      mobileCountryCode: '+1',
      mobileNumber: '2345678901',
      citizenship: 'United States',
      countryOfBirth: 'United States',
      passportNumber: 'AB123456',
      passportIssuingAuthority: 'United States Department of State',
      passportIssueMonth: '03',
      passportIssueDay: '10',
      passportIssueYear: '2020',
      expiryMonth: '03',
      expiryDay: '10',
      expiryYear: '2030',
      occupation: 'Software Engineer',
      
      // Address Information
      permanentCountryOfResidence: 'United States',
      residenceCountry: 'United States',
      residenceAddress: '123 Main Street, New York, NY 10001',
      residenceAddressLine2: 'Apartment 4B',
      
      // Travel Information
      purposeOfTravel: 'business_professional',
      travellerType: 'aircraft_passenger',
      airline: 'Philippine Airlines',
      flightNumber: 'PR102',
      countryOfOrigin: 'United States',
      airportOfOrigin: 'John F. Kennedy International Airport (JFK) - New York',
      departureMonth: '10',
      departureDay: '15',
      departureYear: '2024',
      departureDate: '2024-10-15',
      destination: 'Philippines',
      airportOfDestination: 'Ninoy Aquino International Airport (MNL) - Manila',
      arrivalMonth: '10',
      arrivalDay: '16',
      arrivalYear: '2024',
      
      // Missing document attachments - makes it incomplete
      digitalSignature: 'John Michael Doe'
    },
    current_step: 'document-upload',
    completed: false,
    admin_notes: null
  },
  {
    stripe_session_id: 'cs_test_2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q',
    customer_email: 'maria.santos@gmail.com',
    customer_name: 'Maria Santos',
    travel_method: 'Flight',
    travel_type: 'departure',
    status: 'in_review',
    form_data: {
      // Personal Information
      picture: 'https://images.unsplash.com/photo-1494790108755-2616b2d2c37b?w=300&h=200&fit=crop',
      passportType: 'philippines',
      firstName: 'Maria',
      middleName: 'Isabel',
      lastName: 'Santos',
      sex: 'Female',
      birthMonth: '03',
      birthDay: '22',
      birthYear: '1985',
      mobileCountryCode: '+63',
      mobileNumber: '9171234567',
      citizenship: 'Philippines',
      countryOfBirth: 'Philippines',
      passportNumber: 'CD789012',
      passportIssuingAuthority: 'Department of Foreign Affairs',
      passportIssueMonth: '05',
      passportIssueDay: '15',
      passportIssueYear: '2019',
      expiryMonth: '05',
      expiryDay: '15',
      expiryYear: '2029',
      occupation: 'Teacher',
      
      // Address Information
      permanentCountryOfResidence: 'Philippines',
      residenceCountry: 'Philippines',
      residenceAddress: '456 Rizal Street, Quezon City, Metro Manila',
      
      // Travel Information
      purposeOfTravel: 'education_training',
      travellerType: 'aircraft_passenger',
      airline: 'Cebu Pacific',
      flightNumber: '5J814',
      countryOfOrigin: 'Philippines',
      airportOfOrigin: 'Ninoy Aquino International Airport (MNL) - Manila',
      departureMonth: '10',
      departureDay: '20',
      departureYear: '2024',
      departureDate: '2024-10-20',
      destination: 'Singapore',
      airportOfDestination: 'Singapore Changi Airport (SIN) - Singapore',
      arrivalMonth: '10',
      arrivalDay: '20',
      arrivalYear: '2024',
      
      // Complete with required documents
      customsDeclarationAttachment: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&h=200&fit=crop',
      currencyDeclarationAttachment: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop',
      digitalSignature: 'Maria Isabel Santos'
    },
    current_step: 'completed',
    completed: true,
    admin_notes: 'Documents submitted. Passport verification in progress.'
  },
  {
    stripe_session_id: 'cs_test_3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r',
    customer_email: 'david.smith@outlook.com',
    customer_name: 'David Smith',
    travel_method: 'Cruise',
    travel_type: 'arrival',
    status: 'approved',
    form_data: {
      // Personal Information
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop',
      passportType: 'foreign',
      firstName: 'David',
      middleName: 'Michael',
      lastName: 'Smith',
      sex: 'Male',
      birthMonth: '07',
      birthDay: '10',
      birthYear: '1978',
      mobileCountryCode: '+44',
      mobileNumber: '7911123456',
      citizenship: 'United Kingdom',
      countryOfBirth: 'United Kingdom',
      passportNumber: 'EF345678',
      passportIssuingAuthority: 'HM Passport Office',
      passportIssueMonth: '01',
      passportIssueDay: '20',
      passportIssueYear: '2021',
      expiryMonth: '01',
      expiryDay: '20',
      expiryYear: '2031',
      occupation: 'Business Executive',
      
      // Address Information
      permanentCountryOfResidence: 'United Kingdom',
      residenceCountry: 'United Kingdom',
      residenceAddress: '789 Oxford Street, London W1D 2HH',
      residenceAddressLine2: 'Suite 300',
      
      // Travel Information (Cruise)
      purposeOfTravel: 'holiday_vacation',
      travellerType: 'cruise_passenger',
      vesselName: 'Royal Princess',
      origin: 'Singapore',
      seaportOfOrigin: 'Port of Singapore',
      departureMonth: '10',
      departureDay: '25',
      departureYear: '2024',
      departureDate: '2024-10-25',
      destination: 'Philippines',
      seaportOfDestination: 'Port of Manila',
      arrivalMonth: '10',
      arrivalDay: '27',
      arrivalYear: '2024',
      
      // Destination Details
      destinationType: 'hotel_resort',
      destinationAddress: 'Manila Hotel, One Rizal Park, Manila 1000',
      
      // Complete with required documents
      customsDeclarationAttachment: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=300&h=200&fit=crop',
      currencyDeclarationAttachment: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop',
      digitalSignature: 'David Michael Smith'
    },
    current_step: 'completed',
    completed: true,
    admin_notes: 'All documents verified. Approved for travel. eTA issued.'
  },
  {
    stripe_session_id: 'cs_test_4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s',
    customer_email: 'sarah.johnson@yahoo.com',
    customer_name: 'Sarah Johnson',
    travel_method: 'Flight',
    travel_type: 'arrival',
    status: 'rejected',
    form_data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@yahoo.com',
      passportNumber: 'GH901234',
      citizenship: 'Canada',
      occupation: 'Student',
      mobileNumber: '+14161234567',
      birthMonth: '11',
      birthDay: '05',
      birthYear: '2000'
    },
    current_step: 'passport-details',
    completed: false,
    admin_notes: 'Passport expires within 6 months. Customer notified to renew passport before travel.'
  },
  {
    stripe_session_id: 'cs_test_5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    customer_email: 'hiroshi.tanaka@gmail.com',
    customer_name: 'Hiroshi Tanaka',
    travel_method: 'Flight',
    travel_type: 'arrival',
    status: 'completed',
    form_data: {
      firstName: 'Hiroshi',
      lastName: 'Tanaka',
      email: 'hiroshi.tanaka@gmail.com',
      passportNumber: 'IJ567890',
      citizenship: 'Japan',
      occupation: 'Engineer',
      mobileNumber: '+819012345678',
      birthMonth: '04',
      birthDay: '18',
      birthYear: '1982',
      airline: 'Japan Airlines',
      flightNumber: 'JL741',
      departureDate: '2024-11-01',
      digitalSignature: 'Hiroshi Tanaka',
      purposeOfTravel: 'business_professional'
    },
    current_step: 'completed',
    completed: true,
    admin_notes: 'Fast-track processing completed. eTA issued within 24 hours.'
  },
  {
    stripe_session_id: 'cs_test_6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u',
    customer_email: 'anna.mueller@hotmail.com',
    customer_name: 'Anna Mueller',
    travel_method: 'Cruise',
    travel_type: 'departure',
    status: 'pending',
    form_data: {
      firstName: 'Anna',
      lastName: 'Mueller',
      email: 'anna.mueller@hotmail.com',
      passportNumber: 'KL123456',
      citizenship: 'Germany',
      occupation: 'Doctor',
      mobileNumber: '+4915123456789'
    },
    current_step: 'travel-details',
    completed: false,
    admin_notes: null
  },
  {
    stripe_session_id: 'cs_test_7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
    customer_email: 'carlos.rodriguez@empresa.com',
    customer_name: 'Carlos Rodriguez',
    travel_method: 'Flight',
    travel_type: 'arrival',
    status: 'in_review',
    form_data: {
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      email: 'carlos.rodriguez@empresa.com',
      passportNumber: 'MN789012',
      citizenship: 'Spain',
      occupation: 'Marketing Manager',
      mobileNumber: '+34612345678',
      birthMonth: '09',
      birthDay: '28',
      birthYear: '1987',
      airline: 'Iberia',
      flightNumber: 'IB6858',
      departureDate: '2024-11-10',
      purposeOfTravel: 'holiday_vacation'
    },
    current_step: 'health-declaration',
    completed: false,
    admin_notes: 'Waiting for additional travel insurance documentation.'
  },
  {
    stripe_session_id: 'cs_test_8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w',
    customer_email: 'lisa.chen@university.edu',
    customer_name: 'Lisa Chen',
    travel_method: 'Flight',
    travel_type: 'arrival',
    status: 'approved',
    form_data: {
      firstName: 'Lisa',
      lastName: 'Chen',
      email: 'lisa.chen@university.edu',
      passportNumber: 'OP345678',
      citizenship: 'Australia',
      occupation: 'Research Scientist',
      mobileNumber: '+61412345678',
      birthMonth: '12',
      birthDay: '12',
      birthYear: '1991',
      airline: 'Qantas',
      flightNumber: 'QF19',
      departureDate: '2024-11-15',
      digitalSignature: 'Lisa Ming Chen',
      purposeOfTravel: 'education_training'
    },
    current_step: 'completed',
    completed: true,
    admin_notes: 'Academic conference attendee. All documents verified and approved.'
  }
];

async function createTestApplications() {
  console.log('🧪 Creating test applications for admin panel...\n');

  try {
    // Check if we can access the application_sessions table
    const { error: testError } = await supabase
      .from('application_sessions')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Cannot access application_sessions table:', testError.message);
      console.log('\n💡 Make sure you have run the database setup:');
      console.log('1. Run the SQL schema for application_sessions table');
      console.log('2. Run: npm run setup-database');
      return;
    }

    console.log('✅ Database connection successful\n');

    // Add different created dates for more realistic timeline
    const now = new Date();
    const applicationsWithDates = testApplications.map((app, index) => ({
      ...app,
      form_session_token: `test_session_${app.stripe_session_id}`,
      created_at: new Date(now.getTime() - (index * 2 * 60 * 60 * 1000)).toISOString(), // 2 hours apart
      updated_at: new Date(now.getTime() - (index * 1 * 60 * 60 * 1000)).toISOString(), // 1 hour apart
      expires_at: new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString() // 7 days from now
    }));

    console.log('📝 Inserting test applications...');

    const { data, error } = await supabase
      .from('application_sessions')
      .insert(applicationsWithDates)
      .select();

    if (error) {
      console.error('❌ Error inserting test data:', error);
      return;
    }

    console.log(`✅ Successfully created ${data.length} test applications!\n`);

    // Show summary
    console.log('📊 Test Data Summary:');
    const statusCounts = applicationsWithDates.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} applications`);
    });

    console.log('\n🎉 Admin panel is now populated with test data!');
    console.log('\n🔗 Visit your admin panel:');
    console.log('• Dashboard: http://localhost:3000/admin/dashboard');
    console.log('• Login: admin@immi-center.com / admin123');
    
    console.log('\n✨ Test the following features:');
    console.log('• Search by customer email or name');
    console.log('• Filter by application status');
    console.log('• Click "View" to see detailed application pages');
    console.log('• Update status and add admin notes');
    console.log('• Export application data');

  } catch (error: any) {
    console.error('❌ Error creating test applications:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. Your database schema is set up correctly');
    console.log('2. The application_sessions table exists');
    console.log('3. Your .env.local file has the correct Supabase credentials');
  }
}

createTestApplications();
