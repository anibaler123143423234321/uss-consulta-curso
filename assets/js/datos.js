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

  // Programación real extraída de los documentos oficiales Canva CINF
  horarios: [
    /* ==========================================================================
       CICLO ENERO 2027 (Fuente: documentos/2027-2.pdf)
       Clases: 11/01/2027 al 20/02/2027 (06 semanas) · Modalidad: Virtual USS Zoom
       ========================================================================== */
    // Word 365
    { ciclo: 'enero', curso: 'Word 365', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Word 365', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Word 365', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Martes, jueves y sábado',    horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Excel 365
    { ciclo: 'enero', curso: 'Excel 365', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Excel 365', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Excel 365', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Martes, jueves y sábado',    horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Diseño con Canva
    { ciclo: 'enero', curso: 'Diseño con Canva', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Diseño con Canva', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Sábados',          horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Excel Asociado
    { ciclo: 'enero', curso: 'Excel Asociado', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Lunes, miércoles y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Excel Asociado', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Martes y jueves',            horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Excel Asociado', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Lunes, miércoles y viernes', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Microsoft Word Asociado
    { ciclo: 'enero', curso: 'Microsoft Word Asociado', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes y jueves',  horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Microsoft Word Asociado', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Power BI para Análisis de Datos
    { ciclo: 'enero', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Martes y jueves',  horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Lunes y miércoles', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD c', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Sábados',          horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // AutoCAD 2D
    { ciclo: 'enero', curso: 'AutoCAD 2D', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes y jueves',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'AutoCAD 2D', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // AutoCAD 3D
    { ciclo: 'enero', curso: 'AutoCAD 3D', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'AutoCAD 3D', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes y viernes', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Microsoft Project
    { ciclo: 'enero', curso: 'Microsoft Project', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche',  dias: 'Lunes y miércoles', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Microsoft Project', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Mañana', dias: 'Sábados',          horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Software Bizagi
    { ciclo: 'enero', curso: 'Software Bizagi', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Diseño Web
    { ciclo: 'enero', curso: 'Diseño Web', seccion: 'PEAD a', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Lunes y miércoles', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'enero', curso: 'Diseño Web', seccion: 'PEAD b', inicio: '11/01/2027', fin: '20/02/2027', turno: 'Noche', dias: 'Martes y jueves',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    /* ==========================================================================
       CICLO SETIEMBRE / NOVIEMBRE 2026 (Fuente: documentos/HORARIOS NOVIEMBRE.pdf)
       Clases: 09/11/2026 al 19/12/2026 (06 semanas) · Modalidad: Virtual USS Zoom
       ========================================================================== */
    // Word 365
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD ah', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD ai', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD aj', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD ak', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes',  horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD al', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes',  horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD am', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes',  horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD an', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Tarde',  dias: 'Lunes y martes',  horario: '03:00 p. m. – 07:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD ao', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD ap', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD aq', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD ar', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD as', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD u',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD v',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD w',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD x',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes',  horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD y',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Lunes y martes',  horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD z',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Word 365', seccion: 'PEAD aa', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Excel 365
    { ciclo: 'setiembre', curso: 'Excel 365', seccion: 'PEAD ab', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel 365', seccion: 'PEAD ac', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel 365', seccion: 'PEAD ad', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel 365', seccion: 'PEAD ae', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel 365', seccion: 'PEAD af', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel 365', seccion: 'PEAD ag', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Lunes y martes',  horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Excel Asociado
    { ciclo: 'setiembre', curso: 'Excel Asociado', seccion: 'PEAD k',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel Asociado', seccion: 'PEAD l',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel Asociado', seccion: 'PEAD m',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel Asociado', seccion: 'PEAD n',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel Asociado', seccion: 'PEAD o',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Excel Asociado', seccion: 'PEAD g',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Microsoft Word Asociado
    { ciclo: 'setiembre', curso: 'Microsoft Word Asociado', seccion: 'PEAD f',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Microsoft Word Asociado', seccion: 'PEAD g',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Microsoft Word Asociado', seccion: 'PEAD m',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Microsoft Word Asociado', seccion: 'PEAD ap', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // AutoCAD 2D
    { ciclo: 'setiembre', curso: 'AutoCAD 2D', seccion: 'PEAD e', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'AutoCAD 2D', seccion: 'PEAD f', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche', dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // AutoCAD 3D
    { ciclo: 'setiembre', curso: 'AutoCAD 3D', seccion: 'PEAD c',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'AutoCAD 3D', seccion: 'PEAD aj', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'AutoCAD 3D', seccion: 'PEAD am', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 11:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'AutoCAD 3D', seccion: 'PEAD e',  inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },

    // Power BI para Análisis de Datos
    { ciclo: 'setiembre', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD h', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD i', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD m', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Noche',  dias: 'Martes y jueves', horario: '07:00 p. m. – 10:30 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
    { ciclo: 'setiembre', curso: 'Power BI para Análisis de Datos', seccion: 'PEAD g', inicio: '09/11/2026', fin: '19/12/2026', turno: 'Mañana', dias: 'Martes y jueves', horario: '08:00 a. m. – 12:00 p. m.', aula: 'Virtual · Zoom', docente: '', linkAula: '', cupos: 30 },
  ],
};
