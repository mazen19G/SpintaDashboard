# Spinta Stats Admin Dashboard

Admin dashboard for managing soccer match analysis. Built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui components.

## Features
- Match intake flow: add match metadata, upload assets, and trigger analysis.
- Loading and preview screens showing analyzed events as a timeline or raw JSON.
- Embedded video preview for analyzed matches.
- Routing with React Router (`/`, `/dashboard`, `/loading`, `/preview`).
- Toast notifications and React Query setup for async interactions.

## Tech Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn-ui (Radix-based components)
- React Query

## Getting Started
### Prerequisites
- Node.js 18+
- npm (comes with Node)

### Installation
```sh
npm install
```

### Development
```sh
npm run dev
```
The app runs on the port shown in the terminal (default: http://localhost:8080).

### Production Build
```sh
npm run build
npm run preview   # serve the production build locally
```

## Project Structure
- `src/pages` — top-level routes (`Login`, `Index`, `LoadingScreen`, `PreviewScreen`, `NotFound`).
- `src/components` — shared UI (MatchForm, UploadArea) and shadcn-ui primitives.
- `src/lib` — utilities and mock API helpers.
- `public` — static assets (e.g., `output_video.mp4`).

## Key Flows
1) Add match via the dashboard form.
2) Loading screen simulates analysis.
3) Preview screen shows timeline/JSON plus video; confirm or re-run analysis.

## Useful Scripts
- `npm run dev` — start development server.
- `npm run build` — build for production.
- `npm run preview` — serve built assets locally.
- `npm run lint` — lint the project.

## Notes
- If you serve your own analyzed video, place it in `public` and point the preview to the correct filename.
- Authentication and backend calls are stubbed; replace mock APIs with real endpoints when ready.
