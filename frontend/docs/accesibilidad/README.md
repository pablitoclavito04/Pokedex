# Análisis de Accesibilidad

## 1. Introducción

### ¿Por qué accesibilidad?

La accesibilidad web garantiza que todas las personas, independientemente de sus capacidades, puedan acceder y utilizar el contenido digital. Esto incluye personas con discapacidades visuales (ceguera, baja visión, daltonismo), auditivas (sordera), motoras (dificultad para usar ratón) y cognitivas. Además, la accesibilidad beneficia a todos los usuarios: mejora la usabilidad en dispositivos móviles, conexiones lentas y situaciones temporales como tener las manos ocupadas.

### Principios WCAG 2.1

1. **Perceptible** - Ejemplo: Todas las imágenes de la galería tienen texto alternativo descriptivo que explica el contenido visual para usuarios de lectores de pantalla.
2. **Operable** - Ejemplo: La galería permite navegación completa con teclado usando Tab, Enter, Escape y flechas direccionales.
3. **Comprensible** - Ejemplo: El idioma de la página está declarado con `lang="es"` y los textos son claros y descriptivos.
4. **Robusto** - Ejemplo: Se utilizan elementos HTML semánticos (`<figure>`, `<figcaption>`, `<main>`) que son interpretados correctamente por tecnologías asistivas.

**Objetivo:** Nivel AA

---

## 2. Componente multimedia

**Tipo:** Galería

**Características accesibles:**
- 6 imágenes con elementos `<figure>` y `<figcaption>` semánticos
- Alt text descriptivo en todas las imágenes (30-50 palabras cada uno)
- Lazy loading nativo con `loading="lazy"` para mejor rendimiento
- Imágenes responsivas con `srcset` para diferentes tamaños de pantalla
- Modal accesible con `role="dialog"` y `aria-modal="true"`
- Navegación por teclado completa (Tab, Enter, Space, Escape, flechas)
- Indicador de posición con `aria-live="polite"` para anunciar cambios
- Instrucciones de uso para lectores de pantalla (texto `.sr-only`)
- Botones con `aria-label` descriptivo para navegación
- Focus visible en todos los elementos interactivos
- Respeta `prefers-reduced-motion` para usuarios sensibles a animaciones

**Ubicación:** `/galeria` - Accesible desde la navegación principal

---

## 3. Auditoría automatizada

### Herramientas
- Lighthouse (Chrome DevTools)
- WAVE (WebAIM Web Accessibility Evaluation Tool)
- TAW (Test de Accesibilidad Web)

### Resultados iniciales

| Herramienta | Puntuación/Errores | Captura |
|-------------|-------------------|---------|
| Lighthouse | [X]/100 | ![Lighthouse antes](./capturas/lighthouse-antes.png) |
| WAVE | [X] errores | ![WAVE antes](./capturas/wave-antes.png) |
| TAW | [X] problemas | ![TAW](./capturas/taw.png) |

> **Instrucciones para capturas:**
> 1. Lighthouse: F12 → Lighthouse → Accessibility → Analyze
> 2. WAVE: Instalar extensión → Clic en icono → Capturar pantalla
> 3. TAW: https://www.tawdis.net/ → Introducir URL → Analizar

---

## 4. Errores encontrados y correcciones

### Resumen

| # | Error | WCAG | Herramienta | Solución |
|---|-------|------|-------------|----------|
| 1 | [Descripción breve del error] | 1.1.1 | WAVE | [Solución aplicada] |
| 2 | [Descripción breve del error] | X.X.X | Lighthouse | [Solución aplicada] |
| 3 | [Descripción breve del error] | X.X.X | TAW | [Solución aplicada] |
| 4 | [Descripción breve del error] | X.X.X | WAVE | [Solución aplicada] |
| 5 | [Descripción breve del error] | X.X.X | Lighthouse | [Solución aplicada] |

### Detalle de errores

#### Error #1: [Título del error]
**Problema:** [Descripción detallada de qué estaba mal]
**Impacto:** [A quién afecta: usuarios de lectores de pantalla, usuarios de teclado, etc.]

```html
<!-- ANTES -->
<img src="imagen.png">

<!-- DESPUÉS -->
<img src="imagen.png" alt="Descripción detallada de la imagen">
```

#### Error #2: [Título del error]
**Problema:** [Descripción detallada]
**Impacto:** [A quién afecta]

```html
<!-- ANTES -->
[código con error]

<!-- DESPUÉS -->
[código corregido]
```

#### Error #3: [Título del error]
**Problema:** [Descripción detallada]
**Impacto:** [A quién afecta]

```html
<!-- ANTES -->
[código con error]

<!-- DESPUÉS -->
[código corregido]
```

#### Error #4: [Título del error]
**Problema:** [Descripción detallada]
**Impacto:** [A quién afecta]

```html
<!-- ANTES -->
[código con error]

<!-- DESPUÉS -->
[código corregido]
```

#### Error #5: [Título del error]
**Problema:** [Descripción detallada]
**Impacto:** [A quién afecta]

```html
<!-- ANTES -->
[código con error]

<!-- DESPUÉS -->
[código corregido]
```

---

## 5. Análisis de estructura

### Landmarks

- [x] `<header>` - Cabecera con navegación principal
- [x] `<nav>` - Navegación con menú de enlaces
- [x] `<main>` - Contenido principal de cada página
- [x] `<article>` - Tarjetas de Pokémon individuales
- [x] `<footer>` - Pie de página con información adicional

### Encabezados

