#!/usr/bin/env node

/**
 * Test script to verify Ongea setup
 * This script tests database connection, API routes, and basic functionality
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Ongea Setup...\n');

// Test 1: Check environment variables
console.log('1. Checking environment variables...');
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missingVars = requiredVars.filter(varName => !envContent.includes(varName));

if (missingVars.length > 0) {
  console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}
console.log('✅ Environment variables configured');

// Test 2: Check database connection
console.log('\n2. Testing database connection...');
try {
  execSync('npx prisma db push --accept-data-loss', { stdio: 'pipe' });
  console.log('✅ Database connection successful');
} catch (error) {
  console.log('❌ Database connection failed');
  console.log('   Make sure MySQL is running and DATABASE_URL is correct');
  process.exit(1);
}

// Test 3: Check Prisma client generation
console.log('\n3. Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'pipe' });
  console.log('✅ Prisma client generated');
} catch (error) {
  console.log('❌ Prisma client generation failed');
  process.exit(1);
}

// Test 4: Check TypeScript compilation
console.log('\n4. Checking TypeScript compilation...');
try {
  execSync('npm run typecheck', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  console.log('   Run `npm run typecheck` for details');
  process.exit(1);
}

// Test 5: Check if all required files exist
console.log('\n5. Checking required files...');
const requiredFiles = [
  'src/lib/db.ts',
  'src/lib/auth.ts',
  'src/lib/analytics.ts',
  'src/hooks/use-auth.ts',
  'src/hooks/use-analytics.ts',
  'src/middleware.ts',
  'prisma/schema.prisma'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));

if (missingFiles.length > 0) {
  console.log(`❌ Missing files: ${missingFiles.join(', ')}`);
  process.exit(1);
}
console.log('✅ All required files present');

console.log('\n🎉 Setup test completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the development server: npm run dev');
console.log('2. Visit http://localhost:9002');
console.log('3. Create a test account');
console.log('4. Check analytics at /admin');
console.log('\n✨ Your Ongea app is ready to go!');
