# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

Sitio web estático de **Smartjob** — empresa de servicios TI chilena con presencia en Chile, Colombia y EE.UU. No hay framework, bundler ni package.json: HTML + CSS + JS vanilla puro.

## Desarrollo local

```bash
# Servidor local (cualquiera sirve)
python3 -m http.server 8080
# O con Node:
npx serve .
```

Abrir `http://localhost:8080` en el navegador. No hay paso de build, lint ni tests.

## Páginas

| Archivo | Ruta | Propósito |
|---|---|---|
| `index.html` | `/` | Home: hero, servicios, stats, partners, misión/visión, red de impacto |
| `servicios.html` | `/servicios.html` | Detalle de los tres servicios (cards horizontales) |
| `smart-staffing.html` | `/smart-staffing.html` | Landing de Smart Staffing |
| `smart-cloud.html` | `/smart-cloud.html` | Landing de Smart Cloud |
| `se-smarter.html` | `/se-smarter.html` | Trabaja con nosotros (formulario de postulación) |
| `contacto.html` | `/contacto.html` | Formulario de contacto, dos columnas |

## Arquitectura CSS (`css/style.css`)

Un único archivo con tokens CSS en `:root`:

```css
--orange:   #F99C08   /* color primario, títulos, botones */
--teal:     #1BB9A5   /* color secundario, acentos */
--dark:     #0F0F0F
--muted:    #646466
--offwhite: #F8F8F8
--border:   #EEEEEE
```

**Tipografías**: `Host Grotesk` (cuerpo y headings, 400–800) + `Montserrat` (stats numéricos grandes). Cargadas desde Google Fonts.

**Clases utilitarias clave**: `.c-orange`, `.c-teal`, `.fw-700`, `.fw-800`, `.text-center`, `.container` (max 1336px), `.section` (padding vertical con clamp).

**Botones**: `.btn-orange` (relleno naranja), `.btn-orange-outline` (borde blanco sobre fondo oscuro), `.btn-white-pill` (blanco sobre oscuro).

## Arquitectura JS (`js/main.js`)

Vanilla JS sin dependencias externas. Seis módulos funcionales:

1. **Nav scroll** — agrega `.scrolled` al `#navbar` al pasar 50px. Las páginas internas tienen `scrolled` hardcodeado en el HTML desde el inicio.
2. **Mobile menu** — toggle de atributo `hidden` en `#mobile-menu`.
3. **Scroll reveal** — `IntersectionObserver` sobre `.reveal` → añade `.visible`. Los elementos pueden usar `style="--delay:100ms"` para escalonar.
4. **Counter animation** — anima `.stat-num` con `data-target`, `data-prefix`, `data-suffix`. Easing cúbico de 1800ms.
5. **Form feedback** — IDs de formularios: `smarter-form`, `contact-form`, `newsletter-form`. Submit previene default, muestra "✓ Enviado" 3s y hace reset. Los formularios **no tienen backend real**.
6. **WhatsApp bubble** — componente `#wa-bubble` con popup `#wa-popup`. Enlace a `wa.me/56957689050`.

**Contact preselector**: `contacto.html?s=staffing` o `?s=cloud` pre-marca el checkbox correspondiente (`#chip-staffing`, `#chip-cloud`).

## Convenciones del diseño

- El diseño replica fielmente el wireframe Figma (`188:5`). Los comentarios en el HTML incluyen coordenadas Figma como referencia.
- Todas las páginas comparten el mismo `<header>` nav y `<footer>` — se duplican manualmente (no hay include/template).
- El footer incluye la burbuja de WhatsApp y es idéntico en todas las páginas.
- Imágenes decorativas usan `aria-hidden="true"` y `alt=""`.
- El favicon es `assets/img/hormiga%20logo.svg`.
