# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## Current state: this repo is mid-rebuild

**There is no application code.** The previous Vue portfolio was deleted; only
configuration survives (`.gitignore`, `.eslintrc.cjs`, `.prettierrc.json`, the
`.env` files, and a deploy workflow that is itself due for replacement).

Do not restore the old site. It was discarded deliberately: it was never served,
and its architecture — Tailwind, an anime.js transform stage, a JSON content
layer — shares almost nothing with the design being built now. If `git status`
shows a large number of deletions, that is the expected state, not damage.

## Where the work is defined

Everything is on the issue tracker; none of it is duplicated in this repo.

- **[#72](https://github.com/Trinityy2/personal-website/issues/72)** — the spec.
  Problem, solution, 50 user stories, implementation decisions, testing
  decisions, scope. Read this before writing code.
- **#73–#79** — seven tracer-bullet tickets with native blocking dependencies.
  Each is sized for a single fresh context window. Start from the frontier: any
  ticket whose blockers are all closed.

Read the ticket you are working, and #72 for the decisions behind it. Do not
re-litigate settled decisions; they came out of a long design interview and the
reasoning is recorded in #72.

## The design source

The visual design lives in a Claude Design project, **Undertale Website Color
Palette**: <https://claude.ai/design/p/1387747b-0134-407d-a98c-bf9457a5f2b4>

It contains three things worth knowing about:

- `Undertale Palette.dc.html` — the design system: three zone palettes, type,
  border and spacing rules.
- `Undertale Site Prototype v2.dc.html` — the target. A near-complete interactive
  prototype whose logic script defines the zone tokens, the transition timings,
  and the navigation behaviour. **Where the two documents disagree, the prototype
  wins** — notably, the palette doc specifies a cross-fade between zones while
  the prototype implements a fade through black, and the prototype's version was
  chosen.
- `sprites/` — three pixel-art avatars at 168×204, one idle pose per zone
  (`avatar-void.png`, `avatar-ruins.png`, `avatar-snowdin.png`). Extract them
  with the `claude-design` MCP: `render_preview` on the sprite path returns a
  short-lived `serve_url`, which `curl` can fetch to `public/sprites/`. That URL
  is a credentialed link — never print it or commit it.

Beware: the About and Skills content in the prototype is **real** and carries
across as-is. The Work and Blog content is placeholder belonging to a fictional
designer and must not be mistaken for real history.

## Invariants worth stating twice

These are the decisions most likely to be got wrong by someone reading only a
ticket:

- **The responsive inversion.** The full-viewport lock and `overflow: hidden`
  live inside a `min-width` media query. The mobile baseline is an ordinary
  scrolling document; the desktop stage is the special case layered on top.
  Inverted the other way, adding a mobile design later becomes a rewrite.
- **The transition ordering.** Zone swaps happen while the black overlay is
  fully opaque, enforced by holding navigation in a router guard — not by
  reacting to a route change. The 250ms timeout fallback is not optional: a
  backgrounded tab never fires `transitionend` and navigation would hang.
- **The post source is injectable.** The module turning raw Markdown into typed
  posts takes its input as a parameter, never calling the bundler's glob API
  internally. This is what makes the project's single test seam reachable.
- **Arrow-key travel does not wrap.** Left at the first zone and right at the
  last are dead stops.
- **No design tokens outside the zone system.** Every colour resolves from a CSS
  custom property switched by one `data-zone` attribute. The only exception is
  the soul red, which never recolours.
- **No gradients, no shadows, no border-radius.** 3px hard borders throughout.

## Toolchain

Bun, not npm or yarn (`package-lock.json` and `yarn.lock` are gitignored).
Vue 3 with `<script setup>`, Vite, TypeScript, Vue Router, Vitest. Hand-written
CSS — no utility framework. Pure CSS transitions and keyframes — no animation
library.

`.env.production` sets `VITE_BASE_PATH=/` because the site is served at the root
of a GitHub user site. If that ever moves back to a project-site subpath, every
asset reference needs revisiting.

Testing uses **one seam**: mount the app with an in-memory router and injected
fixture posts, then assert on rendered output and route state. Do not add
component-level or end-to-end suites; see #72's Testing Decisions for why.

## Agent skills

### Issue tracker

Issues live as GitHub issues on this repo, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
