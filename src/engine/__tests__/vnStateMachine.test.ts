import { describe, it, expect, beforeEach } from 'vitest';
import { VNStateMachine, INITIAL_STATE } from '../vnStateMachine.ts';
import { DialogueNode } from '../../types/vn.ts';

// Mock localStorage for test environment
const mockStorageData: Record<string, string> = {};
const mockLocalStorage: Storage = {
  length: 0,
  key: (i: number) => Object.keys(mockStorageData)[i] ?? null,
  getItem: (key: string) => mockStorageData[key] ?? null,
  setItem: (key: string, value: string) => { mockStorageData[key] = value; },
  removeItem: (key: string) => { delete mockStorageData[key]; },
  clear: () => { Object.keys(mockStorageData).forEach((k) => delete mockStorageData[k]); }
};

globalThis.localStorage = mockLocalStorage;

const mockScript: DialogueNode[] = [
  {
    id: 'node_1',
    speaker: 'Narrator',
    text: 'You sit in the cold archive room.',
    background: 'archive_sublevel',
    nextNodeId: 'node_2',
  },
  {
    id: 'node_2',
    speaker: 'Dr. Vance',
    text: 'What should I do with Tape 09?',
    background: 'tape_deck_closeup',
    choices: [
      {
        id: 'play_tape',
        text: 'Insert Tape 09 and press play.',
        targetNodeId: 'node_tape_play',
        dreadDelta: 0.2,
        flagsToSet: { tapePlayed: true },
      },
      {
        id: 'inspect_recorder',
        text: 'Inspect the acoustic head first.',
        targetNodeId: 'node_inspect',
        dreadDelta: -0.05,
        flagsToSet: { inspectedAcoustics: true },
      },
    ],
  },
  {
    id: 'node_tape_play',
    speaker: 'Tape 09',
    text: 'Isaac... I know you are listening.',
    background: 'tape_deck_closeup',
    nextNodeId: 'node_ending_resonance',
  },
  {
    id: 'node_inspect',
    speaker: 'Dr. Vance',
    text: 'The heads are covered in a strange residue.',
    background: 'tape_deck_closeup',
    nextNodeId: 'node_ending_lucid',
  },
  {
    id: 'node_ending_resonance',
    speaker: 'System',
    text: 'You fade into the acoustic loop.',
    background: 'corrupted_void',
    endingId: 'deep_resonance',
  },
  {
    id: 'node_ending_lucid',
    speaker: 'System',
    text: 'You escape before the broadcast syncs.',
    background: 'lucid_dawn',
    endingId: 'lucid_escape',
  },
];

describe('VNStateMachine', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('should initialize with initial state and retrieve current node', () => {
    const sm = new VNStateMachine(mockScript, { ...INITIAL_STATE, currentNodeId: 'node_1' });
    const state = sm.getState();
    expect(state.currentNodeId).toBe('node_1');
    expect(state.dreadLevel).toBe(0.15);

    const currentNode = sm.getCurrentNode();
    expect(currentNode?.text).toBe('You sit in the cold archive room.');
  });

  it('should advance to the next node and record history', () => {
    const sm = new VNStateMachine(mockScript, { ...INITIAL_STATE, currentNodeId: 'node_1' });
    const advanced = sm.advance();

    expect(advanced).toBe(true);
    expect(sm.getState().currentNodeId).toBe('node_2');
    expect(sm.getState().history.length).toBe(1);
    expect(sm.getState().history[0].nodeId).toBe('node_1');
  });

  it('should not auto-advance when choices are present', () => {
    const sm = new VNStateMachine(mockScript, { ...INITIAL_STATE, currentNodeId: 'node_2' });
    const advanced = sm.advance();
    expect(advanced).toBe(false);
    expect(sm.getState().currentNodeId).toBe('node_2');
  });

  it('should execute choices, adjust dread level and set flags', () => {
    const sm = new VNStateMachine(mockScript, { ...INITIAL_STATE, currentNodeId: 'node_2' });
    const selected = sm.selectChoice(0); // Choose play_tape

    expect(selected).toBe(true);
    const state = sm.getState();
    expect(state.currentNodeId).toBe('node_tape_play');
    expect(state.dreadLevel).toBeCloseTo(0.35); // 0.15 + 0.2
    expect(state.flags.tapePlayed).toBe(true);
  });

  it('should transition to ending state when reaching ending node', () => {
    const sm = new VNStateMachine(mockScript, { ...INITIAL_STATE, currentNodeId: 'node_tape_play' });
    sm.advance(); // moves to node_ending_resonance

    const state = sm.getState();
    expect(state.currentNodeId).toBe('node_ending_resonance');
    expect(state.hasEnded).toBe(true);
    expect(state.endingId).toBe('deep_resonance');
  });

  it('should save and load game state faithfully', () => {
    const sm = new VNStateMachine(mockScript, { ...INITIAL_STATE, currentNodeId: 'node_1' });
    sm.advance(); // now at node_2
    sm.selectChoice(1); // chose inspect_recorder -> node_inspect

    const saveSuccess = sm.saveGame(1);
    expect(saveSuccess).toBe(true);

    const sm2 = new VNStateMachine(mockScript, INITIAL_STATE);
    expect(sm2.getState().currentNodeId).toBe('prologue_01');

    const loadSuccess = sm2.loadGame(1);
    expect(loadSuccess).toBe(true);
    expect(sm2.getState().currentNodeId).toBe('node_inspect');
    expect(sm2.getState().flags.inspectedAcoustics).toBe(true);
  });
});
