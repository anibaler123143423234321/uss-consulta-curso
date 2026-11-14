# Prompt de Perfeccionamiento de Diseño, UX, Sincronización en la Nube y Cero Datos Locales — USS Consulta de Cursos

> **Instrucciones para el usuario (Dagner):**  
> Copia todo el contenido a continuación de la línea divisoria y pégalo directamente en **Claude Code**. Este documento contiene todas las directivas técnicas, las reglas de negocio oficiales, la especificación de ciclos y la instrucción de **eliminar todo dato local para que el 100% funcione a través de Internet (Google Drive / Cloud)**.  

---

Actúa como Diseñador UI/UX y Arquitecto Frontend Senior del Centro de Informática (CINF) de la Universidad Señor de Sipán (USS). Responde y documenta todo el código en español.

---

## 🛑 REGLA SUPREMA DE CONTROL DE VERSIONES (¡TOTALMENTE PROHIBIDO!)

> ⛔ **NUNCA, BAJO NINGUNA CIRCUNSTANCIA, EJECUTES `git push`.**  
> - Está **TERMINANTEMENTE PROHIBIDO** hacer push al repositorio remoto (`origin`, `github`, etc.).  
> - El usuario (Dagner) es el **ÚNICO** autorizado para ejecutar `git push` manualmente desde su terminal cuando él lo decida.  
> - Como IA, solo puedes editar archivos en local y hacer commits locales si se te pide, pero **JAMÁS disparar `git push`**.

---

## ⚠️ DIRECTIVA OBLIGATORIA DEL PROYECTO: CERO DATOS LOCALES (TODO A TRAVÉS DE INTERNET)

> 🔴 **REGLA FUNDAMENTAL:** **Elimina cualquier dependencia de datos locales quemados en el código. NADA DE DATOS LOCALES.**  
> El sistema no debe tener arrays estáticos ni mocks de horarios (`catalogo.horarios = [...]`) dentro de los archivos JavaScript.
> - **El 100% de los horarios y secciones debe obtenerse en tiempo real a través de Internet** (consumiendo directamente las hojas de Google Drive / Google Sheets / Cloud API).
> - La **única fuente de verdad oficial** son los archivos de cálculo alojados en la carpeta de Google Drive institucional (`1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX`).
> - Si se añade, modifica o cierra un curso en Google Drive, debe verse reflejado de inmediato a través de Internet en la web de consulta y en el panel administrativo.
> - Si la aplicación está cargando los datos desde la red, debe mostrar un **estado de carga (loader o skeleton)** moderno, y no pintar datos simulados antiguos de archivos locales.

---

## 1. Contexto y Estado Actual del Proyecto

Este repositorio (`uss-consulta-curso/`) es el portal web oficial para que los estudiantes de la USS consulten sus rutas de aprendizaje, asignaturas y secciones programadas por ciclo académico.

### Lo que YA ESTÁ IMPLEMENTADO Y FUNCIONANDO (No modificar):
1. **Sincronización en Tiempo Real con Google Sheets (Drive):**
   - El archivo `assets/js/config.js` contiene la URL pública CSV de Google Drive (`window.GOOGLE_SHEETS_URL`) correspondiente a la carga académica (`CINF 202602 NOVIEMBRE`).
   - El motor en `assets/js/datos.js` (`cargarDesdeGoogleSheets` y `convertirDatosSheets`) procesa en vivo las secciones, filtra las cerradas (`ESTADO !== 'APERTURADO'`), normaliza nombres de cursos, turnos, días y cupos, y las combina (*merge*) con el catálogo local de respaldo.
2. **Separación Estricta de Modelos de Acreditación (Paso 2):**
   - **Modelo PROTECH XP:** Exclusivo para alumnos que inician su ruta por competencias (Word 365, Excel 365, Canva, AutoCAD, etc.). **NUNCA** debe mostrar Computación II ni III.
   - **Plan Tradicional:** Para alumnos que convalidan o culminan niveles legacy (Computación I, II, III y Taller de Certificación Internacional). **NUNCA** debe mostrar cursos Protech XP.
   - En `index.js`, `modeloSeleccionado = null` por defecto (sin preselección automática). Los ciclos del Paso 3 no se muestran ni permiten navegación hasta que el estudiante elija su modelo.
   - En `horarios.js`, si no existe el parámetro `modelo` en la URL, redirige automáticamente a la portada para obligar a seleccionar.
