# Guía de Configuración SEO - EMMAGINATION

## ✅ Optimizaciones Implementadas

### 1. Metadata y Open Graph
- [x] Títulos únicos por página (Home, Portafolio, Servicios, Proyectos)
- [x] Meta descriptions únicas y optimizadas
- [x] Keywords específicas por página
- [x] Canonical URLs correctas por ruta
- [x] Open Graph completo (title, description, image, url, type, locale)
- [x] Twitter Cards configuradas
- [x] Imagen OG optimizada 1200x630 (`og-default.jpg`)
- [x] hreflang alternates (es-CL, es, x-default)

### 2. Schema.org / JSON-LD
- [x] **WebSite** - En homepage
- [x] **Organization** (ProfessionalService) - En todas las páginas
  - Logo con dimensiones
  - ContactPoint
  - Address con Santiago
  - FoundingDate, numberOfEmployees
- [x] **LocalBusiness** - En todas las páginas
  - GeoCoordinates (Santiago)
  - OpeningHours
  - hasMap (Google Maps)
- [x] **Service** - En páginas de servicios
  - FAQPage con preguntas reales
  - Offers con CLP
- [x] **Article** - En páginas de proyectos (reemplazó CreativeWork)
  - datePublished, dateModified
  - Publisher con logo
  - author
- [x] **BreadcrumbList** - En todas las páginas
- [x] **WebPage** / **CollectionPage** - Según corresponda

### 3. Indexación
- [x] `robots.txt` mejorado con crawl-delay y directivas específicas
- [x] `sitemap.xml` con extensiones de imagen
- [x] `rss.xml` para feed de proyectos
- [x] 9 rutas prerenderizadas (HTML estático)
- [x] Sin duplicados de metadata

### 4. Google Analytics 4
- [x] Script de GA4 instalado en `index.html`
- [x] Tracking de page views en navegación SPA
- [x] Eventos personalizados:
  - `generate_lead` - CTA principal y WhatsApp
  - `contact` - Click en WhatsApp
  - `cta_click` - Botones del hero
  - `view_service` - Vista de página de servicio
  - `view_project` - Vista de caso de estudio
  - `scroll_depth` - 25%, 50%, 75%, 90%
  - `outbound_click` - Links externos

### 5. Performance
- [x] Imágenes de proyecto optimizadas (reducción de 70-90%)
- [x] Imagen OG en formato JPEG optimizado
- [x] Preconnect a Google Fonts

### 6. Web App Manifest
- [x] Manifest mejorado con categories, screenshots, purpose maskable

---

## 🔧 Pasos Pendientes (Requieren tu acción)

### 1. Google Analytics 4 - Measurement ID
**Archivo:** `index.html` (líneas ~59 y ~68)

Reemplaza `G-XXXXXXXXXX` con tu Measurement ID real de GA4:

1. Ve a [Google Analytics](https://analytics.google.com)
2. Crea una propiedad (o usa una existente)
3. Ve a Admin > Data Streams > Web
4. Copia el Measurement ID (formato: `G-XXXXXXXXXX`)
5. Reemplaza en `index.html`:

```html
<!-- Antes -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
gtag('config', 'G-XXXXXXXXXX', ...

<!-- Después -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123DEF4"></script>
gtag('config', 'G-ABC123DEF4', ...
```

**También actualiza:** `src/lib/ga4.ts` (línea 6)
```typescript
const GA4_MEASUREMENT_ID = 'G-ABC123DEF4';
```

### 2. Google Search Console - Verificación
**Archivo:** `index.html` (línea ~25)

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Añade tu propiedad: `emmagination.cl`
3. Elige método de verificación: **Meta tag**
4. Copia el código (ej: `abc123def456ghi789`)
5. Reemplaza en `index.html`:

```html
<!-- Antes -->
<meta name="google-site-verification" content="AQUI_TU_CODIGO_DE_VERIFICACION" />

<!-- Después -->
<meta name="google-site-verification" content="abc123def456ghi789" />
```

### 3. Enviar Sitemap a Google
Una vez verificada la propiedad:

1. En Search Console, ve a **Sitemaps**
2. Añade: `https://emmagination.cl/sitemap.xml`
3. Click en **Submit**

### 4. Verificar en Google Search Console
- Ve a **URL Inspection**
- Inspecciona: `https://emmagination.cl/`
- Verifica que aparezca "URL is on Google"
- Revisa la sección "Enhancements" para ver los schemas detectados

---

## 📊 Eventos GA4 Configurados

| Evento | Trigger | Parámetros |
|--------|---------|------------|
| `page_view` | Navegación SPA | page_path, page_title |
| `generate_lead` | Click CTA / WhatsApp | currency, value, lead_source |
| `contact` | Click WhatsApp | contact_method |
| `cta_click` | Click botón hero | button_text, location |
| `view_service` | Carga página servicio | service_name |
| `view_project` | Carga página proyecto | project_name |
| `scroll_depth` | Scroll 25/50/75/90% | depth_percent |

---

## 🚀 Deploy

Después de hacer los cambios de GA4 y Search Console:

```bash
npm run build
# Subir dist/ a tu hosting (Cloudflare Pages, etc.)
```

---

## 📈 Próximos Pasos Recomendados

1. **Crear contenido de blog** - Artículos sobre diseño web, branding, SEO
2. **Backlinks** - Registrarse en directorios de agencias chilenas
3. **Google Business Profile** - Mantener activo con posts y reseñas
4. **Core Web Vitals** - Monitorear en Search Console después del deploy
5. **Search Console** - Revisar queries y CTR mensualmente
