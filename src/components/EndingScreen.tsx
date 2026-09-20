import React from 'react';
import { EndingData } from '../types/vn.ts';
import { RotateCcw, Award } from 'lucide-react';

interface EndingScreenProps {
  ending: EndingData;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  ending,
  onRestart,
  onReturnTitle,
}) => {
  const getRankBadge = () => {
    switch (ending.rank) {
      case 'Lucid':
        return 'bg-sky-950/80 border-sky-500 text-sky-300';
      case 'Entangled':
        return 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
      case 'Severed':
        return 'bg-rose-950/80 border-rose-500 text-rose-300';
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl text-center space-y-6 p-8 border border-neutral-800 bg-neutral-950/90 rounded-2xl shadow-2xl">
        <div className="flex justify-center">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono-plex font-bold uppercase tracking-widest ${getRankBadge()}`}
          >
            <Award className="w-4 h-4" />
            <span>RESULT: {ending.rank} CONSCIOUSNESS</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-cinzel font-bold tracking-wider text-neutral-100">
            {ending.title}
          </h1>
          <p className="text-sm font-mono-plex text-neutral-400 uppercase tracking-widest">
            {ending.subtitle}
          </p>
        </div>

        <div className="p-5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-left space-y-4">
          <div>
            <span className="text-[11px] font-mono-plex text-amber-500 font-bold uppercase">SUMMARY</span>
            <p className="text-sm md:text-base font-spectral text-neutral-200 mt-1 leading-relaxed">
              {ending.description}
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-800/80">
            <span className="text-[11px] font-mono-plex text-neutral-400 font-bold uppercase">EPILOGUE</span>
            <p className="text-sm font-spectral italic text-neutral-300 mt-1 leading-relaxed">
              "{ending.epilogue}"
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono-plex text-xs font-bold uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={onReturnTitle}
            className="px-6 py-2.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-200 font-mono-plex text-xs font-bold uppercase tracking-wider transition-all"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
