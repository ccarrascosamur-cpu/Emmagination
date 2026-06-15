import { readFile, writeFile, copyFile, mkdir, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

// Create .htaccess for Hostinger after everything else
async function createHtaccess() {
  const htaccessContent = `# EMMAGINATION - Hostinger cPanel Configuration
# React Router SPA support + performance + security

# Enable rewrite engine
RewriteEngine On

# --- SPA Routing: Serve index.html for non-file, non-directory requests ---
# This allows React Router to handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# --- Redirect trailing slashes to non-trailing (SEO canonical) ---
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)/$ /$1 [L,R=301]

# --- Force HTTPS (uncomment after SSL is active in Hostinger) ---
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# --- Redirect www to non-www (SEO canonical - uncomment if needed) ---
# RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
# RewriteRule ^(.*)$ https://%1/$1 [L,R=301]

# --- Compression ---
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE application/xml application/rss+xml
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# --- Browser Caching ---
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
  
  # CSS & JS
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # HTML
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

# --- Security Headers ---
<IfModule mod_headers.c>
  # X-Frame-Options
  Header always set X-Frame-Options "SAMEORIGIN"
  
  # X-Content-Type-Options
  Header always set X-Content-Type-Options "nosniff"
  
  # Referrer Policy
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  
  # Permissions Policy
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# --- Disable server signature ---
ServerSignature Off
`;

  const htaccessPath = path.join(distDir, '.htaccess');
  await writeFile(htaccessPath, htaccessContent, 'utf8');
  console.log('✅ Created .htaccess for Hostinger');
}

// Fix asset paths in index.html for subdirectory hosting if needed
async function fixAssetPaths() {
  const indexPath = path.join(distDir, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  
  // Ensure script src uses relative paths for maximum compatibility
  // Vite already does this, but double-check
  if (html.includes('src="/src/main.tsx"')) {
    html = html.replace('src="/src/main.tsx"', 'src="./src/main.tsx"');
    await writeFile(indexPath, html, 'utf8');
    console.log('✅ Fixed asset paths in index.html');
  }
}

// Verify all prerendered routes exist
async function verifyRoutes() {
  const requiredRoutes = [
    'index.html',
    'portafolio/index.html',
    'proyectos/portal-zen/index.html',
    'proyectos/sagrada-madre/index.html',
    'proyectos/fegar/index.html',
    'proyectos/ingles-rugby-club/index.html',
    'servicios/diseno-web/index.html',
    'servicios/branding/index.html',
    'servicios/seo/index.html',
    'servicios/index.html',
    'proceso/index.html',
    'testimonios/index.html',
    'contacto/index.html',
    'cotizar/index.html',
    'auditoria/index.html',
    'ads/landing/index.html',
    '404.html',
    'sitemap.xml',
    'robots.txt',
    'rss.xml',
    'content/site-data.json',
  ];
  
  let allGood = true;
  for (const route of requiredRoutes) {
    const fullPath = path.join(distDir, route);
    try {
      await readFile(fullPath);
    } catch {
      console.warn(`⚠️  Missing: ${route}`);
      allGood = false;
    }
  }
  
  if (allGood) {
    console.log('✅ All required routes verified');
  }
  
  return allGood;
}

// Copy content/site-data.json to dist/content/
async function copyContentJson() {
  const src = path.resolve(__dirname, '..', 'content', 'site-data.json');
  const destDir = path.join(distDir, 'content');
  const dest = path.join(destDir, 'site-data.json');
  try {
    await mkdir(destDir, { recursive: true });
    await copyFile(src, dest);
    console.log('✅ Copied content/site-data.json to dist/content/');
  } catch (e) {
    console.warn('⚠️  Could not copy site-data.json:', e.message);
  }
}

// Main
async function main() {
  console.log('🔧 Post-build for Hostinger...\n');

  await createHtaccess();
  await copyContentJson();
  await fixAssetPaths();
  const ok = await verifyRoutes();
  
  console.log('\n📦 Build ready for Hostinger!');
  console.log('📁 Upload the contents of dist/ to your public_html folder');
  
  if (!ok) {
    console.log('\n⚠️  Some files are missing - check warnings above');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
