# Map: Psychological Horror Visual Novel Vertical Slice (Liminal Resonance)
**Label**: `wayfinder:map`

## Destination
A complete, fully playable 15–20 minute vertical slice (Prologue / Chapter 1) of the psychological horror visual novel **"Echoes of the Liminal Room"** (*Liminal Resonance*), running on port `3000` with branching narrative dialogue, procedural Web Audio dread engine, reactive CRT/glitch visual shaders, save/load/backlog state machine, and character/background assets.

## Notes
- **Domain**: Psychological Horror Visual Novel (Web-native React 19 + TypeScript + Vite + Web Audio API).
- **Skills to consult**: `game-development`, `game-audio-design`, `game-asset-pipeline`, `frontend-design`, `stop-slop`, `react-best-practices`, `test-driven-development`.
- **Standing preferences**:
  - Global container port boundary: `3000-3010` (Vite dev server strictly on `3000`).
  - No unearned jumpscares: prioritize atmospheric dread, uncanny unease, cognitive drift, and UI distortion.
  - Procedural Web Audio synthesis (binaural drones, tape flutter, heartbeat, static) + generated 2D art assets.
  - Strict host path translation for all `file://` links (`/home/ritesh/containers/agy-agentic/root/...`).

## Decisions so far
<!-- the index: one line per closed ticket, enough to judge relevance -->
- [Initial Scope & Genre Selection](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/000-initial-scope.md): Settled on 15–20m vertical slice, psychological horror genre, atmospheric uncanny tone, procedural audio, and layered 2D visual novel presentation.
- [Audio & Procedural Soundscape Architecture](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/001-audio-dread-synthesis.md): Built procedural Web Audio architecture featuring binaural Theta beats (108/114Hz), wow/flutter tape degradation, dynamic S1/S2 heartbeat pacing, and Poisson Geiger counter clicks driven by global Dread.
- [Project Engine Scaffolding & State Machine Core](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/002-state-machine-and-scaffold.md): Scaffolded Vite + React 19 + TypeScript, implemented strict dialogue state machine, history backlog, save/load persistence, and verified with automated test suite.
- [Visual Glitch & Atmospheric Shader Pipeline](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/003-visual-glitch-pipeline.md): Implemented reactive CRT scanlines, screen tear animations, chromatic aberration, and zalgo text distortion driven by Cognitive Drift.
- [Chapter 1 Scene Beat & Branching Tree Structure](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/004-chapter-1-script-and-branching.md): Wrote complete 22-node branching Chapter 1 dialogue script in `src/data/script.ts` with 6 choice junctures and 3 distinct endings.
- [Asset Acquisition & Generative Pipeline](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/005-asset-acquisition-pipeline.md): Generated 7 procedural background vector environments and 13 character expression portraits across all 3 cast members.
- [Neural Dialogue Voice Generation Pipeline](file:///home/ritesh/containers/agy-agentic/root/Projects/liminal-resonance-vn/wayfinder/tickets/006-neural-voice-generation.md): Generated 23 high-fidelity neural voice lines with custom acoustic parameters for Isaac, Mercer, and Cole.

## Not yet specified
<!-- Fog of war: in-scope fog you can't ticket yet -->
- Full Act 2 & 3 multi-route narrative expansion and persistent memory ARG mechanics across browser reloads.
- Ren'Py 8 desktop `.rpy` transpilation bridge and export packaging.
- Accessibility options (screen reader captions, customizable font size, colorblind modes).

## Out of scope
<!-- Work ruled beyond the destination -->
- Full 3D environment free-roam navigation.
- Live multiplayer or server-side netcode.
- Studio voice acting recording.
