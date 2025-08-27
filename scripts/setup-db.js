#!/usr/bin/env node

/**
 * Database setup script for Ongea
 * This script helps you set up your MySQL database and run initial migrations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Ongea Database...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Please create a .env file based on .env.example');
  console.log('   Make sure to set your DATABASE_URL and other required variables\n');
  
  console.log('Example .env content:');
  console.log('DATABASE_URL="mysql://username:password@localhost:3306/ongea_db"');
  console.log('JWT_SECRET="your-super-secret-jwt-key"');
  console.log('GEMINI_API_KEY="your-gemini-api-key"');
  console.log('ANALYTICS_ENABLED="true"\n');
  
  process.exit(1);
}

try {
  console.log('📦 Installing Prisma CLI...');
  execSync('npm install prisma --save-dev', { stdio: 'inherit' });
  
  console.log('\n🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n📊 Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Visit http://localhost:9002 to see your app');
  console.log('3. Create an account to test the authentication');
  console.log('4. Visit /admin to see analytics (after creating an account)');
  console.log('\n🎉 Happy coding!');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔍 Troubleshooting tips:');
  console.log('1. Make sure MySQL is running');
  console.log('2. Check your DATABASE_URL in .env file');
  console.log('3. Ensure the database exists (create it if needed)');
  console.log('4. Verify database user has proper permissions');
  
  process.exit(1);
}
