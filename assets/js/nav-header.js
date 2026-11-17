/**
 * Componente Modular de Header CINF USS (uss-consulta-curso)
 * Estandarizado a 76px de altura, logo oficial USS y enlaces institucionales.
 */
(function () {
    function initHeader() {
        const el = document.getElementById('cinf-header');
        if (!el) return;

        const variant = el.getAttribute('data-variant') || 'hero';
        const portalUrl = el.getAttribute('data-portal-url') || 'https://informatica-uss.vercel.app/';
        const backUrl = el.getAttribute('data-back-url') || 'index.html';
        const backText = el.getAttribute('data-back-text') || 'Cambiar carrera o ciclo';
        const logoUrl = el.getAttribute('data-logo-url') || 'assets/img/logo-uss.png?v=61';

        if (variant === 'hero') {
            el.className = 'nav nav--sobre-azul';
            el.innerHTML = `
        <div class="wrap nav__fila">
            <a class="skip-link" href="#contenido">Saltar al contenido</a>
            <a class="nav__marca" href="./" aria-label="Centro de Informática USS, volver al inicio">
                <img src="${logoUrl}" alt="Universidad Señor de Sipán" width="851" height="293" />
            </a>
            <a class="btn btn--blanco" href="${portalUrl}" target="_blank" rel="noopener noreferrer">
                <span class="nav__texto-largo">Ir al Portal CINF</span>
                <span class="nav__texto-corto">Portal</span>
                <svg class="icono icono--sm" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                </svg>
            </a>
        </div>`;
        } else {
            // Variante claro (horarios.html)
            el.className = 'nav nav--claro';
            el.innerHTML = `
        <div class="wrap nav__fila">
            <a class="skip-link" href="#contenido">Saltar al contenido</a>
            <div class="nav__izq">
                <a href="${backUrl}" class="btn btn--secondary btn--sm btn-volver-inicio" id="btn-volver-atras"
                    aria-label="${backText}">
                    <svg class="icono icono--sm" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 12H5m6-6-6 6 6 6" />
                    </svg>
                    <span class="nav__texto-largo">${backText}</span>
                </a>
                <a href="./" class="nav__marca" aria-label="Centro de Informática USS, volver al inicio">
                    <img src="${logoUrl}" alt="Universidad Señor de Sipán" width="851" height="293" />
                </a>
            </div>
            <a class="btn btn--secondary btn--sm nav__btn-portal" href="${portalUrl}" target="_blank" rel="noopener noreferrer">
                <span>Ir al Portal CINF</span>
                <svg class="icono icono--sm" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                </svg>
            </a>
        </div>`;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeader);
    } else {
        initHeader();
    }
})();
