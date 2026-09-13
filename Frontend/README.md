# GrindNEXT Frontend

React + Vite frontend for the GrindNEXT gamified productivity application.

## Setup

```bash
npm install
npm run dev
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
```

The backend must allow credentials from `http://localhost:5173`.

## Authentication

Authentication uses Better Auth cookies. Axios is configured with `withCredentials: true`.
There is no fake bearer token or demo-login fallback.

## Main routes

- `/` Dashboard
- `/tasks`
- `/projects`
- `/projects/:id`
- `/skills`
- `/workspace`
- `/achievements`
- `/collection`
- `/shop`
- `/profile`
- `/login`
- `/register`

## Production build

```bash
npm run build
```

Vite will generate a fresh `dist/` directory.
