/**
 * Configuración pública del portal CINF.
 *
 * ÚNICA fuente de horarios: hojas de Google Drive (carpeta CINF GEX > CURSOS,
 * ID 1Fin2Z5dCGVTeQe7tReP0oshA0L7m3iiX) publicadas en la web como CSV.
 * Una hoja por ciclo. Para abrir un ciclo nuevo, agrega aquí su enlace
 * «Publicar en la web → .csv» (o créala desde el Panel Admin, que devuelve el enlace).
 *
 * Columnas oficiales (fila de cabecera):
 * PERIODO | MES | MODALIDAD | PLAN DE ESTUDIO | CURSO | SECCION | MAT | PREMAT | DOCENTE |
 * ESTADO | TURNO | DIAS | HORA INICIO | HORA FIN | FECHA INICIO | FECHA FIN
 */
window.GOOGLE_SHEETS_URLS = window.GOOGLE_SHEETS_URLS || [
  // CINF 202602 NOVIEMBRE
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSz3Ap9uS8wQ9sEgccZNblL2vcDGGWsVf2V3GQYshhQaDvG2Jrcy7QQcvzHxz6Jcw/pub?gid=41443645&single=true&output=csv',
  // Los ciclos nuevos (CINF 202701 ENERO, …) llegan solos por CINF_DRIVE_INDICE_URL.
];

// Índice automático de hojas (Apps Script ecosistema-cinf/google-apps-script/CINFDriveSync.gs).
// Con esta URL «/exec», toda hoja «CINF AAAANN MES» publicada en la carpeta aparece sola
// en el portal, incluidas las que se crean desde el Panel Admin. Vacío = solo la lista fija.
window.CINF_DRIVE_INDICE_URL =
  window.CINF_DRIVE_INDICE_URL ||
  'https://script.google.com/macros/s/AKfycby9ol55gNSq7AnH_zeuDYZi0_rOfzwVjybsyiOGEfObpVFaXst2ConIDHWhQGAT82wv/exec';

// Compatibilidad con código anterior que lee una sola URL.
window.GOOGLE_SHEETS_URL = window.GOOGLE_SHEETS_URL || window.GOOGLE_SHEETS_URLS[0] || '';
