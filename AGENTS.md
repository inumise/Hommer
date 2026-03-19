# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is **archweb**, a React + TypeScript + Vite single-page application (portfolio/marketing website). It is a purely frontend project with no backend, database, or external API dependencies.

### Running the application

- **Dev server:** `npm run dev` (Vite, default port 5173). Use `-- --host 0.0.0.0` to expose on all interfaces.
- **Build:** `npm run build` (runs `tsc -b && vite build`, outputs to `dist/`).
- **Preview production build:** `npm run preview`.
- **Lint:** `npm run lint` (ESLint). The codebase has pre-existing lint warnings/errors that are not regressions.

### Notes

- The project uses **npm** (lockfile: `package-lock.json`).
- Path alias `@/` maps to `./src/` (configured in `vite.config.ts` and `tsconfig.json`).
- There are no automated tests configured (no test script in `package.json`).
- No environment variables or secrets are required.
- No Docker, CI/CD, or devcontainer configuration exists.
