# Ticket 001: Audio & Procedural Soundscape Architecture
**Label**: `wayfinder:research`
**Status**: Closed
**Assignee**: agy

## Question
How should the procedural Web Audio API engine synthesize dynamic psychological horror soundscapes (binaural theta beats 4–8Hz, sub-bass drones, analog tape flutter/hiss, heartbeat pacing linked to Cognitive Drift, and spatial radio static) without relying on external bandwidth?

## Resolution
Implemented procedural Web Audio synthesis engines in pure TypeScript:
1. `BinauralThetaEngine`: Dichotic sine generators (108 Hz Left / 114 Hz Right) with drift LFO (0.03 Hz) and 54 Hz sub-bass triangle foundation.
2. `TapeDegradationEngine`: Dual LFO delay modulation (0.45 Hz wow + 8.5 Hz flutter), `tanh` wave-shaper soft saturation, and continuous Kellet-filtered pink noise tape hiss with 3.8 kHz head resonance.
3. `DynamicHeartbeatEngine`: Anatomical dual-valve S1 ("Lub" 62->34 Hz) and S2 ("Dub" 86->44 Hz) cardiac pulses driven by lookahead scheduler, with arrhythmia jitter and systolic noise swoosh scaling from 52 to 168 BPM via global Dread (0.0 - 1.0).
4. `HazardTextureEngine`: Inhomogeneous Poisson process Geiger ionization discharges ($\Delta t = -\ln(1-U)/\lambda$), heterodyne drifting radio static, and inharmonic modal frequency bursts.
5. `HorrorSoundscapeConductor`: Unified master controller binding the 0.0 - 1.0 dread index across all modules.
