# Prompt de continuación — Horarios de cursos y asignación de docentes

Copia todo lo que está debajo de la línea y pégalo en la otra IA.

---

Actúa como arquitecto full stack del Centro de Informática (CINF) de la Universidad Señor de Sipán. Responde y comenta el código en español.

## Objetivo

El panel administrativo debe poder **guardar los horarios de cada ciclo**: secciones, fechas de inicio y fin, turnos, días, horario, aula, docente y link del aula. La página pública de consulta debe mostrar esos horarios. Hoy nada de eso se guarda: hay que construirlo.

## Contexto

Dos proyectos en `/Users/dagnerchumanlluen/Documents/USS/`:

1. **`ecosistema-cinf/`** — panel administrativo en producción (React 19 + Vite + Tailwind, API Express en `backend/`, Supabase). **Lee primero** `ecosistema-cinf/CLAUDE.md` y los dos archivos que referencia (`AGENTS.md` y `ARQUITECTURA.md`): fijan las capas, el sistema de diseño, las migraciones y las reglas de git.
2. **`uss-consulta-curso/`** — página pública estática (HTML + Bootstrap + JavaScript puro, sin compilación). Ya funciona con datos provisionales:
   - `index.html`: paso 1 con los ciclos de apertura; al hacer clic se abre una hoja con aspecto de Excel.
   - `assets/js/datos.js`: ciclos, las 7 rutas por carrera y 3 secciones de ejemplo de enero.
   - `assets/js/app.js`: pinta ciclos, tabla, filtros (carrera, turno, texto) y pestañas inferiores.
   - Un ciclo sin horarios muestra solo «Próximamente…».
   - Regla: nada de estilos ni scripts en línea; CSS en `assets/css/`, JS en `assets/js/`.

## Estado real de Supabase (consultado por el usuario)

- La única tabla de cursos es `tbl_cursos_cinf`. Guarda código, nombre, categoría, modalidad, costos y agrupaciones, pero **no** secciones, fechas, turnos ni docentes.
- Tiene 21 cursos; 12 activos (`active_chiclayo` y `active_filial` en true): XP-W365 (id 1), XP-E365 (2), XP-CANVA (3), CERT-EXCEL (6), ESP-PBI (7), ESP-CAD2D (8), ESP-WEB (9), ESP-BIZAGI (10), ESP-CAD3D (175), CERT-TALLER (176), CERT-WORD (234), ESP-PROJECT (237). Los otros 9 están inactivos.
- Los id no son correlativos: referencia los cursos por `id` o `code`, nunca por posición.
- `tbl_docentes` (nombre en `tbl_personas` vía `persona_id`) **no tiene docentes activos todavía**. Todo debe funcionar con la lista vacía.
- Última migración aplicada: v29.

## Reglas de negocio confirmadas

- Ciclos de apertura y duración: Enero 2 meses, Febrero 2 meses, Abril 3 meses, Mayo 2 meses, Agosto 1 mes, Setiembre 3 meses, Octubre 2 meses. No hay otros ciclos.
- Cada fila es una **sección** de un curso en un ciclo. Columnas: Curso, Sección (PEAD), Inicio (inicio del curso), Fin (fin del curso), Turno, Días, Horario, Aula, Docente, Link del aula.
- Turno: solo Mañana, Tarde o Noche.
- Aula: dónde se dicta. Virtual (Zoom) o Presencial.
- Un curso puede tener varias secciones en el mismo ciclo. Una sección puede quedar sin docente.
- **Todo es por ciclo y año, y el historial no se borra.** Cargar los horarios de un ciclo nuevo (por ejemplo, desde los PDF de Canva) solo **agrega** filas con ese `ciclo` y `anio`. Nunca elimina ni sobrescribe las secciones de ciclos anteriores, y nunca borra ni modifica cursos de `tbl_cursos_cinf`.
- Un ciclo pasado queda como historial: se puede consultar en el panel eligiendo su ciclo y año, pero deja de mostrarse en la página pública. La página pública muestra, por cada mes, solo el ciclo vigente publicado.
- Si un curso deja de dictarse, no se elimina: simplemente no se le crean secciones en el ciclo nuevo.

## Lo que hay que construir

### 1. Base de datos

Crea `ecosistema-cinf/supabase/migration_v30_horarios_cursos.sql`, idempotente y terminada en una sentencia (no en comentarios), y refléjala en `schema.sql`. El usuario la ejecuta en Supabase; no la ejecutes tú.

Tabla `tbl_horarios_cursos`:

| Columna | Tipo | Regla |
|---|---|---|
| `id` | BIGSERIAL PK | |
| `curso_id` | INT → `tbl_cursos_cinf(id)` | obligatorio |
| `ciclo` | VARCHAR | CHECK: enero, febrero, abril, mayo, agosto, setiembre, octubre |
| `anio` | INT | obligatorio |
| `seccion` | VARCHAR | p. ej. «PEAD a»; obligatorio |
| `fecha_inicio`, `fecha_fin` | DATE | CHECK `fecha_fin >= fecha_inicio` |
| `turno` | VARCHAR | CHECK: Mañana, Tarde, Noche |
| `dias` | VARCHAR | p. ej. «Lunes, miércoles y viernes» |
| `hora_inicio`, `hora_fin` | TIME | CHECK `hora_fin > hora_inicio` |
| `aula` | VARCHAR | CHECK: Virtual, Presencial |
| `docente_id` | BIGINT → `tbl_docentes(id)` | nulo si no hay asignado; ON DELETE SET NULL |
| `link_aula` | TEXT | nulo hasta que se publique |
| `publicado` | BOOLEAN | DEFAULT false |
| `created_at`, `updated_at` | TIMESTAMPTZ | DEFAULT now() |