3. **Catálogo Oficial y Rutas:**
   - En `assets/js/datos.js` están mapeadas las 7 rutas por carreras profesionales (Salud, Sociales y Leyes, Empresariales, etc.) y los grupos de especialidad para Computación Tradicional (Sistemas, Civil, Mecánica, Arquitectura).

> ⚠️ **REGLA DE ORO:** No alteres la lógica de filtrado de datos, ni los esquemas de bases de datos, ni los endpoints de API. Tu trabajo se concentra en: **UI, UX, CSS responsivo, micro-interacciones, legibilidad y diseño móvil en pantallas estrechas (< 576px).**

---

## 2. Definición Oficial de Ciclos de Apertura CINF USS (¡REQUERIMIENTO CLAVE!)

Los ciclos académicos oficiales del Centro de Informática USS y sus duraciones exactas son:

| Ciclo | Duración Oficial | Descripción Académica |
| :--- | :--- | :--- |
| **Enero** | **2 meses** | Ciclo de verano regular (enero - febrero) |
| **Febrero** | **2 meses** | Ciclo intensivo / regular |
| **Abril** | **3 meses** | Ciclo semestral I |
| **Mayo** | **2 meses** | Ciclo intermedio |
| **Agosto** | **1 mes** | Ciclo rápido de actualización |
| **Setiembre** | **3 meses** | Ciclo semestral II |
| **Octubre / Noviembre** | **2 meses** | Ciclo de cierre de año: **formalmente inicia en Noviembre y cubre Noviembre – Diciembre**. En las hojas de matrícula y en la base de datos se registra como *Noviembre* (ciclo 2026-02). |

### Cómo deben presentarse en la interfaz:
1. **En la Portada (`index.html` — Paso 3 "Elige el ciclo de apertura"):**
   - Cuadrícula responsiva de tarjetas de ciclo (`#grid-ciclos`):
     - **Desktop:** Cuadrícula de 4 columnas x 2 filas (u 8 tarjetas balanceadas).
     - **Tablet (576px a 991px):** 2 columnas x 4 filas.
     - **Móvil (< 576px):** 1 o 2 columnas compactas y fluidas, con altura táctil accesible (mínimo 44px para targets táctiles).
   - Cada tarjeta debe mostrar con claridad:
     - Ícono calendario `📅`.
     - Nombre del mes y año (ej. **Noviembre 2026** o **Enero 2027**).
     - Subtítulo de duración académica: `2 meses`, `3 meses`, `1 mes`, etc.
     - Badge de disponibilidad en tiempo real:
       - **Si tiene clases programadas:** Badge verde destacado con el conteo (`5 cursos · 28 secciones`).
       - **Si aún no abre para la carrera/modelo:** Tarjeta atenuada (opacidad 0.5, cursor `not-allowed`, badge gris `Próximamente`).
2. **En la Página de Horarios (`horarios.html` — Cinta superior de pestañas):**
   - Carrusel de pestañas tipo **"Scrollable Pills"** horizontales (`.cinta-horarios__pestanas`):
     - Contenedor con `min-width: 0; width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; display: flex; gap: 8px;`.
     - Cada pestaña debe mantener `white-space: nowrap; flex-shrink: 0;`.
     - Meses con apertura: resaltados con su conteo de secciones (ej. `Noviembre 35` o `Enero 16`).
     - Meses sin apertura: botón sutil atenuado con candado `🔒` (ej. `Febrero 🔒`).
     - **Crítico para móvil:** Las pestañas NO deben cortarse bruscamente contra el borde de la pantalla; debe existir un efecto sutil de desvanecimiento (*fade gradient* o sombra de scroll) que indique que se puede deslizar horizontalmente con el dedo.

---

## 3. Identidad Visual y Paleta de Colores por Curso (Badges de Especialidad)

En `assets/css/estilos.css` y `assets/js/horarios.js` ya existen las clases base para dar identidad de marca a cada curso oficial. Claude debe asegurar que estas clases se vean pulidas, contrastadas y legibles (accesibilidad WCAG AA):

