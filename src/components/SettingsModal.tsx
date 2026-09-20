import React from 'react';
import { X, Volume2, Sliders, Eye } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  textSpeed: number;
  onTextSpeedChange: (val: number) => void;
  photosensitivityMode: boolean;
  onTogglePhotosensitivity: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  volume,
  onVolumeChange,
  textSpeed,
  onTextSpeedChange,
  photosensitivityMode,
  onTogglePhotosensitivity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/70">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-mono-plex font-bold tracking-widest text-neutral-200 uppercase">
              FACILITY TELEMETRY & CONFIGURATION
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="p-6 space-y-6">
          {/* Master Soundscape Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-plex text-neutral-300">
              <span className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-500" />
                <span>PROCEDURAL SOUNDSCAPE GAIN</span>
              </span>
              <span>{(volume * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Text Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-plex text-neutral-300">
              <span>TELETYPE CADENCE (SPEED)</span>
              <span>{textSpeed} ms/char</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={textSpeed}
              onChange={(e) => onTextSpeedChange(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Photosensitivity Mode */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/60 border border-neutral-800">
            <div className="flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-sm font-spectral text-neutral-200">Photosensitivity Safe Mode</p>
                <p className="text-xs font-mono-plex text-neutral-500">Disables intense screen shakes and strobe flashes</p>
              </div>
            </div>
            <button
              onClick={onTogglePhotosensitivity}
              className={`px-3 py-1.5 rounded text-xs font-mono-plex transition-colors ${
                photosensitivityMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/70' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {photosensitivityMode ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono-plex text-xs rounded transition-colors"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
