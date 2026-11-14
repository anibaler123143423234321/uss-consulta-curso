# Instrucciones del Proyecto — uss-consulta-curso

## 🛑 REGLA SUPREMA: PROHIBIDO EJECUTAR GIT PUSH

> ⛔ **NUNCA ejecutes `git push`. Está terminantemente prohibido.**
> El desarrollador (Dagner) es el único que decide cuándo y cómo hacer push al repositorio remoto.
> Puedes editar archivos, ejecutar pruebas y hacer commits locales si se solicita, pero **JAMÁS `git push`**.

## Arquitectura y Reglas del Proyecto
1. **Cero Datos Locales:** Toda la información de horarios debe fluir en tiempo real a través de Internet desde Google Drive (`window.GOOGLE_SHEETS_URL`) o la API. No uses arrays locales quemados en el código.
2. **Separación de Modelos:** Modelo PROTECH XP (rutas de carrera) vs Plan Tradicional (Computación I, II, III). Nunca mezclar.
3. **No tocar backend ni proxies:** Vercel y backend ya están configurados.
