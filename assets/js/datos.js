/**
 * USS Consulta de Cursos - Datos Oficiales CINF
 * Archivo: assets/js/datos.js
 *
 * Contiene SOLO metadatos estructurales (ciclos, rutas, carreras, especialidades,
 * calendario). Las secciones y horarios NO viven aquí: llegan 100% por Internet
 * desde las hojas de Google Drive publicadas como CSV (assets/js/config.js),
 * a través de catalogo.cargarHorariosRemotos().
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

  // Calendario oficial de clases por ciclo (metadato estructural, NO son horarios).
  // Se usa solo si la hoja de Drive no trae las columnas FECHA INICIO / FECHA FIN.
  // Clave: '<año>-<ciclo>'. Si un ciclo no figura aquí ni en la hoja, se muestra «Por confirmar».
  calendarioCiclos: {
    '2026-noviembre': { inicio: '09/11/2026', fin: '19/12/2026' },
    '2027-enero': { inicio: '11/01/2027', fin: '20/02/2027' },
  },

  // Vacío a propósito: el 100% de las secciones llega por Internet desde las hojas
  // de Google Drive configuradas en assets/js/config.js (window.GOOGLE_SHEETS_URLS).
  horarios: [],
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
 * Integración con Google Drive (única fuente de horarios).
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

  // «LUN-MIE-VIE», «MAR.JUE», «VIE-SAB» → «Lunes, miércoles y viernes».
  // Si no son abreviaturas de días (p. ej. «10,17 Y 24»), se respeta el texto original.
  const NOMBRES_DIAS = {
    lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves', vie: 'viernes', sab: 'sábado', dom: 'domingo',
  };
  function expandirDias(valor) {
    const raw = String(valor || '').trim();
    const tokens = normalizarCabecera(raw).split(' ').filter((t) => t && t !== 'y');
    if (!tokens.length || !tokens.every((t) => NOMBRES_DIAS[t.slice(0, 3)] && t.length <= 9)) return raw;
    const nombres = tokens.map((t) => NOMBRES_DIAS[t.slice(0, 3)]);
    const texto = nombres.length > 1
      ? `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`
      : nombres[0];
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Año académico de la fila: PERIODO «2026 02» → 2026; si no hay, se toma de FECHA INICIO.
  function anioDeRegistro(registro) {
    const periodo = obtener(registro, ['Periodo', 'Año', 'Anio']);
    const desdePeriodo = periodo.match(/\b(20\d{2})/);
    if (desdePeriodo) return desdePeriodo[1];
    const fecha = obtener(registro, ['Fecha Inicio', 'Fecha de Inicio']);
    return fecha.match(/\b(20\d{2})\b/)?.[1] || '';
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
    // ESTADO de la hoja: APERTURADO y CERRADO se muestran (el estudiante ve qué sección ya no
    // recibe matrícula); vacío = «Por confirmar». Otros valores (ANULADO, CANCELADO…) no se publican.
    const estadoRaw = normalizarCabecera(obtener(registro, ['Estado', 'Condicion', 'Status']));
    let estado = 'Por confirmar';
    if (estadoRaw.includes('apert') || estadoRaw === 'abierto') estado = 'Aperturado';
    else if (estadoRaw.includes('cerr')) estado = 'Cerrado';
    else if (estadoRaw) return null;

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

    const dias = expandirDias(obtener(registro, ['Días', 'Dias']));

    let turno = obtener(registro, ['Turno']);
    const tNorm = normalizarCabecera(turno);
    if (tNorm === 'manana') turno = 'Mañana';
    else if (tNorm === 'tarde') turno = 'Tarde';
    else if (tNorm === 'noche') turno = 'Noche';

    let aula = obtener(registro, ['Aula', 'Modalidad']);
    if (normalizarCabecera(aula).includes('virtual')) aula = 'Virtual · Zoom';
    else if (normalizarCabecera(aula).includes('presencial')) aula = 'Presencial · Elías Aguirre 933';

    // Fechas: 1) columnas FECHA INICIO / FECHA FIN de la hoja; 2) calendario oficial del ciclo;
    // 3) vacío → la interfaz muestra «Por confirmar». Nunca se inventan fechas de otro ciclo.
    const anio = anioDeRegistro(registro, ciclo);
    const calendario = (catalogo.calendarioCiclos || {})[`${anio}-${ciclo}`] || {};
    const inicio =
      normalizarFecha(obtener(registro, ['Fecha Inicio', 'Fecha de Inicio', 'Inicio de clases'])) ||
      calendario.inicio || '';
    const fin =
      normalizarFecha(obtener(registro, ['Fecha Fin', 'Fecha de Fin', 'Fin de clases'])) ||
      calendario.fin || '';

    return {
      id: obtener(registro, ['ID', 'Id']) || `sheets-${ciclo}-${indice + 1}`,
      ciclo,
      anio,
      modelo: modeloCalculado,
      curso: cursoNormalizado,
      seccion: seccion,
      estado,
      inicio,
      fin,
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

  /** Hojas fijas declaradas en config.js (una por ciclo), sin duplicados. */
  catalogo.urlsHojasDrive = () => {
    const lista = [
      ...(Array.isArray(window.GOOGLE_SHEETS_URLS) ? window.GOOGLE_SHEETS_URLS : []),
      window.GOOGLE_SHEETS_URL,
      window.GOOGLE_SHEETS_CSV_URL,
    ];
    return [...new Set(lista.map((url) => String(url || '').trim()).filter(Boolean))];
  };

  const conTiempoMaximo = async (url, tiempoMaximoMs) => {
    const controlador = typeof AbortController === 'function' ? new AbortController() : null;
    const temporizador = controlador ? setTimeout(() => controlador.abort(), tiempoMaximoMs) : null;
    try {
      const respuesta = await fetch(url, { cache: 'no-store', signal: controlador?.signal });
      if (!respuesta.ok) throw new Error(`Google Drive respondió ${respuesta.status}`);
      return await respuesta.text();
    } finally {
      if (temporizador) clearTimeout(temporizador);
    }
  };

  /**
   * Hojas descubiertas automáticamente en la carpeta de Drive (Apps Script «?accion=indice»).
   * Así, una hoja creada desde el Panel Admin aparece en el portal sin tocar config.js.
   * Si el índice no está configurado o falla, se sigue solo con las hojas fijas.
   */
  catalogo.urlsHojasIndice = async (tiempoMaximoMs = 15000) => {
    const indice = String(window.CINF_DRIVE_INDICE_URL || '').trim();
    if (!indice) return [];
    try {
      const separador = indice.includes('?') ? '&' : '?';
      const json = JSON.parse(await conTiempoMaximo(`${indice}${separador}accion=indice`, tiempoMaximoMs));
      return (json?.hojas || []).map((h) => String(h.csvUrl || '').trim()).filter(Boolean);
    } catch (error) {
      console.warn('No se pudo leer el índice de hojas de Google Drive:', error);
      return [];
    }
  };

  // Una misma hoja puede llegar por config.js y por el índice (con URLs distintas): se une sin repetir.
  const claveSeccion = (h) =>
    [h.anio, h.ciclo, h.curso, h.seccion, h.dias, h.horario, h.docente].map((v) => normalizarCabecera(v)).join('|');

  /**
   * Descarga en paralelo TODAS las hojas de Drive y une sus secciones.
   * - Si una hoja falla pero otras responden, se muestran las que llegaron (y se avisa en consola).
   * - Si fallan todas, lanza un error: la interfaz muestra «Reintentar conexión», nunca datos locales.
   */
  catalogo.cargarHorariosRemotos = async ({ tiempoMaximoMs = 20000 } = {}) => {
    const urls = [...new Set([...catalogo.urlsHojasDrive(), ...(await catalogo.urlsHojasIndice())])];
    if (!urls.length) throw new Error('No hay hojas de Google Drive configuradas en config.js.');

    const descargar = async (url) => {
      const contenido = await conTiempoMaximo(url, tiempoMaximoMs);
      const datos = /^[\s]*[\[{]/.test(contenido) ? JSON.parse(contenido) : contenido;
      return convertirDatosSheets(datos);
    };

    const resultados = await Promise.allSettled(urls.map(descargar));
    const fallidas = resultados.filter((r) => r.status === 'rejected');
    fallidas.forEach((r) => console.warn('Una hoja de Google Drive no respondió:', r.reason));
    if (fallidas.length === resultados.length) {
      throw new Error('No se pudo conectar con Google Drive.');
    }

    const vistas = new Set();
    return resultados
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .filter((h) => {
        const clave = claveSeccion(h);
        if (vistas.has(clave)) return false;
        vistas.add(clave);
        return true;
      });
  };
})();
