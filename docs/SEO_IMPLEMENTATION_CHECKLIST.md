# SEO Implementation Checklist

Usa este checklist al final de cada sitio o cuando pidas una mejora SEO puntual.

## 1. Base tecnica

- `title` unico por pagina
- `meta description` unica por pagina
- canonical correcto por pagina
- Open Graph configurado
- Twitter Card configurado
- favicon y social preview definidos
- `lang` correcto en `<html>`
- status codes correctos
- URLs limpias y estables

## 2. Indexacion

- `robots.txt` disponible
- `sitemap.xml` disponible
- `sitemap.xml` declarado en `robots.txt`
- pagina no bloqueada por `noindex` accidental
- canonicals apuntan a la URL final correcta
- redirecciones resueltas sin cadenas innecesarias

## 3. Contenido y estructura

- un solo H1 por pagina
- H2/H3 en jerarquia coherente
- copy alineado con intencion de busqueda
- enlaces internos utiles
- alt text descriptivo en imagenes importantes
- FAQ solo si aporta valor real

## 4. Schema

- JSON-LD valido
- tipo correcto segun pagina:
  - `Organization`
  - `WebSite`
  - `LocalBusiness`
  - `Service`
  - `Product`
  - `BreadcrumbList`
  - `FAQPage`
  - `Article`
- no incluir datos falsos o inventados

## 5. Analytics y medicion

- GA4 instalado
- Measurement ID externalizado si es posible
- eventos base definidos si aplica
- exclusiones de trafico interno si aplica
- consentimiento o banner si el proyecto lo requiere

## 6. Search Console

- propiedad creada
- metodo de verificacion definido
- sitemap enviado
- dominio correcto en inspeccion

## 7. Performance SEO

- hero no bloquea render innecesariamente
- imagenes optimizadas
- fuentes controladas
- scripts de terceros minimizados
- HTML indexable en paginas criticas

## 8. Cloudflare Workers

- `worker.js` o entry equivalente sirve `robots.txt` y `sitemap.xml` correctamente
- `wrangler.jsonc` alineado con deploy real
- no depender de runtime Node
- headers SEO aplicados solo donde corresponde

## 9. Validacion final

- home validada
- pagina principal de conversion validada
- pagina secundaria validada
- metadata revisada en HTML final
- preview social revisada
- sitemap abre en navegador
- robots abre en navegador

## Regla de uso

No cargar este checklist completo al agente en cada proyecto.

Usarlo solo cuando:

- pidas auditoria SEO
- pidas implementacion SEO
- pidas QA previo a deploy
- pidas correccion de indexacion

Si no hay solicitud SEO explicita, basta con aplicar solo la base minima:

- title
- meta description
- canonical
- sitemap
- robots
- schema base
