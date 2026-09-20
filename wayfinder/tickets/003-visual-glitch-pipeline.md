# Ticket 003: Visual Glitch & Atmospheric Shader Pipeline
**Label**: `wayfinder:prototype`
**Status**: Closed
**Assignee**: agy

## Question
How should chromatic aberration, CRT scanlines, screen-tear shaders, and corrupted zalgo text dynamically scale in intensity based on the player's real-time Cognitive Drift level?

## Resolution
Implemented dynamic visual effects pipeline across UI components:
1. `src/components/GlitchOverlay.tsx`: Real-time CRT scanlines, shadow mask grid, screen flicker, horizontal screen tears (`glitch-tear-active`), dynamic chromatic aberration shifts, and dark vignette attenuation scaled by `dreadLevel` (0.0 to 1.0) with photosensitivity safety toggle.
2. `src/components/TypewriterText.tsx`: Paced typewriter text rendering with punctuation delays, text corruption / zalgo token rendering when dread exceeds 0.75.
3. `src/components/DialogueBox.tsx` & `src/components/ChoiceOverlay.tsx`: Psychological choice hover glitching, character color-coded badges, and live Cognitive Drift telemetry meters.
