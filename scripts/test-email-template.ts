import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { generateCustomerConfirmationEmail, generateAdminNotificationEmail } from '../lib/email-templates';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

// Sample comprehensive application data
const sampleApplicationData = {
  // Personal Information
  passportType: 'foreign',
  firstName: 'Maria',
  middleName: 'Isabella',
  lastName: 'Santos',
  sex: 'F',
  birthMonth: '03',
  birthDay: '22',
  birthYear: '1985',
  mobileCountryCode: '+63',
  mobileNumber: '917123456',
  citizenship: 'Philippines',
  countryOfBirth: 'Philippines',
  passportNumber: 'CD789012',
  passportIssuingAuthority: 'Department of Foreign Affairs - Philippines',
  passportIssueMonth: '05',
  passportIssueDay: '15',
  passportIssueYear: '2020',
  expiryMonth: '05',
  expiryDay: '15',
  expiryYear: '2030',
  occupation: 'Teacher',
  
  // Address Information
  permanentCountryOfResidence: 'Philippines',
  residenceCountry: 'Philippines',
  residenceAddress: '123 Rizal Street, Quezon City, Metro Manila 1101, Philippines',
  residenceAddressLine2: 'Unit 4B, Building A',
  
  // Travel Information
  purposeOfTravel: 'tourism_leisure',
  travellerType: 'aircraft_passenger',
  airline: 'Cebu Pacific',
  flightNumber: '5J814',
  countryOfOrigin: 'Philippines',
  airportOfOrigin: 'Ninoy Aquino International Airport (MNL) - Manila',
  departureMonth: '10',
  departureDay: '20',
  departureYear: '2024',
  departureDate: '2024-10-20',
  destination: 'United States',
  airportOfDestination: 'John F. Kennedy International Airport (JFK) - New York',
  arrivalMonth: '10',
  arrivalDay: '21',
  arrivalYear: '2024',
  
  // Document Information (complete application)
  picture: 'https://example.com/profile.jpg',
  customsDeclarationAttachment: 'https://example.com/customs.pdf',
  currencyDeclarationAttachment: 'https://example.com/currency.pdf',
  digitalSignature: 'Maria Isabella Santos',
  
  // Form metadata
  formType: 'Flight',
  userEmail: 'maria.santos@gmail.com',
  recaptchaScore: 0.8
};

// Sample incomplete application data
const incompleteApplicationData = {
  ...sampleApplicationData,
  // Missing some documents
  customsDeclarationAttachment: undefined,
  currencyDeclarationAttachment: undefined,
  digitalSignature: undefined,
  recaptchaScore: 0.6
};

const submissionTime = new Date().toLocaleString();

console.log('🧪 Generating email template samples...\n');

// Generate complete application emails
const completeAdminEmail = generateAdminNotificationEmail(sampleApplicationData, submissionTime);
const completeCustomerEmail = generateCustomerConfirmationEmail(sampleApplicationData, submissionTime);

// Generate incomplete application emails
const incompleteAdminEmail = generateAdminNotificationEmail(incompleteApplicationData, submissionTime);
const incompleteCustomerEmail = generateCustomerConfirmationEmail(incompleteApplicationData, submissionTime);

// Save sample emails to files for preview
writeFileSync('sample-admin-email-complete.html', completeAdminEmail);
writeFileSync('sample-customer-email-complete.html', completeCustomerEmail);
writeFileSync('sample-admin-email-incomplete.html', incompleteAdminEmail);
writeFileSync('sample-customer-email-incomplete.html', incompleteCustomerEmail);

console.log('✅ Email templates generated successfully!');
console.log('\n📧 Generated Files:');
console.log('   • sample-admin-email-complete.html');
console.log('   • sample-customer-email-complete.html');
console.log('   • sample-admin-email-incomplete.html');
console.log('   • sample-customer-email-incomplete.html');

console.log('\n📋 Template Features:');
console.log('   🎨 Professional, responsive design');
console.log('   📊 Complete application status indicators');
console.log('   📝 All form fields organized by section');
console.log('   🔍 Document upload status tracking');
console.log('   🚀 Security score and submission details');
console.log('   📱 Mobile-friendly layout');
console.log('   🎯 Different versions for admins vs customers');

console.log('\n🔄 Email Integration Points:');
console.log('   1. Form submission → Comprehensive details email');
console.log('   2. Payment confirmation → Professional confirmation');
console.log('   3. Admin notifications → Full application overview');
console.log('   4. Customer updates → Branded status updates');

console.log('\n✨ The email templates now mirror your admin panel structure!');
console.log('   Open the HTML files in a browser to preview the emails.');
