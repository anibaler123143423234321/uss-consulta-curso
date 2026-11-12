/**
 * USS Consulta de Cursos - Flujo de la consulta
 * Archivo: assets/js/app.js
 *
 * Flujo:
 * 1. Selección de carrera profesional (Ruta oficial de aprendizaje CINF).
 * 2. Selección de ciclo de apertura (Enero, Febrero, etc. con conteo filtrado por carrera).
 * 3. Hoja interactiva de horarios (Hoja de cálculo ejecutiva con filtros y enlaces).
 *
 * Lee los horarios desde la API REST (GET /api/horarios). Si la API no tiene
 * datos o se ejecuta de forma local, utiliza el catálogo oficial de Canva en datos.js.
 */
document.addEventListener('DOMContentLoaded', () => {
  const { ciclos, rutas } = window.CONSULTA_CURSOS;
  const $ = (id) => document.getElementById(id);

  const estado = {
    ciclo: null,
    carrera: '',
  };

  let horariosPublicados = [];
  let errorCarga = null;
  let cargando = false;

  // Resolver base de API REST
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
    (texto || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const crear = (etiqueta, clase, texto) => {
    const nodo = document.createElement(etiqueta);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  };

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

  const filasDe = (cicloId) =>
    horariosPublicados.filter((fila) => (fila.ciclo || '').toLowerCase() === (cicloId || '').toLowerCase());

  // Cursos que le tocan a una carrera, sumando todas sus rutas
  const cursosDe = (carrera) => {
    if (!carrera) return null;
    return new Set(rutas.filter((ruta) => ruta.carreras.includes(carrera)).flatMap((ruta) => ruta.cursos));
  };

  /* ==========================================================================
     1. PASO 1: SELECCIÓN DE CARRERA (Estilo buscador elevado USS-GEX)
     ========================================================================== */
  const carreras = [...new Set(rutas.flatMap((ruta) => ruta.carreras))].sort((a, b) => a.localeCompare(b, 'es'));

  // Llenar selector principal de carrera
  const selCarreraPrincipal = $('selector-carrera-principal');
  carreras.forEach((carrera) => {
    selCarreraPrincipal.appendChild(new Option(carrera, carrera));
  });

  // Llenar selector secundario dentro de la hoja de cálculo
  const selFiltroCarrera = $('filtro-carrera');
  carreras.forEach((carrera) => {
    selFiltroCarrera.appendChild(new Option(carrera, carrera));
  });

  // Chips rápidos de carreras más consultadas
  const carrerasDestacadas = [
    'Psicología',
    'Derecho',
    'Administración',
    'Ingeniería de Sistemas',
    'Medicina Humana',
    'Arquitectura',
    'Enfermería',
    'Contabilidad',
  ];

  const contChips = $('chips-carreras-rapidas');
  carrerasDestacadas.forEach((car) => {
    const chip = crear('button', 'chip-carrera', car);
    chip.type = 'button';
    chip.dataset.carrera = car;
    chip.addEventListener('click', () => {
      seleccionarCarrera(car);
    });
    contChips.appendChild(chip);
  });

  function seleccionarCarrera(carreraElegida) {
    estado.carrera = carreraElegida || '';
    selCarreraPrincipal.value = estado.carrera;
    selFiltroCarrera.value = estado.carrera;

    // Actualizar chips activos
    document.querySelectorAll('.chip-carrera').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.carrera === estado.carrera);
    });

    const fichaRuta = $('ficha-ruta');
    const btnLimpiar = $('btn-limpiar-carrera');
    const subtituloMes = $('subtitulo-mes-dinamico');
    const bannerCarrera = $('banner-carrera-activa');

    if (estado.carrera) {
      const ruta = rutas.find((r) => r.carreras.includes(estado.carrera));
      btnLimpiar.hidden = false;

      if (ruta) {
        fichaRuta.hidden = false;
        $('ruta-badge').textContent = `Ruta ${ruta.id}`;
        $('ruta-nombre').textContent = ruta.nombre.replace(/^Ruta \d+ · /, '');
        $('ruta-carrera-elegida').textContent = estado.carrera;

        // Lista de cursos de la ruta
        const contCursos = $('ruta-lista-cursos');
        contCursos.replaceChildren(
          ...ruta.cursos.map((c) => {
            const span = crear('span', 'ficha-ruta__curso-chip');
            span.innerHTML = `<span class="text-primary">✓</span> ${c}`;
            return span;
          })
        );

        subtituloMes.textContent = `Mostrando secciones y cursos de la ${ruta.nombre} para ${estado.carrera}.`;

        // Banner dentro de la hoja
        $('banner-carrera-nombre').textContent = estado.carrera;
        $('banner-ruta-nombre').textContent = `(${ruta.nombre})`;
        bannerCarrera.hidden = false;
      }
    } else {
      fichaRuta.hidden = true;
      btnLimpiar.hidden = true;
      bannerCarrera.hidden = true;
      subtituloMes.textContent = 'Haz clic en un ciclo para ver los horarios y secciones programadas.';
    }

    actualizarBadgesCiclos();
    if (estado.ciclo) {
      pintarFilas();
    }
  }

  selCarreraPrincipal.addEventListener('change', (e) => {
    seleccionarCarrera(e.target.value);
  });

  $('btn-ver-todas-carreras').addEventListener('click', () => {
    seleccionarCarrera('');
  });

  $('btn-limpiar-carrera').addEventListener('click', () => {
    seleccionarCarrera('');
  });

  $('btn-cambiar-carrera-hoja').addEventListener('click', () => {
    seleccionarCarrera('');
  });

  /* ==========================================================================
     2. PASO 2: CICLOS DE APERTURA (Grid de meses)
     ========================================================================== */
  ciclos.forEach((ciclo) => {
    const columna = crear('div', 'col ciclo-card-wrapper');
    columna.setAttribute('role', 'listitem');

    const boton = crear('button', 'ciclo');
    boton.type = 'button';

    const header = crear('div', 'ciclo__header');
    header.append(
      crear('span', 'ciclo__mes', ciclo.nombre),
      crear('span', 'ciclo__icono', '📅')
    );

    const duracion = crear('span', 'ciclo__duracion', `⏱ Duración: ${ciclo.duracion}`);

    const notaSpan = crear('span', 'ciclo__nota ciclo__nota--proximamente');
    notaSpan.id = `nota-ciclo-${ciclo.id}`;
    notaSpan.innerHTML = `<span>○ Próximamente</span><span>Sin apertura</span>`;

    boton.append(header, duracion, notaSpan);
    boton.addEventListener('click', () => abrirCiclo(ciclo));

    columna.appendChild(boton);
    $('lista-meses').appendChild(columna);
  });

  function actualizarBadgesCiclos() {
    const permitidos = cursosDe(estado.carrera);

    ciclos.forEach((ciclo) => {
      const todasFilas = filasDe(ciclo.id);
      const filasFiltradas = permitidos
        ? todasFilas.filter((f) => permitidos.has(f.curso))
        : todasFilas;

      const total = filasFiltradas.length;
      const nodoNota = document.getElementById(`nota-ciclo-${ciclo.id}`);

      if (nodoNota) {
        if (total > 0) {
          nodoNota.className = 'ciclo__nota ciclo__nota--disponible';
          const label = estado.carrera
            ? `${total} ${total === 1 ? 'sección para tu carrera' : 'secciones para tu carrera'}`
            : `${total} ${total === 1 ? 'sección disponible' : 'secciones disponibles'}`;
          nodoNota.innerHTML = `<span>● ${label}</span><span>Ver horarios →</span>`;
        } else {
          nodoNota.className = 'ciclo__nota ciclo__nota--proximamente';
          const label = (estado.carrera && todasFilas.length > 0)
            ? 'Sin cupos para esta carrera'
            : 'Próximamente';
          nodoNota.innerHTML = `<span>○ ${label}</span><span>Sin apertura</span>`;
        }
      }
    });
  }

  /* ==========================================================================
     3. PASO 3: HOJA DE HORARIOS INTERACTIVA
     ========================================================================== */
  // Pestañas inferiores estilo libro de cálculo
  ciclos.forEach((ciclo) => {
    const pestana = crear('button', 'pestanas__item', ciclo.nombre);
    pestana.type = 'button';
    pestana.setAttribute('role', 'tab');
    pestana.dataset.ciclo = ciclo.id;
    pestana.addEventListener('click', () => abrirCiclo(ciclo));
    $('pestanas').appendChild(pestana);
  });

  const celda = (texto, clase) => crear('td', clase, texto);

  function pintarFilas() {
    if (!estado.ciclo) return;

    if (errorCarga && filasDe(estado.ciclo.id).length === 0) {
      $('sin-filas').hidden = false;
      $('sin-filas').replaceChildren();
      const divErr = crear('div', 'text-center p-4');
      divErr.appendChild(crear('p', 'mb-2 text-danger fw-bold fs-6', 'No se pudieron consultar los horarios en línea.'));
      const btnReintentar = crear('button', 'btn btn-sm btn-primary rounded-pill px-4', 'Reintentar conexión');
      btnReintentar.type = 'button';
      btnReintentar.addEventListener('click', () => cargarHorariosDesdeApi());
      divErr.appendChild(btnReintentar);
      $('sin-filas').appendChild(divErr);

      document.querySelector('.cinta').hidden = true;
      document.querySelector('.hoja').hidden = true;
      $('conteo').textContent = '';
      return;
    }

    const carrera = selFiltroCarrera.value;
    const turno = $('filtro-turno').value;
    const texto = normalizar($('filtro-texto').value);
    const permitidos = carrera ? cursosDe(carrera) : null;

    const filasCiclo = filasDe(estado.ciclo.id);
    const visibles = filasCiclo.filter((fila) => {
      if (permitidos && !permitidos.has(fila.curso)) return false;
      if (turno && fila.turno !== turno) return false;
      if (texto && !normalizar(`${fila.curso} ${fila.seccion} ${fila.docente} ${fila.dias}`).includes(texto)) return false;
      return true;
    });

    $('filas').replaceChildren(
      ...visibles.map((fila, indice) => {
        const tr = crear('tr');

        // Número de fila
        tr.append(celda(String(indice + 1), 'hoja__numero'));

        // Curso
        tr.append(celda(fila.curso, 'fw-bold text-dark'));

        // Sección con badge
        const tdSec = crear('td');
        const badgeSec = crear('span', 'badge-seccion', fila.seccion);
        tdSec.appendChild(badgeSec);
        tr.append(tdSec);

        // Fechas
        tr.append(
          celda(fila.inicio, 'hoja__dato text-muted'),
          celda(fila.fin, 'hoja__dato text-muted')
        );

        // Turno con badge estilizado
        const tdTurno = crear('td');
        const turnoClass = normalizar(fila.turno);
        const badgeTurno = crear('span', `badge-turno badge-turno--${turnoClass}`, fila.turno);
        tdTurno.appendChild(badgeTurno);
        tr.append(tdTurno);

        // Días y horario
        tr.append(
          celda(fila.dias, 'fw-semibold text-secondary'),
          celda(fila.horario, 'hoja__dato fw-bold')
        );

        // Aula con badge (Virtual / Presencial)
        const tdAula = crear('td');
        const isVirtual = (fila.aula || '').includes('Virtual');
        const badgeAula = crear('span', `badge-aula ${isVirtual ? 'badge-aula--virtual' : 'badge-aula--presencial'}`);
        badgeAula.innerHTML = isVirtual ? '💻 Virtual · Zoom' : '🏫 Presencial';
        tdAula.appendChild(badgeAula);
        tr.append(tdAula);

        // Docente
        const tdDocente = crear('td');
        if (fila.docente) {
          tdDocente.textContent = fila.docente;
          tdDocente.className = 'fw-semibold';
        } else {
          const spDoc = crear('span', 'hoja__pendiente', 'Por asignar');
          tdDocente.appendChild(spDoc);
        }
        tr.append(tdDocente);

        // Aula virtual o enlace
        const tdLink = crear('td');
        if (fila.linkAula) {
          const a = crear('a', 'btn-aula', 'Entrar al aula ↗');
          a.href = fila.linkAula;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.title = 'Abrir sesión de Zoom de la sección';
          tdLink.appendChild(a);
        } else {
          const spLink = crear('span', 'hoja__pendiente', 'Por publicar');
          tdLink.appendChild(spLink);
        }
        tr.append(tdLink);

        return tr;
      })
    );

    const publicado = filasCiclo.length > 0;
    $('sin-filas').hidden = visibles.length > 0;
    $('sin-filas').textContent = publicado
      ? 'No hay horarios disponibles con los filtros aplicados.'
      : 'Próximamente… Este ciclo aún no tiene secciones publicadas.';

    document.querySelector('.cinta').hidden = !publicado;
    document.querySelector('.hoja').hidden = !publicado;
    $('conteo').textContent = `${visibles.length} ${visibles.length === 1 ? 'sección' : 'secciones'}`;
  }

  function abrirCiclo(ciclo) {
    estado.ciclo = ciclo;
    $('mes-elegido').textContent = ciclo.nombre;
    $('detalle-ciclo').textContent = `Ciclo oficial de apertura de ${ciclo.nombre} · Duración del curso: ${ciclo.duracion}`;
    document.querySelectorAll('.pestanas__item').forEach((pestana) => {
      pestana.setAttribute('aria-selected', String(pestana.dataset.ciclo === ciclo.id));
    });

    // Mantener la carrera seleccionada
    selFiltroCarrera.value = estado.carrera;

    pintarFilas();
    $('seccion-carrera').hidden = true;
    $('paso-mes').hidden = true;
    $('paso-horarios').hidden = false;
    history.replaceState(null, '', `?mes=${ciclo.id}${estado.carrera ? `&carrera=${encodeURIComponent(estado.carrera)}` : ''}`);
    $('titulo-horarios').focus();
  }

  selFiltroCarrera.addEventListener('change', (e) => {
    seleccionarCarrera(e.target.value);
  });

  $('filtro-turno').addEventListener('change', pintarFilas);
  $('filtro-texto').addEventListener('input', pintarFilas);

  $('volver-meses').addEventListener('click', () => {
    estado.ciclo = null;
    $('paso-horarios').hidden = true;
    $('seccion-carrera').hidden = false;
    $('paso-mes').hidden = false;
    history.replaceState(null, '', location.pathname);
    $('titulo-mes').focus();
    actualizarBadgesCiclos();
  });

  // Carga de horarios desde la API con respaldo automático en datos.js
  async function cargarHorariosDesdeApi() {
    cargando = true;
    errorCarga = null;
    const apiBase = resolveApiBase();

    try {
      const resp = await fetch(`${apiBase}/horarios`, {
        headers: { Accept: 'application/json' },
      });

      if (!resp.ok) {
        throw new Error(`Error en el servidor (HTTP ${resp.status})`);
      }

      const json = await resp.json();
      const rawRows = Array.isArray(json) ? json : (json.data || []);

      if (rawRows.length > 0) {
        horariosPublicados = rawRows.map((r) => ({
          id: r.id,
          ciclo: (r.ciclo || '').toLowerCase(),
          curso: r.curso || '',
          seccion: r.seccion || '',
          inicio: formatearFecha(r.fechaInicio),
          fin: formatearFecha(r.fechaFin),
          turno: r.turno || '',
          dias: r.dias || '',
          horario: `${formatearHora12(r.horaInicio)} – ${formatearHora12(r.horaFin)}`,
          aula: r.aula === 'Virtual' ? 'Virtual · Zoom' : (r.aula || 'Presencial'),
          docente: r.docente || '',
          linkAula: r.linkAula || null,
          publicado: Boolean(r.publicado),
        }));
      } else {
        if (Array.isArray(window.CONSULTA_CURSOS?.horarios) && window.CONSULTA_CURSOS.horarios.length > 0) {
          horariosPublicados = window.CONSULTA_CURSOS.horarios;
        }
      }
    } catch (err) {
      console.warn('[app.js] API no disponible, usando catálogo de Canva en datos.js:', err.message);
      if (Array.isArray(window.CONSULTA_CURSOS?.horarios) && window.CONSULTA_CURSOS.horarios.length > 0) {
        horariosPublicados = window.CONSULTA_CURSOS.horarios;
      } else {
        errorCarga = err.message || 'Error de conexión';
      }
    } finally {
      cargando = false;
      actualizarBadgesCiclos();
      if (estado.ciclo) {
        pintarFilas();
      }
    }
  }

  // Iniciar consulta de API
  cargarHorariosDesdeApi();

  /* ==========================================================================
     4. PARÁMETROS INICIALES EN LA URL (?mes=enero&carrera=Psicologia)
     ========================================================================== */
  const params = new URLSearchParams(location.search);
  const carreraUrl = params.get('carrera');
  if (carreraUrl) {
    seleccionarCarrera(carreraUrl);
  }

  const cicloUrl = params.get('mes');
  const inicial = ciclos.find((ciclo) => ciclo.id === cicloUrl);
  if (inicial) {
    abrirCiclo(inicial);
  }
});
