/**
 * Configuración pública del portal CINF.
 *
 * ÚNICA fuente de horarios: hojas de Google Drive, leídas por GET (solo lectura).
 * Estructura: carpeta «CINF 2027 › CURSOS», un libro por periodo (CINF 202700, 202701, 202702…)
 * con una pestaña por mes. Cada pestaña es un GET: el libro se publica una vez
 * (Archivo › Compartir › Publicar en la web › Todo el documento) y cada pestaña se lee con
 * «…/pub?gid=<gid de la pestaña>&single=true&output=csv». El gid sale de la URL al abrir la pestaña.
 *
 * Columnas (fila de cabecera; se leen por nombre, el orden y las faltantes no importan):
 * PERIODO | MES | MODALIDAD | PLAN DE ESTUDIO | CURSO | SECCION | MAT | PREMAT | DOCENTE |
 * ESTADO | TURNO | DIAS | HORA INICIO | HORA FIN | FECHA INICIO | FECHA FIN
 */
const CINF_202700 =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQw5JY_Fz5u4muIWgl8bWeunHTvuhf0f0z3rf2c9UyJtw_2tdVOsjrx18UyjfpmeDl4vmOTE6Z7zi60/pub';

window.GOOGLE_SHEETS_URLS = window.GOOGLE_SHEETS_URLS || [
  // CINF 202700 › ENERO
  `${CINF_202700}?gid=0&single=true&output=csv`,
  // CINF 202700 › NOVIEMBRE (datos de 2026 02, de prueba)
  `${CINF_202700}?gid=2097893266&single=true&output=csv`,
  // Anterior, CINF 202602 NOVIEMBRE.xlsx (reemplazado por la pestaña de arriba):
  // 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSz3Ap9uS8wQ9sEgccZNblL2vcDGGWsVf2V3GQYshhQaDvG2Jrcy7QQcvzHxz6Jcw/pub?gid=41443645&single=true&output=csv',
];

// Índice automático de hojas (Apps Script ecosistema-cinf/google-apps-script/CINFDriveSync.gs).
// Con esta URL «/exec», toda pestaña de mes de un libro «CINF AAAANN» en una carpeta de cursos
// aparece sola en el portal, incluidas las hojas que se crean desde el Panel Admin. Vacío = solo la lista fija.
window.CINF_DRIVE_INDICE_URL =
  window.CINF_DRIVE_INDICE_URL ||
  'https://script.google.com/macros/s/AKfycby9ol55gNSq7AnH_zeuDYZi0_rOfzwVjybsyiOGEfObpVFaXst2ConIDHWhQGAT82wv/exec';

// Compatibilidad con código anterior que lee una sola URL.
window.GOOGLE_SHEETS_URL = window.GOOGLE_SHEETS_URL || window.GOOGLE_SHEETS_URLS[0] || '';
