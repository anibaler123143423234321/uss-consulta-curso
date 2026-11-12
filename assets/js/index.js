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
  const { ciclos, rutas, horarios, cursosParaTodos = [] } = window.CONSULTA_CURSOS;
  const $ = (id) => document.getElementById(id);

  let carreraSeleccionada = '';
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

  // Obtener cursos oficiales de la carrera
  const cursosDeCarrera = (carrera) => {
    if (!carrera) return null;
    const info = mapaCarrerasMap.get(carrera);
    return info ? new Set([...info.cursos, ...cursosParaTodos]) : null;
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
      // Volver a la vista de selección de carrera
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
     2. GRID DE CICLOS DE APERTURA (Adentro de la Tarjeta Elevada)
     ========================================================================== */
  const gridCiclos = $('grid-ciclos');

  ciclos.forEach((ciclo) => {
    const btn = crear('button', 'ciclo-btn');
    btn.type = 'button';
    btn.id = `btn-ciclo-${ciclo.id}`;

    const header = crear('div', 'ciclo-btn__header');
    const izquierda = document.createElement('div');
    const mes = crear('span', 'ciclo-btn__mes', ciclo.nombre);
    const duracion = crear('div', 'ciclo-btn__duracion', `⏱ ${ciclo.duracion}`);
    izquierda.append(mes, duracion);
    const icono = crear('span', 'ciclo-btn__icono', '📅');
    header.append(izquierda, icono);

    const footer = crear('div', 'ciclo-btn__footer');
    const badge = crear('span', 'ciclo-btn__badge ciclo-btn__badge--disponible');
    badge.id = `badge-ciclo-${ciclo.id}`;
    badge.innerHTML = '<span>●</span> <span>Consultar</span>';

    const accion = crear('span', 'ciclo-btn__accion', 'Ver horarios →');
    footer.append(badge, accion);

    btn.append(header, footer);

    // Clic en el ciclo -> Redirige a horarios.html con la carrera y ciclo
    btn.addEventListener('click', () => {
      abrirHorarios(ciclo.id);
    });

    gridCiclos.appendChild(btn);
  });

  // Tarjeta 8 de ayuda rápida para balancear la cuadrícula 4x2
  const tarjetaAyuda = crear('div', 'ciclo-btn ciclo-btn--ayuda');
  tarjetaAyuda.innerHTML = `
    <div class="ciclo-btn__header">
      <div>
        <span class="ciclo-btn__mes" style="font-size:12.5px;color:#1e3a8a;">Asistencia CINF</span>
        <div class="ciclo-btn__duracion">Atención al estudiante</div>
      </div>
      <span class="ciclo-btn__icono">💬</span>
    </div>
    <div class="ciclo-btn__footer">
      <span class="ciclo-btn__badge" style="color:#0284c7;font-size:10.5px;">Soporte WhatsApp USS</span>
      <a href="https://wa.me/51986724506" target="_blank" rel="noopener noreferrer" class="ciclo-btn__accion" style="text-decoration:none;">Contactar ↗</a>
    </div>
  `;
  gridCiclos.appendChild(tarjetaAyuda);

  function actualizarContadoresCiclos() {
    const permitidos = cursosDeCarrera(carreraSeleccionada);

    ciclos.forEach((ciclo) => {
      const btn = $(`btn-ciclo-${ciclo.id}`);
      const badge = $(`badge-ciclo-${ciclo.id}`);
      if (!btn || !badge) return;

      const accion = btn.querySelector('.ciclo-btn__accion');

      const filasCiclo = (horarios || []).filter(
        (h) => (h.ciclo || '').toLowerCase() === ciclo.id.toLowerCase()
      );

      const filasFiltradas = permitidos
        ? filasCiclo.filter((f) => permitidos.has(f.curso))
        : filasCiclo;

      const total = filasFiltradas.length;

      if (total > 0) {
        btn.disabled = false;
        btn.classList.add('ciclo-btn--destacado');
        btn.classList.remove('ciclo-btn--deshabilitado');
        badge.className = 'ciclo-btn__badge ciclo-btn__badge--disponible';
        badge.innerHTML = `<span>●</span> <span>${total} secciones para tu carrera</span>`;
        if (accion) {
          accion.textContent = 'Ver horarios →';
          accion.className = 'ciclo-btn__accion';
        }
      } else {
        btn.disabled = true;
        btn.classList.remove('ciclo-btn--destacado');
        btn.classList.add('ciclo-btn--deshabilitado');
        badge.className = 'ciclo-btn__badge ciclo-btn__badge--vacio';
        badge.innerHTML = `<span>🔒</span> <span>Próximamente</span>`;
        if (accion) {
          accion.textContent = 'Sin apertura';
          accion.className = 'ciclo-btn__accion ciclo-btn__accion--bloqueado';
        }
      }
    });
  }

  function abrirHorarios(cicloId) {
    if (!carreraSeleccionada) return;
    const btn = $(`btn-ciclo-${cicloId}`);
    if (btn && btn.disabled) return;
    const url = `horarios.html?ciclo=${encodeURIComponent(cicloId)}&carrera=${encodeURIComponent(
      carreraSeleccionada
    )}`;
    window.location.href = url;
  }

  // Comprobar parámetros de URL (si regresan desde horarios.html)
  const params = new URLSearchParams(window.location.search);
  const carreraUrl = params.get('carrera');
  if (carreraUrl) {
    seleccionarCarrera(carreraUrl);
  }
});
