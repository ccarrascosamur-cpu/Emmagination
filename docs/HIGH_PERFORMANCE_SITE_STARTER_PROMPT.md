# High Performance Site Starter Prompt

Usa este prompt para crear un sitio nuevo con buen nivel visual, estructura tecnica limpia y SEO suficiente sin cargar instrucciones avanzadas innecesarias.

## Prompt base

Quiero que construyas este sitio completo y lo dejes listo para GitHub y Cloudflare.

Antes de empezar, debes preguntarme primero:

`¿Este sitio es una landing page simple o un sitio con backend autoadministrable?`

Reglas base:

- prioriza una experiencia visual fuerte y no generica
- deja el sitio responsive
- deja deploy compatible con Cloudflare
- usa una estructura mantenible
- aplica SEO base obligatoria:
  - `title`
  - `meta description`
  - canonical
  - Open Graph
  - JSON-LD base
  - `robots.txt`
  - `sitemap.xml`
- no actives auditoria SEO competitiva completa salvo que yo lo pida
- no agregues GA4, Search Console ni eventos avanzados salvo que yo lo pida o el proyecto ya este en etapa de produccion

Si es `landing page simple`:

- no crear backend
- no crear KV
- no crear `/admin`
- dejar deploy estatico limpio

Si es `sitio con backend autoadministrable`:

- crear frontend estatico
- crear `/admin`
- crear backend con Cloudflare Worker
- crear persistencia con Cloudflare KV
- usar endpoint `GET /api/data`
- usar endpoint `POST /api/data`
- usar binding `SITE_DATA`
- usar variables `SITE_ADMIN_USER` y `SITE_ADMIN_PASSWORD`

Entregables:

- codigo implementado
- archivos clave creados
- instrucciones de deploy
- validaciones pendientes

## Activador SEO avanzado

Solo cuando yo escriba algo como:

- `aplica mejora seo`
- `haz auditoria seo`
- `implementa seo competitivo`
- `prepara indexacion y analytics`

ahi debes cargar tambien estas referencias:

- [SEO_COMPETITIVE_AGENT_PROMPT.md](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/SEO_COMPETITIVE_AGENT_PROMPT.md)
- [SEO_IMPLEMENTATION_CHECKLIST.md](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/SEO_IMPLEMENTATION_CHECKLIST.md)
- [CLOUDFLARE_SEO_TECH_STACK_TEMPLATE.md](C:/Users/churr/OneDrive/Desktop/Visual%20Studio/CLOUDFLARE_SEO_TECH_STACK_TEMPLATE.md)

## Uso recomendado

Fase 1:

- construir rapido con SEO base

Fase 2:

- cuando el sitio ya existe y valga la pena, pedir SEO avanzado

Fase 3:

- antes de deploy final, correr checklist SEO y medicion