| Curso Oficial | Color Distintivo | Variables / Clases CSS recomendadas |
| :--- | :--- | :--- |
| **Word 365 / Microsoft Word Asociado** | Azul Microsoft | `.badge-curso--word` (Color: `#185abd`, Fondo: `#eff6ff`, Borde: `#bfdbfe`) |
| **Excel 365 / Excel Asociado** | Verde Microsoft | `.badge-curso--excel` (Color: `#107c41`, Fondo: `#f0fdf4`, Borde: `#bbf7d0`) |
| **Diseño con Canva** | Cian / Teal Creativo | `.badge-curso--canva` (Color: `#00838f`, Fondo: `#ecfeff`, Borde: `#a5f3fc`) |
| **AutoCAD 2D / AutoCAD 3D** | Rojo Autodesk | `.badge-curso--autocad` (Color: `#c4151b`, Fondo: `#fef2f2`, Borde: `#fecaca`) |
| **Power BI / Análisis con SPSS** | Ámbar Analítico | `.badge-curso--powerbi`, `.badge-curso--spss` (Color: `#b45309`, Fondo: `#fffbeb`, Borde: `#fde68a`) |
| **Computación I, II, III (Tradicional)** | Azul Marino USS | `.badge-curso--tradicional` (Color: `#073299`, Fondo: `#eef2ff`, Borde: `#c7d2fe`) |
| **Diseño Web / Otros Cursos** | Índigo / Violeta | `.badge-curso--default` (Color: `#4f46e5`, Fondo: `#f5f3ff`, Borde: `#ddd6fe`) |

---

## 4. Problemas Críticos de UI/UX a Corregir en Móvil (< 576px)

Al probar en dispositivos móviles reales (iPhone SE 375px, iPhone 14 390px, Android 360px), se han detectado los siguientes detalles a perfeccionar:

### A. En `index.html` (Portada de Consulta):
1. **Hero Header excesivamente alto:**
   - En pantallas pequeñas, el banner azul superior empuja la tarjeta de selección demasiado hacia abajo, forzando al usuario a hacer mucho scroll para ver los pasos.
   - **Solución:** Reducir paddings verticales (`padding: 24px 16px 20px;`), achicar títulos de 28px a 20-22px en móvil, y compactar la distancia entre el logo y el texto.
2. **Paso 2 (Selector de Modelo de Acreditación):**
   - Actualmente las tarjetas de "Modelo PROTECH XP" y "Plan Tradicional" necesitan verse limpias y proporcionadas en celular.
   - En pantallas estrechas, pueden ir una al lado de la otra (2 columnas de ~75-85px de alto) o en tarjetas verticales compactas con radio button visual claro (`aria-checked`), icono ilustrativo y texto explicativo nítido.
3. **Paso 3 (Grid de Ciclos):**
   - Mantener tarjetas táctiles con padding cómodo (10px - 12px), donde el nombre del mes, su duración (`2 meses`) y la cantidad de secciones se lean de un solo vistazo.
   - Si no hay ciclos disponibles para una carrera/modelo, la caja de aviso (`#ciclos-proximos`) debe verse moderna, con bordes redondeados, fondo azul tenue y enlace directo de asistencia a WhatsApp.

### B. En `horarios.html` (Listado Oficial de Secciones):
1. **Pestañas de Ciclos cortadas a la mitad:**
   - La cinta de meses (`Noviembre 35`, `Enero 16`, `Febrero 🔒`) no debe desbordar ni cortarse con aristas duras. Debe tener scroll horizontal elástico táctil (`-webkit-overflow-scrolling: touch`) y una sutil sombra de borde derecho indicando que hay más meses.
2. **Banner de Carrera y Modelo en móvil:**
   - El encabezado con la carrera seleccionada, el badge de ruta (ej. `Ruta 2 · Sociales y Leyes`) y el badge del modelo (`🛡️ PROTECH XP` o `📚 Plan Tradicional`) debe ordenarse con gracia en pantallas estrechas:
     - Fila 1: Nombre de la carrera con tipografía destacada.
     - Fila 2: Badges de Ruta y Modelo alineados horizontalmente.
     - Fila 3 o esquina: Botón `Cambiar carrera ✕` compacto y accesible.
3. **Barra de Filtros en Pantallas Pequeñas:**
   - El campo de búsqueda por texto debe ocupar el 100% del ancho con su ícono de lupa bien centrado.
   - Los 4 selectores (*Curso, Turno, Días, Modalidad*) deben colocarse en una cuadrícula limpia de 2 columnas (`col-6`) con tipografía de 12px-13px y altura mínima de 40px para fácil pulsación táctil.
   - El botón de limpiar filtros (`↺`) debe quedar accesible sin romper la alineación.
