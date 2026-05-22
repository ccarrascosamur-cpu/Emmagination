#!/usr/bin/env node
/**
 * Script de deploy manual para Cloudflare Workers
 *
 * Uso:
 *   node scripts/deploy.mjs           → Deploy a staging (default)
 *   node scripts/deploy.mjs production → Deploy a production
 */

import { execSync } from 'node:child_process';

const env = process.argv[2];
const isProduction = env === 'production';

console.log(`🚀 Deploying to ${isProduction ? 'PRODUCTION' : 'STAGING'}...\n`);

// Build
console.log('📦 Building...');
execSync('npm run build', { stdio: 'inherit' });

// Deploy
const command = isProduction
  ? 'npx wrangler deploy --env production'
  : 'npx wrangler deploy';

console.log(`\n🌐 Running: ${command}\n`);
execSync(command, { stdio: 'inherit' });

console.log(`\n✅ Deployed to ${isProduction ? 'PRODUCTION' : 'STAGING'}!`);
if (!isProduction) {
  console.log('💡 To deploy to production, run: node scripts/deploy.mjs production');
}
