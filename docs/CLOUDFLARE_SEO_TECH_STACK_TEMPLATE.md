# Cloudflare SEO Tech Stack Template

Plantilla tecnica para implementar SEO basico y medible en sitios estaticos o hibridos con Cloudflare Workers.

## Objetivo

Dejar una base reusable que cubra:

- indexacion
- metadata
- schema
- medicion
- compatibilidad con Cloudflare Workers

## Minimo obligatorio

- `robots.txt`
- `sitemap.xml`
- `title`
- `meta description`
- canonical
- Open Graph
- JSON-LD base
- GA4

## Estructura sugerida

- `worker.js`
- `wrangler.jsonc`
- `index.html`
- `js/seo.js` si hace falta centralizar metadata o schema
- `public/og-default.jpg` o equivalente

## `robots.txt`

Debe incluir al menos:

```txt
User-agent: *
Allow: /

Sitemap: https://tudominio.com/sitemap.xml
```

## `sitemap.xml`

Debe incluir:

- home
- paginas de servicio
- categorias o colecciones
- articulos si existen
- URLs canonicas finales

Si el sitio es chico, puede ser estatico.
Si el sitio es dinamico, puede generarse desde el Worker.

## Metadata base por pagina

Cada pagina importante debe definir:

- `title`
- `meta description`
- canonical
- `og:title`
- `og:description`
- `og:type`
- `og:image`
- `og:url`

## JSON-LD base recomendado

### Home de marca o negocio

- `Organization`
- `WebSite`

### Negocio local

- `LocalBusiness`

### Pagina de servicio

- `Service`
- `BreadcrumbList`

### Producto

- `Product`
- `BreadcrumbList`

## Google Analytics 4

Implementacion recomendada:

- usar `gtag.js`
- mantener el Measurement ID fuera del HTML duro cuando sea posible
- documentar donde se cambia

Eventos base sugeridos:

- `page_view`
- `generate_lead`
- `contact`
- `view_item`
- `begin_checkout`
- `purchase`

No implementar todos por defecto si el sitio no los necesita.

## Search Console

Soportar uno de estos metodos:

- meta tag en `<head>`
- DNS
- archivo de verificacion

Si el sitio usa Worker, asegurar que el metodo elegido no choque con el routing.

## Implementacion en Worker

El Worker debe poder:

- servir assets estaticos
- responder `/robots.txt`
- responder `/sitemap.xml`
- agregar headers SEO especiales solo si hacen falta

## Reglas

- no usar cloaking
- no usar texto oculto
- no inyectar schema falso
- no romper cache ni performance por una capa SEO innecesaria

## Modo de uso eficiente

Usar esta plantilla completa solo si:

- el usuario pide SEO
- el proyecto va a produccion
- hay que arreglar indexacion

Si el sitio aun esta en fase de maqueta, usar solo:

- titles
- metas
- canonical
- robots
- sitemap pendiente o stub
