# Ticket 002: Project Engine Scaffolding & State Machine Core
**Label**: `wayfinder:task`
**Status**: Closed
**Assignee**: agy

## Question
What is the optimal strict TypeScript architecture for the dialogue node state machine, choice router, history backlog stack, dread accumulation formula, and localStorage save/load persistence in Vite + React 19?

## Resolution
Scaffolded Vite + React 19 + TypeScript on port 3000 and created:
1. `src/types/vn.ts`: Strict schemas for characters, expressions, backgrounds, audio cues, visual cues, choices, dialogue nodes, and save slots.
2. `src/engine/vnStateMachine.ts`: Deterministic state machine managing node advancement, conditional branching, dread delta clamping (0.0 to 1.0), history backlog stack, auto-play, skip, and persistent `localStorage` save/load slots.
3. `src/engine/__tests__/vnStateMachine.test.ts`: Vitest automated test suite with 100% pass rate validating transitions, choices, dread deltas, and state persistence.
