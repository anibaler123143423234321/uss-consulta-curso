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
  // Ciclos oficiales de apertura CINF y su duración
  ciclos: [
    { id: 'noviembre', nombre: 'Noviembre', duracion: '6 semanas' },
    { id: 'enero', nombre: 'Enero', duracion: '6 semanas' },
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

  // Plan Tradicional: no pertenece a una ruta, así que se muestra a todas las carreras
  cursosParaTodos: [
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
       16 grupos generales + 4 de Computación II por especialidad (hoja «Horarios enero 2027»).
       ========================================================================== */
    // Word 365
    { ciclo: 'enero', curso: 'Word 365', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Word 365', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Word 365', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Excel 365
    { ciclo: 'enero', curso: 'Excel 365', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Martes, jueves y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Excel 365', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Excel 365', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Diseño con Canva
    { ciclo: 'enero', curso: 'Diseño con Canva', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Diseño con Canva', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Martes, jueves y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Diseño con Canva', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Diseño con Canva', seccion: 'PEAD d', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Excel Asociado
    { ciclo: 'enero', curso: 'Excel Asociado', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // AutoCAD 2D
    { ciclo: 'enero', curso: 'AutoCAD 2D', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Martes, jueves y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // AutoCAD 3D
    { ciclo: 'enero', curso: 'AutoCAD 3D', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Computación II
    { ciclo: 'enero', curso: 'Computación II', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Computación III
    { ciclo: 'enero', curso: 'Computación III', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Computación III', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Computación II por especialidad: cada grupo solo se muestra a su carrera (ver especialidades)
    { ciclo: 'enero', curso: 'Computación II', seccion: 'PEAD CIV', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Computación II', seccion: 'PEAD SIST', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Computación II', seccion: 'PEAD MEC', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Computación II', seccion: 'PEAD ARQ', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes, jueves y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    /* ==========================================================================
       CICLO NOVIEMBRE 2026 (Fuente: documentos/HORARIOS NOVIEMBRE.pdf, revisado página por página)
       Clases: 09/11/2026 al 19/12/2026 (06 semanas) · Modalidad: Virtual USS Zoom
       ========================================================================== */
    // Word 365
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD ah', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD ai', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD aj', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD ak', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Miércoles y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD al', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Viernes y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD am', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD an', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Tarde', dias: 'Viernes y sábado', horario: '03:00 p. m. – 07:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD ao', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD ap', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD aq', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD ar', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y martes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Word 365', seccion: 'PEAD as', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Excel 365
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD u', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y martes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD v', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Miércoles y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD w', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD x', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Miércoles y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD y', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Viernes y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD z', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y martes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel 365', seccion: 'PEAD aa', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Diseño con Canva
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD aa', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y martes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ab', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Miércoles y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ac', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ad', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y miércoles', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ae', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD af', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Viernes y sábado', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ag', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y martes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ah', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Miércoles y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Diseño con Canva', seccion: 'PEAD ai', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Excel Asociado
    { ciclo: 'noviembre', curso: 'Excel Asociado', seccion: 'PEAD k', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel Asociado', seccion: 'PEAD l', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel Asociado', seccion: 'PEAD m', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel Asociado', seccion: 'PEAD n', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Excel Asociado', seccion: 'PEAD o', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Microsoft Word Asociado
    { ciclo: 'noviembre', curso: 'Microsoft Word Asociado', seccion: 'PEAD g', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // AutoCAD 2D
    { ciclo: 'noviembre', curso: 'AutoCAD 2D', seccion: 'PEAD f', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'AutoCAD 2D', seccion: 'PEAD g', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // AutoCAD 3D
    { ciclo: 'noviembre', curso: 'AutoCAD 3D', seccion: 'PEAD e', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'AutoCAD 3D', seccion: 'PEAD f', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Diseño Web
    { ciclo: 'noviembre', curso: 'Diseño Web', seccion: 'PEAD c', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Power BI para Análisis de Datos
    { ciclo: 'noviembre', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD c', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Computación II
    { ciclo: 'noviembre', curso: 'Computación II', seccion: 'PEAD h', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Computación II', seccion: 'PEAD i', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Computación II', seccion: 'PEAD b (Mecánica)', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Computación II', seccion: 'PEAD b (Arquitectura)', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes', horario: '08:00 a. m. – 11:30 a. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Computación III
    { ciclo: 'noviembre', curso: 'Computación III', seccion: 'PEAD m', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Computación III', seccion: 'PEAD n', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Computación III', seccion: 'PEAD o', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Viernes y sábado', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Computación III', seccion: 'PEAD b (Mecánica)', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Jueves y sábado', horario: '08:00 a. m. – 11:30 a. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    // Taller de Certificación Microsoft (presencial, Elías Aguirre 933)
    { ciclo: 'noviembre', curso: 'Taller de Certificación Internacional', seccion: 'PEAD D (Word)', inicio: '11/11/2026', fin: '25/11/2026', turno: 'Mañana', dias: '11, 18 y 25 de noviembre', horario: '08:30 a. m. – 10:30 a. m.', aula: 'Presencial · Elías Aguirre 933', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'noviembre', curso: 'Taller de Certificación Internacional', seccion: 'PEAD D (Excel)', inicio: '13/11/2026', fin: '27/11/2026', turno: 'Mañana', dias: '13, 20 y 27 de noviembre', horario: '08:30 a. m. – 10:30 a. m.', aula: 'Presencial · Elías Aguirre 933', docente: '', linkAula: '', cupos: 30 },
  ],
};

/** Una sección de especialidad (PEAD CIV, PEAD b (Mecánica)…) solo se muestra a su carrera. */
window.CONSULTA_CURSOS.seccionVisible = (seccion, carrera) => {
  const grupo = window.CONSULTA_CURSOS.especialidades.find((e) => e.patron.test(seccion || ''));
  return !grupo || grupo.carreras.includes(carrera);
};
