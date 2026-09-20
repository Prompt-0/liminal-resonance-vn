import React from 'react';
import { SaveSlot } from '../types/vn.ts';
import { X, Bookmark, FolderOpen } from 'lucide-react';

interface SaveLoadModalProps {
  mode: 'save' | 'load';
  isOpen: boolean;
  onClose: () => void;
  saveSlots: SaveSlot[];
  onSaveSlot: (slotId: number) => void;
  onLoadSlot: (slotId: number) => void;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  mode,
  isOpen,
  onClose,
  saveSlots,
  onSaveSlot,
  onLoadSlot,
}) => {
  if (!isOpen) return null;

  const totalSlots = 6;
  const slotsMap = new Map(saveSlots.map((s) => [s.slotId, s]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/70">
          <div className="flex items-center gap-3">
            {mode === 'save' ? (
              <Bookmark className="w-4 h-4 text-amber-500" />
            ) : (
              <FolderOpen className="w-4 h-4 text-cyan-500" />
            )}
            <h2 className="text-sm font-mono-plex font-bold tracking-widest text-neutral-200 uppercase">
              {mode === 'save' ? 'COMMIT TELEMETRY STATE (SAVE)' : 'RESTORE TELEMETRY STATE (LOAD)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: totalSlots }).map((_, i) => {
            const slotId = i + 1;
            const slot = slotsMap.get(slotId);

            return (
              <div
                key={slotId}
                className={`p-4 rounded-lg border transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                  slot
                    ? 'bg-neutral-900/70 border-neutral-700 hover:border-amber-500/80 cursor-pointer group'
                    : 'bg-neutral-950/50 border-neutral-800/80 border-dashed text-neutral-600'
                }`}
                onClick={() => {
                  if (mode === 'save') {
                    onSaveSlot(slotId);
                    onClose();
                  } else if (slot) {
                    onLoadSlot(slotId);
                    onClose();
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-plex font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    SLOT 0{slotId}
                  </span>
                  {slot && (
                    <span className="text-[10px] font-mono-plex text-neutral-500">
                      {new Date(slot.timestamp).toLocaleTimeString()} · {new Date(slot.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {slot ? (
                  <div className="space-y-2">
                    <p className="text-xs font-mono-plex text-amber-400 font-semibold uppercase">
                      {slot.speaker}
                    </p>
                    <p className="text-sm font-spectral text-neutral-200 line-clamp-2">
                      "{slot.previewText}"
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[10px] font-mono-plex text-neutral-400">
                      <span>SCENE: {slot.background}</span>
                      <span>DRIFT: {(slot.dreadLevel * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="font-mono-plex text-xs uppercase tracking-wider text-neutral-500">
                      {mode === 'save' ? '+ CLICK TO RECORD STATE' : 'EMPTY TELEMETRY SLOT'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono-plex text-xs rounded transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