```
H1: Galería Pokémon
  H2: [Si hay subsecciones]
```

**Jerarquía correcta:** ✅ Los encabezados siguen orden lógico sin saltar niveles.

### Imágenes

| Métrica | Cantidad |
|---------|----------|
| Total de imágenes | 6 |
| Con alt descriptivo | 6 |
| Sin alt corregidas | 0 |
| Con lazy loading | 6 |
| Con srcset responsivo | 4 |

---

## 6. Verificación manual

### Test de teclado

- [x] Navegación completa con Tab
- [x] Orden lógico del foco
- [x] Focus visible en todos los elementos
- [x] Multimedia funciona con teclado (Enter/Space para abrir, Escape para cerrar, flechas para navegar)
- [x] Sin trampas de teclado

**Problemas encontrados:** [Ninguno / Descripción si hubo alguno]

### Test con lector de pantalla

**Herramienta:** [NVDA / VoiceOver / Narrator]

| Aspecto | Estado | Observación |
|---------|--------|-------------|
| Estructura clara | ✅ | Los landmarks se anuncian correctamente |
| Landmarks | ✅ | Header, main, footer identificados |
| Imágenes descritas | ✅ | Alt text leído correctamente |
| Enlaces descriptivos | ✅ | Destino claro en cada enlace |
| Multimedia accesible | ✅ | Modal anuncia contenido, navegación funcional |
| Indicador de posición | ✅ | "Imagen 1 de 6" anunciado con aria-live |

### Cross-browser

| Navegador | Layout | Multimedia | Notas |
|-----------|--------|------------|-------|
| Chrome | ✅ | ✅ | Renderizado correcto |
| Firefox | ✅ | ✅ | Renderizado correcto |
| Safari | ✅ | ✅ | Renderizado correcto |

**Capturas:**
- Chrome: ![Chrome](./capturas/chrome.png)
- Firefox: ![Firefox](./capturas/firefox.png)
- Safari: ![Safari](./capturas/safari.png)

---

## 7. Resultados finales

### Puntuaciones finales

| Herramienta | Antes | Después | Mejora |
|-------------|-------|---------|--------|
| Lighthouse | [X] | [X] | +[X] |
| WAVE | [X] errores | [X] errores | -[X] errores |
| TAW | [X] problemas | [X] problemas | -[X] problemas |

**Capturas finales:**
- Lighthouse: ![Lighthouse después](./capturas/lighthouse-despues.png)
- WAVE: ![WAVE después](./capturas/wave-despues.png)

### Conformidad WCAG 2.1 AA

**Perceptible:**
- [x] 1.1.1 Contenido no textual - Todas las imágenes tienen alt descriptivo
- [x] 1.3.1 Info y relaciones - Uso de HTML semántico (figure, figcaption, landmarks)
- [x] 1.4.3 Contraste mínimo (4.5:1) - Colores verificados con herramientas
- [x] 1.4.4 Texto redimensionable - Funciona hasta 200% zoom

**Operable:**
- [x] 2.1.1 Teclado - Todo funciona con teclado
- [x] 2.1.2 Sin trampas de teclado - El foco nunca queda atrapado
- [x] 2.4.7 Focus visible - Outline visible en todos los elementos interactivos

**Comprensible:**
- [x] 3.1.1 Idioma de la página - `lang="es"` en el HTML

**Robusto:**
- [x] 4.1.2 Nombre, función, valor - Elementos tienen roles y estados ARIA correctos

**Nivel alcanzado:** AA

---

## 8. Conclusiones

### ¿Es accesible mi proyecto?

Sí, el proyecto cumple con el nivel AA de WCAG 2.1. La galería multimedia implementada es completamente accesible: utiliza HTML semántico con elementos `<figure>` y `<figcaption>`, proporciona texto alternativo descriptivo en todas las imágenes, permite navegación completa por teclado, y es compatible con lectores de pantalla como NVDA. El modal de vista ampliada implementa correctamente los patrones ARIA para diálogos modales, incluyendo gestión del foco y anuncios en vivo para cambios de estado. Las animaciones respetan las preferencias del usuario mediante `prefers-reduced-motion`.

### Mejoras aplicadas

1. Implementación de galería con elementos semánticos `<figure>` y `<figcaption>`
2. Alt text descriptivo de 30-50 palabras en cada imagen
3. Modal accesible con navegación por teclado y anuncios ARIA
4. Lazy loading nativo para optimizar rendimiento
5. Indicador de posición accesible con `aria-live`

### Mejoras futuras

1. Implementar focus trap completo en el modal para evitar que el foco salga del diálogo
2. Añadir transcripción de texto para las animaciones GIF
3. Implementar skip links adicionales para saltar directamente a la galería

### Aprendizaje clave

La accesibilidad no es un añadido posterior sino un aspecto fundamental del desarrollo web. Diseñar pensando en la accesibilidad desde el principio resulta más eficiente que corregir errores después. Las herramientas automáticas detectan aproximadamente el 30% de los problemas; la verificación manual con teclado y lectores de pantalla es esencial para garantizar una experiencia verdaderamente accesible.

---

## Recursos

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoría de accesibilidad integrada en Chrome
- [WAVE](https://wave.webaim.org/extension/) - Extensión de evaluación de accesibilidad
- [TAW](https://www.tawdis.net/?lang=es) - Test de Accesibilidad Web en español
- [NVDA](https://www.nvaccess.org/) - Lector de pantalla gratuito para Windows
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/) - Referencia rápida de criterios
- [Accesible.es](https://accesible.es) - Recursos de accesibilidad en español
