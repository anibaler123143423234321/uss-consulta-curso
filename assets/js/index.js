/**
 * USS Consulta de Cursos - Portal de Selección (index.html)
 * Archivo: assets/js/index.js
 *
 * Flujo:
 * 1. El estudiante escribe y selecciona su carrera en la tarjeta principal.
 * 2. Una vez seleccionada, esa misma tarjeta se limpia suavemente y muestra
 *    la barra de carrera activa junto con los ciclos de apertura programados.
 * 3. Al hacer clic en un ciclo, redirige a horarios.html con los filtros aplicados.
 */
document.addEventListener('DOMContentLoaded', () => {
  const { ciclos, rutas, cursosTradicionales = [], cursosParaTodos = [] } = window.CONSULTA_CURSOS;
  // Sin datos locales: las secciones llegan solo desde Google Drive (ver sincronizarHorariosDrive).
  let horariosDisponibles = [];
  let estadoCarga = 'cargando'; // 'cargando' | 'listo' | 'error'
  const $ = (id) => document.getElementById(id);

  let carreraSeleccionada = '';
  let modeloSeleccionado = null;
  let indiceActivoTeclado = -1;

  const normalizar = (texto) =>
    (texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const crear = (etiqueta, clase, texto) => {
    const el = document.createElement(etiqueta);
    if (clase) el.className = clase;
    if (texto !== undefined) el.textContent = texto;
    return el;
  };

  // Construir mapa de carreras únicas (evita duplicidad)
  const mapaCarrerasMap = new Map();
  rutas.forEach((ruta) => {
    ruta.carreras.forEach((carrera) => {
      if (!mapaCarrerasMap.has(carrera)) {
        mapaCarrerasMap.set(carrera, {
          nombre: carrera,
          rutaId: ruta.id,
          rutaNombre: ruta.nombre,
          cursos: [...ruta.cursos],
        });
      } else {
        const existente = mapaCarrerasMap.get(carrera);
        ruta.cursos.forEach((c) => {
          if (!existente.cursos.includes(c)) existente.cursos.push(c);
        });
      }
    });
  });

  const mapaCarreras = Array.from(mapaCarrerasMap.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, 'es')
  );

  // Obtener cursos oficiales de la carrera según el modelo seleccionado
  const cursosDeCarrera = (carrera, modelo = modeloSeleccionado) => {
    if (!carrera) return null;
    if (modelo === 'tradicional') {
      const trad = cursosTradicionales.length > 0 ? cursosTradicionales : cursosParaTodos;
      return new Set(trad);
    }
    // Modelo PROTECH XP: estrictamente los cursos de la ruta oficial por carrera
    const info = mapaCarrerasMap.get(carrera);
    return info ? new Set(info.cursos) : null;
  };

  /* ==========================================================================
     1. VISTAS Y TRANSICIÓN ADENTRO DE LA TARJETA ELEVADA
     ========================================================================== */
  const vistaCarrera = $('vista-carrera');
  const vistaCiclos = $('vista-ciclos');
  const carreraBadge = $('carrera-elegida-badge');
  const btnCambiarCarrera = $('btn-cambiar-carrera');

  const elWrap = $('carrera-combobox-wrap');
  const elInput = $('input-carrera-principal');
  const elToggle = $('btn-toggle-carrera');
  const elDropdown = $('dropdown-carreras');
  const elOptions = $('lista-opciones-carreras');

  let opcionesFiltradas = [...mapaCarreras];

  function abrirDropdown() {
    elDropdown.hidden = false;
    elWrap.classList.add('abierto');
    renderOpciones(elInput.value.trim());
  }

  function cerrarDropdown() {
    elDropdown.hidden = true;
    elWrap.classList.remove('abierto');
    indiceActivoTeclado = -1;
  }

  function resaltarTexto(texto, query) {
    if (!query) return document.createTextNode(texto);
    const pos = normalizar(texto).indexOf(normalizar(query));
    if (pos === -1) return document.createTextNode(texto);

    const span = document.createElement('span');
    const antes = texto.substring(0, pos);
    const match = texto.substring(pos, pos + query.length);
    const despues = texto.substring(pos + query.length);

    if (antes) span.appendChild(document.createTextNode(antes));
    const mark = document.createElement('span');
    mark.className = 'carrera-combobox__highlight';
    mark.textContent = match;
    span.appendChild(mark);
    if (despues) span.appendChild(document.createTextNode(despues));

    return span;
  }

  function renderOpciones(query) {
    const qNorm = normalizar(query);
    opcionesFiltradas = mapaCarreras.filter((item) =>
      normalizar(item.nombre).includes(qNorm) || normalizar(item.rutaNombre).includes(qNorm)
    );

    elOptions.replaceChildren();

    if (opcionesFiltradas.length === 0) {
      const vacio = crear(
        'div',
        'carrera-combobox__empty',
        `No se encontró ninguna carrera para "${query}"`
      );
      elOptions.appendChild(vacio);
      return;
    }

    opcionesFiltradas.forEach((item, idx) => {
      const divItem = crear('div', 'carrera-combobox__item');
      if (item.nombre === carreraSeleccionada) {
        divItem.classList.add('seleccionado');
      }
      divItem.setAttribute('role', 'option');
      divItem.dataset.index = idx;

      const spanNombre = crear('span', 'carrera-combobox__item-nombre');
      spanNombre.appendChild(resaltarTexto(item.nombre, query));

      const spanRuta = crear('span', 'carrera-combobox__item-ruta', `Ruta ${item.rutaId}`);

      divItem.append(spanNombre, spanRuta);

      divItem.addEventListener('click', (e) => {
        e.stopPropagation();
        seleccionarCarrera(item.nombre);
      });

      elOptions.appendChild(divItem);
    });

    indiceActivoTeclado = -1;
  }

  function seleccionarCarrera(carrera) {
    carreraSeleccionada = (carrera || '').trim();
    cerrarDropdown();

    if (carreraSeleccionada) {
      // 1. Limpiar y ocultar la vista de selección de carrera
      vistaCarrera.hidden = true;

      // 2. Mostrar la vista de ciclos en esa misma tarjeta
      carreraBadge.textContent = carreraSeleccionada;
      vistaCiclos.hidden = false;

      // 3. Actualizar conteo de secciones por ciclo para esta carrera
      actualizarContadoresCiclos();
    } else {
      // Al cambiar de carrera se exige volver a elegir el modelo explícitamente.
      modeloSeleccionado = null;
      [cardModeloProtech, cardModeloTradicional].forEach((card) => {
        card?.classList.remove('activa');
        card?.setAttribute('aria-checked', 'false');
      });
      gridCiclos.hidden = true;
      // Volver a la vista de selección de carrera.
      vistaCiclos.hidden = true;
      vistaCarrera.hidden = false;
      elInput.value = '';
    }
  }

  // Botón Cambiar Carrera dentro de la tarjeta
  btnCambiarCarrera.addEventListener('click', () => {
    seleccionarCarrera('');
    setTimeout(() => {
      elInput.focus();
      abrirDropdown();
    }, 50);
  });

  // Eventos en el Input Principal
  elInput.addEventListener('focus', () => {
    abrirDropdown();
  });

  elInput.addEventListener('input', (e) => {
    abrirDropdown();
    renderOpciones(e.target.value);
  });

  elInput.addEventListener('keydown', (e) => {
    const items = elOptions.querySelectorAll('.carrera-combobox__item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (elDropdown.hidden) {
        abrirDropdown();
        return;
      }
      if (items.length > 0) {
        indiceActivoTeclado = (indiceActivoTeclado + 1) % items.length;
        actualizarItemActivoTeclado(items);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length > 0) {
        indiceActivoTeclado = (indiceActivoTeclado - 1 + items.length) % items.length;
        actualizarItemActivoTeclado(items);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (indiceActivoTeclado >= 0 && indiceActivoTeclado < opcionesFiltradas.length) {
        seleccionarCarrera(opcionesFiltradas[indiceActivoTeclado].nombre);
      } else if (opcionesFiltradas.length > 0) {
        seleccionarCarrera(opcionesFiltradas[0].nombre);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cerrarDropdown();
    }
  });

  function actualizarItemActivoTeclado(items) {
    items.forEach((it, i) => {
      const activo = i === indiceActivoTeclado;
      it.classList.toggle('activo', activo);
      if (activo) {
        it.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  elToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (elDropdown.hidden) {
      elInput.focus();
      abrirDropdown();
    } else {
      cerrarDropdown();
    }
  });

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!elDropdown.hidden && !$('carrera-combobox').contains(e.target)) {
      cerrarDropdown();
    }
  });

  /* ==========================================================================
     2. SELECTOR DE MODELO DE ACREDITACIÓN (PROTECH XP vs Plan Tradicional)
     ========================================================================== */
  const cardModeloProtech = $('opcion-modelo-protech');
  const cardModeloTradicional = $('opcion-modelo-tradicional');

  function seleccionarModelo(nuevoModelo) {
    if (!['protech', 'tradicional'].includes(nuevoModelo)) return;

    modeloSeleccionado = nuevoModelo;

    const esProtech = modeloSeleccionado === 'protech';

    cardModeloProtech?.classList.toggle('activa', esProtech);
    cardModeloProtech?.setAttribute('aria-checked', String(esProtech));

    cardModeloTradicional?.classList.toggle('activa', !esProtech);
    cardModeloTradicional?.setAttribute('aria-checked', String(!esProtech));

    actualizarContadoresCiclos();
  }

  [cardModeloProtech, cardModeloTradicional].forEach((card) => {
    if (!card) return;
    const modelo = card.dataset.modelo;
    card.addEventListener('click', () => seleccionarModelo(modelo));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        seleccionarModelo(modelo);
      }
    });
  });

  /* ==========================================================================
     3. GRID DE CICLOS DE APERTURA (Adentro de la Tarjeta Elevada)
     ========================================================================== */
  const gridCiclos = $('grid-ciclos');

  ciclos.forEach((ciclo) => {
    const btn = crear('button', 'ciclo-btn');
    btn.type = 'button';
    btn.id = `btn-ciclo-${ciclo.id}`;

    const header = crear('div', 'ciclo-btn__header');
    const izquierda = document.createElement('div');
    const mes = crear('span', 'ciclo-btn__mes', ciclo.nombre);
    const duracion = crear('div', 'ciclo-btn__duracion', ciclo.duracion);
    izquierda.append(mes, duracion);
    const icono = crear('span', 'ciclo-btn__icono', '📅');
    header.append(izquierda, icono);

    const footer = crear('div', 'ciclo-btn__footer');
    const badge = crear('span', 'ciclo-btn__badge ciclo-btn__badge--disponible');
    badge.id = `badge-ciclo-${ciclo.id}`;
    badge.textContent = 'Consultar';

    const accion = crear('span', 'ciclo-btn__accion', 'Ver horarios →');
    footer.append(badge, accion);

    btn.append(header, footer);

    // Clic en el ciclo -> Redirige a horarios.html con carrera, ciclo y modelo
    btn.addEventListener('click', () => {
      abrirHorarios(ciclo.id);
    });

    gridCiclos.appendChild(btn);
  });

  // Debajo de las tarjetas: ciclos que aún no abren y contacto
  const proximos = crear('p', 'ciclos-proximos');
  proximos.id = 'ciclos-proximos';
  const ayuda = crear('p', 'ciclos-ayuda');
  ayuda.append('¿Dudas con tu matrícula? ');
  const enlaceWsp = crear('a', null, 'Escríbenos al WhatsApp 986 724 506');
  enlaceWsp.href = 'https://wa.me/51986724506';
  enlaceWsp.target = '_blank';
  enlaceWsp.rel = 'noopener noreferrer';
  ayuda.appendChild(enlaceWsp);
  gridCiclos.after(proximos, ayuda);

  // Estado de conexión con Google Drive: esqueleto mientras descarga, alerta con reintento si falla
  const estadoRed = crear('div', 'estado-red');
  estadoRed.id = 'estado-red-ciclos';
  estadoRed.setAttribute('role', 'status');
  estadoRed.setAttribute('aria-live', 'polite');
  estadoRed.hidden = true;
  gridCiclos.before(estadoRed);

  function pintarEstadoRed() {
    if (estadoCarga === 'cargando') {
      estadoRed.className = 'estado-red estado-red--cargando';
      const aviso = crear('p', 'estado-red__texto');
      aviso.append(crear('span', 'estado-red__spinner'), 'Conectando con Google Drive y cargando horarios en tiempo real…');
      const esqueletos = crear('div', 'estado-red__esqueletos');
      esqueletos.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 4; i += 1) esqueletos.appendChild(crear('div', 'esqueleto esqueleto--ciclo'));
      estadoRed.replaceChildren(aviso, esqueletos);
    } else {
      estadoRed.className = 'estado-red estado-red--error';
      estadoRed.setAttribute('role', 'alert');
      const titulo = crear('p', 'estado-red__titulo', 'No pudimos conectar con Google Drive');
      const detalle = crear('p', 'estado-red__texto', 'Revisa tu conexión a Internet e inténtalo de nuevo. Los horarios se publican solo en línea.');
      const acciones = crear('div', 'estado-red__acciones');
      const reintentar = crear('button', 'btn btn-sm btn-primary rounded-pill px-3', '↻ Reintentar conexión');
      reintentar.type = 'button';
      reintentar.addEventListener('click', sincronizarHorariosDrive);
      const wsp = crear('a', 'btn btn-sm btn-outline-success rounded-pill px-3', 'WhatsApp de soporte');
      wsp.href = 'https://wa.me/51986724506';
      wsp.target = '_blank';
      wsp.rel = 'noopener noreferrer';
      acciones.append(reintentar, wsp);
      estadoRed.replaceChildren(titulo, detalle, acciones);
    }
  }

  // Solo se muestran como tarjeta los ciclos con horarios para la carrera y modelo elegidos
  function actualizarContadoresCiclos() {
    estadoRed.hidden = true;
    // Validación: impedir mostrar ciclos mientras no exista un modelo elegido
    if (!modeloSeleccionado) {
      ciclos.forEach((ciclo) => {
        const btn = $(`btn-ciclo-${ciclo.id}`);
        if (btn) {
          btn.hidden = true;
          btn.disabled = true;
        }
      });
      gridCiclos.hidden = true;
      proximos.hidden = false;
      proximos.textContent = '👆 Selecciona en el Paso 2 si cursas el Modelo PROTECH XP o el Plan Tradicional para ver los ciclos disponibles.';
      return;
    }

    // Mientras Drive no responde (o si falló) no se pinta ningún ciclo: nada de datos simulados
    if (estadoCarga !== 'listo') {
      gridCiclos.hidden = true;
      proximos.hidden = true;
      estadoRed.hidden = false;
      pintarEstadoRed();
      return;
    }

    gridCiclos.hidden = false;
    const permitidos = cursosDeCarrera(carreraSeleccionada, modeloSeleccionado);
    const sinApertura = [];

    ciclos.forEach((ciclo) => {
      const btn = $(`btn-ciclo-${ciclo.id}`);
      const badge = $(`badge-ciclo-${ciclo.id}`);
      if (!btn || !badge) return;

      const filas = horariosDisponibles.filter((h) => {
        if ((h.ciclo || '').toLowerCase() !== ciclo.id.toLowerCase()) return false;
        // Si el horario tiene modelo definido, debe coincidir; si no, inferir por curso
        const modeloFila =
          h.modelo ||
          (window.CONSULTA_CURSOS.esCursoDeModelo(h.curso, 'tradicional') ? 'tradicional' : 'protech');
        if (modeloFila !== modeloSeleccionado) return false;
        if (permitidos && !permitidos.has(h.curso)) return false;
        return window.CONSULTA_CURSOS.seccionVisible(h.seccion, carreraSeleccionada);
      });
      const total = filas.length;

      btn.hidden = total === 0;
      btn.disabled = total === 0;
      if (total === 0) {
        sinApertura.push(ciclo.nombre);
        return;
      }

      const cursosDistintos = new Set(filas.map((h) => h.curso)).size;
      const anio = filas[0].anio || (filas[0].inicio || '').split('/')[2] || '';
      btn.dataset.anio = anio;
      btn.classList.add('ciclo-btn--destacado');
      btn.querySelector('.ciclo-btn__mes').textContent = `${ciclo.nombre} ${anio}`.trim();
      const conFechas = filas.find((h) => h.inicio && h.fin);
      btn.querySelector('.ciclo-btn__duracion').textContent = conFechas
        ? `Clases del ${conFechas.inicio} al ${conFechas.fin} · ${ciclo.duracion}`
        : `Fechas por confirmar · ${ciclo.duracion}`;
      badge.className = 'ciclo-btn__badge ciclo-btn__badge--disponible';
      const cerradas = filas.filter((h) => h.estado === 'Cerrado').length;
      badge.textContent =
        `${cursosDistintos} ${cursosDistintos === 1 ? 'curso' : 'cursos'} · ${total} ${total === 1 ? 'sección' : 'secciones'}` +
        (cerradas ? ` · ${cerradas} ${cerradas === 1 ? 'cerrada' : 'cerradas'}` : '');
    });

    proximos.hidden = sinApertura.length === 0;
    proximos.textContent = `Próximamente: ${sinApertura.join(' · ')}`;

    const sinNinguno = sinApertura.length === ciclos.length;
    gridCiclos.hidden = sinNinguno;
    if (sinNinguno) {
      proximos.textContent = 'Por ahora no hay ciclos con horarios publicados para tu carrera y modelo seleccionados. Vuelve a consultar pronto.';
    }
  }

  function abrirHorarios(cicloId) {
    if (!carreraSeleccionada) return;
    if (!modeloSeleccionado) {
      cardModeloProtech?.focus();
      return;
    }
    const btn = $(`btn-ciclo-${cicloId}`);
    if (btn && btn.disabled) return;
    const url = `horarios.html?ciclo=${encodeURIComponent(cicloId)}&carrera=${encodeURIComponent(
      carreraSeleccionada
    )}&modelo=${encodeURIComponent(modeloSeleccionado)}&anio=${encodeURIComponent(btn?.dataset.anio || '')}`;
    window.location.href = url;
  }

  // Ciclos y secciones 100% desde Google Drive (todas las hojas de config.js).
  // Si Drive no responde se muestra «Reintentar conexión»; nunca se usan datos locales.
  async function sincronizarHorariosDrive() {
    estadoCarga = 'cargando';
    if (carreraSeleccionada) actualizarContadoresCiclos();
    try {
      horariosDisponibles = await window.CONSULTA_CURSOS.cargarHorariosRemotos();
      estadoCarga = 'listo';
    } catch (error) {
      console.error('Google Drive no disponible:', error);
      horariosDisponibles = [];
      estadoCarga = 'error';
    }
    if (carreraSeleccionada) actualizarContadoresCiclos();
  }
  sincronizarHorariosDrive();

  // Comprobar parámetros de URL (si regresan desde horarios.html).
  // Se restaura la carrera, nunca el modelo: el estudiante debe elegirlo de nuevo.
  const params = new URLSearchParams(window.location.search);
  const carreraUrl = params.get('carrera');
  if (carreraUrl) {
    seleccionarCarrera(carreraUrl);
  }
});
