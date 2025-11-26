# Repository Reorganization Plan

## 1) Classification criteria
- **landing**: Public/marketing surfaces (legal pages, SEO files, store/landing copy).
- **webapp**: React/Vite SPA and supporting mobile/frontend assets or configs.
- **api**: Node/Express backends, microservices, database assets, deployment/runtime scripts, and automated QA tied to backend behavior.
- **shared**: Cross-cutting code (schemas, types, utilities) consumed by both front-end and back-end.
- **assets**: Binary or static resources reused across landing/webapp (images, store screenshots, base64 exports, QA assets).
- Generated/system folders (`node_modules`, `.git`, `.venv`, build artifacts) are excluded from moves and should be recreated as needed.

## 2) OLD_PATH → NEW_PATH mapping
- README.md → api/docs/README.md
- DEPLOYMENT_GUIDE.md → api/docs/deploy/DEPLOYMENT_GUIDE.md
- DEPLOY_CHECKLIST.md → api/docs/deploy/DEPLOY_CHECKLIST.md
- INSTRUCCIONES_DESPLIEGUE_VPS.md → api/docs/deploy/INSTRUCCIONES_DESPLIEGUE_VPS.md
- GOOGLE_PLAY_BILLING_SETUP.md → webapp/docs/mobile/GOOGLE_PLAY_BILLING_SETUP.md
- ANDROID_STUDIO_QUICKSTART.md → webapp/docs/mobile/ANDROID_STUDIO_QUICKSTART.md
- QUICKSTART.md → webapp/docs/mobile/QUICKSTART.md
- CODIGO_COMPLETO_APP.kt → webapp/docs/mobile/CODIGO_COMPLETO_APP.kt
- SECURITY-ALERT.md → api/docs/security/SECURITY-ALERT.md
- SECURITY_WARNING.md → api/docs/security/SECURITY_WARNING.md
- SECURITY-AUDIT-REPORT.md → api/docs/security/SECURITY-AUDIT-REPORT.md
- replit.md → api/docs/deploy/replit.md
- FAQ images (faq-7-expanded.png, faq-expanded-fullpage.png) → assets/marketing/
- TheCookFlow-base64.txt → assets/marketing/TheCookFlow-base64.txt
- privacy-policy.html → landing/privacy-policy.html
- terms-of-service.html → landing/terms-of-service.html
- public/** → landing/public/**
- play_store_assets/** → assets/store/play_store_assets/**
- google_play_upload/** → assets/store/google_play_upload/**
- attached_assets/** → assets/app/attached_assets/**
- public/qa-assets/** → assets/qa/public/**
- android/** → webapp/mobile/android/**
- compile_cookflow_aab.py → webapp/mobile/scripts/compile_cookflow_aab.py
- google_play_upload/screenshots/** → assets/store/google_play_upload/screenshots/**
- play_store_assets/screenshots/** → assets/store/play_store_assets/screenshots/**
- zi4Koatz → assets/backups/zi4Koatz
- ziCITmPe → assets/backups/ziCITmPe
- client/** → webapp/client/**
- vite.config.ts → webapp/vite.config.ts
- tailwind.config.ts → webapp/tailwind.config.ts
- postcss.config.js → webapp/postcss.config.js
- components.json → webapp/components.json
- jsconfig.json → webapp/jsconfig.json
- vitest.config.ts → api/config/vitest.config.ts
- tsconfig.json → api/config/tsconfig.json (create separate webapp/tsconfig.json inheriting root)
- package.json → api/package.json (introduce webapp/package.json for front-end dependencies)
- package-lock.json → api/package-lock.json
- package-microservice.json → api/server-microservice/package.json
- Dockerfile → api/Dockerfile
- docker-compose.yml → api/docker-compose.yml
- docker-compose.prod.yml → api/docker-compose.prod.yml
- ecosystem.config.js → api/processes/ecosystem.config.js
- production-start.js → api/processes/production-start.js
- start-dev.sh → api/scripts/start-dev.sh
- start-tcf.sh → api/scripts/start-tcf.sh
- start_auto_sync.sh → api/scripts/start_auto_sync.sh
- start_complete.zip.sh → api/scripts/start_complete.zip.sh
- simple_sync.sh → api/scripts/simple_sync.sh
- sync_android_now.sh → api/scripts/sync_android_now.sh
- sync_complete.zip.sh → api/scripts/sync_complete.zip.sh
- configure-env.sh → api/scripts/configure-env.sh
- configure_github_token.sh → api/scripts/configure_github_token.sh
- setup_github_token.sh → api/scripts/setup_github_token.sh
- deploy-to-vps.sh → api/scripts/deploy-to-vps.sh
- start-microservice artifacts (scripts-microservice/**, test-microservice.js, microservice.pid) → api/server-microservice/scripts/**
- deploy/** → api/deploy/**
- tools/** → api/tools/**
- scripts/** → api/scripts/utilities/**
- docs/ADMOB_INTEGRATION.md → webapp/docs/mobile/ADMOB_INTEGRATION.md
- migrations/** → api/migrations/**
- drizzle.config.ts → api/db/drizzle.config.ts
- server/** → api/server/**
- server-microservice/** → api/server-microservice/**
- tests/** → api/tests/**
- server/vite-production-wrapper.js → api/server/vite-production-wrapper.js
- server/vite.ts → api/server/vite.ts
- server/production-paths.ts → api/server/production-paths.ts
- server/index.ts / index.js → api/server/index.ts (retain compiled output under api/server/dist later)
- shared/schema.ts → shared/schema.ts (keep shared root but consider src/ for future shared modules)
- attached workspace files (thecookflow.code-workspace) → webapp/docs/workspace/thecookflow.code-workspace
- nginx.conf → api/deploy/nginx.conf
- pyproject.toml → api/tools/python/pyproject.toml
- uv.lock → api/tools/python/uv.lock

## 3) Final folder trees
### /landing
```
landing/
  public/ (robots.txt, sitemap.xml, app-ads.txt, admob-integration.js, tcf-bridge.js)
  privacy-policy.html
  terms-of-service.html
```

### /webapp
```
webapp/
  client/ (index.html, public/, src/**)
  mobile/
    android/**
    scripts/compile_cookflow_aab.py
  docs/
    mobile/(ANDROID_STUDIO_QUICKSTART.md, QUICKSTART.md, GOOGLE_PLAY_BILLING_SETUP.md, ADMOB_INTEGRATION.md, CODIGO_COMPLETO_APP.kt)
    workspace/thecookflow.code-workspace
  components.json
  postcss.config.js
  tailwind.config.ts
  vite.config.ts
  jsconfig.json
  package.json (new webapp-specific manifest)
  tsconfig.json (extends ../../tsconfig.base.json or root)
```

### /api
```
api/
  server/**
  server-microservice/**
  migrations/**
  db/drizzle.config.ts
  config/
    tsconfig.json
    vitest.config.ts
  scripts/
    start-dev.sh
    start-tcf.sh
    start_auto_sync.sh
    start_complete.zip.sh
    simple_sync.sh
    sync_android_now.sh
    sync_complete.zip.sh
    configure-env.sh
    configure_github_token.sh
    setup_github_token.sh
    deploy-to-vps.sh
    utilities/** (from scripts/)
  processes/
    ecosystem.config.js
    production-start.js
  deploy/
    nginx.conf
    (other deploy assets)
  docs/
    README.md
    deploy/(DEPLOYMENT_GUIDE.md, DEPLOY_CHECKLIST.md, INSTRUCCIONES_DESPLIEGUE_VPS.md, replit.md)
    security/(SECURITY-ALERT.md, SECURITY_WARNING.md, SECURITY-AUDIT-REPORT.md)
  tools/
    qa/**
    python/(pyproject.toml, uv.lock)
  tests/**
  Dockerfile
  docker-compose.yml
  docker-compose.prod.yml
  package.json
  package-lock.json
```

### /shared
```
shared/
  schema.ts
  (future shared utilities/types)
```

### /assets
```
assets/
  app/attached_assets/**
  qa/public/**
  marketing/
    faq-7-expanded.png
    faq-expanded-fullpage.png
    TheCookFlow-base64.txt
  store/
    play_store_assets/**
    google_play_upload/**
  backups/
    zi4Koatz
    ziCITmPe
```

## 4) Bash move script
```bash
mkdir -p landing/public webapp/docs/mobile webapp/mobile/scripts webapp/mobile/android webapp/docs/workspace api/docs/deploy api/docs/security api/config api/db api/scripts/utilities api/processes api/deploy api/tools/python api/tests api/server-microservice/scripts assets/marketing assets/store/play_store_assets assets/store/google_play_upload assets/app/attached_assets assets/qa/public assets/backups
mv README.md api/docs/README.md
mv DEPLOYMENT_GUIDE.md api/docs/deploy/DEPLOYMENT_GUIDE.md
mv DEPLOY_CHECKLIST.md api/docs/deploy/DEPLOY_CHECKLIST.md
mv INSTRUCCIONES_DESPLIEGUE_VPS.md api/docs/deploy/INSTRUCCIONES_DESPLIEGUE_VPS.md
mv GOOGLE_PLAY_BILLING_SETUP.md webapp/docs/mobile/GOOGLE_PLAY_BILLING_SETUP.md
mv ANDROID_STUDIO_QUICKSTART.md webapp/docs/mobile/ANDROID_STUDIO_QUICKSTART.md
mv QUICKSTART.md webapp/docs/mobile/QUICKSTART.md
mv CODIGO_COMPLETO_APP.kt webapp/docs/mobile/CODIGO_COMPLETO_APP.kt
mv SECURITY-ALERT.md api/docs/security/SECURITY-ALERT.md
mv SECURITY_WARNING.md api/docs/security/SECURITY_WARNING.md
mv SECURITY-AUDIT-REPORT.md api/docs/security/SECURITY-AUDIT-REPORT.md
mv replit.md api/docs/deploy/replit.md
mv faq-7-expanded.png assets/marketing/
mv faq-expanded-fullpage.png assets/marketing/
mv TheCookFlow-base64.txt assets/marketing/
mv privacy-policy.html landing/
mv terms-of-service.html landing/
mv public/* landing/public/
mv play_store_assets assets/store/play_store_assets
mv google_play_upload assets/store/google_play_upload
mv attached_assets assets/app/
mv public/qa-assets assets/qa/
mv android webapp/mobile/
mv compile_cookflow_aab.py webapp/mobile/scripts/
mv zi4Koatz assets/backups/
mv ziCITmPe assets/backups/
mv client webapp/
mv vite.config.ts webapp/
mv tailwind.config.ts webapp/
mv postcss.config.js webapp/
mv components.json webapp/
mv jsconfig.json webapp/
mv vitest.config.ts api/config/
mv tsconfig.json api/config/
mv package.json api/
mv package-lock.json api/
mv package-microservice.json api/server-microservice/package.json
mv Dockerfile api/
mv docker-compose.yml api/
mv docker-compose.prod.yml api/
mv ecosystem.config.js api/processes/
mv production-start.js api/processes/
mv start-dev.sh api/scripts/
mv start-tcf.sh api/scripts/
mv start_auto_sync.sh api/scripts/
mv start_complete.zip.sh api/scripts/
mv simple_sync.sh api/scripts/
mv sync_android_now.sh api/scripts/
mv sync_complete_zip.sh api/scripts/
mv configure-env.sh api/scripts/
mv configure_github_token.sh api/scripts/
mv setup_github_token.sh api/scripts/
mv deploy-to-vps.sh api/scripts/
mv scripts-microservice api/server-microservice/scripts
mv test-microservice.js api/server-microservice/
mv microservice.pid api/server-microservice/
mv deploy api/deploy/
mv tools api/tools/
mv scripts api/scripts/utilities/
mv docs/ADMOB_INTEGRATION.md webapp/docs/mobile/
mv migrations api/
mv drizzle.config.ts api/db/
mv server api/
mv server-microservice api/
mv tests api/
mv thecookflow.code-workspace webapp/docs/workspace/
mv nginx.conf api/deploy/
mv pyproject.toml api/tools/python/
mv uv.lock api/tools/python/
```

## 5) PowerShell move script
```powershell
New-Item -ItemType Directory -Force -Path "landing/public","webapp/docs/mobile","webapp/mobile/scripts","webapp/mobile/android","webapp/docs/workspace","api/docs/deploy","api/docs/security","api/config","api/db","api/scripts/utilities","api/processes","api/deploy","api/tools/python","api/tests","api/server-microservice/scripts","assets/marketing","assets/store/play_store_assets","assets/store/google_play_upload","assets/app/attached_assets","assets/qa/public","assets/backups"
Move-Item README.md api/docs/README.md
Move-Item DEPLOYMENT_GUIDE.md api/docs/deploy/DEPLOYMENT_GUIDE.md
Move-Item DEPLOY_CHECKLIST.md api/docs/deploy/DEPLOY_CHECKLIST.md
Move-Item INSTRUCCIONES_DESPLIEGUE_VPS.md api/docs/deploy/INSTRUCCIONES_DESPLIEGUE_VPS.md
Move-Item GOOGLE_PLAY_BILLING_SETUP.md webapp/docs/mobile/GOOGLE_PLAY_BILLING_SETUP.md
Move-Item ANDROID_STUDIO_QUICKSTART.md webapp/docs/mobile/ANDROID_STUDIO_QUICKSTART.md
Move-Item QUICKSTART.md webapp/docs/mobile/QUICKSTART.md
Move-Item CODIGO_COMPLETO_APP.kt webapp/docs/mobile/CODIGO_COMPLETO_APP.kt
Move-Item SECURITY-ALERT.md api/docs/security/SECURITY-ALERT.md
Move-Item SECURITY_WARNING.md api/docs/security/SECURITY_WARNING.md
Move-Item SECURITY-AUDIT-REPORT.md api/docs/security/SECURITY-AUDIT-REPORT.md
Move-Item replit.md api/docs/deploy/replit.md
Move-Item faq-7-expanded.png assets/marketing/
Move-Item faq-expanded-fullpage.png assets/marketing/
Move-Item TheCookFlow-base64.txt assets/marketing/
Move-Item privacy-policy.html landing/
Move-Item terms-of-service.html landing/
Move-Item public/* landing/public/
Move-Item play_store_assets assets/store/play_store_assets
Move-Item google_play_upload assets/store/google_play_upload
Move-Item attached_assets assets/app/
Move-Item public/qa-assets assets/qa/
Move-Item android webapp/mobile/
Move-Item compile_cookflow_aab.py webapp/mobile/scripts/
Move-Item zi4Koatz assets/backups/
Move-Item ziCITmPe assets/backups/
Move-Item client webapp/
Move-Item vite.config.ts webapp/
Move-Item tailwind.config.ts webapp/
Move-Item postcss.config.js webapp/
Move-Item components.json webapp/
Move-Item jsconfig.json webapp/
Move-Item vitest.config.ts api/config/
Move-Item tsconfig.json api/config/
Move-Item package.json api/
Move-Item package-lock.json api/
Move-Item package-microservice.json api/server-microservice/package.json
Move-Item Dockerfile api/
Move-Item docker-compose.yml api/
Move-Item docker-compose.prod.yml api/
Move-Item ecosystem.config.js api/processes/
Move-Item production-start.js api/processes/
Move-Item start-dev.sh api/scripts/
Move-Item start-tcf.sh api/scripts/
Move-Item start_auto_sync.sh api/scripts/
Move-Item start_complete.zip.sh api/scripts/
Move-Item simple_sync.sh api/scripts/
Move-Item sync_android_now.sh api/scripts/
Move-Item sync_complete_zip.sh api/scripts/
Move-Item configure-env.sh api/scripts/
Move-Item configure_github_token.sh api/scripts/
Move-Item setup_github_token.sh api/scripts/
Move-Item deploy-to-vps.sh api/scripts/
Move-Item scripts-microservice api/server-microservice/scripts
Move-Item test-microservice.js api/server-microservice/
Move-Item microservice.pid api/server-microservice/
Move-Item deploy api/deploy/
Move-Item tools api/tools/
Move-Item scripts api/scripts/utilities/
Move-Item docs/ADMOB_INTEGRATION.md webapp/docs/mobile/
Move-Item migrations api/
Move-Item drizzle.config.ts api/db/
Move-Item server api/
Move-Item server-microservice api/
Move-Item tests api/
Move-Item thecookflow.code-workspace webapp/docs/workspace/
Move-Item nginx.conf api/deploy/
Move-Item pyproject.toml api/tools/python/
Move-Item uv.lock api/tools/python/
```

## 6) Required code/config updates after moving
- **Update import aliases**: adjust Vite and TypeScript path aliases to point to `../shared`, `../assets`, and the new `webapp/client/src` root (e.g., in `webapp/vite.config.ts`, `api/config/tsconfig.json`, and `webapp/jsconfig.json`).
- **Split tsconfig**: create a root `tsconfig.base.json` for shared compiler options, with `api/config/tsconfig.json` and `webapp/tsconfig.json` extending it; update `include` paths to `webapp/client/src` and `api/server/**/*`/`api/server-microservice/**/*`.
- **Adjust npm scripts**: in `api/package.json` expose scripts referencing new paths (e.g., `dev`: `tsx api/server/index.ts`, `build`: `vite build --config webapp/vite.config.ts && esbuild api/server/index.ts ...`). Create a separate `webapp/package.json` for front-end-only commands if desired or convert root package to workspace managing `api` and `webapp` packages.
- **Update Vitest config**: move to `api/config/vitest.config.ts` and refresh alias roots (`@` → `../webapp/client/src`, `@server` → `../api/server`); adjust test setup file paths accordingly.
- **Revise Docker/docker-compose**: update context paths inside `api/Dockerfile` and compose files to copy from new folder structure (copy `api`, `webapp` build output under `webapp/dist/public`, shared assets under `/assets`).
- **Server static serving**: update `api/server/vite.ts` to point to the new build output path (e.g., `path.resolve(import.meta.dirname, '../webapp/dist/public')` depending on final build pipeline).
- **Shared imports**: ensure any server/client imports from `shared/schema.ts` use the new relative paths or a monorepo alias such as `@shared/` pointing to `/shared`.
- **Asset references**: adjust URLs or import paths in the React app and landing pages that referenced `attached_assets`, `public/qa-assets`, or store images so they read from `/assets/...` (or configured static mount in Express/hosting).
- **CI/QA tooling**: update any scripts in `tools/qa`, `start-dev.sh`, or GitHub Actions (if present) to reference the new locations for server entry points, configs, and tests.
