/**
 * USS Consulta de Cursos - Vista de Horarios (horarios.html)
 * Archivo: assets/js/horarios.js
 *
 * Funcionalidad:
 * 1. Lee parámetros de URL (?ciclo=enero&carrera=Psicologia).
 * 2. Muestra banner oficial de la carrera y ruta de aprendizaje CINF.
 * 3. Muestra únicamente la carrera, modelo y ciclo seleccionados en el portal.
 * 4. Consume API REST (/api/horarios) con respaldo en datos.js (Canva oficial).
 * 5. Filtra por cursos correspondientes a la carrera, turno y búsqueda en vivo.
 */
document.addEventListener('DOMContentLoaded', () => {
  const {
    ciclos,
    rutas,
    horarios,
    cursosTradicionales = [],
    cursosParaTodos = [],
    seccionVisible,
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
  const ruta = rutas.find((r) => r.carreras.includes(carrera)) || {
    id: 0,
    nombre: 'Ruta Especial',
    cursos: [],
  };

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
    if (!permitidos.has(h.curso)) return false;

    return seccionVisible(h.seccion, carrera);
  };

  // La API devuelve «Word 365 (Protech XP)»; las rutas lo llaman «Word 365»
  const limpiarCurso = (nombre) => (nombre || '').replace(/\s*\(Protech XP\)\s*/i, '').trim();

  // Pintar banner de carrera y modelo
  $('txt-carrera-nombre').textContent = carrera;
  $('txt-ruta-badge').textContent = `Ruta ${ruta.id}`;
  $('txt-ruta-nombre').textContent = `(${ruta.nombre.replace(/^Ruta \d+ · /, '')})`;
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
      badge.textContent = '📚 Plan Tradicional';
    } else {
      badge.className = 'banner-carrera__modelo-badge banner-carrera__modelo-badge--protech';
      badge.textContent = '🛡️ PROTECH XP';
    }
  }
  actualizarBadgeModelo();

  // 4. Fuente de datos: API REST o catálogo oficial en datos.js
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

  // 4.1 Identidad y Colores Temáticos por Curso Oficial
  function obtenerClaseColorCurso(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.includes('word')) return 'badge-curso--word';
    if (n.includes('excel')) return 'badge-curso--excel';
    if (n.includes('canva')) return 'badge-curso--canva';
    if (n.includes('autocad') || n.includes('cad') || n.includes('diseño mecánico') || n.includes('diseno mecanico')) return 'badge-curso--autocad';
    if (n.includes('spss')) return 'badge-curso--spss';
    if (n.includes('power bi')) return 'badge-curso--powerbi';
    if (n.includes('computacion') || n.includes('computación')) return 'badge-curso--tradicional';
    return 'badge-curso--default';
  }

  function obtenerIconoCurso(nombre) {
    const n = (nombre || '').toLowerCase();
    if (n.includes('word')) return 'word';
    if (n.includes('excel')) return 'excel';
    if (n.includes('canva')) return 'canva';
    if (n.includes('autocad') || n.includes('cad') || n.includes('diseño mecánico') || n.includes('diseno mecanico')) return 'autocad';
    if (n.includes('power bi')) return 'power-bi';
    if (n.includes('spss')) return 'spss';
    if (n.includes('computacion') || n.includes('computación')) return 'computacion';
    return 'software';
  }

  // 4.2 Sincronización opcional con Google Sheets (CSV o JSON)
  // La normalización compartida vive en datos.js para reutilizarse también en index.js.
  const GOOGLE_SHEETS_URL = window.GOOGLE_SHEETS_URL || window.GOOGLE_SHEETS_CSV_URL || '';

  async function cargarDesdeGoogleSheets(sheetsCsvUrl) {
    const cargar = window.CONSULTA_CURSOS?.cargarDesdeGoogleSheets;
    if (typeof cargar !== 'function') {
      throw new Error('No se encontró el módulo de integración de Google Sheets en datos.js.');
    }
    return cargar(sheetsCsvUrl);
  }

  async function cargarDatos() {
    try {
      // Intento 1: Cargar desde la hoja publicada en Google Sheets (Drive) en vivo
      if (GOOGLE_SHEETS_URL) {
        try {
          const filasSheets = await cargarDesdeGoogleSheets(GOOGLE_SHEETS_URL);
          if (filasSheets && filasSheets.length > 0) {
            const ciclosRemotos = new Set(filasSheets.map((f) => (f.ciclo || '').toLowerCase()));
            horariosCargados = [
              ...filasSheets,
              ...(horarios || []).filter((h) => !ciclosRemotos.has((h.ciclo || '').toLowerCase())),
            ];
            fuenteEnVivo = true;
          }
        } catch (eSheets) {
          console.warn('Google Sheets no disponible, probando API de Supabase...', eSheets);
        }
      }

      // Intento 2: API REST Supabase (si Google Sheets no respondió)
      if (horariosCargados.length === 0) {
        const apiBase = resolveApiBase();
        const resp = await fetch(`${apiBase}/horarios`, {
          headers: { Accept: 'application/json' },
        });
        if (resp.ok) {
          const json = await resp.json();
          const filas = Array.isArray(json) ? json : (json.data || []);
          if (filas.length > 0) {
            horariosCargados = filas.map((r) => {
              const cLimpio = limpiarCurso(r.curso);
              const modFila =
                r.modelo ||
                (window.CONSULTA_CURSOS.esCursoDeModelo(cLimpio, 'tradicional')
                  ? 'tradicional'
                  : 'protech');
              return {
                id: r.id,
                ciclo: (r.ciclo || '').toLowerCase(),
                modelo: modFila,
                curso: cLimpio,
                seccion: r.seccion || '',
                inicio: formatearFecha(r.fechaInicio),
                fin: formatearFecha(r.fechaFin),
                turno: r.turno || '',
                dias: r.dias || '',
                horario: `${formatearHora12(r.horaInicio)} – ${formatearHora12(r.horaFin)}`,
                aula: r.aula === 'Virtual' ? 'Virtual · Zoom' : (r.aula || 'Virtual · Zoom'),
                cupos: r.cupos || 30,
                cuposDisponibles: r.cuposDisponibles !== undefined ? r.cuposDisponibles : (r.cupos || 25),
                cuposTotal: r.cupos || 30,
                docente: r.docente || '',
                linkAula: r.linkAula || null,
              };
            });
            fuenteEnVivo = true;
          } else {
            horariosCargados = horarios || [];
          }
        } else {
          horariosCargados = horarios || [];
        }
      }
    } catch {
      horariosCargados = horarios || [];
    }

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
      !normalizar(`${fila.curso} ${fila.seccion} ${fila.docente} ${fila.dias} ${fila.aula} ${fila.turno} ${fila.horario}`).includes(f.texto)
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
      dias: [...new Set(filas.map((h) => h.dias))].sort((a, b) => a.localeCompare(b, 'es')).map((v) => [v, v]),
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

  const ETIQUETAS_CELDA = ['N.°', 'Curso', 'Sección', 'Inicio', 'Fin', 'Turno', 'Días', 'Horario', 'Aula', 'Cupos', 'Docente', 'Acceso'];

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
    filasVisibles.sort(
      (x, y) =>
        posicion(x.curso) - posicion(y.curso) ||
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

        // 1. Número
        const tdNum = document.createElement('td');
        tdNum.className = 'col-num';
        tdNum.textContent = index + 1;

        // 2. Curso Oficial con color temático institucional
        const tdCurso = document.createElement('td');
        tdCurso.className = 'col-curso';
        const colorClase = obtenerClaseColorCurso(fila.curso);
        const badgeCurso = document.createElement('span');
        badgeCurso.className = `badge-curso ${colorClase}`;
        const iconoCurso = document.createElement('img');
        iconoCurso.className = 'badge-curso__icono';
        iconoCurso.src = `assets/img/cursos/${obtenerIconoCurso(fila.curso)}.svg`;
        iconoCurso.alt = '';
        iconoCurso.setAttribute('aria-hidden', 'true');
        iconoCurso.width = 22;
        iconoCurso.height = 22;
        const nombreCurso = document.createElement('strong');
        nombreCurso.textContent = fila.curso || 'Curso sin nombre';
        badgeCurso.append(iconoCurso, nombreCurso);
        tdCurso.appendChild(badgeCurso);

        // 3. Sección
        const tdSec = document.createElement('td');
        tdSec.className = 'col-sec';
        const badgeSeccion = document.createElement('span');
        badgeSeccion.className = 'badge-seccion';
        badgeSeccion.textContent = fila.seccion || '—';
        tdSec.appendChild(badgeSeccion);

        // 4. Inicio
        const tdInicio = document.createElement('td');
        tdInicio.textContent = fila.inicio;

        // 5. Fin
        const tdFin = document.createElement('td');
        tdFin.textContent = fila.fin;

        // 6. Turno
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

        // 7. Días
        const tdDias = document.createElement('td');
        tdDias.className = 'fw-semibold text-secondary';
        tdDias.textContent = fila.dias;

        // 8. Horario
        const tdHorario = document.createElement('td');
        tdHorario.className = 'celda-horario';
        tdHorario.textContent = fila.horario;

        // 9. Aula
        const tdAula = document.createElement('td');
        const esZoom = (fila.aula || '').toLowerCase().includes('zoom') || (fila.aula || '').toLowerCase().includes('virtual');
        const badgeAula = document.createElement('span');
        badgeAula.className = `badge-aula ${esZoom ? 'badge-aula--zoom' : ''}`;
        badgeAula.textContent = `${esZoom ? '📹' : '📍'} ${fila.aula || 'No informado'}`;
        tdAula.appendChild(badgeAula);

        // 10. Cupos
        const tdCupos = document.createElement('td');
        tdCupos.className = 'text-center';
        const cuposTexto = fila.cupos !== null && fila.cupos !== undefined && fila.cupos !== '' && Number.isFinite(Number(fila.cupos)) ? `${Number(fila.cupos)} cupos` : 'No informado';
        const badgeCupos = document.createElement('span');
        badgeCupos.className = 'badge-cupos';
        badgeCupos.title = 'Cupos publicados';
        const cuposStrong = document.createElement('strong');
        cuposStrong.textContent = cuposTexto;
        badgeCupos.append('👥 ', cuposStrong);
        tdCupos.appendChild(badgeCupos);

        // 11. Docente
        const tdDocente = document.createElement('td');
        if (fila.docente && fila.docente !== 'Por asignar') {
          tdDocente.className = 'docente-asignado';
          tdDocente.textContent = fila.docente;
        } else {
          tdDocente.className = 'docente-pendiente';
          tdDocente.textContent = 'Docente por asignar';
        }

        // 12. Acceso
        const tdAcceso = document.createElement('td');
        tdAcceso.className = 'col-acceso';
        let urlAula = null;
        try {
          const candidata = new URL(fila.linkAula || '');
          if (['https:', 'http:'].includes(candidata.protocol)) urlAula = candidata.href;
        } catch { /* Enlace vacío o inválido: se muestra acceso pendiente. */ }
        if (urlAula) {
          const enlace = document.createElement('a');
          enlace.href = urlAula;
          enlace.target = '_blank';
          enlace.rel = 'noopener noreferrer';
          enlace.className = 'btn-zoom';
          enlace.title = 'Abrir sala Zoom';
          enlace.append(document.createTextNode('Ingresar '), document.createTextNode('↗'));
          tdAcceso.appendChild(enlace);
        } else {
          const pendiente = document.createElement('span');
          pendiente.className = 'badge-acceso-pendiente';
          pendiente.textContent = 'Aula Virtual';
          tdAcceso.appendChild(pendiente);
        }

        // En celular cada fila es una tarjeta: la etiqueta de cada dato sale de data-label
        const celdas = [tdNum, tdCurso, tdSec, tdInicio, tdFin, tdTurno, tdDias, tdHorario, tdAula, tdCupos, tdDocente, tdAcceso];
        celdas.forEach((td, i) => {
          td.dataset.label = ETIQUETAS_CELDA[i];
        });

        tr.append(
          tdNum,
          tdCurso,
          tdSec,
          tdInicio,
          tdFin,
          tdTurno,
          tdDias,
          tdHorario,
          tdAula,
          tdCupos,
          tdDocente,
          tdAcceso
        );

        [tdCurso, tdSec, tdDias, tdDocente].forEach((td) => resaltar(td, f.texto));

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
