# Prompt de Perfeccionamiento de Diseño y Responsividad — USS Consulta de Cursos

Copia todo el contenido a continuación de la línea divisoria y pégalo directamente en **Claude Code**.

---

Actúa como diseñador UI/UX y arquitecto frontend senior del Centro de Informática (CINF) de la Universidad Señor de Sipán. Responde y comenta el código en español.

## Estado Actual del Proyecto (¡IMPORTANTE! No reescribir backend ni BD)

Todo el trabajo estructural de datos y backend **YA ESTÁ TERMINADO Y FUNCIONANDO EN PRODUCCIÓN**:
1. **Base de Datos (Supabase):** La tabla `tbl_horarios_cursos` ya cuenta con todas sus columnas (`id`, `curso_id`, `ciclo` incluyendo `'noviembre'`, `anio`, `seccion`, `fecha_inicio`, `fecha_fin`, `turno`, `dias`, `hora_inicio`, `hora_fin`, `aula`, `cupos`, `cupos_disponibles`, `docente_id`, `link_aula`, `publicado`).
2. **Backend API (`ecosistema-cinf/backend`):** Endpoints `/api/horarios` públicos y administrativos funcionando con DTOs y validaciones.
3. **Panel Administrativo:** Módulo `HorariosManager.tsx` integrado en el ecosistema.
4. **Proxies en Vercel:** Las rutas `/consulta-cursos`, `/horarios`, `/horarios.html` y todos los assets (`/assets/css/`, `/assets/js/`, `/assets/img/`) están correctamente enrutados en `ecosistema-cinf/vercel.json`.

**TU ÚNICO OBJETIVO ES: Perfeccionar el diseño visual, la experiencia de usuario (UX) y la responsividad móvil en `uss-consulta-curso/`.**

---

## El Problema Crítico de Diseño Detectado (Mobile Viewport)

Al probar en dispositivos móviles y viewports reducidos (pantallas de 360px a 480px), se han detectado los siguientes defectos visuales:

1. **Desborde y corte de pestañas de ciclos (`Febrero` cortado a la mitad):**
   - En la cinta superior de `horarios.html`, los botones de meses (`Noviembre 35`, `Enero 16`, `Febrero 🔒`, etc.) no tienen un contenedor con scroll horizontal elástico (`min-width: 0`, `overflow-x: auto`, `-webkit-overflow-scrolling: touch`).
   - El botón del tercer mes queda cortado bruscamente contra el borde derecho del contenedor, dando un aspecto roto y sin indicación visual de que se puede deslizar.
2. **Falta de orden entre el selector de ciclos y el contador:**
   - La etiqueta `CICLO:` y el texto `Mostrando 35 de 35 secciones programadas` se apretujan o caen de forma desalineada en celulares.
3. **Cabecera de carrera rígida:**
   - El bloque que muestra `Carrera: Administración y Emprendimiento Ruta 3 (Empresariales)` junto al botón `Elegir otra carrera ✕` se desborda en dos líneas desiguales o empuja el botón fuera de la vista cómoda.
4. **Filtros amontonados:**
   - La barra con los 5 filtros (Búsqueda, Curso, Turno, Días, Modalidad y Reset) ocupa demasiado espacio vertical en móvil o se quiebra de forma desordenada en pantallas estrechas.
