# Webapp (planned)

Main CookFlow SPA and related mobile tooling. This will absorb the current `client/` React/Vite app and Android helper scripts.

Planned structure:
- `client/` containing the Vite app (`public/`, `src/`, `index.html`).
- `mobile/` for Android assets and build scripts (e.g., `compile_cookflow_aab.py`).
- `docs/` for mobile integration guides and workspace files.
- Front-end configs such as `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, and `jsconfig.json`.
