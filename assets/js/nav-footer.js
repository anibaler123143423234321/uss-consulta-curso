/**
 * Componente Modular de Footer CINF USS (uss-consulta-curso)
 * Estandarizado con créditos oficiales y enlaces rápidos a Campus, Aula y WhatsApp.
 */
(function () {
    function initFooter() {
        const el = document.getElementById('cinf-footer');
        if (!el) return;

        el.className = 'footer-uss';
        el.innerHTML = `
        <div class="wrap" style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px; font-size:12px; color:var(--muted, #64748b);">
            <div>Universidad Señor de Sipán &middot; Centro de Informática CINF &middot; &copy; 2026</div>
            <div style="display:flex; align-items:center; gap:16px; font-weight:500;">
                <a href="https://campus.uss.edu.pe/CampusNet5/Login.aspx" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;">Campus Virtual</a>
                <span style="opacity:0.4;">&bull;</span>
                <a href="https://www.aulauss.edu.pe/" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:none;">Aula Virtual</a>
                <span style="opacity:0.4;">&bull;</span>
                <a href="https://wa.me/51986724506" target="_blank" rel="noopener noreferrer" style="color:#059669; text-decoration:none; font-weight:600;">WhatsApp CINF</a>
            </div>
        </div>`;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter);
    } else {
        initFooter();
    }
})();
