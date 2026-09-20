import React from 'react';
import { Play, FolderOpen, Sliders, Info, Radio } from 'lucide-react';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLoad: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLoad,
  onOpenSettings,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-8 md:p-16 z-20 select-none overflow-hidden">
      {/* Background Graphic: Pristine Nagra Tape Deck Cinematic */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-10000 opacity-60"
        style={{ backgroundImage: 'url(/assets/cinematics/tape_deck.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/85 z-1" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-950/70 border border-red-800/80 rounded-lg text-[11px] font-mono-plex text-red-300 tracking-widest uppercase shadow-lg">
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>ST. JUDE SOMNOLOGY ARCHIVE // TERMINAL 04</span>
        </div>
        <span className="text-xs font-mono-plex text-neutral-400 font-semibold tracking-wider">PROJECT MORPHEUS · 1987</span>
      </div>

      {/* Main Center Title */}
      <div className="relative z-10 max-w-2xl space-y-4 my-auto">
        <div className="space-y-2">
          <p className="text-xs md:text-sm font-mono-plex tracking-[0.35em] text-amber-500 font-bold uppercase">
            A PSYCHOLOGICAL HORROR VISUAL NOVEL
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-black tracking-wider text-neutral-100 drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]">
            LIMINAL <span className="text-amber-500/95">RESONANCE</span>
          </h1>
          <p className="text-base font-spectral italic text-neutral-300 max-w-xl leading-relaxed">
            "When the room is quiet enough, you will realize the recording was waiting for you."
          </p>
        </div>

        {/* Action Menu */}
        <div className="pt-6 space-y-3 max-w-sm">
          <button
            onClick={onStartGame}
            className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/80 hover:border-amber-400 text-amber-100 font-mono-plex text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-amber-950/60 group"
          >
            <span>START TRANSMISSION</span>
            <Play className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenLoad}
            className="w-full flex items-center justify-between px-6 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono-plex text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <span>RESTORE LOG (LOAD)</span>
            <FolderOpen className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-6 py-3 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono-plex text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <span>CONFIGURATION</span>
            <Sliders className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between text-[11px] font-mono-plex text-neutral-400 pt-6 border-t border-neutral-900">
        <p>ST. JUDE SOMNOLOGY & ACOUSTIC LABS © 1987 // WEBAUDIO PROCEDURAL DREAD</p>
        <p className="flex items-center gap-1.5 mt-2 md:mt-0 text-amber-400/90 font-semibold">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>HEADPHONES RECOMMENDED FOR BINAURAL DREAD</span>
        </p>
      </div>
    </div>
  );
};
