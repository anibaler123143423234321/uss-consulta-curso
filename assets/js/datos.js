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
  // Ciclos oficiales de apertura CINF y su duración (Noviembre culminó; Enero 2027 es el ciclo activo)
  ciclos: [
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
