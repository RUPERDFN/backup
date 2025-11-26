# Reorganization roadmap

Goal: migrate the repository into `/assets`, `/landing`, `/webapp`, `/api`, and `/shared` without a single large refactor. Each bullet is a separate commit-sized milestone.

## Phased commits
1. **Introduce structure markers (this step)**
   - Create the target top-level folders with README stubs describing expected contents.
   - Keep all existing code in place; no path changes.

2. **Extract shared/static assets**
   - Move `attached_assets/`, `faq-*.png`, `TheCookFlow-base64.txt`, store uploads, QA fixtures, and backups into `/assets`.
   - Update references in docs/scripts that hardcode the old paths.

3. **Move marketing/landing surface**
   - Relocate `privacy-policy.html`, `terms-of-service.html`, and `public/` marketing files into `/landing`.
   - Adjust any build/deploy references (e.g., nginx, Docker) to read from the new landing paths.

4. **Relocate front-end SPA**
   - Move `client/` plus front-end configs (`vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `components.json`, `jsconfig.json`) into `/webapp`.
   - Add `webapp/package.json` and `webapp/tsconfig.json` (extending a shared base) as needed.
   - Update import aliases and package scripts to point to the new locations.

5. **Group backend services under `/api`**
   - Move `server/`, `server-microservice/`, `migrations/`, `drizzle.config.ts`, backend scripts, Docker files, and deployment assets into `/api`.
   - Refresh CI/deploy tooling to use the new paths.

6. **Normalize shared modules**
   - Keep `shared/schema.ts` under `/shared` and prepare for future shared utilities.
   - Update imports across webapp and API to reference the new shared path/aliasing.

7. **Clean up tooling and documentation**
   - Align root/package scripts, CI, and documentation (`README`, deploy guides) with the final structure.
   - Run tests/linters to confirm the reorganized layout is stable.

## Notes
- Avoid large move-only commits; prefer focused steps that update references alongside file moves.
- Generated artifacts (e.g., `node_modules`, build outputs) remain ignored and will be recreated after the reorganization.
- Use the existing `REORGANIZATION_PLAN.md` for detailed path mapping and move scripts.