4. **Tabla de 12 Columnas en Pantalla Móvil:**
   - La tabla con columnas (`#`, `Curso Oficial`, `Sec.`, `Inicio`, `Fin`, `Turno`, `Días`, `Horario`, `Aula`, `Cupos`, `Docente`, `Acceso Zoom`) no debe desbordar el ancho de la página completa (`body overflow-x`).
   - El contenedor `.tabla-horarios-wrap` debe tener scroll horizontal suave e incluir un aviso sutil superior visible solo en móvil:
     ```html
     <div class="d-flex d-md-none align-items-center justify-content-between px-3 py-2 bg-slate-50 border-bottom text-muted" style="font-size: 11px;">
       <span>👉 Desliza la tabla para ver horarios, días y cupos</span>
       <span class="fw-bold">⇄</span>
     </div>
     ```
   - Las cabeceras (`thead th`) deben ser pegajosas (`position: sticky; top: 0; z-index: 2;`) con fondo sólido para no perder el contexto al hacer scroll vertical.
   - Badges de cupos: fondo menta `#ecfdf5`, texto verde oscuro `#065f46`, icono `👥 30 cupos`.
   - Badges de turnos: Mañana (ámbar suave), Tarde (azul cielo), Noche (púrpura o índigo suave).

---

## 5. Estructura de Archivos del Proyecto

```text
uss-consulta-curso/
├── index.html                     # Portada: Selección de Carrera (Paso 1), Modelo (Paso 2) y Ciclos (Paso 3)
├── horarios.html                  # Vista de Horarios: Cinta de ciclos, filtros, tabla con badges y botón WhatsApp
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css      # Bootstrap 5 base (no modificar)
│   │   └── estilos.css            # Estilos personalizados (AQUÍ DEBEN IR TODOS LOS CAMBIOS DE DISEÑO)
│   ├── js/
│   │   ├── config.js              # URL de Google Sheets y endpoints API
│   │   ├── datos.js               # Catálogo oficial, duraciones de ciclos, rutas y parser de Google Sheets
│   │   ├── index.js               # Controlador de portada (selección de carrera, modelo y contadores)
│   │   └── horarios.js            # Controlador de horarios (filtros, rendering de tabla y badges de cursos)
│   └── img/
│       └── logo-uss.png           # Logo oficial institucional
└── documentos/
    ├── CINF 202602 NOVIEMBRE.xlsx # Archivo fuente original vinculado a Google Drive
    └── 2027-2.pdf                 # Brochure oficial de rutas por competencias
```

---

## 6. Instrucciones Específicas para Claude Code

1. **Inspecciona primero `assets/css/estilos.css`, `index.html` y `horarios.html`.**
2. **Aplica las mejoras de estilos prioritariamente en `assets/css/estilos.css`**, utilizando variables CSS nativas y media queries ordenadas:
   - `@media (max-width: 991px)` (Tablets / Laptops pequeñas)
   - `@media (max-width: 575px)` (Smartphones estándar)
   - `@media (max-width: 380px)` (Smartphones compactos tipo iPhone SE)
3. **Asegúrate de que los ciclos reflejen fielmente la duración oficial:**
   - Enero: 2 meses
   - Febrero: 2 meses
   - Abril: 3 meses
   - Mayo: 2 meses
   - Agosto: 1 mes
   - Setiembre: 3 meses
   - Octubre / Noviembre: 2 meses (Noviembre – Diciembre)
4. **Respeta los atributos de accesibilidad (`aria-checked`, `role="radio"`, `aria-label`)** en las tarjetas de selección de modelo y botones de ciclo.
5. **No uses estilos inline innecesarios (`style="..."`)**; todas las nuevas reglas deben estar encapsuladas en `estilos.css`.
6. **Al terminar, verifica que el código compile sin errores** (`node --check assets/js/*.js`), comprueba que el layout sea 100% fluido en 360px de ancho y reporta un resumen claro de las mejoras visuales implementadas.

---

## 7. Módulo de Integración con Google Drive: Sincronización Bidireccional y Creación Automática de Hojas

> 📌 **OBJETIVO ESTRATÉGICO:** La institución migrará progresivamente de Supabase hacia Google Drive como fuente de verdad oficial para los horarios de cursos.

