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
  const { ciclos, rutas, horarios } = window.CONSULTA_CURSOS;
  const $ = (id) => document.getElementById(id);

  // 1. Obtener parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const carreraParam = params.get('carrera');
  let cicloActivo = (params.get('ciclo') || 'enero').toLowerCase();

  // Si no hay carrera seleccionada, redirigir al portal de selección
  if (!carreraParam) {
    window.location.href = 'index.html';
    return;
  }

  const carrera = carreraParam.trim();

  // Configurar enlace de retorno conservando la carrera
  const btnVolver = $('btn-volver-atras');
  if (btnVolver) {
    btnVolver.href = `index.html?carrera=${encodeURIComponent(carrera)}`;
  }

  // 2. Identificar la Ruta Oficial de la Carrera
  const ruta = rutas.find((r) => r.carreras.includes(carrera)) || {
    id: 0,
    nombre: 'Ruta Especial',
    cursos: [],
  };

  const cursosPermitidos = new Set(
    rutas
      .filter((r) => r.carreras.includes(carrera))
      .flatMap((r) => r.cursos)
  );

  // Pintar banner de carrera
  $('txt-carrera-nombre').textContent = carrera;
  $('txt-ruta-badge').textContent = `Ruta ${ruta.id}`;
  $('txt-ruta-nombre').textContent = `(${ruta.nombre.replace(/^Ruta \d+ · /, '')})`;

  const contCursos = $('txt-ruta-cursos');
  contCursos.replaceChildren(
    ...Array.from(cursosPermitidos).map((c) => {
      const span = document.createElement('span');
      span.className = 'ficha-ruta__curso-chip';
      span.innerHTML = `<span style="color:#0284c7">✓</span> ${c}`;
      return span;
    })
  );

  // 3. Pestañas de meses para cambiar de ciclo
  const contPestanas = $('pestanas-meses');
  ciclos.forEach((ciclo) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pestana-ciclo ${ciclo.id.toLowerCase() === cicloActivo ? 'activa' : ''}`;
    btn.textContent = ciclo.nombre;
    btn.dataset.ciclo = ciclo.id;
    btn.addEventListener('click', () => {
      cambiarCiclo(ciclo.id);
    });
    contPestanas.appendChild(btn);
  });

  function cambiarCiclo(nuevoCicloId) {
    cicloActivo = nuevoCicloId.toLowerCase();
    document.querySelectorAll('.pestana-ciclo').forEach((btn) => {
      btn.classList.toggle('activa', btn.dataset.ciclo.toLowerCase() === cicloActivo);
    });

    const newUrl = new URL(window.location);
    newUrl.searchParams.set('ciclo', cicloActivo);
    window.history.replaceState(null, '', newUrl);

    pintarTabla();
  }

  // 4. Fuente de datos: API REST o catálogo oficial en datos.js
  let horariosCargados = [];

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
          horariosCargados = filas.map((r) => ({
            id: r.id,
            ciclo: (r.ciclo || '').toLowerCase(),
            curso: r.curso || '',
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
          }));
        } else {
          horariosCargados = horarios || [];
        }
      } else {
        horariosCargados = horarios || [];
      }
    } catch {
      horariosCargados = horarios || [];
    }

    pintarTabla();
  }

  // 5. Renderizado de Filas de la Tabla
  function pintarTabla() {
    const tbody = $('filas-horarios');
    const sinHorarios = $('sin-horarios');
    const conteo = $('conteo-secciones');
    const textoFiltro = normalizar($('filtro-texto').value);
    const turnoFiltro = $('filtro-turno').value;

    const filasCiclo = horariosCargados.filter(
      (h) => (h.ciclo || '').toLowerCase() === cicloActivo
    );

    // Filtrar estrictamente por los cursos que le tocan a esta carrera
    const filasCarrera = filasCiclo.filter((h) => cursosPermitidos.has(h.curso));

    // Filtrar por turno y texto de búsqueda
    const filasVisibles = filasCarrera.filter((fila) => {
      if (turnoFiltro && fila.turno !== turnoFiltro) return false;
      if (
        textoFiltro &&
        !normalizar(`${fila.curso} ${fila.seccion} ${fila.docente} ${fila.dias} ${fila.aula}`).includes(
          textoFiltro
        )
      ) {
        return false;
      }
      return true;
    });

    conteo.textContent = `Mostrando ${filasVisibles.length} de ${filasCarrera.length} secciones programadas`;

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
        tdNum.className = 'text-muted fw-bold text-center';
        tdNum.textContent = index + 1;

        // 2. Curso Oficial
        const tdCurso = document.createElement('td');
        tdCurso.innerHTML = `<strong class="text-dark d-block">${fila.curso}</strong>`;

        // 3. Sección
        const tdSec = document.createElement('td');
        tdSec.innerHTML = `<span class="badge bg-light text-dark border">${fila.seccion}</span>`;

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
        tdHorario.className = 'font-monospace text-nowrap';
        tdHorario.style.fontSize = '12px';
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
        tdAcceso.className = 'text-center';
        if (fila.linkAula) {
          tdAcceso.innerHTML = `<a href="${fila.linkAula}" target="_blank" rel="noopener noreferrer" class="btn-zoom" title="Abrir sala Zoom">
            <span>Ingresar</span> <span>↗</span>
          </a>`;
        } else {
          tdAcceso.innerHTML = `<span class="badge bg-light text-muted border" style="font-size:10.5px;">Aula Virtual</span>`;
        }

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

        return tr;
      })
    );
  }

  // Eventos de filtros
  $('filtro-texto').addEventListener('input', pintarTabla);
  $('filtro-turno').addEventListener('change', pintarTabla);

  $('btn-reset-filtros').addEventListener('click', () => {
    $('filtro-texto').value = '';
    $('filtro-turno').value = '';
    pintarTabla();
  });

  // Iniciar carga
  cargarDatos();
});

