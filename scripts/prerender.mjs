import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const serverDir = path.join(distDir, 'server');

const template = await readFile(path.join(distDir, 'index.html'), 'utf8');
const serverEntryUrl = pathToFileURL(path.join(serverDir, 'entry-server.js')).href;
const { render, getPrerenderRoutes } = await import(serverEntryUrl);
const routes = getPrerenderRoutes();

for (const route of routes) {
  const { appHtml, headHtml } = render(route.url);
  const html = template
    .replace(/<!--app-seo-fallback-start-->[\s\S]*?<!--app-seo-fallback-end-->\r?\n?/, '')
    .replace('<!--app-head-->', headHtml)
    .replace('<!--app-html-->', appHtml);

  const outputPath = path.join(distDir, route.file);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
}

const now = new Date().toISOString().split('T')[0];

// Build enhanced sitemap with image support
function buildSitemap(routes) {
  const urlEntries = routes.map((route) => {
    const priority = route.url === '/' 
      ? '1.0' 
      : route.url.startsWith('/servicios/') 
        ? '0.9' 
        : route.url.startsWith('/proyectos/') 
          ? '0.8' 
          : '0.8';
    
    const changefreq = route.url === '/' ? 'weekly' : 'monthly';
    
    // Add image sitemap for project pages
    let imageXml = '';
    if (route.url.startsWith('/proyectos/')) {
      const slug = route.url.replace('/proyectos/', '');
      const imageMap = {
        'portal-zen': '/images/project-portalzen.jpg',
        'sagrada-madre': '/images/project-sagradamadre.jpg',
        'fegar': '/images/project-fegar.jpg',
        'ingles-rugby-club': '/images/project-irc.jpg',
      };
      const imgPath = imageMap[slug];
      if (imgPath) {
        imageXml = `
    <image:image>
      <image:loc>https://emmagination.cl${imgPath}</image:loc>
      <image:title>Caso de estudio ${slug.replace(/-/g, ' ')}</image:title>
      <image:caption>Proyecto de diseño web y branding desarrollado por EMMAGINATION</image:caption>
    </image:image>`;
      }
    }

    return `  <url>
    <loc>https://emmagination.cl${route.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries.join('\n')}
</urlset>`;
}

const sitemap = buildSitemap(routes);
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

// Enhanced robots.txt with more directives
const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /404.html
Disallow: /*?*

# Crawl-delay for major bots
User-agent: AhrefsBot
Crawl-delay: 2

User-agent: SemrushBot
Crawl-delay: 2

User-agent: MJ12bot
Crawl-delay: 2

# Allow Google full access
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /images/

Host: emmagination.cl
Sitemap: https://emmagination.cl/sitemap.xml
`;

await writeFile(path.join(distDir, 'robots.txt'), robots, 'utf8');

// Generate RSS feed for projects
const rssItems = routes
  .filter(r => r.url.startsWith('/proyectos/'))
  .map(r => {
    const slug = r.url.replace('/proyectos/', '');
    const titleMap = {
      'portal-zen': 'Caso Portal Zen | E-commerce Shopify y Branding',
      'sagrada-madre': 'Caso Sagrada Madre | Diseño Web y Branding E-commerce',
      'fegar': 'Caso Fegar | Landing Page Corporativa y Branding',
      'ingles-rugby-club': 'Caso Inglés Rugby Club | Web Institucional con Panel',
    };
    return `    <item>
      <title>${titleMap[slug] || slug}</title>
      <link>https://emmagination.cl${r.url}</link>
      <guid>https://emmagination.cl${r.url}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Caso de estudio de diseño web y branding desarrollado por EMMAGINATION</description>
    </item>`;
  });

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EMMAGINATION | Portafolio de Proyectos</title>
    <link>https://emmagination.cl/portafolio</link>
    <description>Casos de diseño web, branding y desarrollo digital en Chile</description>
    <language>es-CL</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://emmagination.cl/rss.xml" rel="self" type="application/rss+xml" />
${rssItems.join('\n')}
  </channel>
</rss>`;

await writeFile(path.join(distDir, 'rss.xml'), rss, 'utf8');

await rm(serverDir, { recursive: true, force: true });

console.log(`✅ Prerendered ${routes.length} routes`);
console.log('✅ Generated sitemap.xml with image extensions');
console.log('✅ Generated robots.txt with enhanced directives');
console.log('✅ Generated rss.xml feed');
