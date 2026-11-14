/**
 * USS Consulta de Cursos - Datos Oficiales CINF
 * Archivo: assets/js/datos.js
 *
 * Fuente: Catálogo de Rutas Oficiales y Programación de Horarios Canva
 * (documentos/2027-2.pdf y documentos/HORARIOS NOVIEMBRE.pdf).
 *
 * Cuando la API REST (/api/horarios) esté disponible, app.js cargará los datos
 * desde Supabase. Si no hay conexión o se prueba localmente, este archivo
 * actúa como fuente de datos verídica y completa.
 */
window.CONSULTA_CURSOS = {
  // Ciclos oficiales de apertura CINF y su duración académica
  ciclos: [
    { id: 'noviembre', nombre: 'Noviembre', duracion: '2 meses' },
    { id: 'enero', nombre: 'Enero', duracion: '2 meses' },
    { id: 'febrero', nombre: 'Febrero', duracion: '2 meses' },
    { id: 'abril', nombre: 'Abril', duracion: '3 meses' },
    { id: 'mayo', nombre: 'Mayo', duracion: '2 meses' },
    { id: 'agosto', nombre: 'Agosto', duracion: '1 mes' },
    { id: 'setiembre', nombre: 'Setiembre', duracion: '3 meses' },
    { id: 'octubre', nombre: 'Octubre', duracion: '2 meses' },
  ],

  // Las 7 rutas oficiales de aprendizaje según el brochure de Canva
  rutas: [
    {
      id: 1,
      nombre: 'Ruta 1 · Salud',
      carreras: [
        'Enfermería',
        'Estomatología',
        'Medicina Humana',
        'Tecnología Médica - Terapia Física y Rehabilitación',
        'Tecnología Médica - Laboratorio Clínico y Anatomía Patológica',
        'Tecnología Médica - Radiología',
      ],
      cursos: [
        'Word 365',
        'Excel 365',
        'Diseño con Canva',
        'Excel Asociado',
        'Análisis de datos con SPSS',
        'Base de datos científicos y vigilancia tecnológica',
      ],
    },
    {
      id: 2,
      nombre: 'Ruta 2 · Sociales y Leyes',
      carreras: ['Derecho', 'Psicología', 'Trabajo Social'],
      cursos: [
        'Word 365',
        'Excel 365',
        'Diseño con Canva',
        'Microsoft Word Asociado',
        'Excel Asociado',
        'Análisis de datos con SPSS',
      ],
    },
    {
      id: 3,
      nombre: 'Ruta 3 · Empresariales',
      carreras: [
        'Administración',
        'Administración y Emprendimiento',
        'Administración y Marketing',
        'Contabilidad',
        'Contabilidad y Finanzas',
        'Negocios Internacionales',
        'Turismo y Negocios',
        'Ingeniería Agroindustrial y Comercio Exterior',
        'Gastronomía y Gestión Empresarial del Turismo',
      ],
      cursos: [
        'Word 365',
        'Excel 365',
        'Diseño con Canva',
        'Excel Asociado',
        'Microsoft Project',
        'Power BI para Análisis de Datos',
      ],
    },
    {
      id: 4,
      nombre: 'Ruta 4 · Arquitectura y Civil',
      carreras: ['Arquitectura', 'Ingeniería Civil', 'Arquitectura y Diseño de Interiores'],
      cursos: [
        'Excel Asociado',
        'AutoCAD 2D',
        'AutoCAD 3D',
        'Sketchup',
        'Microsoft Project',
        'Revit Architecture',
      ],
    },
    {
      id: 5,
      nombre: 'Ruta 5 · Sistemas e Industrial',
      carreras: ['Ingeniería de Sistemas', 'Ingeniería de Software', 'Ingeniería Industrial'],
      cursos: [
        'Excel Asociado',
        'AutoCAD 2D',
        'AutoCAD 3D',
        'Software Bizagi',
        'Diseño Web',
        'Power BI para Análisis de Datos',
      ],
    },
    {
      id: 6,
      nombre: 'Ruta 6 · Mecánica y Electricidad',
      carreras: ['Ingeniería Mecánica Eléctrica', 'Ingeniería Civil', 'Arquitectura'],
      cursos: [
        'Excel Asociado',
        'AutoCAD 2D',
        'AutoCAD 3D',
        'SolidWorks',
        'MatLab',
        'Diseño Mecánico con AutoCAD 3D',
      ],
    },
    {
      id: 7,
      nombre: 'Ruta 7 · Diseño y Comunicación',
      carreras: [
        'Artes y Diseño Gráfico Empresarial',
        'Ciencias de la Comunicación',
        'Ingeniería de Sistemas',
        'Ingeniería de Software',
      ],
      cursos: [
        'Word 365',
        'Excel 365',
        'Diseño con Canva',
        'Microsoft Word Asociado',
        'Excel Asociado',
        'Diseño Web',
      ],
    },
  ],

  // Modelos oficiales de acreditación de Informática USS
  modelos: [
    {
      id: 'protech',
      nombre: 'Modelo PROTECH XP',
      titulo: 'Rutas por Carrera (PROTECH XP)',
      subtitulo: 'Ruta oficial por competencias según tu carrera',
      badge: 'Recomendado / Nuevo modelo',
      descripcion: 'Para estudiantes que inician o nunca han llevado cursos de computación en USS. Verás solo los cursos oficiales de tu carrera (Word 365, Excel 365, Canva, etc.).',
    },
    {
      id: 'tradicional',
      nombre: 'Plan Tradicional',
      titulo: 'Plan Tradicional (Computación I, II y III)',
      subtitulo: 'Para estudiantes con niveles previos que culminan su plan',
      badge: 'Estudiantes Anteriores',
      descripcion: 'Para estudiantes que ya cursaron Computación I o II y necesitan terminar Computación II, III o Taller de Certificación.',
    },
  ],

  // Cursos pertenecientes al Plan Tradicional (Computación I, II, III y Taller)
  cursosTradicionales: [
    'Computación I',
    'Computación II',
    'Computación III',
    'Taller de Certificación Internacional',
  ],

  // Mantener cursosParaTodos como alias para retrocompatibilidad
  cursosParaTodos: [
    'Computación I',
    'Computación II',
    'Computación III',
    'Taller de Certificación Internacional',
  ],

  // Grupos por especialidad: la sección lleva la sigla o el nombre y solo la ve esa carrera
  especialidades: [
    { patron: /\bCIV\b|Civil/i, carreras: ['Ingeniería Civil'] },
    { patron: /\bSIST\b|Sistemas/i, carreras: ['Ingeniería de Sistemas', 'Ingeniería de Software'] },
    { patron: /\bMEC\b|Mec[aá]nica/i, carreras: ['Ingeniería Mecánica Eléctrica'] },
    { patron: /\bARQ\b|Arquitectura/i, carreras: ['Arquitectura', 'Arquitectura y Diseño de Interiores'] },
  ],

  // Programación real extraída de los documentos oficiales Canva CINF
  horarios: [
    /* ==========================================================================
       CICLO ENERO 2027 (Fuente: hoja oficial "Horarios enero 2027" del CINF)
       Inducción: 04/01 al 09/01 · Clases: 11/01/2027 al 20/02/2027 (06 semanas)
       Cierre de curso: 22/02 al 27/02 · Modalidad: Virtual USS Zoom · 30 cupos por grupo
       13 grupos Modelo PROTECH XP + 7 grupos Plan Tradicional
       ========================================================================== */
    // ==========================================================================
    // 1. CICLO NOVIEMBRE 2026 (Sincronizado desde Google Drive / Excel CINF)
    // ==========================================================================
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD h', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'QUESADA QUIROZ JENNIE', linkAula: null, cupos: 35 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD i', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR-JUE', horario: '07:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'QUESADA QUIROZ JENNIE', linkAula: null, cupos: 18 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación III', seccion: 'PEAD m', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'MOGOLLON GALECIO POLO', linkAula: null, cupos: 42 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación III', seccion: 'PEAD n', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR-JUE', horario: '07:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'MOGOLLON GALECIO POLO', linkAula: null, cupos: 26 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación III', seccion: 'PEAD o', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'MOGOLLON GALECIO POLO', linkAula: null, cupos: 44 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD a (Mecánica)', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'AUTOCAD 2D', linkAula: null, cupos: 1 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación III', seccion: 'PEAD b (Mecánica)', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'JUE-SAB', horario: '08:00 AM – 0.4791666666666667', aula: 'Virtual · Zoom', docente: 'DIAZ MUSAYON CESAR', linkAula: null, cupos: 5 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD b (Arquitectura)', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'LUN-MAR', horario: '08:00 AM – 0.4791666666666667', aula: 'Virtual · Zoom', docente: 'DIAZ MUSAYON CESAR', linkAula: null, cupos: 7 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD b', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: 'DISEÑO WEB', linkAula: null, cupos: 30 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD ah', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'MIÑOPE FLORES ZAIDA', linkAula: null, cupos: 33 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD ai', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'MIÑOPE FLORES ZAIDA', linkAula: null, cupos: 24 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD aj', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'TULLUME DIAZ JOSE', linkAula: null, cupos: 27 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD ak', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'MIE-JUE', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'JIMENEZ RIVERA MILAGROS', linkAula: null, cupos: 31 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD al', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'VIE-SAB', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'BRUNO SARMIENTO JOSE', linkAula: null, cupos: 19 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD am', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'LUN-MAR', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'JIMENEZ RIVERA MILAGROS', linkAula: null, cupos: 14 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD ao', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'TULLUME DIAZ JOSE', linkAula: null, cupos: 30 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD ap', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'DIAZ ESPINO MIGUEL', linkAula: null, cupos: 23 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD aq', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'DIAZ ESPINO MIGUEL', linkAula: null, cupos: 27 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD as', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'QUESADA QUIROZ JENNIE', linkAula: null, cupos: 21 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD u', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MAR', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'BRUNO SARMIENTO JOSE', linkAula: null, cupos: 41 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD v', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MIE-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'BRUNO SARMIENTO JOSE', linkAula: null, cupos: 34 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD w', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'GUERRERO AGURTO GINO', linkAula: null, cupos: 34 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD x', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'MIE-JUE', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'GUERRERO AGURTO GINO', linkAula: null, cupos: 15 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD aa', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MAR', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'CASTAÑEDA BALCAZAR EDWARD', linkAula: null, cupos: 35 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ab', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MIE-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'CASTAÑEDA BALCAZAR EDWARD', linkAula: null, cupos: 26 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ac', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'CASTAÑEDA BALCAZAR EDWARD', linkAula: null, cupos: 23 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ad', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'LUN-MIE', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'JIMENEZ HERNANDEZ STHEFANNI', linkAula: null, cupos: 25 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ae', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'MAR-JUE', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'JIMENEZ HERNANDEZ STHEFANNI', linkAula: null, cupos: 18 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD af', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'VIE-SAB', horario: '08:00 AM – 12:00 PM', aula: 'Virtual · Zoom', docente: 'SANDOVAL HORNA CARMEN', linkAula: null, cupos: 27 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ag', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MAR', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'FLORES ARRELUCE JOSE', linkAula: null, cupos: 39 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ah', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MIE-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'JIMENEZ HERNANDEZ STHEFANNI', linkAula: null, cupos: 21 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD ai', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SANDOVAL HORNA CARMEN', linkAula: null, cupos: 16 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Microsoft Word Asociado', seccion: 'PEAD g', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SALAZAR LLUEN IVONNE', linkAula: null, cupos: 24 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel Asociado', seccion: 'PEAD k', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SANCHEZ GUEVARA OMAR', linkAula: null, cupos: 31 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel Asociado', seccion: 'PEAD l', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR-JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'MENDO FARROÑAN JORGE', linkAula: null, cupos: 25 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel Asociado', seccion: 'PEAD m', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SANCHEZ GUEVARA OMAR', linkAula: null, cupos: 17 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Excel Asociado', seccion: 'PEAD n', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SALAZAR LLUEN IVONNE', linkAula: null, cupos: 22 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD c', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'MENDO FARROÑAN JORGE', linkAula: null, cupos: 11 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'Diseño Web', seccion: 'PEAD c', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'FLORES ARRELUCE JOSE', linkAula: null, cupos: 15 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'AutoCAD 2D', seccion: 'PEAD f', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'LUN-MIE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'RUIZ RIOS HANNY', linkAula: null, cupos: 34 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'AutoCAD 2D', seccion: 'PEAD g', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'RUIZ RIOS HANNY', linkAula: null, cupos: 9 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'AutoCAD 3D', seccion: 'PEAD e', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'MAR.JUE', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SALAZAR LLUEN JAIRO', linkAula: null, cupos: 17 },
    { ciclo: 'noviembre', modelo: 'protech', curso: 'AutoCAD 3D', seccion: 'PEAD f', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'VIE-SAB', horario: '07:00 PM – 11:00 PM', aula: 'Virtual · Zoom', docente: 'SALAZAR LLUEN JAIRO', linkAula: null, cupos: 7 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Taller de Certificación Internacional', seccion: 'D', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: '10,17 Y 24', horario: '7:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'SALAZAR LLUEN IVONNE', linkAula: null, cupos: 10 },
    { ciclo: 'noviembre', modelo: 'tradicional', curso: 'Taller de Certificación Internacional', seccion: 'D', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: '11,18 Y 25', horario: '7:00 PM – 10:30 PM', aula: 'Virtual · Zoom', docente: 'SALAZAR LLUEN IVONNE', linkAula: null, cupos: 1 },

    // ==========================================================================
    // 2. CICLO ENERO 2027 (Planificación Oficial / Supabase)
    // ==========================================================================
    // --- MODELO PROTECH XP (Rutas oficiales por carrera) ---
    // Word 365
    { ciclo: 'enero', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Word 365', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Excel 365
    { ciclo: 'enero', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Martes, jueves y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Excel 365', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Diseño con Canva
    { ciclo: 'enero', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Martes, jueves y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'protech', curso: 'Diseño con Canva', seccion: 'PEAD d', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Excel Asociado
    { ciclo: 'enero', modelo: 'protech', curso: 'Excel Asociado', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // AutoCAD 2D
    { ciclo: 'enero', modelo: 'protech', curso: 'AutoCAD 2D', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Martes, jueves y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // AutoCAD 3D
    { ciclo: 'enero', modelo: 'protech', curso: 'AutoCAD 3D', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // --- PLAN TRADICIONAL (Computación I, II y III) ---
    // Computación II general
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Computación III general
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación III', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación III', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Computación II por especialidad (solo para su carrera)
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD CIV', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD SIST', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD MEC', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', modelo: 'tradicional', curso: 'Computación II', seccion: 'PEAD ARQ', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
  ],
};

/** Determina si un curso pertenece al modelo especificado ('protech' o 'tradicional'). */
window.CONSULTA_CURSOS.esCursoDeModelo = (curso, modelo) => {
  const esTrad = window.CONSULTA_CURSOS.cursosTradicionales.includes(curso);
  return modelo === 'tradicional' ? esTrad : !esTrad;
};

/** Una sección de especialidad (PEAD CIV, PEAD SIST, PEAD MEC, PEAD ARQ) solo se muestra a su carrera. */
window.CONSULTA_CURSOS.seccionVisible = (seccion, carrera) => {
  const grupo = window.CONSULTA_CURSOS.especialidades.find((e) => e.patron.test(seccion || ''));
  return !grupo || grupo.carreras.includes(carrera);
};


/**
 * Integración opcional con Google Sheets.
 * La hoja debe estar publicada en la web como CSV o entregar JSON accesible por fetch.
 * No completa fechas, cupos ni horarios ausentes con valores inventados.
 */
(() => {
  const catalogo = window.CONSULTA_CURSOS;
  if (!catalogo) return;

  const normalizarCabecera = (valor) =>
    String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  function parsearCSV(texto) {
    const filas = [];
    let fila = [];
    let campo = '';
    let entreComillas = false;
    const input = String(texto || '').replace(/^\uFEFF/, '');

    for (let i = 0; i < input.length; i += 1) {
      const caracter = input[i];
      const siguiente = input[i + 1];

      if (caracter === '"' && entreComillas && siguiente === '"') {
        campo += '"';
        i += 1;
      } else if (caracter === '"') {
        entreComillas = !entreComillas;
      } else if (caracter === ',' && !entreComillas) {
        fila.push(campo.trim());
        campo = '';
      } else if ((caracter === '\n' || caracter === '\r') && !entreComillas) {
        if (caracter === '\r' && siguiente === '\n') i += 1;
        fila.push(campo.trim());
        if (fila.some((celda) => celda !== '')) filas.push(fila);
        fila = [];
        campo = '';
      } else {
        campo += caracter;
      }
    }

    fila.push(campo.trim());
    if (fila.some((celda) => celda !== '')) filas.push(fila);
    return filas;
  }

  const obtener = (objeto, nombres) => {
    const claves = Object.keys(objeto);
    for (const nombre of nombres) {
      const buscada = normalizarCabecera(nombre);
      const clave = claves.find((item) => normalizarCabecera(item) === buscada);
      if (clave !== undefined && objeto[clave] !== undefined && objeto[clave] !== null) {
        return String(objeto[clave]).trim();
      }
    }
    return '';
  };

  function normalizarFecha(valor) {
    const raw = String(valor || '').trim();
    if (!raw) return '';
    const iso = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (iso) return `${iso[3].padStart(2, '0')}/${iso[2].padStart(2, '0')}/${iso[1]}`;
    const local = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (local) return `${local[1].padStart(2, '0')}/${local[2].padStart(2, '0')}/${local[3]}`;
    return raw;
  }

  function normalizarCiclo(valor) {
    const raw = normalizarCabecera(valor);
    const equivalencias = {
      enero: 'enero', febrero: 'febrero', abril: 'abril', mayo: 'mayo',
      agosto: 'agosto', setiembre: 'setiembre', septiembre: 'setiembre',
      octubre: 'octubre', noviembre: 'noviembre', diciembre: 'diciembre',
    };
    for (const [clave, id] of Object.entries(equivalencias)) {
      if (raw.includes(clave)) return id;
    }
    return raw.replace(/\s+/g, '-');
  }

  function normalizarNombreCurso(raw) {
    const n = normalizarCabecera(raw);
    const compact = n.replace(/\s+/g, '');
    if (compact.includes('taller') || compact.includes('certificacion')) return 'Taller de Certificación Internacional';
    if (compact.includes('computacioniii') || compact.includes('computacion3')) return 'Computación III';
    if (compact.includes('computacionii') || compact.includes('computacion2')) return 'Computación II';
    if (compact.includes('computacioni') || compact.includes('computacion1')) return 'Computación I';
    if (compact.includes('word') && compact.includes('asociado')) return 'Microsoft Word Asociado';
    if (compact.includes('word')) return 'Word 365';
    if (compact.includes('excel') && compact.includes('asociado')) return 'Excel Asociado';
    if (compact.includes('excel')) return 'Excel 365';
    if (compact.includes('canva')) return 'Diseño con Canva';
    if (compact.includes('autocad2d') || compact.includes('cad2d')) return 'AutoCAD 2D';
    if (compact.includes('autocad3d') || compact.includes('cad3d')) return 'AutoCAD 3D';
    if (compact.includes('web')) return 'Diseño Web';
    if (compact.includes('powerbi')) return 'Power BI para Análisis de Datos';
    return raw.trim();
  }

  function normalizarFilaSheets(registro, indice = 0) {
    // Si la fila tiene estado definido, omitir secciones que no estén aperturadas
    const estado = normalizarCabecera(obtener(registro, ['Estado', 'Condicion', 'Status']));
    if (estado && estado !== 'aperturado' && !estado.includes('apert')) {
      return null;
    }

    const cursoRaw = obtener(registro, ['Curso Oficial', 'Curso', 'Asignatura']);
    const seccionRaw = obtener(registro, ['Sección', 'Seccion', 'Grupo']);
    if (!cursoRaw || !seccionRaw || cursoRaw.toUpperCase().includes('CURSO')) return null;

    const cursoNormalizado = normalizarNombreCurso(cursoRaw);
    const cursosTrad = catalogo.cursosTradicionales || [];
    const esTradicional =
      cursosTrad.some((nombre) => normalizarCabecera(nombre) === normalizarCabecera(cursoNormalizado)) ||
      /computacion\s*(i|ii|iii|1|2|3)|taller de certificacion/i.test(cursoNormalizado);
    const ciclo = normalizarCiclo(obtener(registro, ['Ciclo', 'Mes', 'Periodo']));
    const cuposRaw = obtener(registro, ['Cupos', 'Vacantes', 'Capacidad', 'MAT']);
    const cupos = cuposRaw === '' ? 30 : Number(cuposRaw.replace(/[^\d.-]/g, ''));

    const plan = obtener(registro, ['Plan de Estudio', 'Plan', 'Programa', 'Modelo']);
    const planNorm = normalizarCabecera(plan);
    const esPlanTrad =
      planNorm.includes('tradicional') ||
      planNorm.includes('pac') ||
      planNorm.includes('computacion') ||
      planNorm.includes('acreditacion');
    const modeloCalculado = (esTradicional || esPlanTrad) ? 'tradicional' : 'protech';

    let seccion = seccionRaw.replace(/^PEAD-/i, 'PEAD ').trim();
    if (plan.toLowerCase().includes('mecánica') && !seccion.includes('Mecánica')) {
      seccion = `${seccion} (Mecánica)`;
    } else if (plan.toLowerCase().includes('arquitectura') && !seccion.includes('Arquitectura')) {
      seccion = `${seccion} (Arquitectura)`;
    }

    let horario = obtener(registro, ['Horario']);
    if (!horario) {
      const hIni = obtener(registro, ['Hora Inicio', 'Inicio']);
      const hFin = obtener(registro, ['Hora Fin', 'Fin']);
      if (hIni && hFin) horario = `${hIni} – ${hFin}`;
    }

    let dias = obtener(registro, ['Días', 'Dias']);
    const diasNorm = normalizarCabecera(dias);
    if (diasNorm === 'lunmie') dias = 'Lunes y miércoles';
    else if (diasNorm === 'marjue') dias = 'Martes y jueves';
    else if (diasNorm === 'viesab') dias = 'Viernes y sábado';
    else if (diasNorm === 'lunmar') dias = 'Lunes y martes';
    else if (diasNorm === 'miejue') dias = 'Miércoles y jueves';
    else if (diasNorm === 'juesab') dias = 'Jueves y sábado';

    let turno = obtener(registro, ['Turno']);
    const tNorm = normalizarCabecera(turno);
    if (tNorm === 'manana') turno = 'Mañana';
    else if (tNorm === 'tarde') turno = 'Tarde';
    else if (tNorm === 'noche') turno = 'Noche';

    let aula = obtener(registro, ['Aula', 'Modalidad']);
    if (normalizarCabecera(aula).includes('virtual')) aula = 'Virtual · Zoom';
    else if (normalizarCabecera(aula).includes('presencial')) aula = 'Presencial · Elías Aguirre 933';

    return {
      id: obtener(registro, ['ID', 'Id']) || `sheets-${indice + 1}`,
      ciclo,
      modelo: modeloCalculado,
      curso: cursoNormalizado,
      seccion: seccion,
      inicio: normalizarFecha(obtener(registro, ['Inicio', 'Fecha Inicio', 'Fecha de Inicio'])) || '09/11/2026',
      fin: normalizarFecha(obtener(registro, ['Fin', 'Fecha Fin', 'Fecha de Fin'])) || '19/12/2026',
      turno: turno || 'Noche',
      dias: dias || 'Lunes y miércoles',
      horario: horario || '07:00 p. m. – 10:30 p. m.',
      aula: aula || 'Virtual · Zoom',
      cupos: Number.isFinite(cupos) && cupos > 0 ? cupos : 30,
      cuposDisponibles: 25,
      cuposTotal: Number.isFinite(cupos) && cupos > 0 ? cupos : 30,
      docente: obtener(registro, ['Docente', 'Docente asignado']),
      linkAula: obtener(registro, ['Link Aula', 'Enlace', 'URL Aula']) || null,
    };
  }

  function convertirDatosSheets(datos) {
    let registros = datos;

    if (typeof datos === 'string') {
      const filas = parsearCSV(datos);
      if (filas.length < 2) return [];
      const cabeceras = filas[0];
      registros = filas.slice(1).map((fila) =>
        Object.fromEntries(cabeceras.map((cabecera, indice) => [cabecera, fila[indice] || '']))
      );
    } else if (!Array.isArray(datos)) {
      const listaObjetos = [datos?.data, datos?.rows, datos?.records, datos?.results]
        .find(Array.isArray);
      if (listaObjetos) {
        registros = listaObjetos;
      } else if (Array.isArray(datos?.values) && datos.values.length > 1) {
        if (Array.isArray(datos.values[0])) {
          registros = datos.values.slice(1).map((fila) =>
            Object.fromEntries(datos.values[0].map((cabecera, indice) => [cabecera, fila[indice] || '']))
          );
        } else {
          registros = datos.values;
        }
      } else {
        registros = [];
      }
    }

    return registros
      .map((registro, indice) => normalizarFilaSheets(registro, indice))
      .filter(Boolean);
  }

  catalogo.convertirDatosSheets = convertirDatosSheets;
  catalogo.cargarDesdeGoogleSheets = async (sheetsCsvUrl) => {
    if (!sheetsCsvUrl) return [];
    const respuesta = await fetch(sheetsCsvUrl, {
      headers: { Accept: 'text/csv, application/json;q=0.9, */*;q=0.8' },
      cache: 'no-store',
    });
    if (!respuesta.ok) throw new Error(`Google Sheets respondió ${respuesta.status}`);
    const contenido = await respuesta.text();
    const tipoJSON = /json/i.test(respuesta.headers.get('content-type') || '') ||
      /^[\s]*[\[{]/.test(contenido);
    let datos = contenido;
    if (tipoJSON) {
      try {
        datos = JSON.parse(contenido);
      } catch {
        throw new Error('La respuesta de Google Sheets no contiene un JSON válido.');
      }
    }
    const filas = convertirDatosSheets(datos);
    if (!filas.length) throw new Error('Google Sheets no contiene filas válidas con Curso Oficial y Sección.');
    return filas;
  };
})();
