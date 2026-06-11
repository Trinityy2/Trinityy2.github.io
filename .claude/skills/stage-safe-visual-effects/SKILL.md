---
name: stage-safe-visual-effects
description: Rendering and animation constraints for this site's home page — an anime.js-translated stage of full-viewport scrollable section slides where naive CSS effects break — plus recipes for debugging compositor artifacts. Consult this BEFORE any work involving anime.js animations or transitions; styling HomeView, NavBar, or any section component (hover effects, glows, auras, shimmer, parallax, frosted glass, blur or backdrop-blur, progress bars, animated fills); adding, removing, or reordering home-page sections; or any code that scrolls or navigates to a section. Also use it when debugging visual bugs anywhere on the home page — ghost traces left by animations, glows or shadows cut off by a rectangular "frame", flickering during section transitions, sections landing misaligned, the timeline desyncing from the visible section, or navigation overshooting.
---

# Stage-safe visual effects

The home page renders sections inside a compositing stack that breaks naive CSS effects:

```
stage (overflow-hidden, h-screen)
└── track (will-change: transform, translateY animated by anime.js)
    └── slide per section (overflow-y-auto, overscroll-contain, h-screen)
        └── section content
```

The fixed NavBar additionally uses `backdrop-blur` (`backdrop-filter`), which forces
expensive repaints of anything animating beneath/inside it.

Scroll containers, transformed ancestors, and backdrop-filter each give Chromium's
compositor a chance to rasterize, clip, or cache your effect at the wrong bounds.
Three real bugs came from this stack; their fixes generalize.

## Rules

**1. Never use `filter: blur()` for glows/auras inside the stage — paint a radial gradient.**
A filter's output is hard-clipped to a rectangle (the element's box + ~3× the blur's
standard deviation), and the compositor clips it tighter still inside scrolled/transformed
ancestors. The visible symptom: the glow vanishes or shows a straight-edged "frame".
A radial gradient is geometrically incapable of this — its falloff is part of the painted
shape — and costs nothing per frame while the track animates.

```html
<!-- BAD: rectangle-clipped inside the stage -->
<div class="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 opacity-20 blur-2xl"></div>

<!-- GOOD: same look, cannot be clipped to a rectangle (see HeroSection.vue) -->
<div class="absolute -inset-16 rounded-full
            bg-[radial-gradient(closest-side,theme(colors.primary.500/0.35),theme(colors.primary.500/0.12)_60%,transparent)]"></div>
```

**2. Animate `transform`/`opacity`, never layout properties (`width`, `height`, `top`, `left`).**
Layout properties repaint every frame; under the NavBar's `backdrop-filter` those repaints
left ghost traces of the old pixels (the timeline progress line bug). Transforms run on
the compositor and repaint cleanly. Pattern used by the NavBar progress fill: render the
element at full size, animate `scaleX` with an `origin-left` class, and let anime.js own
the element's `transform` entirely — don't put Tailwind transform utilities (`-translate-y-1/2`
etc.) on the same element, because anime.js overwrites the whole `transform` property.
Put positioning transforms on a wrapper instead.

**3. When anime.js retargets an in-flight animation, call `utils.remove(el)` first.**
v4's default `composition: 'replace'` usually handles interruption, but explicit removal
guarantees an interrupted back-and-forth never leaves a competing tween writing values.

**4. Position by measurement, not arithmetic.**
The track pins to each slide's measured `offsetTop`, not `index * 100vh`, and re-pins on
resize. Anything new that scrolls/translates to a section must go through the sections
store (`useSectionsStore`) — never `scrollIntoView`, native anchor jumps, or manual
transforms — otherwise the timeline desyncs and offsets stack (the "View My Work" bug).
In-page `<a href="#section">` links are already intercepted by HomeView's stage click
handler and routed through the store, so plain anchors in *content* are fine.

**5. `prefers-reduced-motion` short-circuits every animation** (duration 0 / `utils.set`).
Follow that pattern for any new effect.

## Debugging visual artifacts here

1. Separate state from paint: read the element's computed style / inline style after the
   animation settles. Correct values + wrong pixels = compositor artifact → apply rules 1–2.
2. Find who clips: walk up `parentElement`, logging any ancestor where `overflow`,
   `contain`, `clip-path`, `will-change`, or `filter` is non-default.
3. Make subtle effects visible to verify: temporarily boost the effect's alpha/size via
   inline style in the preview, screenshot, then revert — a soft 10%-alpha glow is
   invisible in compressed screenshots, a boosted one shows clipping instantly.