5. **Tabla de 12 columnas en pantallas pequeñas:**
   - La tabla con columnas (#, Curso, Sec, Inicio, Fin, Turno, Días, Horario, Aula, Cupos, Docente, Acceso) requiere una barra de scroll horizontal suave con aviso táctil claro, o una presentación visual adaptada para no generar desborde horizontal de la página completa (`horizontal page overflow`).

---

## Requerimientos de Diseño y Responsividad a Implementar

### 1. Pestañas de Ciclos tipo "Scrollable Pills" (Móvil y Desktop)
- En `horarios.html` y `assets/css/estilos.css`:
  - Envolver las pestañas en un contenedor con `min-width: 0; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;`.
  - Ocultar scrollbar antiestético o aplicar scrollbar fino de 3px (`scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent;`).
  - Cada pestaña (`.pestana-ciclo`) debe mantener `white-space: nowrap; flex-shrink: 0;`, con tamaño táctil accesible (mínimo 36px de alto en móvil) y espaciado consistente.
  - Los meses sin apertura (`.pestana-ciclo--bloqueada`) deben mantener su estilo atenuado con candado `🔒` y `disabled="true"`.
  - En móvil, mostrar el contador `Mostrando X de Y secciones` en una fila dedicada y sutil debajo de las pestañas, sin apretar los botones.

### 2. Banner de Carrera Adaptativo
- En resoluciones móviles (< 768px):
  - La fila del banner de carrera debe organizarse verticalmente:
    - Arriba: ícono 🎓 + Nombre de la carrera destacado en negrita.
    - Al medio: Badge de Ruta (ej. `Ruta 3`) y categoría `(Empresariales)` alineados con flexibilidad (`flex-wrap: wrap`).
    - Botón `Elegir otra carrera ✕`: compacto, con borde suave y alineado a la derecha o full width en pantallas muy estrechas (< 400px).

### 3. Barra de Filtros Inteligente y Compacta
- En móvil:
  - El buscador de texto debe ocupar el 100% del ancho (`col-12`) con ícono de lupa centrado.
  - Los desplegables (Curso, Turno, Días, Aula) deben organizarse en cuadrícula de 2 columnas (`col-6`) con `font-size: 12px` a `13px` y altura táctil cómoda (`min-height: 38px`).
  - El botón reset (`↺`) debe estar integrado armoniosamente junto a los filtros.

### 4. Tabla de Horarios Responsiva
- Contenedor `.tabla-horarios-wrap`:
  - `overflow-x: auto; -webkit-overflow-scrolling: touch;` garantizado para que nunca rompa el ancho del `<body>` del viewport móvil.
  - Indicador visual superior exclusivo para móvil:
    ```html
    <div class="d-flex d-md-none align-items-center justify-content-between px-3 py-1.5 bg-slate-50 border-bottom border-slate-100 text-muted" style="font-size:11px;">
        <span>👉 Desliza la tabla para ver turnos, horarios y cupos</span>
        <span class="fw-bold">⇄</span>
    </div>
    ```
  - Sticky headers en el `thead` para que no se pierdan los títulos de columna al hacer scroll vertical.
  - Badges bien dimensionados:
    - `.badge-cupos`: fondo verde menta suave (`#ecfdf5`), texto verde oscuro (`#065f46`), ícono `👥 30 cupos`.
    - Turnos: Mañana (dorado/ámbar suave), Tarde (azul cielo suave), Noche (púrpura tenue).
    - Modalidad Zoom: badge azul claro con ícono de cámara o Zoom.

### 5. Tarjeta de Selección en `index.html` (Mobile Polish)
- La cuadrícula de 8 meses (`grid-ciclos-compacto`):
  - En desktop: 4 columnas x 2 filas.
  - En tablet (576px a 991px): 2 columnas x 4 filas.
  - En móvil (< 575px): 1 columna fluida con padding táctil de 12px por tarjeta, texto grande y botones de acción claros.
- Tarjetas con `disabled="true"` cuando el ciclo dice `Próximamente`: deben tener opacidad 0.5, cursor `not-allowed`, y no activar hover.

---

## Reglas de Implementación en Código

1. **Ubicación de archivos:**
   - Estructura HTML: `uss-consulta-curso/horarios.html` y `uss-consulta-curso/index.html`.
   - Lógica JS: `uss-consulta-curso/assets/js/horarios.js` e `index.js`.
   - Estilos CSS: `uss-consulta-curso/assets/css/estilos.css`.
2. **Cero estilos inline innecesarios:** Todo el diseño responsivo debe vivir en `assets/css/estilos.css` bajo las media queries estándar:
   - `@media (max-width: 991px)` (Tablets)
   - `@media (max-width: 768px)` (Móviles estándar)
   - `@media (max-width: 480px)` (Móviles pequeños)
3. **No romper enlaces de proxy:** Los enlaces relativos deben ser `./` o `consulta-cursos` para que funcionen tanto localmente como bajo el proxy de Vercel en `https://informatica-uss.vercel.app/consulta-cursos`.
4. **Prueba visual:** Tras aplicar los cambios, abre la página en el navegador en modo responsive (iPhone SE 375px y iPhone 14 390px) y confirma que **las pestañas se pueden deslizar libremente con el dedo sin cortarse**, que no hay desborde horizontal de la página y que los textos se leen con total nitidez.
