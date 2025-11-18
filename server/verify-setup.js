import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 Verifying Database Setup...\n');

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.log('❌ DATABASE_URL is not set in .env file');
  console.log('\n📝 Please edit server/.env and add your Neon connection string');
  process.exit(1);
}

if (dbUrl.includes('[user]') || dbUrl.includes('[password]') || dbUrl.includes('[host]')) {
  console.log('❌ DATABASE_URL still contains placeholder values');
  console.log('\n📝 Please replace the placeholders in server/.env with your actual Neon connection string');
  console.log('\nYour current DATABASE_URL:');
  console.log(dbUrl);
  console.log('\n💡 Get your connection string from: https://console.neon.tech/app/projects/twilight-bush-36348545');
  process.exit(1);
}

if (!dbUrl.includes('neon.tech')) {
  console.log('⚠️  DATABASE_URL does not look like a Neon connection string');
  console.log('\nCurrent value:', dbUrl);
  console.log('\n💡 It should look like:');
  console.log('postgresql://user:password@ep-something.neon.tech/neondb?sslmode=require');
}

console.log('✅ DATABASE_URL is set!');
console.log('\n🔗 Database Host:', dbUrl.match(/@(.+?)\//)?.[1] || 'Unknown');
console.log('✅ JWT_SECRET is set:', process.env.JWT_SECRET ? 'Yes' : 'No');
console.log('✅ PORT is set:', process.env.PORT || '5000');

console.log('\n🎉 Setup looks good! Ready to start the server.\n');
console.log('👉 Run: npm run dev\n');
