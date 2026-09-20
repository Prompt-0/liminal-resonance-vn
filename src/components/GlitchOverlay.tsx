import React from 'react';
import { VisualCue } from '../types/vn.ts';

interface GlitchOverlayProps {
  dreadLevel: number; // 0.0 to 1.0
  visualCue?: VisualCue;
  enablePhotosensitivityMode?: boolean;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({
  dreadLevel,
  visualCue,
  enablePhotosensitivityMode = false,
}) => {
  if (enablePhotosensitivityMode) {
    return null;
  }

  const effectiveGlitch = visualCue?.glitchIntensity ?? Math.floor(dreadLevel * 3.5);
  const isViolentShake = visualCue?.screenShake === 'violent';
  const isSubtleShake = visualCue?.screenShake === 'subtle' || (dreadLevel > 0.65 && Math.random() < 0.3);
  const flashColor = visualCue?.flashColor;

  const shakeTranslate = isViolentShake
    ? 'translate(8px, -6px) rotate(0.4deg)'
    : isSubtleShake
    ? 'translate(2px, -1px)'
    : 'none';

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden transition-transform duration-75"
      style={{ transform: shakeTranslate }}
    >
      {/* 1. CRT Scanlines & Shadow Mask */}
      <div className="absolute inset-0 crt-scanlines opacity-75 mix-blend-overlay" />

      {/* 2. Ambient CRT Flicker */}
      <div className="absolute inset-0 screen-flicker pointer-events-none bg-emerald-500/5 mix-blend-screen" />

      {/* 3. Screen Tear / Chromatic Aberration under high dread */}
      {effectiveGlitch >= 1 && (
        <div
          className="absolute inset-0 glitch-tear-active opacity-40 mix-blend-difference bg-red-950/20"
          style={{
            transform: `translate(${(Math.random() - 0.5) * effectiveGlitch * 6}px, ${(Math.random() - 0.5) * effectiveGlitch * 4}px)`,
          }}
        />
      )}

      {/* 4. Heavy Glitch Artifact Lines */}
      {effectiveGlitch >= 2 && (
        <div className="absolute inset-0 flex flex-col justify-around opacity-30">
          <div className="w-full h-1 bg-cyan-400 blur-xs" />
          <div className="w-full h-2 bg-rose-500 blur-xs translate-x-4" />
          <div className="w-full h-0.5 bg-white blur-xs -translate-x-6" />
        </div>
      )}

      {/* 5. Extreme Cosmic Void Inversion */}
      {effectiveGlitch >= 3 && (
        <div className="absolute inset-0 bg-red-900/15 mix-blend-color-dodge animate-pulse" />
      )}

      {/* 6. Dynamic Vignette Darkness */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.88) 95%)',
          opacity: Math.max(0.3, visualCue?.vignetteDarkness ?? (0.3 + dreadLevel * 0.65)),
        }}
      />

      {/* 7. Red / White / Black Flash Effects */}
      {flashColor === 'red' && (
        <div className="absolute inset-0 bg-red-600/50 animate-ping" />
      )}
      {flashColor === 'white' && (
        <div className="absolute inset-0 bg-white/70 animate-pulse" />
      )}
      {flashColor === 'black' && (
        <div className="absolute inset-0 bg-black/95 transition-opacity duration-300" />
      )}
    </div>
  );
};
