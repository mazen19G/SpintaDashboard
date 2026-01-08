# Spinta Stats - Admin Dashboard

A modern admin panel for managing soccer match data and statistics. This application allows coaches and administrators to upload match data, process match videos, and analyze player performance using StatsBomb data format.

## Features

- **Authentication System**: Secure login for coaches and administrators
- **Match Data Entry**: Easy-to-use form for entering match details including:
  - Opponent team information and logo
  - Match date
  - Home and away team lineups
  - Match scores
  - Match video upload
- **Match Processing**: Simulated AI-powered analysis with multi-step loading screens
- **Data Visualization**: Preview and review match analysis data before saving
- **StatsBomb Integration**: Support for StatsBomb JSON event data format

## Tech Stack

This project is built with modern web technologies:

- **Vite** - Fast build tool and dev server
- **React** - UI library with TypeScript
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **shadcn/ui** - High-quality UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mazen19G/SpintaDashboard.git
cd SpintaDashboard
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the production bundle
- `npm run build:dev` - Build with development mode
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
SpintaDashboard/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable React components
│   │   ├── ui/         # shadcn/ui components
│   │   └── MatchForm.tsx
│   ├── pages/          # Page components
│   │   ├── Login.tsx
│   │   ├── Index.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── PreviewScreen.tsx
│   │   └── NotFound.tsx
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Application entry point
├── public/             # Public static files
└── index.html          # HTML template
```

## API Integration

The application integrates with the Spinta Backend API:

- **Base URL**: `https://spinta-backend.vercel.app/api`
- **Authentication**: JWT token-based
- **Login Endpoint**: `POST /auth/login`
- **Save Match**: `POST /coach/matches`

## Development

### Code Style

This project follows standard TypeScript and React best practices:
- Component-based architecture
- TypeScript for type safety
- Functional components with hooks
- CSS modules with Tailwind utility classes

### Linting

Run the linter to check code quality:
```bash
npm run lint
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
