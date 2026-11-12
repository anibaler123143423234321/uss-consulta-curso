---
name: uss-consulta-curso
description: >-
  Manual del portal público "Consulta de Horarios y Cursos" del Centro de Informática USS (uss-consulta-curso).
  Usar al cambiar su diseño, cargar los horarios de un ciclo nuevo, tocar filtros, carreras, rutas o su despliegue.
---

# Consulta de Horarios y Cursos — Centro de Informática USS

Portal público donde el estudiante elige su carrera, luego un ciclo de apertura y ve las secciones programadas (curso, PEAD, fechas, turno, días, horario, aula, cupos, docente y acceso).

- **Producción:** `https://informatica-uss.vercel.app/consulta-cursos` (proxy definido en `ecosistema-cinf/vercel.json`).
- **Despliegue propio:** `https://uss-consulta-curso.vercel.app` (repositorio `anibaler123143423234321/uss-consulta-curso`, rama `main`).
- **Datos:** API `GET /api/horarios` del ecosistema (tabla `tbl_horarios_cursos` en Supabase).

## 1. Stack y reglas de código

- HTML estático + Bootstrap (`assets/css/bootstrap.min.css`) + JavaScript puro. Sin frameworks ni compilación.
- **Nada en línea:** ni `<style>`, ni `style=""`, ni `<script>` dentro del HTML. Estilos en `assets/css/estilos.css`, lógica en `assets/js/`.
- No uses clases que Bootstrap 5.0.0-beta1 no define (`gap-2.5`, `rounded-8`, `text-xs`, `py-1.5`…): no hacen nada. Crea la clase en `estilos.css`.
- Textos y comentarios en español. Los comentarios explican el porqué.
- No inventes cursos, horarios, docentes ni precios. Si falta un dato, pídelo.

## 2. Archivos

| Archivo | Para qué |
|---|---|
| `index.html` + `assets/js/index.js` | Portada: paso 1 elegir carrera (combobox), paso 2 elegir ciclo. |
| `horarios.html` + `assets/js/horarios.js` | Tabla de secciones del ciclo, pestañas de ciclos, filtros, ayuda. |
| `assets/js/datos.js` | Ciclos, rutas por carrera, cursos para todos, especialidades y **copia de respaldo** de horarios. |
| `assets/css/estilos.css` | Todo el diseño propio. |
| `documentos/` | Fuentes oficiales (PDF de Canva por ciclo). |
| `sql/` | Scripts que el usuario ejecuta en Supabase para cargar o corregir un ciclo. |

## 3. Cómo llegan los datos

1. `horarios.js` pide `GET /api/horarios`. Si responde con filas, **usa solo la API**.
2. Si la API falla o viene vacía, usa `horarios` de `datos.js` y lo avisa en ámbar («se muestra la última copia guardada»).
3. `index.js` (la portada) cuenta secciones **solo desde `datos.js`**, no desde la API.

Consecuencia: al cargar o corregir un ciclo hay que actualizar **los dos lados**: la base (con un SQL) y `datos.js`. Si no, la portada y la tabla muestran números distintos.

La API devuelve nombres como «Word 365 (Protech XP)»; `limpiarCurso()` en `horarios.js` quita el sufijo para que coincidan con las rutas.

## 4. Reglas de negocio

- **Ciclos de apertura:** Noviembre y Enero (6 semanas), Febrero 2 meses, Abril 3 meses, Mayo 2 meses, Agosto 1 mes, Setiembre 3 meses, Octubre 2 meses.
- **7 rutas por carrera** en `datos.js` (`rutas`). Una carrera puede estar en dos rutas (Ingeniería de Sistemas: 5 y 7; Arquitectura: 4 y 6): ve los cursos de ambas.
- **`cursosParaTodos`:** Computación II, Computación III y Taller de Certificación Internacional se muestran a cualquier carrera.
- **Grupos por especialidad (`especialidades`):** una sección cuya PEAD lleva la sigla o el nombre solo la ve su carrera, mediante `seccionVisible(seccion, carrera)`:
  - CIV / Civil → Ingeniería Civil
  - SIST / Sistemas → Ingeniería de Sistemas e Ingeniería de Software
  - MEC / Mecánica → Ingeniería Mecánica Eléctrica
  - ARQ / Arquitectura → Arquitectura y Arquitectura y Diseño de Interiores
- **Un ciclo sin secciones para la carrera** no aparece como tarjeta en la portada (va a la línea «Próximamente») y en `horarios.html` su pestaña sale con candado.
- **Historial:** cargar un ciclo nuevo agrega filas con su `ciclo` y `anio`. No se borran cursos ni otros ciclos.
- **Contacto oficial:** WhatsApp 986 724 506 (`https://wa.me/51986724506`) y `centro.informatica@uss.edu.pe`.

## 5. Cargar los horarios de un ciclo nuevo

