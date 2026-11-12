/**
 * USS Consulta de Cursos - Vista de Horarios (horarios.html)
 * Archivo: assets/js/horarios.js
 *
 * Funcionalidad:
 * 1. Lee parámetros de URL (?ciclo=enero&carrera=Psicologia).
 * 2. Muestra banner oficial de la carrera y ruta de aprendizaje CINF.
 * 3. Permite alternar de ciclo mediante pestañas directas sin salir de la página.
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
  let cicloActivo = (params.get('ciclo') || 'enero').toLowerCase();
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
      btnVolver.href = `${homePath}?carrera=${encodeURIComponent(carrera)}&modelo=${encodeURIComponent(modeloActivo)}`;
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

  // Selector interactivo de Modelo (Switcher entre PROTECH XP y Plan Tradicional)
  const tabModeloProtech = $('tab-modelo-protech');
  const tabModeloTradicional = $('tab-modelo-tradicional');

  function actualizarTabsModelo() {
    const esProtech = modeloActivo === 'protech';
    if (tabModeloProtech) {
      tabModeloProtech.classList.toggle('activa', esProtech);
      tabModeloProtech.setAttribute('aria-selected', esProtech ? 'true' : 'false');
    }
    if (tabModeloTradicional) {
      tabModeloTradicional.classList.toggle('activa', !esProtech);
      tabModeloTradicional.setAttribute('aria-selected', !esProtech ? 'true' : 'false');
    }
    actualizarBadgeModelo();
    actualizarEnlaceVolver();
  }

  function cambiarModelo(nuevoModelo) {
    const normalizado = nuevoModelo === 'tradicional' ? 'tradicional' : 'protech';
    if (normalizado === modeloActivo) return;
    modeloActivo = normalizado;

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('modelo', modeloActivo);
    window.history.replaceState(null, '', newUrl);

    actualizarTabsModelo();

    // Si el ciclo activo no tiene secciones para el nuevo modelo, pasar al primer ciclo disponible
    if (contarSeccionesCiclo(cicloActivo) === 0) {
      const cicloDisponible = ciclos.find((c) => contarSeccionesCiclo(c.id) > 0);
      if (cicloDisponible) {
        cicloActivo = cicloDisponible.id.toLowerCase();
        newUrl.searchParams.set('ciclo', cicloActivo);
        window.history.replaceState(null, '', newUrl);
      }
    }

    actualizarPestanasCiclos();
    poblarFiltrosDinamicos();
    pintarTabla();
  }

  tabModeloProtech?.addEventListener('click', () => cambiarModelo('protech'));
  tabModeloTradicional?.addEventListener('click', () => cambiarModelo('tradicional'));

  // 3. Control de Ciclos y Pestañas con Bloqueo de Meses sin Apertura
  const contPestanas = $('pestanas-meses');

  function contarSeccionesCiclo(cicloId) {
    if (!horariosCargados || horariosCargados.length === 0) return 0;
    const cNorm = (cicloId || '').toLowerCase();
    return horariosCargados.filter(
      (h) => (h.ciclo || '').toLowerCase() === cNorm && esDeLaCarrera(h)
    ).length;
  }

  function actualizarPestanasCiclos() {
    if (!contPestanas) return;
    contPestanas.replaceChildren(
      ...ciclos.map((ciclo) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const cId = ciclo.id.toLowerCase();
        const num = contarSeccionesCiclo(cId);
        const estaActivo = cId === cicloActivo;

        btn.dataset.ciclo = ciclo.id;

        if (num === 0) {
          btn.className = 'pestana-ciclo pestana-ciclo--bloqueada';
          btn.disabled = true;
          btn.title = `${ciclo.nombre}: Sin cursos programados para esta carrera`;
          btn.innerHTML = `<span>${ciclo.nombre}</span> <span class="pestana-ciclo__lock" aria-hidden="true">🔒</span>`;
        } else {
          btn.className = `pestana-ciclo ${estaActivo ? 'activa' : ''}`;
          btn.innerHTML = `<span>${ciclo.nombre}</span> <span class="pestana-ciclo__badge">${num}</span>`;
          btn.addEventListener('click', () => {
            cambiarCiclo(ciclo.id);
          });
        }
        return btn;
      })
    );

    // La pestaña activa puede quedar fuera de la vista en celular: se centra en su carril
    const activa = contPestanas.querySelector('.pestana-ciclo.activa');
    const carril = $('pestanas-scroll');
    if (activa && carril) {
      carril.scrollLeft = activa.offsetLeft - (carril.clientWidth - activa.offsetWidth) / 2;
    }
    actualizarSombrasCarril();
  }

  // Degradado en los bordes del carril cuando quedan pestañas por deslizar
  function actualizarSombrasCarril() {
    const carril = $('pestanas-scroll');
    if (!carril) return;
    const resto = carril.scrollWidth - carril.clientWidth - carril.scrollLeft;
    carril.classList.toggle('hay-mas-derecha', resto > 4);
    carril.classList.toggle('hay-mas-izquierda', carril.scrollLeft > 4);
  }

  $('pestanas-scroll')?.addEventListener('scroll', actualizarSombrasCarril, { passive: true });
  window.addEventListener('resize', actualizarSombrasCarril);

  function cambiarCiclo(nuevoCicloId) {
    const cId = nuevoCicloId.toLowerCase();
    if (contarSeccionesCiclo(cId) === 0) return;

    cicloActivo = cId;
    actualizarPestanasCiclos();

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('ciclo', cicloActivo);
    window.history.replaceState(null, '', newUrl);

    poblarFiltrosDinamicos();
    pintarTabla();
  }

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

  async function cargarDatos() {
    try {
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
    } catch {
      horariosCargados = horarios || [];
    }

    // Si el ciclo activo no tiene secciones para esta carrera y modelo, pasar al primer ciclo que sí tenga
    if (contarSeccionesCiclo(cicloActivo) === 0) {
      const cicloDisponible = ciclos.find((c) => contarSeccionesCiclo(c.id) > 0);
      if (cicloDisponible) {
        cicloActivo = cicloDisponible.id.toLowerCase();
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('ciclo', cicloActivo);
        window.history.replaceState(null, '', newUrl);
      }
    }

    actualizarTabsModelo();
    leerFiltrosDeUrl();
    actualizarPestanasCiclos();
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
    horariosCargados.filter((h) => (h.ciclo || '').toLowerCase() === cicloActivo && esDeLaCarrera(h));

  // Reescribe las opciones con su conteo y deshabilita las que no darían resultados
  function poblarFiltrosDinamicos() {
    const filas = filasDelCiclo();
    const f = valoresFiltros();
    const ordenCursos = [...cursosPermitidosActivos()];

    const opciones = {
      curso: [...new Set(filas.map((h) => h.curso))].sort((a, b) => ordenCursos.indexOf(a) - ordenCursos.indexOf(b)).map((v) => [v, v]),
      turno: ['Mañana', 'Tarde', 'Noche'].map((v) => [v, v]),
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
  function pintarTabla() {
    const tbody = $('filas-horarios');
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

        // 1. Número
        const tdNum = document.createElement('td');
        tdNum.className = 'col-num';
        tdNum.textContent = index + 1;

        // 2. Curso Oficial
        const tdCurso = document.createElement('td');
        tdCurso.className = 'col-curso';
        tdCurso.innerHTML = `<strong>${fila.curso}</strong>`;

        // 3. Sección
        const tdSec = document.createElement('td');
        tdSec.className = 'col-sec';
        tdSec.innerHTML = `<span class="badge-seccion">${fila.seccion}</span>`;

        // 4. Inicio
        const tdInicio = document.createElement('td');
        tdInicio.textContent = fila.inicio;

        // 5. Fin
        const tdFin = document.createElement('td');
        tdFin.textContent = fila.fin;

        // 6. Turno
        const tdTurno = document.createElement('td');
        let claseTurno = 'badge-turno--manana';
        if (fila.turno === 'Tarde') claseTurno = 'badge-turno--tarde';
        if (fila.turno === 'Noche') claseTurno = 'badge-turno--noche';
        tdTurno.innerHTML = `<span class="badge-turno ${claseTurno}">${fila.turno || '—'}</span>`;

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
        tdAula.innerHTML = `<span class="badge-aula ${esZoom ? 'badge-aula--zoom' : ''}">
          ${esZoom ? '📹' : '📍'} ${fila.aula || 'Virtual'}
        </span>`;

        // 10. Cupos
        const tdCupos = document.createElement('td');
        tdCupos.className = 'text-center';
        tdCupos.innerHTML = `<span class="badge-cupos" title="Cupos referenciales programados">👥 <strong>${fila.cupos || 30}</strong> cupos</span>`;

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
        if (fila.linkAula) {
          tdAcceso.innerHTML = `<a href="${fila.linkAula}" target="_blank" rel="noopener noreferrer" class="btn-zoom" title="Abrir sala Zoom">
            <span>Ingresar</span> <span>↗</span>
          </a>`;
        } else {
          tdAcceso.innerHTML = `<span class="badge-acceso-pendiente">Aula Virtual</span>`;
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

