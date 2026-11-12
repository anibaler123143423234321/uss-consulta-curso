/**
 * USS Consulta de Cursos - Portal de Selección (index.html)
 * Archivo: assets/js/index.js
 *
 * Funcionalidad:
 * 1. Combobox de Carrera con escritura y filtrado en el mismo campo principal.
 * 2. Deduplicación de carreras y presentación de la Ruta Oficial CINF.
 * 3. Validación obligatoria de carrera antes de acceder a horarios.html.
 */
document.addEventListener('DOMContentLoaded', () => {
  const { ciclos, rutas, horarios } = window.CONSULTA_CURSOS;
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

  // Construir mapa de carreras únicas (evita que 'Arquitectura' se duplique)
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
        // Si la carrera pertenece a más de una ruta, combinar cursos
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
    return info ? new Set(info.cursos) : null;
  };

  /* ==========================================================================
     1. COMBOBOX DIRECTO: ESCRITURA EN EL MISMO INPUT
     ========================================================================== */
  const elWrap = $('carrera-combobox-wrap');
  const elInput = $('input-carrera-principal');
  const elClear = $('btn-clear-carrera');
  const elToggle = $('btn-toggle-carrera');
  const elDropdown = $('dropdown-carreras');
  const elOptions = $('lista-opciones-carreras');
  const elAlerta = $('alerta-carrera-requerida');
  const elTarjeta = $('tarjeta-carrera');

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
        cerrarDropdown();
      });

      elOptions.appendChild(divItem);
    });

    indiceActivoTeclado = -1;
  }

  function seleccionarCarrera(carrera) {
    carreraSeleccionada = carrera || '';
    elInput.value = carreraSeleccionada;

    if (carreraSeleccionada) {
      elClear.hidden = false;
      elAlerta.hidden = true;
      elTarjeta.classList.remove('requiere-atencion');

      // Mostrar ficha de ruta
      const info = mapaCarrerasMap.get(carreraSeleccionada);
      if (info) {
        $('ficha-ruta').hidden = false;
        $('ruta-badge').textContent = `Ruta ${info.rutaId}`;
        $('ruta-nombre').textContent = info.rutaNombre.replace(/^Ruta \d+ · /, '');
        $('ruta-carrera-elegida').textContent = carreraSeleccionada;

        const contCursos = $('ruta-lista-cursos');
        contCursos.replaceChildren(
          ...info.cursos.map((c) => {
            const span = crear('span', 'ficha-ruta__curso-chip');
            span.innerHTML = `<span style="color:#0284c7">✓</span> ${c}`;
            return span;
          })
        );
      }
    } else {
      elClear.hidden = true;
      $('ficha-ruta').hidden = true;
    }

    actualizarContadoresCiclos();
  }

  function limpiarSeleccion(e) {
    if (e) e.stopPropagation();
    seleccionarCarrera('');
    elInput.value = '';
    renderOpciones('');
    abrirDropdown();
    elInput.focus();
  }

  // Eventos en el Input Principal
  elInput.addEventListener('focus', () => {
    abrirDropdown();
  });

  elInput.addEventListener('input', (e) => {
    carreraSeleccionada = '';
    elClear.hidden = !e.target.value;
    $('ficha-ruta').hidden = true;
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
        cerrarDropdown();
      } else if (opcionesFiltradas.length > 0) {
        seleccionarCarrera(opcionesFiltradas[0].nombre);
        cerrarDropdown();
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

  elClear.addEventListener('click', limpiarSeleccion);

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
     2. PASO 2: RENDERIZADO DE CICLOS DE APERTURA (Grid de Ciclos)
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

    // Click en el ciclo -> Redirige a horarios.html
    btn.addEventListener('click', () => {
      abrirCiclo(ciclo.id);
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
      <a href="https://wa.me/51979391000" target="_blank" rel="noopener noreferrer" class="ciclo-btn__accion" style="text-decoration:none;">Contactar ↗</a>
    </div>
  `;
  gridCiclos.appendChild(tarjetaAyuda);

  function actualizarContadoresCiclos() {
    const permitidos = cursosDeCarrera(carreraSeleccionada);

    ciclos.forEach((ciclo) => {
      const btn = $(`btn-ciclo-${ciclo.id}`);
      const badge = $(`badge-ciclo-${ciclo.id}`);
      if (!btn || !badge) return;

      const filasCiclo = (horarios || []).filter(
        (h) => (h.ciclo || '').toLowerCase() === ciclo.id.toLowerCase()
      );

      const filasFiltradas = permitidos
        ? filasCiclo.filter((f) => permitidos.has(f.curso))
        : filasCiclo;

      const total = filasFiltradas.length;

      if (total > 0) {
        btn.classList.add('ciclo-btn--destacado');
        badge.className = 'ciclo-btn__badge ciclo-btn__badge--disponible';
        if (carreraSeleccionada) {
          badge.innerHTML = `<span>●</span> <span>${total} secciones para tu carrera</span>`;
        } else {
          badge.innerHTML = `<span>●</span> <span>${total} secciones disponibles</span>`;
        }
      } else {
        btn.classList.remove('ciclo-btn--destacado');
        badge.className = 'ciclo-btn__badge ciclo-btn__badge--vacio';
        badge.innerHTML = carreraSeleccionada && filasCiclo.length > 0
          ? '<span>○</span> <span>Sin cupos para tu carrera</span>'
          : '<span>○</span> <span>Próximamente</span>';
      }
    });
  }

  function abrirCiclo(cicloId) {
    if (!carreraSeleccionada) {
      // Exigir selección de carrera
      elAlerta.hidden = false;
      elTarjeta.classList.remove('requiere-atencion');
      void elTarjeta.offsetWidth; // Forzar reflow para reiniciar animación
      elTarjeta.classList.add('requiere-atencion');

      elInput.focus();
      abrirDropdown();
      return;
    }

    // Redirigir al otro index (horarios.html)
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
  } else {
    actualizarContadoresCiclos();
  }
});
