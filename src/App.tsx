import React, { useState, useEffect } from 'react';
import { VNStateMachine, INITIAL_STATE } from './engine/vnStateMachine.ts';
import { CHAPTER_1_SCRIPT, ENDINGS_DATA } from './data/script.ts';
import { audioEngine } from './engine/audioEngine.ts';
import { GameState, DialogueNode } from './types/vn.ts';
import { GlitchOverlay } from './components/GlitchOverlay.tsx';
import { DialogueBox } from './components/DialogueBox.tsx';
import { ChoiceOverlay } from './components/ChoiceOverlay.tsx';
import { HistoryBacklog } from './components/HistoryBacklog.tsx';
import { SaveLoadModal } from './components/SaveLoadModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { EndingScreen } from './components/EndingScreen.tsx';
import { TitleScreen } from './components/TitleScreen.tsx';

export const App: React.FC = () => {
  const [stateMachine] = useState<VNStateMachine>(
    () => new VNStateMachine(CHAPTER_1_SCRIPT, INITIAL_STATE)
  );
  const [gameState, setGameState] = useState<GameState>(() => stateMachine.getState());
  const [inGame, setInGame] = useState<boolean>(false);
  const [isTextComplete, setIsTextComplete] = useState<boolean>(false);

  // Modals
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [saveModalMode, setSaveModalMode] = useState<'save' | 'load'>('save');
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Settings
  const [masterVolume, setMasterVolume] = useState<number>(0.8);
  const [textSpeed, setTextSpeed] = useState<number>(25);
  const [photosensitivityMode, setPhotosensitivityMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Subscribe to State Machine updates
  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((newState) => {
      setGameState(newState);
    });
    return unsubscribe;
  }, [stateMachine]);

  const currentNode: DialogueNode | undefined = stateMachine.getCurrentNode();

  // Handle Node Procedural Audio & SFX triggers
  useEffect(() => {
    if (!inGame || !currentNode) return;

    // Update global dread in procedural audio engine
    audioEngine.setDread(gameState.dreadLevel);

    // Audio Cues (SFX / Resonance)
    if (currentNode.audioCue?.sfx) {
      audioEngine.playSfx(currentNode.audioCue.sfx);
    }
    if (currentNode.audioCue?.triggerResonanceBurst) {
      audioEngine.triggerResonanceBurst(380, 2.5, gameState.dreadLevel);
    }
  }, [inGame, currentNode, gameState.dreadLevel]);

  // Handle Auto-play timer
  useEffect(() => {
    if (!inGame || !gameState.isAutoPlaying || gameState.hasEnded || !isTextComplete) return;

    const hasChoices = !!(currentNode?.choices && currentNode.choices.length > 0);
    if (hasChoices) return;

    const timer = setTimeout(() => {
      stateMachine.advance();
    }, 2200);

    return () => clearTimeout(timer);
  }, [inGame, gameState.isAutoPlaying, gameState.hasEnded, isTextComplete, currentNode, stateMachine]);

  // Handle Skip mode
  useEffect(() => {
    if (!inGame || !gameState.isSkipping || gameState.hasEnded) return;

    const hasChoices = !!(currentNode?.choices && currentNode.choices.length > 0);
    if (hasChoices) {
      stateMachine.setSkip(false);
      return;
    }

    const timer = setTimeout(() => {
      stateMachine.advance();
    }, 150);

    return () => clearTimeout(timer);
  }, [inGame, gameState.isSkipping, gameState.hasEnded, currentNode, stateMachine]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (historyOpen || saveModalOpen || settingsOpen) {
        if (e.key === 'Escape') {
          setHistoryOpen(false);
          setSaveModalOpen(false);
          setSettingsOpen(false);
        }
        return;
      }

      if (!inGame) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        const hasChoices = !!(currentNode?.choices && currentNode.choices.length > 0);
        if (!hasChoices) {
          if (!isTextComplete) {
            setIsTextComplete(true);
          } else {
            stateMachine.advance();
          }
        }
      } else if (e.key === 'h' || e.key === 'H') {
        setHistoryOpen(true);
      } else if (e.key === 's' || e.key === 'S') {
        setSaveModalMode('save');
        setSaveModalOpen(true);
      } else if (e.key === 'l' || e.key === 'L') {
        setSaveModalMode('load');
        setSaveModalOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        const muted = audioEngine.toggleMute();
        setIsMuted(muted);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inGame, historyOpen, saveModalOpen, settingsOpen, isTextComplete, currentNode, stateMachine]);

  // Start New Game
  const handleStartGame = async () => {
    await audioEngine.init();
    audioEngine.setDread(0.15);
    stateMachine.restart();
    setInGame(true);
  };

  // Select Choice
  const handleSelectChoice = (index: number) => {
    stateMachine.selectChoice(index);
  };

  // Full-bleed cinematic illustration for the active scene node
  const currentCinemaSrc = currentNode?.background
    ? `/assets/cinematics/${currentNode.background}.jpg`
    : '/assets/cinematics/archive_room.jpg';

  // Dynamic Camera & Staging Zoom for intense narrative moments
  const isIntenseClimax = gameState.dreadLevel > 0.65 || currentNode?.id.includes('mercer') || currentNode?.id.includes('ending');
  const cinemaScale = isIntenseClimax ? 'scale-105' : 'scale-100';

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* 1. CRT Scanline & Psychological Glitch Shaders */}
      <GlitchOverlay
        dreadLevel={gameState.dreadLevel}
        visualCue={currentNode?.visualCue}
        enablePhotosensitivityMode={photosensitivityMode}
      />

      {/* 2. Title Screen Mode */}
      {!inGame ? (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenLoad={() => {
            setSaveModalMode('load');
            setSaveModalOpen(true);
          }}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        /* 3. In-Game Visual Novel Stage: Full-Bleed Cinematic Masterpiece */
        <div className="relative w-full h-full flex flex-col justify-between p-4 md:p-8 z-10">
          {/* Full-Screen Scene Cinematic Illustration */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out z-0 ${cinemaScale}`}
            style={{ backgroundImage: `url(${currentCinemaSrc})` }}
          />
          {/* Vignette & Cinematic Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/70 z-1 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.85)_95%)] z-1 pointer-events-none" />

          {/* Top Info Bar */}
          <div className="relative z-10 flex items-center justify-between font-mono-plex text-xs text-neutral-400">
            <span className="px-3.5 py-1 bg-black/85 border border-neutral-800 rounded backdrop-blur-md font-semibold text-amber-400/90 tracking-wider shadow-lg">
              ST. JUDE SOMNOLOGY // {gameState.currentNodeId.toUpperCase()}
            </span>
            <button
              onClick={() => setInGame(false)}
              className="px-3.5 py-1 bg-black/85 hover:bg-neutral-900 border border-neutral-800 rounded backdrop-blur-md text-neutral-400 hover:text-neutral-200 transition-colors shadow-lg font-mono-plex text-xs tracking-wider uppercase"
            >
              MAIN MENU
            </button>
          </div>

          {/* Spacer for Stage Atmosphere */}
          <div className="relative z-10 flex-1 pointer-events-none" />

          {/* Choice Modal (if choices available) */}
          {currentNode?.choices && currentNode.choices.length > 0 && (
            <ChoiceOverlay
              choices={currentNode.choices}
              dreadLevel={gameState.dreadLevel}
              onSelectChoice={handleSelectChoice}
            />
          )}

          {/* Dialogue Box */}
          {currentNode && (
            <DialogueBox
              speaker={currentNode.speaker}
              characterId={currentNode.characterId}
              expression={currentNode.expression}
              text={currentNode.text}
              zalgoText={currentNode.zalgoText}
              dreadLevel={gameState.dreadLevel}
              textSpeed={textSpeed}
              isComplete={isTextComplete}
              setIsComplete={setIsTextComplete}
              onAdvance={() => stateMachine.advance()}
              onOpenSave={() => {
                setSaveModalMode('save');
                setSaveModalOpen(true);
              }}
              onOpenLoad={() => {
                setSaveModalMode('load');
                setSaveModalOpen(true);
              }}
              onOpenHistory={() => setHistoryOpen(true)}
              onOpenSettings={() => setSettingsOpen(true)}
              isAutoPlaying={gameState.isAutoPlaying}
              onToggleAuto={() => stateMachine.setAutoPlay(!gameState.isAutoPlaying)}
              isSkipping={gameState.isSkipping}
              onToggleSkip={() => stateMachine.setSkip(!gameState.isSkipping)}
              isMuted={isMuted}
              onToggleMute={() => {
                const muted = audioEngine.toggleMute();
                setIsMuted(muted);
              }}
              hasChoices={!!(currentNode.choices && currentNode.choices.length > 0)}
            />
          )}

          {/* Ending Result Screen */}
          {gameState.hasEnded && gameState.endingId && (
            <EndingScreen
              ending={ENDINGS_DATA[gameState.endingId]}
              onRestart={() => {
                stateMachine.restart();
                audioEngine.setDread(0.15);
              }}
              onReturnTitle={() => {
                setInGame(false);
                stateMachine.restart();
              }}
            />
          )}
        </div>
      )}

      {/* Global Modals */}
      <HistoryBacklog
        history={gameState.history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <SaveLoadModal
        mode={saveModalMode}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        saveSlots={stateMachine.getSaveSlots()}
        onSaveSlot={(slotId) => stateMachine.saveGame(slotId)}
        onLoadSlot={(slotId) => {
          stateMachine.loadGame(slotId);
          setInGame(true);
        }}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        volume={masterVolume}
        onVolumeChange={(val) => {
          setMasterVolume(val);
          audioEngine.setVolume(val);
        }}
        textSpeed={textSpeed}
        onTextSpeedChange={(val) => {
          setTextSpeed(val);
          stateMachine.setTextSpeed(val);
        }}
        photosensitivityMode={photosensitivityMode}
        onTogglePhotosensitivity={() => setPhotosensitivityMode(!photosensitivityMode)}
      />
    </div>
  );
};
