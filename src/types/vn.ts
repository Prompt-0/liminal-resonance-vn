export type CharacterId = 'isaac' | 'mercer' | 'cole' | 'system' | 'tape' | 'inner' | 'unknown';

export type CharacterExpression =
  | 'neutral'
  | 'focused'
  | 'uneasy'
  | 'paranoid'
  | 'terrified'
  | 'distorted'
  | 'glitched'
  | 'detached'
  | 'unnatural_smile'
  | 'stern';

export type BackgroundId =
  | 'archive_sublevel'
  | 'tape_deck_closeup'
  | 'isolation_chamber'
  | 'static_hallway'
  | 'corrupted_void'
  | 'lucid_dawn'
  | 'severed_darkness'
  | 'isaac_archive'
  | 'mercer_portrait'
  | 'cole_office'
  | 'archive_room'
  | 'tape_deck';

export type AudioSfxType =
  | 'tape_play'
  | 'tape_stop'
  | 'tape_rewind'
  | 'static_burst'
  | 'geiger_spike'
  | 'door_heavy_slam'
  | 'phone_ring'
  | 'heartbeat_thud'
  | 'metallic_screech'
  | 'glitch_click';

export interface AudioCue {
  targetDread?: number; // Target dread index (0.0 to 1.0)
  sfx?: AudioSfxType;
  geigerIntensity?: number;
  radioStaticVolume?: number;
  triggerResonanceBurst?: boolean;
  silence?: boolean;
}

export interface VisualCue {
  screenShake?: 'subtle' | 'violent' | 'continuous';
  flashColor?: 'red' | 'white' | 'black' | 'static';
  glitchIntensity?: number; // 0 (none) to 3 (extreme)
  chromaticAberration?: boolean;
  invertColors?: boolean;
  vignetteDarkness?: number; // 0.0 to 1.0
}

export interface DialogueChoice {
  id?: string;
  text: string;
  distortedText?: string; // Appears when dread > 0.7
  targetNodeId: string;
  dreadDelta?: number; // Added or subtracted from dread
  flagsToSet?: Record<string, boolean | number | string>;
  condition?: (flags: Record<string, boolean | number | string>, dread: number) => boolean;
  tooltipHint?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  characterId?: CharacterId;
  expression?: CharacterExpression;
  characterPosition?: 'left' | 'center' | 'right';
  text: string;
  zalgoText?: string; // Text rendered when dread exceeds 0.75
  background: BackgroundId;
  audioCue?: AudioCue;
  visualCue?: VisualCue;
  choices?: DialogueChoice[];
  nextNodeId?: string;
  endingId?: 'lucid_escape' | 'deep_resonance' | 'mind_sever';
  onEnterFlags?: Record<string, boolean | number | string>;
}

export interface HistoryEntry {
  nodeId: string;
  speaker: string;
  text: string;
  characterId?: CharacterId;
  dread: number;
}

export interface GameState {
  currentNodeId: string;
  dreadLevel: number; // 0.0 to 1.0
  flags: Record<string, boolean | number | string>;
  history: HistoryEntry[];
  isAutoPlaying: boolean;
  isSkipping: boolean;
  textSpeed: number; // ms per character (default 25)
  hasEnded: boolean;
  endingId: 'lucid_escape' | 'deep_resonance' | 'mind_sever' | null;
}

export interface SaveSlot {
  slotId: number;
  timestamp: number;
  previewText: string;
  speaker: string;
  background: BackgroundId;
  dreadLevel: number;
  gameState: GameState;
}

export interface EndingData {
  id: 'lucid_escape' | 'deep_resonance' | 'mind_sever';
  title: string;
  subtitle: string;
  rank: 'Lucid' | 'Entangled' | 'Severed';
  description: string;
  epilogue: string;
}
