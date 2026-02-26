# Personal Website

A personal website built with Vue 3, TypeScript, Vite, Vue Router, Pinia, and Tailwind CSS.

## Tech Stack

- **Framework**: Vue 3 with `<script setup>` and TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Linting**: ESLint + Prettier

## Getting Started

### Prerequisites

- Bun 1.0+

### Install Dependencies

```bash
bun install
```

### Start Development Server

```bash
bun run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview the production build |
| `bun run lint` | Lint and auto-fix files |
| `bun run format` | Format files with Prettier |
| `bun run type-check` | Run TypeScript type checking |

## Project Structure

```
personal-website/
├── public/               # Static assets
├── src/
│   ├── assets/           # Styles and images
│   ├── components/       # Reusable components
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── views/            # Page-level components
│   ├── App.vue           # Root component
│   └── main.ts           # Application entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## License

MIT