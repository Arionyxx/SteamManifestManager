#!/usr/bin/env node
import crypto from 'crypto';

console.log('\n🔐 Generating Secure Secrets for Steam Manifest Manager\n');
console.log('Copy these values to your .env file or hosting platform environment variables:\n');
console.log('━'.repeat(70));

const jwtSecret = crypto.randomBytes(64).toString('hex');
const adminSecret = crypto.randomBytes(32).toString('hex');

console.log('\n📝 JWT_SECRET (for token signing):');
console.log(jwtSecret);

console.log('\n👑 ADMIN_SECRET (for admin registration - keep private!):');
console.log(adminSecret);

console.log('\n━'.repeat(70));
console.log('\n💡 Tips:');
console.log('  - Add JWT_SECRET to your backend environment variables');
console.log('  - Share ADMIN_SECRET only with trusted administrators');
console.log('  - Never commit these secrets to git');
console.log('  - Use different secrets for development and production');
console.log('\n✅ Done! Add these to your .env file or hosting platform.\n');
