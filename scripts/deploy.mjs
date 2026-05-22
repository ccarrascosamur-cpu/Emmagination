#!/usr/bin/env node
/**
 * Script de deploy para Cloudflare Workers
 *
 * IMPORTANTE: El worker principal conectado a emmagination.cl es "emmagination" (default).
 * NO usar --env production, ya que eso deploya a "emmagination-production" que NO está
 * conectado al dominio.
 *
 * Uso:
 *   node scripts/deploy.mjs  → Deploy a producción (emmagination.cl)
 */

import { execSync } from 'node:child_process';

console.log(`🚀 Deploying to PRODUCTION (emmagination.cl)...\n`);

// Build
console.log('📦 Building...');
execSync('npm run build', { stdio: 'inherit' });

// Deploy al worker default "emmagination" (conectado a emmagination.cl)
// NUNCA usar --env production, eso deploya a otro worker no conectado al dominio
const command = 'npx wrangler deploy';

console.log(`\n🌐 Running: ${command}\n`);
execSync(command, { stdio: 'inherit' });

console.log(`\n✅ Deployed to PRODUCTION!`);
console.log(`🌐 URL: https://emmagination.cl`);
