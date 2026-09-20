import React from 'react';
import { TypewriterText } from './TypewriterText.tsx';
import { CharacterId, CharacterExpression } from '../types/vn.ts';
import {
  Volume2,
  VolumeX,
  Bookmark,
  FolderOpen,
  FastForward,
  Play,
  Pause,
  Sliders,
  Radio,
} from 'lucide-react';

interface DialogueBoxProps {
  speaker: string;
  characterId?: CharacterId;
  expression?: CharacterExpression;
  text: string;
  zalgoText?: string;
  dreadLevel: number;
  textSpeed: number;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  onAdvance: () => void;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  isAutoPlaying: boolean;
  onToggleAuto: () => void;
  isSkipping: boolean;
  onToggleSkip: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  hasChoices: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  characterId,
  text,
  zalgoText,
  dreadLevel,
  textSpeed,
  isComplete,
  setIsComplete,
  onAdvance,
  onOpenSave,
  onOpenLoad,
  onOpenHistory,
  onOpenSettings,
  isAutoPlaying,
  onToggleAuto,
  isSkipping,
  onToggleSkip,
  isMuted,
  onToggleMute,
  hasChoices,
}) => {
  const getSpeakerBadgeStyle = () => {
    switch (characterId) {
      case 'isaac':
        return 'border-amber-600/60 bg-amber-950/40 text-amber-300';
      case 'mercer':
        return 'border-emerald-600/60 bg-emerald-950/40 text-emerald-300';
      case 'cole':
        return 'border-cyan-600/60 bg-cyan-950/40 text-cyan-300';
      case 'system':
      case 'tape':
        return 'border-red-600/60 bg-red-950/50 text-red-400 font-mono-plex';
      default:
        return 'border-neutral-600/60 bg-neutral-900/60 text-neutral-300';
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto z-20 select-none">
      {/* 1. Quick Action Control Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 mb-1 bg-black/85 backdrop-blur-md border border-neutral-800/80 rounded-t-lg text-xs font-mono-plex text-neutral-400 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <Radio className={`w-3.5 h-3.5 ${dreadLevel > 0.6 ? 'text-red-500 animate-pulse' : 'text-amber-500'}`} />
            <span>COGNITIVE DRIFT: {(dreadLevel * 100).toFixed(0)}%</span>
          </span>
          <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
            <div
              className={`h-full transition-all duration-500 ${
                dreadLevel > 0.7 ? 'bg-red-500' : dreadLevel > 0.4 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, dreadLevel * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSave}
            title="Save Telemetry Log"
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SAVE</span>
          </button>

          <button
            onClick={onOpenLoad}
            title="Restore Telemetry Log"
            className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOAD</span>
          </button>

          <button
            onClick={onOpenHistory}
            title="Dialogue Log / Backlog"
            className="px-2.5 py-1 rounded hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            LOG
          </button>

          <button
            onClick={onToggleAuto}
            title="Auto-Play Mode"
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              isAutoPlaying ? 'bg-amber-950 text-amber-300 border border-amber-600/60' : 'hover:bg-neutral-800 hover:text-neutral-200'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AUTO</span>
          </button>

          <button
            onClick={onToggleSkip}
            title="Fast Forward"
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              isSkipping ? 'bg-rose-950 text-rose-300 border border-rose-600/60' : 'hover:bg-neutral-800 hover:text-neutral-200'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SKIP</span>
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Soundscape' : 'Mute Soundscape'}
            className="p-1.5 rounded hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenSettings}
            title="System Settings"
            className="p-1.5 rounded hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Dialogue Container */}
      <div
        onClick={() => {
          if (!hasChoices) {
            if (!isComplete) {
              setIsComplete(true);
            } else {
              onAdvance();
            }
          }
        }}
        className={`relative min-h-[160px] md:min-h-[180px] p-6 bg-black/90 backdrop-blur-xl border border-neutral-800/90 rounded-b-lg shadow-2xl transition-all ${
          !hasChoices ? 'cursor-pointer hover:border-neutral-700' : ''
        }`}
      >
        {/* Speaker Name Tag */}
        {speaker && (
          <div className="absolute -top-4 left-6 z-10">
            <span
              className={`inline-block px-4 py-1 rounded-md text-xs md:text-sm font-semibold tracking-wider uppercase border shadow-md ${getSpeakerBadgeStyle()}`}
            >
              {speaker}
            </span>
          </div>
        )}

        {/* Text Content */}
        <div className="mt-2 pr-12">
          <TypewriterText
            text={text}
            zalgoText={zalgoText}
            dreadLevel={dreadLevel}
            textSpeed={isSkipping ? 5 : textSpeed}
            isComplete={isComplete}
            setIsComplete={setIsComplete}
          />
        </div>

        {/* Advance Indicator Prompt */}
        {!hasChoices && isComplete && (
          <div className="absolute bottom-4 right-6 text-neutral-400 animate-bounce text-xs font-mono-plex font-bold tracking-wider">
            ▼ CLICK TO ADVANCE
          </div>
        )}
      </div>
    </div>
  );
};
