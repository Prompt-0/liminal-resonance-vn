import { GameState, DialogueNode, DialogueChoice, SaveSlot } from '../types/vn.ts';

export const INITIAL_STATE: GameState = {
  currentNodeId: 'prologue_01',
  dreadLevel: 0.15,
  flags: {
    tapePlayed: false,
    listenedToWarning: false,
    inspectedAcoustics: false,
    trustArthur: true,
    mercerConnection: 0,
    discoveredLoop: false,
  },
  history: [],
  isAutoPlaying: false,
  isSkipping: false,
  textSpeed: 25,
  hasEnded: false,
  endingId: null,
};

// Safe memory storage fallback for non-browser/SSR environments
class MemoryStorage implements Storage {
  private data: Map<string, string> = new Map();

  get length(): number {
    return this.data.size;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] ?? null;
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

const memoryStorage = new MemoryStorage();

function getStorage(): Storage {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as unknown as { localStorage?: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage!;
  }
  return memoryStorage;
}

export class VNStateMachine {
  private state: GameState;
  private scriptMap: Map<string, DialogueNode>;
  private listeners: Set<(state: GameState) => void> = new Set();
  private static readonly STORAGE_KEY = 'liminal_resonance_saves_v1';

  constructor(script: DialogueNode[], initialState: GameState = INITIAL_STATE) {
    this.scriptMap = new Map(script.map((node) => [node.id, node]));
    this.state = { ...initialState };
    const currentNode = this.scriptMap.get(this.state.currentNodeId);
    if (currentNode?.endingId) {
      this.state.hasEnded = true;
      this.state.endingId = currentNode.endingId;
    }
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getCurrentNode(): DialogueNode | undefined {
    return this.scriptMap.get(this.state.currentNodeId);
  }

  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    const currentState = this.getState();
    for (const listener of this.listeners) {
      listener(currentState);
    }
  }

  public advance(): boolean {
    if (this.state.hasEnded) return false;

    const currentNode = this.getCurrentNode();
    if (!currentNode) return false;

    // Record to history backlog
    const historyEntry = {
      nodeId: currentNode.id,
      speaker: currentNode.speaker,
      text: currentNode.text,
      characterId: currentNode.characterId,
      dread: this.state.dreadLevel,
    };

    // If node has choices, cannot advance without a choice
    if (currentNode.choices && currentNode.choices.length > 0) {
      return false;
    }

    // If current node has endingId, mark ended
    if (currentNode.endingId) {
      this.state = {
        ...this.state,
        history: [...this.state.history, historyEntry],
        hasEnded: true,
        endingId: currentNode.endingId,
        isAutoPlaying: false,
        isSkipping: false,
      };
      this.emit();
      return true;
    }

    if (!currentNode.nextNodeId) {
      return false;
    }

    const nextNode = this.scriptMap.get(currentNode.nextNodeId);
    if (!nextNode) return false;

    // Apply audio target dread if defined
    let newDread = this.state.dreadLevel;
    if (nextNode.audioCue?.targetDread !== undefined) {
      newDread = Math.max(0, Math.min(1, nextNode.audioCue.targetDread));
    }

    // Apply node enter flags
    const newFlags = { ...this.state.flags };
    if (nextNode.onEnterFlags) {
      Object.assign(newFlags, nextNode.onEnterFlags);
    }

    this.state = {
      ...this.state,
      currentNodeId: nextNode.id,
      dreadLevel: newDread,
      flags: newFlags,
      history: [...this.state.history, historyEntry],
      hasEnded: !!nextNode.endingId,
      endingId: nextNode.endingId ?? null,
    };

    this.emit();
    return true;
  }

  public selectChoice(choiceIndex: number): boolean {
    const currentNode = this.getCurrentNode();
    if (!currentNode || !currentNode.choices || choiceIndex < 0 || choiceIndex >= currentNode.choices.length) {
      return false;
    }

    const choice: DialogueChoice = currentNode.choices[choiceIndex];

    // Check condition if present
    if (choice.condition && !choice.condition(this.state.flags, this.state.dreadLevel)) {
      return false;
    }

    const historyEntry = {
      nodeId: currentNode.id,
      speaker: currentNode.speaker,
      text: `${currentNode.text} [Selected: ${choice.text}]`,
      characterId: currentNode.characterId,
      dread: this.state.dreadLevel,
    };

    // Apply dread delta
    let newDread = this.state.dreadLevel + (choice.dreadDelta ?? 0);
    newDread = Math.max(0, Math.min(1, newDread));

    // Apply flags to set
    const newFlags = { ...this.state.flags };
    if (choice.flagsToSet) {
      Object.assign(newFlags, choice.flagsToSet);
    }

    const targetNode = this.scriptMap.get(choice.targetNodeId);
    if (!targetNode) return false;

    if (targetNode.audioCue?.targetDread !== undefined) {
      newDread = Math.max(0, Math.min(1, targetNode.audioCue.targetDread));
    }

    if (targetNode.onEnterFlags) {
      Object.assign(newFlags, targetNode.onEnterFlags);
    }

    this.state = {
      ...this.state,
      currentNodeId: targetNode.id,
      dreadLevel: newDread,
      flags: newFlags,
      history: [...this.state.history, historyEntry],
      hasEnded: !!targetNode.endingId,
      endingId: targetNode.endingId ?? null,
    };

    this.emit();
    return true;
  }

  public setAutoPlay(active: boolean): void {
    this.state = { ...this.state, isAutoPlaying: active, isSkipping: active ? false : this.state.isSkipping };
    this.emit();
  }

  public setSkip(active: boolean): void {
    this.state = { ...this.state, isSkipping: active, isAutoPlaying: active ? false : this.state.isAutoPlaying };
    this.emit();
  }

  public setTextSpeed(speedMs: number): void {
    this.state = { ...this.state, textSpeed: Math.max(5, Math.min(100, speedMs)) };
    this.emit();
  }

  public saveGame(slotId: number): boolean {
    try {
      const currentNode = this.getCurrentNode();
      if (!currentNode) return false;

      const storage = getStorage();
      const saves = this.getSaveSlots();
      const newSave: SaveSlot = {
        slotId,
        timestamp: Date.now(),
        previewText: currentNode.text.slice(0, 80) + '...',
        speaker: currentNode.speaker,
        background: currentNode.background,
        dreadLevel: this.state.dreadLevel,
        gameState: { ...this.state },
      };

      const existingIndex = saves.findIndex((s) => s.slotId === slotId);
      if (existingIndex >= 0) {
        saves[existingIndex] = newSave;
      } else {
        saves.push(newSave);
      }

      storage.setItem(VNStateMachine.STORAGE_KEY, JSON.stringify(saves));
      return true;
    } catch (e) {
      console.error('Failed to save game state', e);
      return false;
    }
  }

  public loadGame(slotId: number): boolean {
    try {
      const saves = this.getSaveSlots();
      const save = saves.find((s) => s.slotId === slotId);
      if (!save) return false;

      this.state = { ...save.gameState, isAutoPlaying: false, isSkipping: false };
      this.emit();
      return true;
    } catch (e) {
      console.error('Failed to load game state', e);
      return false;
    }
  }

  public getSaveSlots(): SaveSlot[] {
    try {
      const storage = getStorage();
      const raw = storage.getItem(VNStateMachine.STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public restart(): void {
    this.state = { ...INITIAL_STATE };
    this.emit();
  }
}
