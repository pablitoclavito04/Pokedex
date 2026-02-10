# PRUEBA-PRACTICA-DIW

## 1. Arquitectura de estilos.

### Variables nuevas:

Se han añadido 2 variables de color en `src/styles/00-settings/_variables.scss`:

- `$color-stat-bar: #38bdf8` - Color azul claro para las barras de estadísticas.
- `$color-team-highlight: #a78bfa` - Color morado para bordes y hover de las tarjetas de miembros.

### ITCSS:

Se ha hecho `src/styles/06-components/_team-stats.scss` con todos los estilos del componente team-stats. Este se importa en el manifiesto `styles.scss` en la capa de componentes, respetando el orden de la cascada


El componente Angular no tiene `styleUrls`, los estilos vienen del parcial global.

## 2. BEM y estados:

Se usa BEM en todo el HTML:
- Bloque: `.team-stats`
- Elementos: `__member-card`, `__bar-fill`, `__type-badge`, `__summary-item`
- Modificadores: `--strong`, `--weak`, `--small`


## 3. Layout responsive

El grid de miembros usa CSS Grid con 3 breakpoints:
- Escritorio: `grid-template-columns: repeat(3, 1fr)`
- Tablet (768px): `repeat(2, 1fr)`
- Movil (480px): `1fr` (1 columna, tarjetas con flexbox en fila)

Cada tarjeta de miembro usa Flexbox (`flex-direction: column`), y en movil cambia a `flex-direction: row` para apilar lateralmente.

## 4. HTML semantico

Se usan etiquetas HTML5: `<section>`, `<article>`, `<figure>`, `<footer>`, `<ul>`, `<li>`, `<dl>`, `<dt>`, `<dd>`, `<strong>` en vez de `<div>` genericos.

## Justificacion DIW

**Arquitectura:** Las variables estan en Settings porque es la capa de menor especificidad, y los estilos del componente en Components porque tienen mayor especificidad. Si importara Components antes que Settings, las variables no existirian al compilar y el SCSS daria error.

**Metodologia:** BEM me ha servido para que los selectores sean sin anidamiento. Con `div > button` si cambias la estructura HTML se rompe el CSS. Con `.team-stats__member-card` da igual donde este el elemento, siempre funciona.
