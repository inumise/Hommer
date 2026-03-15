# AGENTS.md

## Cursor Cloud specific instructions

This is **archweb**, a client-side React + TypeScript + Vite SPA (portfolio/marketing site). No backend, database, or Docker required.

### Running the app

- `npm run dev` starts the Vite dev server on `http://localhost:5173`
- `npm run build` runs `tsc -b && vite build` (TypeScript check + production build)
- `npm run lint` runs ESLint (pre-existing warnings/errors exist in the codebase)
- `npm run preview` serves the production build locally

### Notes

- The project uses npm (lockfile: `package-lock.json`).
- There are no environment variables, `.env` files, or external API dependencies.
- The chat agent on the Helper page uses client-side keyword matching, not an external LLM.
- ESLint currently reports pre-existing warnings and errors (mostly `react-refresh/only-export-components` warnings and a few `@typescript-eslint` errors). These are not blockers.
