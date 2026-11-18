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
  let horariosCargados = [];
  let fuenteEnVivo = false;

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
  const badgeDuracion = $('txt-duracion-badge');

  function calcularSemanasEntreFechas(inicioStr, finStr) {
    if (!inicioStr || !finStr) return null;
    const pIni = String(inicioStr).split('/').map(Number);
    const pFin = String(finStr).split('/').map(Number);
    if (pIni.length === 3 && pFin.length === 3 && !isNaN(pIni[0]) && !isNaN(pFin[0])) {
      const dIni = new Date(pIni[2], pIni[1] - 1, pIni[0]);
      const dFin = new Date(pFin[2], pFin[1] - 1, pFin[0]);
      const diffDias = Math.round((dFin - dIni) / (1000 * 60 * 60 * 24)) + 1;
      const semanas = Math.round(diffDias / 7);
      return semanas > 0 ? semanas : null;
    }
    return null;
  }

  function obtenerSemanasDelCiclo(cicloId, anio, filas) {
    if (Array.isArray(filas) && filas.length > 0) {
      for (const f of filas) {
        if (f.inicio && f.fin && f.inicio !== '—' && f.fin !== '—') {
          const s = calcularSemanasEntreFechas(f.inicio, f.fin);
          if (s) return s;
        }
      }
    }
    const claveCal = `${anio || '2027'}-${cicloId}`.toLowerCase();
    const cal = window.CONSULTA_CURSOS?.calendarioCiclos?.[claveCal];
    if (cal?.inicio && cal?.fin) {
      const s = calcularSemanasEntreFechas(cal.inicio, cal.fin);
      if (s) return s;
    }
    const c = window.CONSULTA_CURSOS?.ciclos?.find((x) => x.id.toLowerCase() === cicloId.toLowerCase());
    if (c?.semanas) return c.semanas;
    if (c?.duracion) {
      if (c.duracion.includes('1 mes')) return 4;
      if (c.duracion.includes('2 meses')) return 8;
      if (c.duracion.includes('3 meses')) return 12;
      const m = c.duracion.match(/(\d+)\s*semana/i);
      if (m) return Number(m[1]);
    }
    return null;
  }

  function actualizarBadgesCiclo() {
    if (badgeCiclo && cicloSeleccionado) {
      badgeCiclo.textContent = `${cicloSeleccionado.nombre}${anioActivo ? ` ${anioActivo}` : ''}`;
      badgeCiclo.title = anioActivo
        ? `Ciclo seleccionado: ${cicloSeleccionado.nombre} ${anioActivo}`
        : 'Ciclo seleccionado';
    }
    if (badgeDuracion) {
      const semanas = obtenerSemanasDelCiclo(cicloActivo, anioActivo, horariosCargados);
      if (semanas) {
        badgeDuracion.textContent = `${semanas} semanas`;
        badgeDuracion.title = `Duración académica: ${semanas} semanas`;
        badgeDuracion.hidden = false;
      } else {
        badgeDuracion.textContent = '';
        badgeDuracion.hidden = true;
      }
    }
    // Estado del ciclo (Panel Admin) junto a sus badges; sin año todavía no se sabe cuál es
    const calendario = anioActivo ? window.CONSULTA_CURSOS.calendarioDe(cicloActivo, anioActivo) : null;
    window.CONSULTA_CURSOS.pintarEstadoCiclo($('txt-estado-ciclo'), calendario?.estado);
  }

  actualizarBadgesCiclo();
  window.addEventListener('portal_horarios_config_loaded', () => {
    actualizarBadgesCiclo();
    // Las fechas de la tabla salen del panel: si la configuración llegó después que las hojas, repinta
    if ($('filas-horarios')?.children.length) pintarTabla();
  });

  function actualizarBadgeModelo() {
    const badge = $('txt-modelo-badge');
    if (!badge) return;
    const cfg = window.PORTAL_HORARIOS_CONFIG;
    if (modeloActivo === 'tradicional') {
      badge.className = 'banner-carrera__modelo-badge banner-carrera__modelo-badge--tradicional';
      badge.textContent = cfg?.tradicional?.badge || 'Modelo Tradicional (C2 / C3)';
    } else {
      badge.className = 'banner-carrera__modelo-badge banner-carrera__modelo-badge--protech';
      badge.textContent = cfg?.protech?.badge || 'Modelo PROTECH XP';
    }
  }
  actualizarBadgeModelo();
  window.addEventListener('portal_horarios_config_loaded', actualizarBadgeModelo);

  // 4. Fuente de datos: solo en línea (Google Drive y, de respaldo, la API REST)

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

  // Caja de estado de red (sincronización en vivo / alerta con reintento si falla)
  const cajaTablaScroll = document.querySelector('.tabla-horarios__scroll');
  const estadoRed = document.createElement('div');
  estadoRed.id = 'estado-red-horarios';
  estadoRed.hidden = true;
  cajaTablaScroll?.before(estadoRed);

  const CLAVE_CACHE_HORARIOS = 'cinf_horarios_cache_v2';
  const TTL_CACHE_HORARIOS_MS = 8 * 60 * 1000; // 8 minutos

  function leerCacheHorarios() {
    try {
      const crudo = sessionStorage.getItem(CLAVE_CACHE_HORARIOS);
      if (!crudo) return null;
      const datos = JSON.parse(crudo);
      if (!datos || !Array.isArray(datos.filas) || !datos.tiempo) return null;
      if (Date.now() - datos.tiempo > TTL_CACHE_HORARIOS_MS) return null;
      return datos.filas;
    } catch {
      return null;
    }
  }

  function guardarCacheHorarios(filas) {
    try {
      if (Array.isArray(filas) && filas.length > 0) {
        sessionStorage.setItem(
          CLAVE_CACHE_HORARIOS,
          JSON.stringify({ filas, tiempo: Date.now() })
        );
      }
    } catch {
      // Ignorar quota en sessionStorage
    }
  }

  // Pre-renderizado inmediato con los cursos reales de la carrera (cero barras grises anónimas)
  function pintarEsqueletoCursosReales() {
    const tbody = $('filas-horarios');
    if (!tbody) return;
    const cursosLista = Array.from(cursosPermitidosActivos());
    if (cursosLista.length === 0) return;

    tbody.replaceChildren(
      ...cursosLista.map((cursoNombre) => {
        const tr = document.createElement('tr');
        tr.className = 'fila-sincronizando';
        tr.setAttribute('aria-disabled', 'true');

        // 1. Curso con su ícono oficial y color temático
        const tdCurso = document.createElement('td');
        tdCurso.className = 'col-curso';
        tdCurso.setAttribute('data-label', 'Curso');
        const badgeCurso = document.createElement('span');
        badgeCurso.className = `badge-curso ${obtenerClaseColorCurso(cursoNombre)}`;
        const iconoCurso = document.createElement('img');
        iconoCurso.className = 'badge-curso__icono';
        iconoCurso.src = `assets/img/cursos/${obtenerIconoCurso(cursoNombre)}.svg`;
        iconoCurso.alt = '';
        iconoCurso.setAttribute('aria-hidden', 'true');
        iconoCurso.width = 24;
        iconoCurso.height = 24;
        const fuerte = document.createElement('strong');
        fuerte.textContent = cursoNombre;
        badgeCurso.append(iconoCurso, fuerte);
        tdCurso.appendChild(badgeCurso);

        // 2. Sección (placeholder vivo)
        const tdSec = document.createElement('td');
        tdSec.className = 'col-sec';
        tdSec.setAttribute('data-label', 'Sección');
        const badgeSec = document.createElement('span');
        badgeSec.className = 'badge-seccion badge-seccion--sincronizando';
        badgeSec.textContent = 'En vivo';
        tdSec.appendChild(badgeSec);

        // 3. Estado
        const tdEstado = document.createElement('td');
        tdEstado.className = 'col-estado';
        tdEstado.setAttribute('data-label', 'Estado');
        const badgeEstado = document.createElement('span');
        badgeEstado.className = 'badge-estado badge-estado--sincronizando';
        badgeEstado.textContent = 'Aperturado';
        tdEstado.appendChild(badgeEstado);

        // 4. Fechas
        const tdFechas = document.createElement('td');
        tdFechas.setAttribute('data-label', 'Fechas');
        const fechas = document.createElement('span');
        fechas.className = 'celda-fechas celda-fechas--sincronizando';
        const f1 = document.createElement('span');
        f1.textContent = 'Programación';
        const f2 = document.createElement('span');
        f2.className = 'celda-fechas__fin';
        f2.textContent = cicloSeleccionado ? cicloSeleccionado.nombre : 'Ciclo oficial';
        fechas.append(f1, f2);
        tdFechas.appendChild(fechas);

        // 5. Turno
        const tdTurno = document.createElement('td');
        tdTurno.setAttribute('data-label', 'Turno');
        const badgeTurno = document.createElement('span');
        badgeTurno.className = 'badge-turno badge-turno--sincronizando';
        badgeTurno.textContent = 'Consultando turnos…';
        tdTurno.appendChild(badgeTurno);

        // 6. Horario y días
        const tdDias = document.createElement('td');
        tdDias.setAttribute('data-label', 'Horario y días');
        const diasWrap = document.createElement('span');
        diasWrap.className = 'celda-dias celda-dias--sincronizando';
        const dHora = document.createElement('span');
        dHora.className = 'celda-dias__hora';
        dHora.textContent = 'Horarios del ciclo';
        const dDias = document.createElement('span');
        dDias.className = 'celda-dias__dias';
        dDias.textContent = 'Días de apertura';
        diasWrap.append(dHora, dDias);
        tdDias.appendChild(diasWrap);

        // 7. Cupos
        const tdCupos = document.createElement('td');
        tdCupos.className = 'col-centro';
        tdCupos.setAttribute('data-label', 'Cupos');
        const badgeCupos = document.createElement('span');
        badgeCupos.className = 'badge-cupos badge-cupos--sincronizando';
        badgeCupos.textContent = '—';
        tdCupos.appendChild(badgeCupos);

        // 8. Registro
        const tdRegistro = document.createElement('td');
        tdRegistro.className = 'col-centro col-registro';
        tdRegistro.setAttribute('data-label', 'Registro');
        const btnRegSkeleton = document.createElement('span');
        btnRegSkeleton.className = 'btn-registrar btn-registrar--sincronizando';
        btnRegSkeleton.textContent = 'Registrar';
        tdRegistro.appendChild(btnRegSkeleton);

        tr.append(tdCurso, tdSec, tdEstado, tdFechas, tdTurno, tdDias, tdCupos, tdRegistro);
        return tr;
      })
    );
  }

  function mostrarEstadoRed(estado) {
    const conteo = $('conteo-secciones');
    $('sin-horarios').hidden = true;
    estadoRed.replaceChildren();

    if (estado === 'cargando') {
      if (cajaTablaScroll) cajaTablaScroll.hidden = false;
      pintarEsqueletoCursosReales();

      estadoRed.hidden = false;
      estadoRed.className = 'sincronizacion-activa';
      estadoRed.setAttribute('role', 'status');
      estadoRed.setAttribute('aria-live', 'polite');
      if (conteo) conteo.textContent = 'Conectando secciones en tiempo real…';

      const nombreCiclo = cicloSeleccionado ? cicloSeleccionado.nombre : 'tu ciclo';
      const metaModelo = modeloActivo === 'tradicional' ? 'Modelo Tradicional (C2 / C3)' : 'Modelo PROTECH XP';

      // Micro-barra de progreso superior
      const barraProgreso = document.createElement('div');
      barraProgreso.className = 'sincronizacion-activa__progreso';
      barraProgreso.setAttribute('aria-hidden', 'true');

      // Contenedor principal
      const cuerpo = document.createElement('div');
      cuerpo.className = 'sincronizacion-activa__cuerpo';

      // Lado izquierdo: indicador de pulso en vivo y copy editorial
      const info = document.createElement('div');
      info.className = 'sincronizacion-activa__info';

      const pulso = document.createElement('span');
      pulso.className = 'sincronizacion-activa__pulso';
      pulso.setAttribute('aria-hidden', 'true');
      const dot = document.createElement('span');
      dot.className = 'sincronizacion-activa__dot';
      const onda = document.createElement('span');
      onda.className = 'sincronizacion-activa__onda';
      pulso.append(dot, onda);

      const textos = document.createElement('div');
      textos.className = 'sincronizacion-activa__textos';

      const titulo = document.createElement('strong');
      titulo.className = 'sincronizacion-activa__titulo';
      titulo.textContent = `Sincronizando secciones abiertas de ${nombreCiclo}`;

      const detalle = document.createElement('span');
      detalle.className = 'sincronizacion-activa__detalle';
      detalle.textContent = `Verificando turnos y vacantes en vivo para ${carrera}`;

      textos.append(titulo, detalle);
      info.append(pulso, textos);

      // Lado derecho: chip identificador del modelo
      const meta = document.createElement('div');
      meta.className = 'sincronizacion-activa__meta';
      const chip = document.createElement('span');
      chip.className = 'sincronizacion-activa__chip';
      chip.textContent = metaModelo;
      meta.appendChild(chip);

      cuerpo.append(info, meta);
      estadoRed.append(barraProgreso, cuerpo);

      // Si la conexión tarda más de 5 s, actualizar el mensaje sin alarma
      setTimeout(() => {
        if (!estadoRed.hidden && estadoRed.classList.contains('sincronizacion-activa')) {
          detalle.textContent = `Actualizando programación oficial de ${carrera}. Un instante más…`;
        }
      }, 5000);
      return;
    }

    // Estado error de red
    if (cajaTablaScroll) cajaTablaScroll.hidden = true;
    estadoRed.hidden = false;
    estadoRed.className = 'estado-red estado-red--error';
    estadoRed.setAttribute('role', 'alert');
    if (conteo) conteo.textContent = 'Sin conexión con el catálogo oficial';
    const titulo = document.createElement('p');
    titulo.className = 'estado-red__titulo';
    titulo.textContent = 'No pudimos conectar con los horarios en línea';
    const detalle = document.createElement('p');
    detalle.className = 'estado-red__texto';
    detalle.textContent = 'Revisa tu conexión a Internet e inténtalo de nuevo. Los horarios se actualizan solo en vivo.';
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

  function aplicarDatosCargados() {
    const filasCicloSeleccionado = horariosCargados.filter(
      (fila) => (fila.ciclo || '').toLowerCase() === cicloActivo && esDeLaCarrera(fila)
    );
    const obtenerAnio = (fila) =>
      String(fila?.anio || fila?.inicio || '').match(/\b(20\d{2})\b/)?.[1] || '';
    if (!anioActivo) anioActivo = obtenerAnio(filasCicloSeleccionado[0]);
    actualizarBadgesCiclo();

    leerFiltrosDeUrl();
    poblarFiltrosDinamicos();
    pintarTabla();
  }

  async function cargarDatos() {
    // 1. Verificación en caché de sesión (SWR - 0 ms de espera en visitas recurrentes o cambio de ciclo)
    const cache = leerCacheHorarios();
    if (cache && cache.length > 0) {
      horariosCargados = cache;
      fuenteEnVivo = true;
      estadoRed.hidden = true;
      if (cajaTablaScroll) cajaTablaScroll.hidden = false;
      aplicarDatosCargados();

      // Revalidación silenciosa en segundo plano
      window.CONSULTA_CURSOS.cargarHorariosRemotos()
        .then((nuevos) => {
          if (nuevos && nuevos.length > 0) {
            horariosCargados = nuevos;
            guardarCacheHorarios(nuevos);
            aplicarDatosCargados();
          }
        })
        .catch(() => {
          // Revalidación en background silenciosa sin molestar al alumno
        });
      return;
    }

    // 2. Primera carga: muestra el esqueleto con cursos reales e íconos oficiales
    mostrarEstadoRed('cargando');
    horariosCargados = [];
    try {
      horariosCargados = await window.CONSULTA_CURSOS.cargarHorariosRemotos();
      fuenteEnVivo = true;
      guardarCacheHorarios(horariosCargados);
    } catch (eDrive) {
      console.warn('Google Drive no disponible, probando API…', eDrive);
      try {
        horariosCargados = await cargarDesdeApi();
        fuenteEnVivo = true;
        guardarCacheHorarios(horariosCargados);
      } catch (eApi) {
        console.error('Sin conexión con las fuentes en línea:', eApi);
        fuenteEnVivo = false;
        mostrarEstadoRed('error');
        return;
      }
    }
    estadoRed.hidden = true;
    aplicarDatosCargados();
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

  const ETIQUETAS_CELDA = ['Curso', 'Sección', 'Estado', 'Fechas', 'Turno', 'Horario y días', 'Cupos', 'Registro', 'Docente'];

  function manejarClickRegistrar(fila) {
    const destino = document.getElementById('registro');
    if (destino) {
      // 1. Hace visible la sección de registro (oculta por defecto hasta que se pulse Registrar)
      destino.hidden = false;

      // 2. Mostrar qué sección seleccionó en la guía de registro
      const contenedorAviso = $('registro-seleccion');
      const textoAviso = $('registro-seleccion-texto');
      if (contenedorAviso && textoAviso) {
        contenedorAviso.hidden = false;
        const turnoTexto = fila.turno ? ` · Turno ${fila.turno}` : '';
        textoAviso.textContent = `${fila.curso} · Sección ${fila.seccion}${turnoTexto}`;
      }

      // 3. Desplazar suavemente hasta #registro con ID en la URL
      destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history.pushState) {
        history.pushState(null, '', '#registro');
      } else {
        location.hash = 'registro';
      }
    }
  }

  // Cerrar guía de registro si el estudiante lo desea
  $('btn-cerrar-registro')?.addEventListener('click', () => {
    const destino = document.getElementById('registro');
    if (destino) {
      destino.hidden = true;
      if (history.pushState) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }
  });

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
        // La hoja no trae fechas: valen las del ciclo en el Panel Admin (base de datos)
        const cal = window.CONSULTA_CURSOS.calendarioDe(fila.ciclo, fila.anio) || {};
        const fInicio = fila.inicio || cal.inicio;
        const fFin = fila.fin || cal.fin;
        const inicio = document.createElement('span');
        inicio.textContent = fInicio || 'Por confirmar';
        const fin = document.createElement('span');
        fin.className = 'celda-fechas__fin';
        fin.textContent = fFin ? `al ${fFin}` : 'Fin por confirmar';
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

        // 7. Cupos (CUPOS/N°, ej. 24/30)
        const tdCupos = document.createElement('td');
        tdCupos.className = 'col-centro';
        const tieneCupos = fila.cupos !== null && fila.cupos !== undefined && fila.cupos !== '' && Number.isFinite(Number(fila.cupos));
        const tieneTotal = fila.cuposTotal !== null && fila.cuposTotal !== undefined && fila.cuposTotal !== '' && Number.isFinite(Number(fila.cuposTotal)) && Number(fila.cuposTotal) > 0;

        let cuposTexto = '—';
        if (tieneCupos && tieneTotal) {
          cuposTexto = `${Number(fila.cupos)}/${Number(fila.cuposTotal)}`;
        } else if (tieneCupos) {
          cuposTexto = `${Number(fila.cupos)}`;
        }

        const badgeCupos = document.createElement('span');
        badgeCupos.className = 'badge-cupos';
        if (fila.cupos === 0) {
          badgeCupos.classList.add('badge-cupos--agotado');
        }
        if (tieneTotal && tieneCupos) {
          const mat = fila.matriculados ?? 0;
          const pre = fila.prematriculados ?? 0;
          badgeCupos.title = `${fila.cupos} de ${fila.cuposTotal} cupos disponibles (Matriculados: ${mat} · Prematriculados: ${pre})`;
        } else if (tieneCupos) {
          badgeCupos.title = `${fila.cupos} cupos disponibles en la sección`;
        } else {
          badgeCupos.title = 'Cupos por confirmar';
        }
        badgeCupos.textContent = cuposTexto;
        tdCupos.appendChild(badgeCupos);

        // 8. Botón Registrar
        const tdRegistro = document.createElement('td');
        tdRegistro.className = 'col-centro col-registro';
        const btnRegistrar = document.createElement('button');
        btnRegistrar.type = 'button';
        const esCerrada = (fila.estado || '').toLowerCase() === 'cerrado';
        if (esCerrada) {
          btnRegistrar.className = 'btn-registrar btn-registrar--cerrado';
          btnRegistrar.disabled = true;
          btnRegistrar.textContent = 'Cerrado';
          btnRegistrar.title = 'Esta sección se encuentra cerrada para nuevas inscripciones';
        } else {
          btnRegistrar.className = 'btn-registrar btn-registrar--activo';
          btnRegistrar.textContent = 'Registrar';
          btnRegistrar.title = `Registrarme en ${fila.curso} - Sección ${fila.seccion}`;
          btnRegistrar.dataset.curso = fila.curso;
          btnRegistrar.dataset.seccion = fila.seccion;
          btnRegistrar.dataset.turno = fila.turno || '';
          btnRegistrar.dataset.horario = fila.horario || '';
          btnRegistrar.dataset.dias = fila.dias || '';
          btnRegistrar.addEventListener('click', (e) => {
            e.stopPropagation();
            manejarClickRegistrar(fila);
          });
        }
        tdRegistro.appendChild(btnRegistrar);

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
        const celdas = [tdCurso, tdSec, tdEstado, tdFechas, tdTurno, tdDias, tdCupos, tdRegistro];
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
