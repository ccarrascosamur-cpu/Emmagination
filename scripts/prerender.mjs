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
    .replace('<!--app-head-->', headHtml)
    .replace('<!--app-html-->', appHtml);

  const outputPath = path.join(distDir, route.file);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>https://emmagination.ccarrascosamur.workers.dev${route.url}</loc>
    <changefreq>${route.url === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route.url === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

await rm(serverDir, { recursive: true, force: true });
