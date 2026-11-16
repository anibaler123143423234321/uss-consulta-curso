/**
 * textos.js - Carga dinámica de textos editables del Portal de Horarios.
 * Lee desde la API REST de Ecosistema CINF y reemplaza elementos marcados
 * con [data-texto="clave"]. Si la API falla o supera 4 s de timeout,
 * se conservan los textos de respaldo ya presentes en el HTML.
 *
 * NUNCA usa innerHTML, solo textContent.
 */
(function () {
  const resolveApiBase = () => {
    if (window.API_BASE_URL) return window.API_BASE_URL.replace(/\/+$/, '');
    const h = location.hostname.toLowerCase();
    if (h === 'informatica-uss.vercel.app') {
      return '/api';
    }
    if (h === 'localhost' || h === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
    return 'https://informatica-uss.vercel.app/api';
  };

  const aplicarTextos = (cfg) => {
    if (!cfg || typeof cfg !== 'object') return;
    window.PORTAL_HORARIOS_CONFIG = cfg;

    const getVal = (path) => {
      const parts = path.split('.');
      let curr = cfg;
      for (const p of parts) {
        if (curr == null) return undefined;
        curr = curr[p];
      }
      return typeof curr === 'string' ? curr : undefined;
    };

    // Caso especial h1 y palabra destacada (span .hero__resalte)
    const h1 = document.querySelector('[data-texto="portada.titulo"]');
    if (h1 && cfg.portada?.titulo) {
      let span = h1.querySelector('.hero__resalte');
      if (!span) {
        span = document.createElement('span');
        span.className = 'hero__resalte';
      }
      span.setAttribute('data-texto', 'portada.palabraDestacada');
      if (cfg.portada.palabraDestacada !== undefined) {
        span.textContent = cfg.portada.palabraDestacada;
      }
      h1.textContent = cfg.portada.titulo + (cfg.portada.palabraDestacada ? ' ' : '');
      if (cfg.portada.palabraDestacada) {
        h1.appendChild(span);
      }
    }

    // Elementos con [data-texto]
    document.querySelectorAll('[data-texto]').forEach((el) => {
      const clave = el.getAttribute('data-texto');
      if (clave === 'portada.titulo' || clave === 'portada.palabraDestacada') return;
      const val = getVal(clave);
      if (val !== undefined && val !== '') {
        el.textContent = val;
      }
    });

    // Actualizar metadatos de modelos en window.CONSULTA_CURSOS si está disponible
    if (window.CONSULTA_CURSOS && Array.isArray(window.CONSULTA_CURSOS.modelos)) {
      window.CONSULTA_CURSOS.modelos.forEach((m) => {
        if (m.id === 'tradicional') {
          if (cfg.tradicional?.titulo) m.nombre = cfg.tradicional.titulo;
          if (cfg.tradicional?.badgeTag) m.badge = cfg.tradicional.badgeTag;
          if (cfg.tradicional?.descripcion) m.descripcion = cfg.tradicional.descripcion;
        } else if (m.id === 'protech') {
          if (cfg.protech?.titulo) m.nombre = cfg.protech.titulo;
          if (cfg.protech?.badgeTag) m.badge = cfg.protech.badgeTag;
          if (cfg.protech?.descripcion) m.descripcion = cfg.protech.descripcion;
        }
      });
    }

    // Actualizar badge en horarios.html si ya existe en el DOM
    const badge = document.getElementById('txt-modelo-badge');
    if (badge) {
      const urlParams = new URLSearchParams(window.location.search);
      const mod = (urlParams.get('modelo') || '').toLowerCase();
      if (mod === 'tradicional') {
        if (cfg.tradicional?.badge) badge.textContent = cfg.tradicional.badge;
      } else {
        if (cfg.protech?.badge) badge.textContent = cfg.protech.badge;
      }
    }

    window.dispatchEvent(new CustomEvent('portal_horarios_config_loaded', { detail: cfg }));
  };

  const cargar = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const base = resolveApiBase();
      const res = await fetch(`${base}/portal-horarios/config`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return;
      const json = await res.json();
      if (json?.success && json?.data) {
        aplicarTextos(json.data);
      }
    } catch {
      // Si la API falla o agota el tiempo, los textos actuales del HTML se mantienen
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargar);
  } else {
    cargar();
  }
})();
