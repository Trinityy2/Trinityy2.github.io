# Trinityy2.github.io

Personal site and blog for Tomo Suzuki — an Undertale-themed portfolio where the
three sections are locations you travel between rather than pages you switch.

- **About — *Determination***: the void. Black, save-point gold, the red soul.
- **Work — *Ruins***: purple brick and butterscotch, falling leaves. Career
  history as encounters.
- **Blog — *Snowdin***: cold blue and Papyrus orange, falling snow.

Moving between them fades to black, swaps the location while the screen is dark,
and fades back — the way a room transition works in the game.

## Status

Being rebuilt from scratch. The walking skeleton ([#73](../../issues/73)) is in:
the About zone renders at the root from typed data, in the Determination
palette, with self-hosted pixel fonts and the void avatar sprite.

The rest of the work is specified on the issue tracker:

- **[#72](../../issues/72)** — the spec: problem, solution, user stories,
  implementation and testing decisions, scope.
- **[#73–#79](../../issues)** — seven tracer-bullet tickets with blocking
  dependencies, each sized for a single sitting.

## Stack

Vue 3 · Vite · TypeScript · Vue Router · Vitest · Bun. Hand-written CSS with
per-zone custom properties, and pure CSS motion — no utility framework and no
animation library.

Deployed to GitHub Pages on push to `main`.

## Development

```bash
bun install
bun run dev          # http://localhost:5173
bun run type-check
bun run test
bun run build
```