1. Consigue la fuente oficial (PDF de Canva o la hoja de Google) y guárdala en `documentos/`.
2. **Transcribe leyendo cada página**, no de memoria ni por patrón. Convierte el PDF a imágenes y compara fila por fila: curso, PEAD, turno, días y horario. En noviembre 2026 una carga automática dejó 45 filas con días y cursos equivocados.
3. Escribe `sql/<ciclo>_<año>_horarios_reales.sql`:
   - Una transacción (`BEGIN … COMMIT`).
   - Borra solo `ciclo = X AND anio = Y`.
   - Inserta uniendo por `tbl_cursos_cinf.code` (XP-W365, XP-E365, XP-CANVA, CERT-EXCEL, CERT-WORD, ESP-CAD2D, ESP-CAD3D, ESP-WEB, ESP-PBI, COMP-02, COMP-03, CERT-TALLER), nunca por `id`.
   - Termina con una consulta de comprobación que diga cuántas filas debe haber.
4. La tabla exige `UNIQUE (curso_id, ciclo, anio, seccion)`. Si un curso repite letra (Computación II «PEAD b» de Mecánica y de Arquitectura), diferencia la sección: `PEAD b (Mecánica)`, `PEAD D (Word)`.
5. `aula` solo admite `Virtual` o `Presencial`; `turno` solo `Mañana`, `Tarde` o `Noche`.
6. Actualiza las mismas filas en `datos.js` y agrega el ciclo a `ciclos` si es nuevo.
7. **El usuario ejecuta el SQL en Supabase.** Tú no lo ejecutas.
8. Después verifica con `curl https://informatica-uss.vercel.app/api/horarios` que el conteo por curso coincide con la fuente.

## 6. Diseño y responsividad

- Identidad: azul USS `#073299`, tipografía Plus Jakarta Sans, misma portada que el Portal GEX.
- **Portada:** solo tarjetas de ciclos activos, con año, fechas de clases, y «N cursos · N secciones».
- **Horarios, escritorio y tablet:** tabla con cabecera fija dentro de una caja con un solo scroll; `ajustarCajaTabla()` calcula su alto para que la página no tenga doble scroll. El aviso «👉 Desliza la tabla…» aparece solo si la tabla realmente se desliza (clase `se-desliza`).
- **Horarios, celular (< 768 px):** cada sección es una tarjeta; las etiquetas salen de `data-label`. No debe existir scroll horizontal de página.
- **Pestañas de ciclos:** carril deslizable con degradado en el borde; la activa se centra sola.
- **Filtros:** cada opción muestra su conteo según los demás filtros, las de cero se deshabilitan, los activos aparecen como fichas, viajan en la URL (`q`, `curso`, `turno`, `dias`, `aula`) y el texto buscado se resalta. La tecla `/` enfoca el buscador.
- **Orden de la tabla:** por curso en el orden de la ruta y luego por sección (a, b… z, aa, ab…).
- Probar siempre en 360, 375, 820, 1024 y 1366 px, y comprobar `document.documentElement.scrollWidth === innerWidth`.

## 7. Enlaces y despliegue

- `horarios.js` decide a dónde vuelve «Elegir otra carrera»: `./` dentro de `/consulta-cursos`, `consulta-cursos` en el dominio unificado, e `index.html` en local o en el despliegue propio. No lo dejes fijo: en Live Server daba 404.
- La base de la API se resuelve sola: `http://localhost:4000/api` en local, `/api` en Vercel.
- Los proxies de `/consulta-cursos`, `/horarios.html` y `/assets/(css|js|img)` están en `ecosistema-cinf/vercel.json`. Un archivo nuevo en `assets/` con otro nombre o carpeta necesita su regla ahí.
- Al cambiar CSS o JS, sube el `?v=` en `index.html` y `horarios.html`.
- `main` despliega a producción. Confirma y sube solo cuando el usuario lo pida.

## 8. Errores que ya pasaron (no repetir)

- **`index.html` vacío en producción:** se reescribió el archivo con `open(ruta, 'w').write(open(ruta).read()…)`; abrir en modo escritura lo trunca antes de leerlo. Lee primero a una variable y luego escribe. Después de tocar un HTML, comprueba que no pese 0 bytes.
- **`estilos.css` pisado con una versión vieja:** ocurre si otra herramienta o IA tiene el archivo abierto y guarda encima. Si el diseño aparece «en crudo», compara con `git diff` y restaura con `git checkout -- assets/css/estilos.css`.
- **Diseño nuevo que no se ve:** el navegador sirve el CSS en caché. Sube el `?v=` y recarga con `Cmd + Shift + R`.
- **Ciclo mal etiquetado:** noviembre estuvo guardado como `setiembre` en la base; por eso su pestaña salía con candado.
- **Horas en conflicto entre fuentes:** para enero 2027 la hoja «Horarios enero 2027» manda (Computación II y III terminan 10:30 p. m.). Si dos fuentes discrepan, pregunta cuál rige.

## 9. Verificación antes de dar algo por terminado

1. `node --check assets/js/datos.js assets/js/index.js assets/js/horarios.js`.
2. `wc -c index.html horarios.html` (ninguno en 0).
3. Abrir en el navegador portada y horarios, en celular y escritorio, sin errores en consola.
4. Probar al menos: Derecho, Ingeniería de Sistemas, Ingeniería Civil, Ingeniería Mecánica Eléctrica y Arquitectura, y confirmar qué grupos de especialidad ve cada una.
5. Si hubo cambio de datos: comparar la API con la fuente oficial, curso por curso.