### Especificaciones de la Carpeta de Google Drive:
- **URL de la Carpeta:** `https://drive.google.com/drive/u/1/folders/1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX`
- **ID de la Carpeta en Drive:** `1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX`
- **Ruta institucional:** `Compartido conmigo > CINF GEX > CURSOS`

### Requerimientos Funcionales de Sincronización:
1. **Edición en Google Sheets -> Reflejo en el Panel Administrativo y Portal Web:**
   - Cuando un coordinador o docente edita una sección en el archivo de Google Drive (ej. cambia horario, aula o docente), el cambio debe reflejarse en tiempo real en el Panel Administrativo (`ecosistema-cinf/src/components/admin/HorariosManager.tsx`) y en el portal de alumnos (`uss-consulta-curso`).
2. **Edición en el Panel Administrativo -> Actualización en Google Drive en Tiempo Real:**
   - Cuando en `HorariosManager.tsx` se agrega, modifica o elimina una sección o se asigna un docente, la acción debe impactar y actualizar la fila correspondiente en la hoja de Google Drive de forma instantánea.
3. **Creación Automática de Archivos para Ciclos Nuevos:**
   - Si no existe el archivo de un ciclo (por ejemplo, para abrir `CINF 202701 ENERO` o `CINF 202702 FEBRERO`), el sistema debe crear automáticamente la hoja de cálculo dentro de la carpeta con ID `1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX`.
   - La nueva hoja debe crearse con la estructura y cabeceras oficiales:
     ```text
     PERIODO | MES | MODALIDAD | PLAN DE ESTUDIO | CURSO | SECCION | MAT | PREMAT | DOCENTE | ESTADO | TURNO | DIAS | HORA INICIO | HORA FIN
     ```

### Solución Recomendada: Google Apps Script Webhook (Microservicio Serverless)
Para habilitar lectura y escritura en la carpeta privada de Google Drive sin requerir credenciales complejas de Google Cloud ni facturación, se recomienda desplegar un **Google Apps Script Web App** asociado a la carpeta:

```javascript
/**
 * Google Apps Script: CINF Google Drive Synchronizer
 * Carpeta Destino: 1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX
 */
const FOLDER_ID = '1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX';

function doGet(e) {
  const ciclo = (e.parameter.ciclo || 'noviembre').toUpperCase();
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  let targetSheet = null;

  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().toUpperCase().includes(ciclo)) {
      targetSheet = SpreadsheetApp.open(file);
      break;
    }
  }

  if (!targetSheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Hoja no encontrada para el ciclo ' + ciclo }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = targetSheet.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action = payload.action; // 'create_sheet', 'upsert_section', 'delete_section'
  const ciclo = (payload.ciclo || 'ENERO').toUpperCase();
  const folder = DriveApp.getFolderById(FOLDER_ID);

  if (action === 'create_sheet') {
    const fileName = 'CINF 202701 ' + ciclo;
    const newSheet = SpreadsheetApp.create(fileName);
    const sheetFile = DriveApp.getFileById(newSheet.getId());
    folder.addFile(sheetFile);
    DriveApp.getRootFolder().removeFile(sheetFile);

    const sheet = newSheet.getSheets()[0];
    sheet.appendRow([
      'PERIODO', 'MES', 'MODALIDAD', 'PLAN DE ESTUDIO', 'CURSO',
      'SECCION', 'MAT', 'PREMAT', 'DOCENTE', 'ESTADO', 'TURNO',
      'DIAS', 'HORA INICIO', 'HORA FIN'
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, fileId: newSheet.getId() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Lógica de upsert_section en la hoja correspondiente
  // Busca por SECCION y actualiza o inserta nueva fila
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Pasos para Claude Code al implementar la sincronización:
1. Conectar `ecosistema-cinf/src/services/horarioService.ts` y `HorariosManager.tsx` al webhook o endpoint de sincronización con Google Drive.
2. Al ejecutar cualquier `createHorario` o `updateHorario`, despachar la actualización al webhook de Drive para mantener el Excel de la carpeta `1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX` 100% al día.
3. Asegurar que `uss-consulta-curso` consuma tanto la hoja publicada de Noviembre como las nuevas hojas que se generen para Enero, Febrero, etc.

---

## 8. Flujo Asistido con "Claude for Chrome" para Crear el Excel Directamente en Google Drive

> 🚀 **VENTAJA CLAVE:** Como tienes activa la extensión **Claude for Chrome**, Claude puede interactuar directamente con tu navegador para realizar la creación y configuración paso a paso en tu Google Drive. Tú solo autorizas o pones tus credenciales institucionales.

### Procedimiento Guiado para Claude for Chrome:
1. **Navegación a la Carpeta Oficial:**
   - Claude debe abrir la pestaña del navegador en:  
     `https://drive.google.com/drive/u/1/folders/1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX`
