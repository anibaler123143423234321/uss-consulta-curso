/**
 * USS Consulta de Cursos - Vista de Horarios (horarios.html)
 * Archivo: assets/js/horarios.js
 *
 * Funcionalidad:
 * 1. Lee parámetros de URL (?ciclo=enero&carrera=Psicologia).
 * 2. Muestra banner oficial de la carrera y ruta de aprendizaje CINF.
 * 3. Muestra únicamente la carrera, modelo y ciclo seleccionados en el portal.
 * 4. Descarga las secciones en vivo desde Google Drive (config.js); la API REST es
 *    respaldo en línea. Sin datos locales: si no hay red, muestra «Reintentar conexión».
 * 5. Filtra por cursos correspondientes a la carrera, turno y búsqueda en vivo.
 */
document.addEventListener('DOMContentLoaded', () => {
  const {
    ciclos,
    rutas,
    cursosTradicionales = [],
    cursosParaTodos = [],
  } = window.CONSULTA_CURSOS;
  const $ = (id) => document.getElementById(id);

  // 1. Obtener parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const carreraParam = params.get('carrera');
  const cicloSolicitado = (params.get('ciclo') || 'enero').toLowerCase();
  let anioActivo = /^\d{4}$/.test(params.get('anio') || '') ? params.get('anio') : '';
  let cicloActivo = ciclos.some((ciclo) => ciclo.id.toLowerCase() === cicloSolicitado)
    ? cicloSolicitado
    : (ciclos[0]?.id || 'enero').toLowerCase();
  const modeloRaw = (params.get('modelo') || '').toLowerCase().trim();

  // Configurar enlace de retorno al portal
  const enDominioUnificado = /informatica-uss|ecosistema-uss|uss\.edu\.pe/.test(window.location.hostname);
  const dentroDelPortal = window.location.pathname.includes('/consulta-cursos');
  const homePath = dentroDelPortal ? './' : enDominioUnificado ? 'consulta-cursos' : 'index.html';

  // Si no hay carrera seleccionada, redirigir al portal
  if (!carreraParam) {
    window.location.href = homePath;
    return;
  }

  const carrera = carreraParam.trim();

  // Si no se eligió un modelo válido en la URL, redirigir al portal para que elija explícitamente
  // (evita que PROTECH XP quede seleccionado automáticamente sin elección del estudiante)
  if (!['protech', 'tradicional'].includes(modeloRaw)) {
    window.location.href = `${homePath}?carrera=${encodeURIComponent(carrera)}`;
    return;
  }

  let modeloActivo = modeloRaw;

  const btnVolver = $('btn-volver-atras');
  const actualizarEnlaceVolver = () => {
    if (btnVolver) {
      // La portada no restaura el modelo: el estudiante lo vuelve a elegir
      btnVolver.href = `${homePath}?carrera=${encodeURIComponent(carrera)}`;
    }
  };
  actualizarEnlaceVolver();

  const btnOtraCarrera = $('btn-elegir-otra-carrera');
  if (btnOtraCarrera) {
    btnOtraCarrera.href = homePath;
  }

  // 2. Identificar la Ruta Oficial de la Carrera
  // Algunas carreras llevan dos rutas (Sistemas: 5 y 7; Arquitectura y Civil: 4 y 6) y ven los cursos de ambas
  const rutasDeCarrera = rutas.filter((r) => r.carreras.includes(carrera));
  const ruta = rutasDeCarrera[0] || {
    id: 0,
    nombre: 'Ruta Especial',
    cursos: [],
  };
  const idsRutas = rutasDeCarrera.length ? rutasDeCarrera.map((r) => r.id) : [ruta.id];

  const cursosRutaCarrera = new Set(
    rutas
      .filter((r) => r.carreras.includes(carrera))
      .flatMap((r) => r.cursos)
  );

  const cursosTradicionalesSet = new Set(
    cursosTradicionales.length > 0 ? cursosTradicionales : cursosParaTodos
  );

  const cursosPermitidosActivos = () =>
    modeloActivo === 'tradicional' ? cursosTradicionalesSet : cursosRutaCarrera;

  // Filtro por modelo y carrera:
  // - En PROTECH XP: solo cursos de la ruta oficial de su carrera (NUNCA Computación II o III).
  // - En Plan Tradicional: solo cursos tradicionales (Computación I, II, III), respetando grupos de especialidad.
  const esDeLaCarrera = (h) => {
    const modeloFila =
      h.modelo ||
      (window.CONSULTA_CURSOS.esCursoDeModelo(h.curso, 'tradicional') ? 'tradicional' : 'protech');
    if (modeloFila !== modeloActivo) return false;

    const permitidos = cursosPermitidosActivos();
    // El taller de certificación es de PROTECH XP y lo ve toda carrera de ese modelo
    const tallerProtech = modeloActivo === 'protech' && window.CONSULTA_CURSOS.esTallerCertificacion(h.curso);
    if (!permitidos.has(h.curso) && !tallerProtech) return false;

    return window.CONSULTA_CURSOS.filaVisible(h, carrera);
  };

  // La API devuelve «Word 365 (Protech XP)»; las rutas lo llaman «Word 365»
  const limpiarCurso = (nombre) => (nombre || '').replace(/\s*\(Protech XP\)\s*/i, '').trim();

  // Pintar banner de carrera y modelo
  $('txt-carrera-nombre').textContent = carrera;
  $('txt-ruta-badge').textContent = idsRutas.length > 1 ? `Rutas ${idsRutas.join(' y ')}` : `Ruta ${ruta.id}`;
  const nombresRutas = (rutasDeCarrera.length ? rutasDeCarrera : [ruta]).map((r) => r.nombre.replace(/^Ruta \d+ · /, ''));
  $('txt-ruta-nombre').textContent = `(${nombresRutas.join(' · ')})`;

  iniciarConoceRuta();

  // «Conoce tu ruta»: carrusel a mano (sin avance automático) con las imágenes oficiales de las rutas.
  // Solo en PROTECH XP; abre en la imagen de la ruta de la carrera y marca sus botones.
  function iniciarConoceRuta() {
    const seccion = $('conoce-ruta');
    const pista = $('conoce-ruta-pista');
    if (!seccion || !pista) return;
    if (modeloActivo !== 'protech') {
      seccion.hidden = true;
      return;
    }
    const slides = [...pista.querySelectorAll('.conoce-ruta__slide')];
    const puntos = [...seccion.querySelectorAll('.conoce-ruta__punto')];
    const anterior = $('conoce-ruta-anterior');
    const siguiente = $('conoce-ruta-siguiente');
    const esDeLaCarrera = (el) => (el.dataset.rutas || '').split(',').some((id) => idsRutas.includes(Number(id)));
    const suave = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
    let actual = 0;

    puntos.forEach((p) => {
      if (!esDeLaCarrera(p)) return;
      p.classList.add('es-tu-ruta');
      p.setAttribute('aria-label', `${p.getAttribute('aria-label')}, tu ruta`);
    });
    const texto = $('conoce-ruta-texto');
    if (texto && rutasDeCarrera.length) {
      const nombre = idsRutas.length > 1 ? `las rutas ${idsRutas.join(' y ')}` : `la ruta ${idsRutas[0]}`;
      texto.textContent = `${carrera} lleva ${nombre}. Eliges 3 cursos en el orden que quieras y terminas con 1 taller de certificación internacional.`;
    }

    const marcar = (i) => {
      actual = i;
      puntos.forEach((p, j) => p.setAttribute('aria-current', j === i ? 'true' : 'false'));
      if (anterior) anterior.disabled = i === 0;
      if (siguiente) siguiente.disabled = i === slides.length - 1;
    };
    const ir = (i, comportamiento = suave()) => {
      const destino = Math.max(0, Math.min(slides.length - 1, i));
      pista.scrollTo({ left: slides[destino].offsetLeft, behavior: comportamiento });
      marcar(destino);
    };

    anterior?.addEventListener('click', () => ir(actual - 1));
    siguiente?.addEventListener('click', () => ir(actual + 1));
    puntos.forEach((p, i) => p.addEventListener('click', () => ir(i)));
    pista.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); }
    });
    // Al deslizar con el dedo o el trackpad, el botón activo sigue a la imagen visible
    let espera;
    pista.addEventListener('scroll', () => {
      clearTimeout(espera);
      espera = setTimeout(() => {
        // La imagen más cercana al borde izquierdo de la pista es la visible
        const x = pista.scrollLeft;
        let i = 0;
        slides.forEach((s, j) => {
          if (Math.abs(s.offsetLeft - x) < Math.abs(slides[i].offsetLeft - x)) i = j;
        });
        if (i !== actual) marcar(i);
      }, 120);
    }, { passive: true });

    // Cerrado al cargar: al abrirlo por primera vez se ubica en la imagen de la ruta de la carrera
    const primera = slides.findIndex(esDeLaCarrera);
    let ubicado = false;
    marcar(primera > 0 ? primera : 0);
    seccion.addEventListener('toggle', () => {
      if (!seccion.open || ubicado) return;
      ubicado = true;
      ir(primera > 0 ? primera : 0, 'auto');
    });
  }
  const cicloSeleccionado = ciclos.find((ciclo) => ciclo.id.toLowerCase() === cicloActivo);
  const badgeCiclo = $('txt-ciclo-badge');
  if (badgeCiclo && cicloSeleccionado) {
    badgeCiclo.textContent = cicloSeleccionado.nombre;
    badgeCiclo.title = 'Ciclo seleccionado';
  }

  function actualizarBadgeModelo() {
    const badge = $('txt-modelo-badge');
    if (!badge) return;
    if (modeloActivo === 'tradicional') {
      badge.className = 'banner-carrera__modelo-badge banner-carrera__modelo-badge--tradicional';
      badge.textContent = 'Plan Tradicional';
    } else {
      badge.className = 'banner-carrera__modelo-badge banner-carrera__modelo-badge--protech';
      badge.textContent = 'Modelo PROTECH XP';
    }
  }
  actualizarBadgeModelo();

  // 4. Fuente de datos: solo en línea (Google Drive y, de respaldo, la API REST)
  let horariosCargados = [];
  let fuenteEnVivo = false;

  const resolveApiBase = () => {
    if (window.API_BASE_URL) return window.API_BASE_URL.replace(/\/+$/, '');
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
    if (location.hostname.includes('vercel.app') || location.hostname.endsWith('uss.edu.pe')) {
      return '/api';
    }
    return 'https://informatica-uss.vercel.app/api';
  };

  const normalizar = (texto) =>
    (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  function formatearFecha(iso) {
    if (!iso) return '—';
    const partes = String(iso).split('T')[0].split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return iso;
  }

  function formatearHora12(horaStr) {
    if (!horaStr) return '—';
    const partes = String(horaStr).split(':');
    let h = parseInt(partes[0], 10);
    const m = partes[1] || '00';
    if (isNaN(h)) return horaStr;
    const ampm = h >= 12 ? 'p. m.' : 'a. m.';
    h = h % 12;
    if (h === 0) h = 12;
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}:${m} ${ampm}`;
  }

  // Columna Docente oculta por ahora (pedido del Centro de Informática). Para mostrarla: true
  // y descomentar su <th> en horarios.html.
  const MOSTRAR_DOCENTE = false;

  // 4.1 Identidad y Colores Temáticos por Curso Oficial
  // Ícono (assets/img/cursos/<icono>.svg) y color de cada curso del catálogo oficial (21 cursos).
  // Se revisa en orden: «Diseño Mecánico con AutoCAD 3D» debe caer en AutoCAD y no en Diseño Web.
  // Mantener igual a ecosistema-cinf/src/lib/iconoCurso.ts (mismo juego de SVG).
  const ICONOS_CURSO = [
    { patron: /^taller|certificacion/, icono: 'taller', color: 'taller' },
    { patron: /word/, icono: 'word', color: 'word' },
    { patron: /excel/, icono: 'excel', color: 'excel' },
    { patron: /canva/, icono: 'canva', color: 'canva' },
    { patron: /autocad|\bcad\b|diseno mecanico/, icono: 'autocad', color: 'autocad' },
    { patron: /web/, icono: 'diseno-web', color: 'web' },
    { patron: /project/, icono: 'project', color: 'project' },
    { patron: /bizagi/, icono: 'bizagi', color: 'bizagi' },
    { patron: /base de datos|cientific/, icono: 'base-datos', color: 'basedatos' },
    { patron: /sketch/, icono: 'sketchup', color: 'sketchup' },
    { patron: /revit/, icono: 'revit', color: 'revit' },
    { patron: /solid ?works/, icono: 'solidworks', color: 'solidworks' },
    { patron: /matlab/, icono: 'matlab', color: 'matlab' },
    { patron: /power ?bi/, icono: 'power-bi', color: 'powerbi' },
    { patron: /spss/, icono: 'spss', color: 'spss' },
    { patron: /computacion/, icono: 'computacion', color: 'tradicional' },
  ];

  function datosVisualesCurso(nombre) {
    const n = (nombre || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    return ICONOS_CURSO.find((c) => c.patron.test(n)) || { icono: 'software', color: 'default' };
  }

  function obtenerClaseColorCurso(nombre) {
    return `badge-curso--${datosVisualesCurso(nombre).color}`;
  }

  function obtenerIconoCurso(nombre) {
    return datosVisualesCurso(nombre).icono;
  }

  // 4.2 Carga 100% por Internet: hojas de Google Drive (config.js) y, solo si TODAS fallan,
  // la API REST. Nunca se usan datos locales: si no hay red se muestra «Reintentar conexión».
  async function cargarDesdeApi() {
    const resp = await fetch(`${resolveApiBase()}/horarios`, { headers: { Accept: 'application/json' } });
    if (!resp.ok) throw new Error(`API respondió ${resp.status}`);
    const json = await resp.json();
    const filas = Array.isArray(json) ? json : (json.data || []);
    if (!filas.length) throw new Error('La API no devolvió horarios.');
    return filas.map((r) => {
      const cLimpio = limpiarCurso(r.curso);
      const modFila =
        r.modelo ||
        (window.CONSULTA_CURSOS.esCursoDeModelo(cLimpio, 'tradicional') ? 'tradicional' : 'protech');
      return {
        id: r.id,
        ciclo: (r.ciclo || '').toLowerCase(),
        anio: r.anio ? String(r.anio) : '',
        modelo: modFila,
        curso: cLimpio,
        seccion: r.seccion || '',
        estado: 'Aperturado', // la API solo devuelve secciones publicadas
        inicio: formatearFecha(r.fechaInicio),
        fin: formatearFecha(r.fechaFin),
        turno: r.turno || '',
        dias: r.dias || '',
        // Sin dato en la API = campo vacío (la tabla dice «—» o «por confirmar»), nunca un valor de ejemplo
        horario: r.horaInicio && r.horaFin ? `${formatearHora12(r.horaInicio)} – ${formatearHora12(r.horaFin)}` : '',
        aula: r.aula === 'Virtual' ? 'Virtual · Zoom' : (r.aula || ''),
        cupos: Number.isFinite(Number(r.cupos)) && r.cupos !== null && r.cupos !== '' ? Number(r.cupos) : null,
        cuposDisponibles: r.cuposDisponibles ?? null,
        cuposTotal: Number.isFinite(Number(r.cupos)) && r.cupos !== null && r.cupos !== '' ? Number(r.cupos) : null,
        docente: r.docente || '',
        linkAula: r.linkAula || null,
      };
    });
  }

  // Caja de estado de red (esqueleto mientras descarga / alerta con reintento si falla)
  const cajaTablaScroll = document.querySelector('.tabla-horarios__scroll');
  const estadoRed = document.createElement('div');
  estadoRed.id = 'estado-red-horarios';
  estadoRed.hidden = true;
  cajaTablaScroll?.before(estadoRed);

  function mostrarEstadoRed(estado) {
    const conteo = $('conteo-secciones');
    $('sin-horarios').hidden = true;
    if (cajaTablaScroll) cajaTablaScroll.hidden = true;
    estadoRed.hidden = false;
    estadoRed.replaceChildren();
    if (estado === 'cargando') {
      estadoRed.className = 'estado-red estado-red--cargando';
      estadoRed.setAttribute('role', 'status');
      estadoRed.setAttribute('aria-live', 'polite');
      if (conteo) conteo.textContent = 'Cargando secciones…';
      // Cabecera: barra de progreso, spinner, qué se carga y de dónde
      const nombreCiclo = cicloSeleccionado ? cicloSeleccionado.nombre : 'tu ciclo';
      const progreso = document.createElement('div');
      progreso.className = 'carga__progreso';
      progreso.setAttribute('aria-hidden', 'true');
      const cabecera = document.createElement('div');
      cabecera.className = 'carga__cabecera';
      const spinner = document.createElement('span');
      spinner.className = 'estado-red__spinner';
      spinner.setAttribute('aria-hidden', 'true');
      const textos = document.createElement('div');
      const titulo = document.createElement('strong');
      titulo.className = 'carga__titulo';
      titulo.textContent = `Cargando los horarios de ${nombreCiclo}`;
      const detalle = document.createElement('span');
      detalle.className = 'carga__detalle';
      detalle.textContent = 'Leyendo la hoja oficial del Centro de Informática en Google Drive.';
      textos.append(titulo, detalle);
      cabecera.append(spinner, textos);

      // Filas fantasma con la forma de las columnas de la tabla
      const filas = document.createElement('div');
      filas.className = 'carga__filas';
      filas.setAttribute('aria-hidden', 'true');
      const celdas = ['icono', 'curso', 'corta', 'estado', 'doble', 'corta', 'doble', 'mini'];
      if (MOSTRAR_DOCENTE) celdas.push('docente');
      for (let i = 0; i < 6; i += 1) {
        const fila = document.createElement('div');
        fila.className = 'carga__fila';
        celdas.forEach((tipo) => {
          const celda = document.createElement('span');
          celda.className = `carga__celda carga__celda--${tipo}`;
          fila.appendChild(celda);
        });
        filas.appendChild(fila);
      }
      estadoRed.append(progreso, cabecera, filas);

      // Si Drive tarda, se avisa en vez de dejar el mismo texto
      setTimeout(() => {
        if (!estadoRed.hidden && estadoRed.classList.contains('estado-red--cargando')) {
          detalle.textContent = 'La hoja de Drive está tardando un poco más de lo normal. Seguimos esperando su respuesta.';
        }
      }, 5000);
      return;
    }
    estadoRed.className = 'estado-red estado-red--error';
    estadoRed.setAttribute('role', 'alert');
    if (conteo) conteo.textContent = 'Sin conexión con Google Drive';
    const titulo = document.createElement('p');
    titulo.className = 'estado-red__titulo';
    titulo.textContent = 'No pudimos conectar con Google Drive';
    const detalle = document.createElement('p');
    detalle.className = 'estado-red__texto';
    detalle.textContent = 'Revisa tu conexión a Internet e inténtalo de nuevo. Los horarios se publican solo en línea.';
    const acciones = document.createElement('div');
    acciones.className = 'estado-red__acciones';
    const reintentar = document.createElement('button');
    reintentar.type = 'button';
    reintentar.className = 'btn btn--primary btn--sm';
    reintentar.textContent = 'Reintentar conexión';
    reintentar.addEventListener('click', cargarDatos);
    const wsp = document.createElement('a');
    wsp.className = 'btn btn--secondary btn--sm';
    wsp.href = 'https://wa.me/51986724506';
    wsp.target = '_blank';
    wsp.rel = 'noopener noreferrer';
    wsp.textContent = 'Escribir a soporte por WhatsApp';
    acciones.append(reintentar, wsp);
    estadoRed.append(titulo, detalle, acciones);
  }

  async function cargarDatos() {
    mostrarEstadoRed('cargando');
    horariosCargados = [];
    try {
      horariosCargados = await window.CONSULTA_CURSOS.cargarHorariosRemotos();
      fuenteEnVivo = true;
    } catch (eDrive) {
      console.warn('Google Drive no disponible, probando API…', eDrive);
      try {
        horariosCargados = await cargarDesdeApi();
        fuenteEnVivo = true;
      } catch (eApi) {
        console.error('Sin conexión con las fuentes en línea:', eApi);
        fuenteEnVivo = false;
        mostrarEstadoRed('error');
        return;
      }
    }
    estadoRed.hidden = true;

    const filasCicloSeleccionado = horariosCargados.filter(
      (fila) => (fila.ciclo || '').toLowerCase() === cicloActivo && esDeLaCarrera(fila)
    );
    const obtenerAnio = (fila) =>
      String(fila?.anio || fila?.inicio || '').match(/\b(20\d{2})\b/)?.[1] || '';
    if (!anioActivo) anioActivo = obtenerAnio(filasCicloSeleccionado[0]);
    if (badgeCiclo && cicloSeleccionado) {
      badgeCiclo.textContent = `${cicloSeleccionado.nombre}${anioActivo ? ` ${anioActivo}` : ''}`;
      badgeCiclo.title = anioActivo
        ? `Ciclo seleccionado: ${cicloSeleccionado.nombre} ${anioActivo}`
        : 'Ciclo seleccionado';
    }

    leerFiltrosDeUrl();
    poblarFiltrosDinamicos();
    pintarTabla();
  }

  // 5. Filtros inteligentes
  const FILTROS = { curso: 'filtro-curso', turno: 'filtro-turno', dias: 'filtro-dias', aula: 'filtro-aula' };
  const esVirtual = (fila) => /zoom|virtual/i.test(fila.aula || '');

  const valoresFiltros = () => ({
    texto: normalizar($('filtro-texto')?.value),
    curso: $('filtro-curso')?.value || '',
    turno: $('filtro-turno')?.value || '',
    dias: $('filtro-dias')?.value || '',
    aula: $('filtro-aula')?.value || '',
  });

  // Aplica todos los filtros menos el indicado: así cada desplegable sabe cuántas filas daría cada opción
  function cumple(fila, f, omitir) {
    if (omitir !== 'curso' && f.curso && fila.curso !== f.curso) return false;
    if (omitir !== 'turno' && f.turno && fila.turno !== f.turno) return false;
    if (omitir !== 'dias' && f.dias && fila.dias !== f.dias) return false;
    if (omitir !== 'aula' && f.aula && (f.aula === 'zoom') !== esVirtual(fila)) return false;
    if (
      f.texto &&
      !normalizar(`${fila.curso} ${fila.seccion} ${MOSTRAR_DOCENTE ? fila.docente : ''} ${fila.dias} ${fila.aula} ${fila.turno} ${fila.horario}`).includes(f.texto)
    ) {
      return false;
    }
    return true;
  }

  const filasDelCiclo = () =>
    horariosCargados.filter((h) => {
      if ((h.ciclo || '').toLowerCase() !== cicloActivo || !esDeLaCarrera(h)) return false;
      if (!anioActivo) return true;
      const anioFila = String(h.anio || h.inicio || '').match(/\b(20\d{2})\b/)?.[1] || '';
      return anioFila === anioActivo;
    });

  // Reescribe las opciones con su conteo y deshabilita las que no darían resultados
  function poblarFiltrosDinamicos() {
    const filas = filasDelCiclo();
    const f = valoresFiltros();
    const ordenCursos = [...cursosPermitidosActivos()];

    const opciones = {
      curso: [...new Set(filas.map((h) => h.curso))].sort((a, b) => ordenCursos.indexOf(a) - ordenCursos.indexOf(b)).map((v) => [v, v]),
      turno: ['Madrugada', 'Mañana', 'Tarde', 'Noche'].map((v) => [v, v]),
      dias: [...new Set(filas.map((h) => h.dias).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es')).map((v) => [v, v]),
      aula: [['zoom', 'Virtual · Zoom'], ['presencial', 'Presencial']],
    };
    const todos = { curso: 'Todos los cursos', turno: 'Todos los turnos', dias: 'Todos los días', aula: 'Todas las aulas' };

    Object.entries(FILTROS).forEach(([clave, id]) => {
      const select = $(id);
      if (!select) return;
      const actual = select.value;
      const base = filas.filter((fila) => cumple(fila, f, clave));
      const contar = (valor) =>
        base.filter((fila) =>
          clave === 'aula' ? (valor === 'zoom') === esVirtual(fila) : fila[clave] === valor
        ).length;

      select.replaceChildren(new Option(`${todos[clave]} (${base.length})`, ''));
      opciones[clave].forEach(([valor, etiqueta]) => {
        const n = contar(valor);
        if (n === 0 && valor !== actual && clave !== 'turno' && clave !== 'aula') return;
        const opcion = new Option(`${etiqueta} (${n})`, valor);
        opcion.disabled = n === 0 && valor !== actual;
        select.appendChild(opcion);
      });
      select.value = [...select.options].some((o) => o.value === actual) ? actual : '';
      select.classList.toggle('filtro-activo', select.value !== '');
    });
  }

  // Los filtros viajan en la dirección: el enlace que se comparte abre la misma vista
  function leerFiltrosDeUrl() {
    const p = new URLSearchParams(window.location.search);
    if ($('filtro-texto')) $('filtro-texto').value = p.get('q') || '';
    Object.entries(FILTROS).forEach(([clave, id]) => {
      const valor = p.get(clave);
      if (valor && $(id)) {
        if (![...$(id).options].some((o) => o.value === valor)) $(id).appendChild(new Option(valor, valor));
        $(id).value = valor;
      }
    });
  }

  function guardarFiltrosEnUrl() {
    const url = new URL(window.location);
    const f = valoresFiltros();
    const pares = { q: $('filtro-texto')?.value.trim() || '', curso: f.curso, turno: f.turno, dias: f.dias, aula: f.aula };
    Object.entries(pares).forEach(([k, v]) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k)));
    window.history.replaceState(null, '', url);
  }

  function alCambiarFiltros() {
    poblarFiltrosDinamicos();
    pintarTabla();
  }

  // Resalta en la tabla lo que el estudiante escribió en el buscador
  function resaltar(celda, texto) {
    if (!texto) return;
    const contenido = celda.textContent;
    const plano = contenido.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const inicio = plano.indexOf(texto);
    if (inicio === -1 || plano.length !== contenido.length) return;
    const marca = document.createElement('mark');
    marca.className = 'resaltado';
    marca.textContent = contenido.slice(inicio, inicio + texto.length);
    const destino = celda.querySelector('strong, span') || celda;
    if (destino.textContent !== contenido) return;
    destino.replaceChildren(contenido.slice(0, inicio), marca, contenido.slice(inicio + texto.length));
  }

  const ETIQUETAS_CELDA = ['Curso', 'Sección', 'Estado', 'Fechas', 'Turno', 'Horario y días', 'Matriculados', 'Docente'];

  // 6. Renderizado de Filas de la Tabla con Filtros Multidimensionales
  const tbodyHorarios = $('filas-horarios');

  function seleccionarTarjetaSeccion(fila) {
    tbodyHorarios?.querySelectorAll('tr.seccion-seleccionada').forEach((seleccionada) => {
      seleccionada.classList.remove('seccion-seleccionada');
      seleccionada.setAttribute('aria-selected', 'false');
    });
    fila.classList.add('seccion-seleccionada');
    fila.setAttribute('aria-selected', 'true');
  }

  tbodyHorarios?.addEventListener('click', (evento) => {
    if (evento.target.closest('a, button, input, select, textarea')) return;
    const fila = evento.target.closest('tr');
    if (fila) seleccionarTarjetaSeccion(fila);
  });

  tbodyHorarios?.addEventListener('keydown', (evento) => {
    if (!['Enter', ' '].includes(evento.key)) return;
    const fila = evento.target.closest('tr');
    if (!fila) return;
    evento.preventDefault();
    seleccionarTarjetaSeccion(fila);
  });

  const actualizarAccesoTecladoTarjetas = () => {
    tbodyHorarios?.querySelectorAll('tr').forEach((fila) => {
      fila.tabIndex = window.matchMedia('(max-width: 767px)').matches ? 0 : -1;
    });
  };
  window.addEventListener('resize', actualizarAccesoTecladoTarjetas);

  function pintarTabla() {
    const tbody = tbodyHorarios;
    const sinHorarios = $('sin-horarios');
    const conteo = $('conteo-secciones');

    const f = valoresFiltros();
    const filasCarrera = filasDelCiclo();
    const filasVisibles = filasCarrera.filter((fila) => cumple(fila, f));

    guardarFiltrosEnUrl();

    // Orden de lectura: los cursos como en la ruta de la carrera y, dentro de cada uno, PEAD a, b… z, aa, ab…
    const ordenCursos = [...cursosPermitidosActivos()];
    const posicion = (curso) => {
      const i = ordenCursos.indexOf(curso);
      return i === -1 ? ordenCursos.length : i;
    };
    // Dentro de cada curso, las secciones cerradas van al final: primero lo que aún recibe matrícula.
    const esCerrada = (fila) => (fila.estado === 'Cerrado' ? 1 : 0);
    filasVisibles.sort(
      (x, y) =>
        posicion(x.curso) - posicion(y.curso) ||
        esCerrada(x) - esCerrada(y) ||
        x.seccion.length - y.seccion.length ||
        x.seccion.localeCompare(y.seccion, 'es')
    );

    conteo.textContent = `Mostrando ${filasVisibles.length} de ${filasCarrera.length} secciones programadas`;
    requestAnimationFrame(ajustarCajaTabla);

    // Sin resultados se oculta la caja de la tabla: solo queda el aviso con el botón para restablecer
    const cajaTabla = document.querySelector('.tabla-horarios__scroll');
    if (cajaTabla) cajaTabla.hidden = filasVisibles.length === 0;

    if (filasVisibles.length === 0) {
      tbody.replaceChildren();
      sinHorarios.hidden = false;
      return;
    }

    sinHorarios.hidden = true;

    tbody.replaceChildren(
      ...filasVisibles.map((fila, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('aria-selected', 'false');

        // 1. Curso oficial: icono real + nombre (atenuado si repite el de la fila anterior)
        const tdCurso = document.createElement('td');
        tdCurso.className = 'col-curso';
        if (index > 0 && filasVisibles[index - 1].curso === fila.curso) tdCurso.classList.add('col-curso--repite');
        const badgeCurso = document.createElement('span');
        badgeCurso.className = `badge-curso ${obtenerClaseColorCurso(fila.curso)}`;
        const iconoCurso = document.createElement('img');
        iconoCurso.className = 'badge-curso__icono';
        iconoCurso.src = `assets/img/cursos/${obtenerIconoCurso(fila.curso)}.svg`;
        iconoCurso.alt = '';
        iconoCurso.setAttribute('aria-hidden', 'true');
        iconoCurso.width = 24;
        iconoCurso.height = 24;
        const nombreCurso = document.createElement('strong');
        nombreCurso.textContent = fila.curso || 'Curso sin nombre';
        badgeCurso.append(iconoCurso, nombreCurso);
        tdCurso.appendChild(badgeCurso);

        // 2. Sección
        const tdSec = document.createElement('td');
        tdSec.className = 'col-sec';
        const badgeSeccion = document.createElement('span');
        badgeSeccion.className = 'badge-seccion';
        badgeSeccion.textContent = fila.seccion || '—';
        tdSec.appendChild(badgeSeccion);

        // 3. Estado de la sección (columna ESTADO de la hoja)
        const tdEstado = document.createElement('td');
        tdEstado.className = 'col-estado';
        const estado = fila.estado || 'Aperturado';
        const tipoEstado = { Aperturado: 'abierto', Cerrado: 'cerrado' }[estado] || 'pendiente';
        const badgeEstado = document.createElement('span');
        badgeEstado.className = `badge-estado badge-estado--${tipoEstado}`;
        badgeEstado.textContent = estado;
        tdEstado.appendChild(badgeEstado);
        if (tipoEstado === 'cerrado') tr.classList.add('fila-cerrada');

        // 4. Fechas: inicio arriba, fin debajo
        const tdFechas = document.createElement('td');
        const fechas = document.createElement('span');
        fechas.className = 'celda-fechas';
        const inicio = document.createElement('span');
        inicio.textContent = fila.inicio || 'Por confirmar';
        const fin = document.createElement('span');
        fin.className = 'celda-fechas__fin';
        fin.textContent = fila.fin ? `al ${fila.fin}` : 'Fin por confirmar';
        fechas.append(inicio, fin);
        tdFechas.appendChild(fechas);

        // 5. Turno
        const tdTurno = document.createElement('td');
        const turnoNormalizado = normalizar(fila.turno);
        const tipoTurno = ['manana', 'tarde', 'noche', 'madrugada'].includes(turnoNormalizado)
          ? turnoNormalizado
          : '';
        const badgeTurno = document.createElement('span');
        badgeTurno.className = `badge-turno${tipoTurno ? ` badge-turno--${tipoTurno}` : ''}`;
        if (tipoTurno) {
          const iconoTurno = document.createElement('img');
          iconoTurno.className = 'badge-turno__icono';
          iconoTurno.src = `assets/img/turnos/${tipoTurno}.svg`;
          iconoTurno.alt = '';
          iconoTurno.setAttribute('aria-hidden', 'true');
          iconoTurno.width = 16;
          iconoTurno.height = 16;
          badgeTurno.appendChild(iconoTurno);
        }
        badgeTurno.appendChild(document.createTextNode(fila.turno || '—'));
        tdTurno.appendChild(badgeTurno);

        // 6. Días y horario en una celda
        const tdDias = document.createElement('td');
        const diasHorario = document.createElement('span');
        diasHorario.className = 'celda-dias';
        const hora = document.createElement('span');
        hora.className = 'celda-dias__hora';
        hora.textContent = fila.horario || 'Horario por confirmar';
        const dias = document.createElement('span');
        dias.className = 'celda-dias__dias';
        dias.textContent = fila.dias || '—';
        diasHorario.append(hora, dias);
        tdDias.appendChild(diasHorario);

        // 8. Matriculados (columna MAT de la hoja)
        const tdCupos = document.createElement('td');
        tdCupos.className = 'col-centro';
        const cuposTexto = fila.cupos !== null && fila.cupos !== undefined && fila.cupos !== '' && Number.isFinite(Number(fila.cupos)) ? `${Number(fila.cupos)}` : '—';
        const badgeCupos = document.createElement('span');
        badgeCupos.className = 'badge-cupos';
        badgeCupos.title = 'Estudiantes matriculados en la sección';
        badgeCupos.textContent = cuposTexto;
        tdCupos.appendChild(badgeCupos);

        // 9. Docente: oculto por ahora (MOSTRAR_DOCENTE). Si la hoja no trae nombre, no se inventa uno.
        const tdDocente = document.createElement('td');
        if (fila.docente && fila.docente !== 'Por asignar') {
          tdDocente.className = 'docente-asignado';
          tdDocente.textContent = fila.docente;
        } else {
          tdDocente.className = 'docente-pendiente';
          tdDocente.textContent = 'Docente por asignar';
        }

        // En celular cada fila es una tarjeta: la etiqueta de cada dato sale de data-label
        const celdas = [tdCurso, tdSec, tdEstado, tdFechas, tdTurno, tdDias, tdCupos];
        if (MOSTRAR_DOCENTE) celdas.push(tdDocente);
        celdas.forEach((td, i) => {
          td.dataset.label = ETIQUETAS_CELDA[i];
        });

        tr.append(...celdas);

        resaltar(tdCurso, f.texto);
        resaltar(tdSec, f.texto);
        resaltar(dias, f.texto);
        if (MOSTRAR_DOCENTE) resaltar(tdDocente, f.texto);

        return tr;
      })
    );
    actualizarAccesoTecladoTarjetas();
  }

  // 7. Ajuste de la caja de la tabla: ocupa el alto libre y avisa si se desliza de lado
  function ajustarCajaTabla() {
    const caja = document.querySelector('.tabla-horarios__scroll');
    const envoltura = document.querySelector('.tabla-horarios-wrap');
    if (!caja || !envoltura) return;

    // En celular las filas son tarjetas y la página hace el scroll
    if (window.matchMedia('(max-width: 767px)').matches) {
      caja.style.removeProperty('--alto-tabla');
      envoltura.classList.remove('se-desliza');
      return;
    }

    // Primero el aviso (ocupa una fila encima de la caja) y después se mide el alto libre
    envoltura.classList.toggle('se-desliza', caja.scrollWidth > caja.clientWidth + 1);
    const pie = document.querySelector('.footer-uss');
    const arriba = caja.getBoundingClientRect().top + window.scrollY;
    // La tabla llega hasta justo encima de la franja de ayuda (cerrada) y del pie: se mide lo que
    // ocupan en vez de reservar un alto fijo, para no dejar espacio muerto
    const franjaAyuda = document.querySelector('.ayuda-horarios__summary');
    const contenedor = document.querySelector('.hoja-contenedor-horarios');
    const debajo =
      (franjaAyuda ? franjaAyuda.offsetHeight + 10 : 0) +
      (contenedor ? parseFloat(getComputedStyle(contenedor).paddingBottom) : 0) +
      (pie ? pie.offsetHeight : 0) +
      4;
    const libre = window.innerHeight - arriba - debajo;
    caja.style.setProperty('--alto-tabla', `${Math.max(libre, 220)}px`);
  }

  window.addEventListener('resize', ajustarCajaTabla);

  // Eventos de filtros
  $('filtro-texto')?.addEventListener('input', alCambiarFiltros);
  Object.values(FILTROS).forEach((id) => $(id)?.addEventListener('change', alCambiarFiltros));

  // Atajo de teclado: «/» lleva al buscador
  document.addEventListener('keydown', (evento) => {
    const escribiendo = /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName || '');
    if (evento.key === '/' && !escribiendo) {
      evento.preventDefault();
      $('filtro-texto')?.focus();
    }
  });

  function resetearTodosLosFiltros() {
    if ($('filtro-texto')) $('filtro-texto').value = '';
    if ($('filtro-curso')) $('filtro-curso').value = '';
    if ($('filtro-turno')) $('filtro-turno').value = '';
    if ($('filtro-dias')) $('filtro-dias').value = '';
    if ($('filtro-aula')) $('filtro-aula').value = '';
    alCambiarFiltros();
  }

  $('btn-reset-filtros')?.addEventListener('click', resetearTodosLosFiltros);
  $('btn-reset-filtros-top')?.addEventListener('click', resetearTodosLosFiltros);

  // Iniciar carga
  cargarDatos();
});
