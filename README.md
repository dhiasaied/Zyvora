# Zyvora — Hard Shell, Soft Flight

An interactive 3D landing page for a concept bio-inspired micro-drone, built with
**React + Vite**, **Three.js / React Three Fiber / Drei**, **GSAP + ScrollTrigger** and **Lenis**.
The visual direction (ladybug hero, navy blueprint backdrop, giant condensed type split
around the model, orange accent) is inspired by the ThreeUI "ELYTRA — Ladybug" template (rebranded here as Zyvora),
implemented from scratch.

## Run

```bash
npm install
npm run dev        # http://localhost:5179
npm run build      # production bundle in dist/
npm run preview
```

## What's inside

- **Procedural, rigged 3D ladybug** (no external model files): clearcoat physical shell,
  hinged elytra, iridescent membrane wings with veins, articulated legs, antennae,
  emissive optics and a glowing drone halo.
- **Scroll choreography**: each `[data-scene]` section has a pose (position, rotation,
  scale, shell open, wings unfolded, wingbeat). The pose holds while its section fills the
  screen and blends across section boundaries (`src/components/three/keyframes.js`).
- **Interactions**: pointer parallax, drag to rotate (desktop), click or tap the model to
  deploy and hover for a few seconds, and anatomy hotspots in the "How it works" section.
- **Shell Lab color customizer** (bottom-right): six presets, live pickers for shell,
  accent and backdrop, randomize and reset. The palette lives in a zustand store shared
  by the DOM and the canvas, persists to `localStorage`, animates CSS tokens via
  `@property`, and eases 3D material colors every frame.
- **Studio lighting**: baked Lightformer environment for reflections, key and fill lights,
  palette-tinted rim and under lights, contact shadows, infinite grid floor and
  additive dust particles.
- **GSAP**: intro loader curtain, split-line hero reveal, scroll-scrubbed hero parallax,
  reveal-on-scroll, animated counters, FAQ accordion and the mobile menu.
- **Performance**: adaptive DPR via `PerformanceMonitor`, lower geometry and shadow
  resolution and fewer particles on mobile, static environment map (`frames={1}`),
  shared geometries and materials, and per-frame updates through refs (no React
  re-renders in the render loop).

## Structure

```
src/
  App.jsx                    page composition, scroll reveals
  store/theme.js             palette store + presets
  lib/                       scroll state, smooth scroll, pointer, color utils
  hooks/                     media query, theme CSS vars, color tween, active section
  components/three/          Experience (Canvas), Ladybug, LadybugRig, keyframes,
                             BlueprintRings, Hotspots, Backdrop, Lighting, CameraRig
  components/sections/       Hero, Anatomy, Specs, Pricing, Launch, FAQ, Footer
  components/ui/             Navbar, ScrollHud, ColorPicker, Loader, Icons, SectionHeading
  styles/index.css           design tokens, layout, responsive rules
```