2. **Creación del Archivo de Horarios Oficial:**
   - Hacer clic en el botón `+ Nuevo` > `Hojas de cálculo de Google` (o duplicar la hoja existente `CINF 202602 NOVIEMBRE.xlsx`).
   - Nombrar el archivo según la nomenclatura estándar del Centro de Informática:  
     `CINF 202701 ENERO` (o una hoja consolidada `CINF HORARIOS OFICIALES` con pestañas por ciclo: `202602 NOV`, `202701 ENE`).
3. **Estructura de Columnas Oficiales (Fila 1 o Fila 2):**
   - Asegurar que la hoja tenga las 14 columnas requeridas por el parser:
     ```text
     A: PERIODO
     B: MES
     C: MODALIDAD
     D: PLAN DE ESTUDIO
     E: CURSO
     F: SECCION
     G: MAT
     H: PREMAT
     I: DOCENTE
     J: ESTADO
     K: TURNO
     L: DIAS
     M: HORA INICIO
     N: HORA FIN
     ```
   - Poblar las secciones aperturadas (`ESTADO = APERTURADO`) para el ciclo correspondiente (ej. Enero 2027).
4. **Publicación en la Web en Formato CSV:**
   - En Google Sheets, ir al menú: `Archivo` > `Compartir` > `Publicar en la web`.
   - Seleccionar la hoja a publicar y cambiar el formato de `Página web` a:  
     **`Valores separados por comas (.csv)`**.
   - Marcar obligatoriamente la casilla:  
     **☑️ Volver a publicar automáticamente cuando se realicen cambios**.
   - Hacer clic en **Publicar** y copiar el enlace generado (ejemplo: `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`).
5. **Vinculación en el Código:**
   - Pegar el nuevo enlace publicado en `assets/js/config.js`:
     ```javascript
     window.GOOGLE_SHEETS_URL = '<NUEVA_URL_PUBLICADA_CSV_DE_GOOGLE_DRIVE>';
     ```

---

## 9. ELIMINACIÓN DE DATOS LOCALES: 100% POR INTERNET (NADA DE LOCAL)

> 🔴 **ORDEN EXPRESA DEL USUARIO:** **Eliminar todos los datos locales quemados en el código. Toda la consulta y gestión debe operar 100% a través de Internet desde Google Drive.**

### Tareas concretas de limpieza y arquitectura online:
1. **Vaciar el catálogo estático en `assets/js/datos.js`:**
   - El arreglo `catalogo.horarios` debe quedar **vacío** `[]`:
     ```javascript
     horarios: [], // Vacío: se carga exclusivamente desde Google Drive a través de Internet
     ```
   - No mantener arrays quemados de secciones ni horarios locales. Las carreras, rutas y ciclos se conservan como metadatos estructurales, pero las secciones programadas deben fluir exclusivamente desde la nube.
2. **Estado de Carga (Loading State / Skeleton) en `index.html` y `horarios.html`:**
   - Mientras `fetch(GOOGLE_SHEETS_URL)` descarga los datos de Internet:
     - Mostrar un indicador visual elegante: *"Conectando con Google Drive y cargando horarios en tiempo real..."* con un spinner o tarjetas en esqueleto (*skeleton loader*).
   - En cuanto el CSV o JSON de Google Drive se descarga y procesa, renderizar los ciclos aperturados de inmediato.
3. **Manejo de Errores de Red Limpio:**
   - Si no hay conexión a Internet o Google Drive no responde, mostrar una alerta clara con un botón de **"Reintentar conexión"** y el botón directo de WhatsApp de soporte. **NUNCA recurrir a datos locales simulados o desfasados.**
4. **Desconexión progresiva de Supabase:**
   - Configurar la arquitectura para que Google Drive sea la base de datos operativa principal del sistema para alumnos y coordinadores.


