import React from 'react';
import { HistoryEntry } from '../types/vn.ts';
import { X, BookOpen } from 'lucide-react';

interface HistoryBacklogProps {
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
}

export const HistoryBacklog: React.FC<HistoryBacklogProps> = ({
  history,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl h-[80vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-mono-plex font-bold tracking-widest text-neutral-200 uppercase">
              ARCHIVE TELEMETRY TRANSCRIPT LOG
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Backlog List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-spectral text-sm md:text-base leading-relaxed divide-y divide-neutral-800/60">
          {history.length === 0 ? (
            <p className="text-neutral-500 italic text-center py-12 font-mono-plex text-xs">
              No previous transmissions logged.
            </p>
          ) : (
            history.map((entry, index) => (
              <div key={index} className="pt-4 first:pt-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-plex font-bold uppercase tracking-wider text-amber-500/90">
                    {entry.speaker || 'NARRATION'}
                  </span>
                  <span className="text-[10px] font-mono-plex text-neutral-600">
                    DRIFT: {(entry.dread * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-neutral-300">{entry.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/30 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono-plex text-xs rounded transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
