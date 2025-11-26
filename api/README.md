# API

Backend services, infrastructure scripts, and supporting documentation. Use this space for Express/Node servers, microservices, database migrations/config, deployment assets (Docker, nginx, compose), QA tools, and scripts for operating the platform.
# API (planned)

Backend services and operational tooling. Intended to host the Express servers, microservices, database assets, and deployment scripts.

Planned structure:
- `server/` and `server-microservice/` for backend runtimes.
- `config/` for TypeScript/Vitest configs and related utilities.
- `db/` for Drizzle migrations and database configuration.
- `scripts/` for operational shell scripts (start, sync, deploy) and `utilities/` extracted from legacy `scripts/`.
- `processes/` for PM2 or process manager configs.
- `deploy/` for Docker, compose, and Nginx assets.
- `docs/` for API/deploy/security documentation.
- `tools/` and `tests/` for QA/supporting utilities.
