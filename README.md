# Liminal Resonance

[![Tests](https://img.shields.io/badge/tests-6%2F6%20passing-brightgreen?style=for-the-badge&logo=vitest)](https://github.com/Prompt-0/liminal-resonance-vn)
[![React](https://img.shields.io/badge/react-19-61dafb?style=for-the-badge&logo=react)](https://github.com/Prompt-0/liminal-resonance-vn)
[![Tailwind](https://img.shields.io/badge/tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)](https://github.com/Prompt-0/liminal-resonance-vn)
[![TypeScript](https://img.shields.io/badge/typescript-5.7-blue?style=for-the-badge&logo=typescript)](https://github.com/Prompt-0/liminal-resonance-vn)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

A psychological mystery visual novel web engine built with React 19, TypeScript, and Tailwind CSS v4. Explores themes of liminal spaces, memory distortion, and auditory hallucinations through an interactive narrative state machine with dynamic dread meters and synthesized voice textures.

---

## 🎭 Engine Architecture & Features

- **Branching Dialogue State Machine (`VNStateMachine`)**: Finite state machine managing complex narrative node graphs, dialogue progression, player choices, and conditional story flags.
- **Dynamic Dread & Psychometrics**: Player decisions manipulate internal stress and dread indices, dynamically changing UI visual distortions, music pitch, and unlocking secret narrative branches.
- **Synthesized Voice & Audio Ambience**: Procedural text-to-speech audio synthesis delivering distinct resonant voice textures for characters without heavy pre-recorded MP3 bundles.
- **Save & Load Serialization**: Complete state snapshot engine storing choice history, unlocked endings, current node indices, and flags in `localStorage`.
- **Automated Verification**: Vitest unit test suite validating node transitions, choice execution, dread modifiers, and state serialization fidelity.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Prompt-0/liminal-resonance-vn.git
cd liminal-resonance-vn

# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm run test

# Run linter
npm run lint

# Build production bundle
npm run build
```

---

## 📄 License
Licensed under the MIT License.