Añade `UNIQUE (curso_id, ciclo, anio, seccion)` para no duplicar secciones, e índices por `(ciclo, anio)` y `docente_id`. La base está en hora de Lima.

### 2. API (`ecosistema-cinf/backend/src/routes/`)

Un archivo por recurso, como el resto:

- `GET /api/horarios?ciclo=&anio=` — **público**. Devuelve solo `publicado = true`, con el nombre del curso y del docente. No expone DNI, correo ni teléfono del docente.
- `GET /api/horarios/admin?ciclo=&anio=` — con JWT. Devuelve también los no publicados.
- `POST /api/horarios`, `PUT /api/horarios/:id`, `DELETE /api/horarios/:id` — con JWT.
- `PATCH /api/horarios/:id/docente` — asigna o quita el docente y el link del aula.
- `PATCH /api/horarios/publicar` — publica u oculta todas las secciones de un ciclo.

Escritura solo para ADMIN, JEFE, COORDINADOR o ESPECIALISTA. El backend valida todo lo que valida la tabla (ciclo, turno, aula, fechas, horas, sección repetida) y que `link_aula` empiece con `https:`. Responde con mensajes de error claros en español.

### 3. Módulo del panel «Horarios y asignación docente»

Regístralo en `adminNavigation.ts` y en `backend/src/utils/roles.ts` (`rolePermissions.test.ts` exige que coincidan). Capas: componente → servicio → API. Usa los primitivos de `src/components/ui/` (`PageHeader`, `DataTable`, `Modal`, `Field`, `Select`, `Button`, `Badge`, `EmptyState`) y `common/Pagination.tsx`. No crees botones ni modales a mano.

Diseño, según la pizarra del usuario:

- **Arriba**: selector de ciclo y año, y la tabla de secciones del ciclo con las columnas de negocio, más estado (Publicado / Borrador) y acciones (editar, eliminar).
- **Botón «Nueva sección»**: abre un formulario con curso (solo los activos de `tbl_cursos_cinf`), sección, fecha de inicio, fecha de fin, turno, días, hora de inicio, hora de fin y aula. Guarda en `tbl_horarios_cursos`.
- **Abajo a la izquierda**: lista de docentes activos con buscador.
- **Abajo a la derecha, bloque «Asignación»**: para la sección elegida en la tabla, selector de docente, campo de link del aula y botón Enviar.
- **Publicar ciclo**: un botón que publica todas las secciones del ciclo; hasta entonces la página pública muestra «Próximamente…».

Casos que deben quedar bien resueltos:

- Sin docentes activos: el bloque de asignación explica que no hay docentes registrados y enlaza al módulo de docentes; la sección se puede guardar igual.
- Ciclo sin secciones: `EmptyState` con el botón «Nueva sección».
- Sección repetida, fecha de fin anterior al inicio u hora de fin anterior al inicio: error junto al campo, sin perder lo escrito.
- Confirmación antes de eliminar una sección. Eliminar es solo para corregir un error de carga: no hay ninguna acción que borre un ciclo completo.
- Ciclos anteriores: el selector de ciclo y año permite verlos como historial. Ofrece «Copiar secciones de un ciclo anterior» para no volver a escribirlas; la copia crea filas nuevas en el ciclo destino, sin docente ni link, y no toca las originales.

Si el usuario quiere cargar muchas secciones de golpe, propón importación desde Excel como segundo paso; pregúntale antes de construirla.

### 4. Página pública (`uss-consulta-curso/`)

- `assets/js/app.js` debe leer `GET /api/horarios` con `fetch` en lugar de `horarios` de `datos.js`. Las rutas por carrera y los ciclos siguen en `datos.js`.
- Formato en pantalla: fechas `dd/mm/aaaa`, horario «08:00 a. m. – 12:00 p. m.», aula «Virtual · Zoom» o «Presencial».
- Mantén «Próximamente…» si el ciclo no tiene filas publicadas, «Por asignar» si no hay docente y «Por publicar» si no hay link.
- Si la API falla, muestra un mensaje claro con opción de reintentar; no dejes la tabla vacía sin explicación.
- El backend solo admite CORS de los dominios del ecosistema (`backend/src/app.ts`): agrega el de esta página o sírvela bajo el dominio unificado.

### 5. Despliegue

`uss-consulta-curso` aún no está en git ni en Vercel. Para sumarlo al dominio unificado hay que agregar su ruta en `ecosistema-cinf/vercel.json` (ver `ENLACES_ECOSISTEMA_CINF.md`). Pregunta al usuario la ruta que quiere (por ejemplo `/consulta-cursos`).

## Cómo trabajar

- En `ecosistema-cinf` trabaja en una rama; `main` es producción y solo se une cuando el usuario lo pide. La migración se ejecuta en Supabase **antes** de unir a `main`.
- Agrega pruebas de la API de horarios siguiendo `src/test/perfilRoutes.test.ts` (base simulada, nunca la real).
- Antes de dar algo por terminado: `npx tsc -b`, `cd backend && npx tsc --noEmit -p .` y `npm test`.
- No inventes cursos, horarios, docentes ni precios: si falta un dato, pídelo.
- No confirmes ni subas cambios sin que el usuario lo pida.

## Hecho cuando

1. Desde el panel se crea una sección con curso, fechas, turno, días, horario y aula, y queda guardada al recargar.
2. Se le asigna un docente y un link del aula, y se puede quitar.
3. Al publicar el ciclo, la página pública muestra esas filas; un ciclo sin publicar muestra «Próximamente…».
4. Los tres comandos de verificación pasan.
