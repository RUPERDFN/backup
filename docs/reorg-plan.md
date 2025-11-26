# Reorg root folders

| Folder | Owner(s) | What lives here |
| --- | --- | --- |
| `/assets` | Platform eng + marketing | Shared binary/static assets reused across landing and webapp (marketing images, store uploads, QA fixtures, backups). |
| `/landing` | Marketing | Public-facing pages and SEO/legal assets (privacy/ToS, robots/sitemap, lightweight JS shims). |
| `/webapp` | Frontend | Vite/React SPA, mobile tooling (Android, build scripts), and frontend docs. |
| `/api` | Backend | Node/Express services, microservices, migrations, deploy/run scripts, QA tooling. |
| `/shared` | Platform eng | Reusable schemas, types, utilities consumed by both API and webapp. |

Use this layout for future moves and keep generated/system folders (node_modules, build outputs) outside of version control.
