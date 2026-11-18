/**
 * Componente Modular HeroIntro (uss-consulta-curso)
 * Estandarizado con las mismas dimensiones, tipografía y márgenes que Portal GEX.
 */
(function () {
  function renderHeroIntro() {
    const el = document.getElementById('hero-intro');
    if (!el) return;

    const eyebrow = el.getAttribute('data-eyebrow') || 'Centro de Informática • USS';
    const titlePrefix = el.getAttribute('data-title-prefix') || 'Acreditación en Computación';
    const highlight = el.getAttribute('data-highlight') || 'Horarios';
    const lead = el.getAttribute('data-lead') || '27 carreras en 7 rutas de aprendizaje. Elige tu modelo y tu carrera, y ve cada sección abierta con su turno, días y matriculados.';

    // El resalte va en otra línea y otro color: los dos puntos hacen que se lea como una frase, no como dos
    const union = /[.!?:;,…–—)»"”’]$/.test(titlePrefix.trim()) ? ' ' : ': ';

    el.className = 'hero-intro';
    el.innerHTML = `
      <p class="hero__eyebrow" data-texto="portada.eyebrow">${eyebrow}</p>
      <h1 id="hero-h" data-texto="portada.titulo">
        ${titlePrefix.trim()}${union}<span class="hero__resalte" data-texto="portada.palabraDestacada">${highlight}</span>
      </h1>
      <p class="hero__lead" data-texto="portada.descripcion">${lead}</p>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHeroIntro);
  } else {
    renderHeroIntro();
  }
})();
