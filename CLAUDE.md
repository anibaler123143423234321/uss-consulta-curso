# Instrucciones del Proyecto — uss-consulta-curso

## 🛑 REGLA SUPREMA: PROHIBIDO EJECUTAR GIT PUSH

> ⛔ **NUNCA ejecutes `git push`. Está terminantemente prohibido.**
> El desarrollador (Dagner) es el único que decide cuándo y cómo hacer push al repositorio remoto.
> Puedes editar archivos, ejecutar pruebas y hacer commits locales si se solicita, pero **JAMÁS `git push`**.

---

## 🚀 Tareas Prioritarias a Futuro para Claude

### 1. Rendimiento y Carga Rápida (Cero esperas para el estudiante)
- **Problema actual:** Al abrir la portada o navegar a `horarios.html`, el portal hace una descarga en cascada (*waterfall*) de Google Apps Script (~2-3s) y luego de los CSV de Google Drive (~2s), obligando al usuario a esperar 4-5 segundos con spinner.
- **Solución técnica que debe aplicar Claude:**
  1. **Stale-While-Revalidate en navegador (`sessionStorage` / `localStorage`):**
     - Al cargar la página, leer y renderizar **al instante (0 ms)** la última copia guardada en caché.
     - En segundo plano (*background fetch*), consultar Google Drive silenciosamente. Si hay cambios en cupos, docentes o secciones, actualizar la vista suavemente sin recargar la página.
  2. **Paralelización de consultas en `datos.js`:**
     - En `catalogo.cargarHorariosRemotos()`, disparar en paralelo con `Promise.allSettled` tanto el índice de Apps Script como las URLs fijas de `config.js` (en lugar de esperar secuencialmente).
  3. **Botón de refresco manual:**
     - El botón de recarga (🔄) en los filtros debe invalidar la caché local y forzar una lectura fresca inmediata de Drive.

---

### 2. Sincronización en Tiempo Real (Evitar el retraso de 3 a 5 minutos de Google Sheets)
- **Problema actual:** Cuando se edita una celda en Google Drive (ej. cupos o docente) y se consulta el enlace público `/pub?output=csv`, **Google Sheets mantiene una caché fija de 3 a 5 minutos** en sus servidores, haciendo que los cambios no aparezcan de inmediato.
- **Solución técnica que debe aplicar Claude:**
  1. **Endpoint en vivo de Apps Script (`?accion=csv&id=...`):**
     - El proyecto Apps Script **`CINF Drive Sync`** (`ecosistema-cinf/google-apps-script/CINFDriveSync.gs`) implementa:
       ```
       https://script.google.com/macros/s/AKfycby9ol55gNSq7AnH_zeuDYZi0_rOfzwVjybsyiOGEfObpVFaXst2ConIDHWhQGAT82wv/exec?accion=csv&id=<ID_DE_HOJA>
       ```
     - Este endpoint lee directamente con `SpreadsheetApp.openById().getValues()`, **sin la caché de 5 minutos de Google**, entregando los datos en tiempo real al segundo de ser modificados en el Excel.
  2. **Sincronización con el Panel Admin (`ecosistema-cinf`):**
     - Respetar el flujo del botón **"Enviar a Drive"** del Panel Admin (`/admin`), que actualiza por POST (`accion: 'reemplazar_filas'`) las 16 columnas con formato morado oficial en 1 segundo.

---

## 📐 Arquitectura y Reglas del Proyecto
1. **Cero Datos Locales en Horarios:** La disponibilidad de secciones y cupos fluye 100% desde Google Drive o la API. `catalogo.horarios` en `datos.js` se mantiene vacío `[]` como catálogo dinámico.
2. **Separación Estricta de Modelos:**
   - **Modelo PROTECH XP:** Exclusivo para alumnos que inician su ruta por competencias (Word 365, Excel 365, Canva, AutoCAD, etc.). **NUNCA** debe mostrar Computación II ni III.
   - **Plan Tradicional:** Exclusivo para alumnos que culminan niveles anteriores (Computación I, II, III). **NUNCA** debe mostrar cursos Protech XP.
   - `modeloSeleccionado` inicia en `null` (sin presunción automática). Si se entra a `horarios.html` sin parámetro `modelo`, redirige a la portada.
3. **No tocar backend ni proxies:** Vercel y backend ya están configurados.

---

## 🎨 Estándar Visual y Diseño Frontend (Taste-Skill 2.5)
En cualquier cambio, rediseño o ajuste visual en `index.html`, `horarios.html` o los estilos CSS:
- **Skill obligatoria:** `design-taste-frontend` (`.claude/skills/design-taste-frontend/SKILL.md`).
- **Nivel de exigencia:** Interfaz profesional de alta dirección de arte (Figma / Linear / Stripe). Cero AI-slop (sin gradientes clichés, sin cajas vacías, sin cards genéricas).
- **Herramientas de control:**
  - Auditar copy: `node .claude/skills/design-taste-frontend/scripts/copy-lint.mjs index.html`
  - Validar consistencia y viewport: `node .claude/skills/design-taste-frontend/scripts/consistency.mjs index.html`
  - Puerta de verificación en navegador: `node .claude/skills/design-taste-frontend/scripts/gate.mjs --start index.html`
