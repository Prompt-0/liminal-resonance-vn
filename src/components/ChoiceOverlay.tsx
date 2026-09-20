import React, { useState } from 'react';
import { DialogueChoice } from '../types/vn.ts';
import { audioEngine } from '../engine/audioEngine.ts';

interface ChoiceOverlayProps {
  choices: DialogueChoice[];
  dreadLevel: number;
  onSelectChoice: (index: number) => void;
}

export const ChoiceOverlay: React.FC<ChoiceOverlayProps> = ({
  choices,
  dreadLevel,
  onSelectChoice,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseEnter = (idx: number) => {
    setHoveredIndex(idx);
    audioEngine.playSfx('glitch_click');
  };

  return (
    <div className="absolute inset-0 z-25 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl space-y-4">
        <div className="text-center mb-6">
          <span className="px-3 py-1 bg-red-950/70 border border-red-700/80 rounded text-xs font-mono-plex tracking-widest text-red-300 uppercase">
            DECISION THRESHOLD REQUIRED
          </span>
        </div>

        {choices.map((choice, index) => {
          const isHovered = hoveredIndex === index;
          const showDistortion = dreadLevel > 0.6 && choice.distortedText && isHovered;
          const choiceText = showDistortion ? choice.distortedText! : choice.text;

          return (
            <button
              key={choice.id}
              onClick={() => onSelectChoice(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`w-full p-4 md:p-5 text-left rounded-lg transition-all duration-200 border group relative overflow-hidden ${
                isHovered
                  ? 'bg-neutral-900 border-amber-500/80 text-amber-100 shadow-lg shadow-amber-950/50 scale-[1.01]'
                  : 'bg-black/85 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              {/* Background scanline bar on hover */}
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent pointer-events-none" />
              )}

              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono-plex text-xs flex items-center justify-center group-hover:border-amber-500 group-hover:text-amber-300">
                  0{index + 1}
                </span>

                <div className="flex-1">
                  <p
                    className={`text-base md:text-lg font-spectral leading-snug transition-colors ${
                      showDistortion ? 'text-red-400 font-mono-plex tracking-tighter animate-pulse' : ''
                    }`}
                  >
                    {choiceText}
                  </p>
                  {choice.tooltipHint && (
                    <p className="text-xs font-mono-plex text-neutral-500 mt-1">
                      {choice.tooltipHint}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
