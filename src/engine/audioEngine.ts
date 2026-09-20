/**
 * Procedural Web Audio Engine for Psychological Horror
 * Generates binaural beats, magnetic tape wow/flutter, heartbeat arrhythmia,
 * and Poisson Geiger clicks without external audio dependencies.
 */

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private ctx: AudioContext | null = null;

  // Master Gain & Mute
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentVolume: number = 0.8;

  // Binaural Beat Oscillators
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private driftLfo: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;

  // Tape Degradation Nodes
  private tapeInput: GainNode | null = null;
  private tapeOutput: GainNode | null = null;
  private wowOsc: OscillatorNode | null = null;
  private wowGain: GainNode | null = null;
  private flutterOsc: OscillatorNode | null = null;
  private flutterGain: GainNode | null = null;
  private tapeDelay: DelayNode | null = null;
  private tapeHeadFilter: BiquadFilterNode | null = null;
  private hissGain: GainNode | null = null;
  private hissSource: AudioBufferSourceNode | null = null;

  // Heartbeat Scheduler
  private heartbeatGain: GainNode | null = null;
  private heartbeatFilter: BiquadFilterNode | null = null;
  private isHeartbeatRunning: boolean = false;
  private heartbeatTimerId: number | null = null;
  private nextBeatTime: number = 0;
  private dreadValue: number = 0.0;

  // Geiger Counter (Poisson point process)
  private isGeigerRunning: boolean = false;
  private geigerLambda: number = 2.0; // average clicks per sec
  private geigerTimerId: number | null = null;
  private geigerGain: GainNode | null = null;

  // Radio Static
  private staticGain: GainNode | null = null;
  private staticFilter: BiquadFilterNode | null = null;
  private staticSource: AudioBufferSourceNode | null = null;

  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  public async init(): Promise<void> {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('Web Audio API not supported in this browser.');
      return;
    }

    this.ctx = new AudioContextClass();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    // 1. Master Output Chain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    
    // Compressor limiter to prevent clipping
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-6, this.ctx.currentTime);
    compressor.knee.setValueAtTime(12, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain.connect(compressor);
    compressor.connect(this.ctx.destination);

    // 2. Build Tape Degradation Bus
    this.initTapeBus();

    // 3. Build Binaural Subsystem
    this.initBinauralDrone();

    // 4. Build Heartbeat Subsystem
    this.initHeartbeat();

    // 5. Build Geiger & Static Subsystem
    this.initHazardTextures();

    this.isInitialized = true;
  }

  private initTapeBus(): void {
    if (!this.ctx || !this.masterGain) return;

    this.tapeInput = this.ctx.createGain();
    this.tapeOutput = this.ctx.createGain();

    // Delay line for wow/flutter modulation
    this.tapeDelay = this.ctx.createDelay(0.5);
    this.tapeDelay.delayTime.setValueAtTime(0.04, this.ctx.currentTime);

    // Wow LFO (0.45 Hz slow pitch bend)
    this.wowOsc = this.ctx.createOscillator();
    this.wowOsc.type = 'sine';
    this.wowOsc.frequency.setValueAtTime(0.45, this.ctx.currentTime);

    this.wowGain = this.ctx.createGain();
    this.wowGain.gain.setValueAtTime(0.002, this.ctx.currentTime);
    this.wowOsc.connect(this.wowGain);
    this.wowGain.connect(this.tapeDelay.delayTime);

    // Flutter LFO (8.2 Hz rapid flutter)
    this.flutterOsc = this.ctx.createOscillator();
    this.flutterOsc.type = 'triangle';
    this.flutterOsc.frequency.setValueAtTime(8.2, this.ctx.currentTime);

    this.flutterGain = this.ctx.createGain();
    this.flutterGain.gain.setValueAtTime(0.0006, this.ctx.currentTime);
    this.flutterOsc.connect(this.flutterGain);
    this.flutterGain.connect(this.tapeDelay.delayTime);

    // WaveShaper soft saturation (tanh curve)
    const saturator = this.ctx.createWaveShaper();
    saturator.curve = this.createTanhCurve(2048, 2.4);
    saturator.oversample = '4x';

    // Head loss filter
    this.tapeHeadFilter = this.ctx.createBiquadFilter();
    this.tapeHeadFilter.type = 'lowpass';
    this.tapeHeadFilter.frequency.setValueAtTime(7000, this.ctx.currentTime);
    this.tapeHeadFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // Connect tape signal chain
    this.tapeInput.connect(this.tapeDelay);
    this.tapeDelay.connect(saturator);
    saturator.connect(this.tapeHeadFilter);
    this.tapeHeadFilter.connect(this.tapeOutput);
    this.tapeOutput.connect(this.masterGain);

    // Start tape LFOs
    this.wowOsc.start();
    this.flutterOsc.start();

    // Init continuous tape hiss
    this.initTapeHiss();
  }

  private createTanhCurve(samples: number, drive: number): Float32Array {
    const curve = new Float32Array(samples);
    const norm = Math.tanh(drive);
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = Math.tanh(drive * x) / norm;
    }
    return curve;
  }

  private initTapeHiss(): void {
    if (!this.ctx || !this.tapeOutput) return;

    const bufferSize = this.ctx.sampleRate * 3; // 3 sec loop
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink noise filter algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
      b6 = white * 0.115926;
    }

    this.hissSource = this.ctx.createBufferSource();
    this.hissSource.buffer = buffer;
    this.hissSource.loop = true;

    const hissHpf = this.ctx.createBiquadFilter();
    hissHpf.type = 'highpass';
    hissHpf.frequency.setValueAtTime(400, this.ctx.currentTime);

    const hissPeak = this.ctx.createBiquadFilter();
    hissPeak.type = 'peaking';
    hissPeak.frequency.setValueAtTime(3600, this.ctx.currentTime);
    hissPeak.gain.setValueAtTime(4.0, this.ctx.currentTime);
    hissPeak.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.hissGain = this.ctx.createGain();
    this.hissGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.hissSource.connect(hissHpf);
    hissHpf.connect(hissPeak);
    hissPeak.connect(this.hissGain);
    this.hissGain.connect(this.tapeOutput);

    this.hissSource.start();
  }

  private initBinauralDrone(): void {
    if (!this.ctx || !this.tapeInput) return;

    const merger = this.ctx.createChannelMerger(2);
    const leftGain = this.ctx.createGain();
    const rightGain = this.ctx.createGain();
    const subGain = this.ctx.createGain();

    leftGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    rightGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    subGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    subGain.connect(merger, 0, 0);
    subGain.connect(merger, 0, 1);

    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    merger.connect(this.binauralGain);
    this.binauralGain.connect(this.tapeInput);

    // Left Ear 108 Hz
    this.leftOsc = this.ctx.createOscillator();
    this.leftOsc.type = 'sine';
    this.leftOsc.frequency.setValueAtTime(108, this.ctx.currentTime);

    // Right Ear 114 Hz (6 Hz theta beat)
    this.rightOsc = this.ctx.createOscillator();
    this.rightOsc.type = 'sine';
    this.rightOsc.frequency.setValueAtTime(114, this.ctx.currentTime);

    // Sub-octave 54 Hz triangle wave
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'triangle';
    this.subOsc.frequency.setValueAtTime(54, this.ctx.currentTime);

    // Micro drift LFO
    this.driftLfo = this.ctx.createOscillator();
    this.driftLfo.frequency.setValueAtTime(0.04, this.ctx.currentTime);
    const driftGain = this.ctx.createGain();
    driftGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.driftLfo.connect(driftGain);
    driftGain.connect(this.leftOsc.frequency);

    this.leftOsc.connect(leftGain);
    this.rightOsc.connect(rightGain);
    this.subOsc.connect(subGain);

    this.leftOsc.start();
    this.rightOsc.start();
    this.subOsc.start();
    this.driftLfo.start();

    // Smooth fade in
    this.binauralGain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + 3.0);
  }

  private initHeartbeat(): void {
    if (!this.ctx || !this.masterGain) return;

    this.heartbeatGain = this.ctx.createGain();
    this.heartbeatGain.gain.setValueAtTime(0.9, this.ctx.currentTime);

    this.heartbeatFilter = this.ctx.createBiquadFilter();
    this.heartbeatFilter.type = 'lowpass';
    this.heartbeatFilter.frequency.setValueAtTime(95, this.ctx.currentTime);
    this.heartbeatFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.heartbeatFilter.connect(this.heartbeatGain);
    this.heartbeatGain.connect(this.masterGain);

    this.isHeartbeatRunning = true;
    this.nextBeatTime = this.ctx.currentTime + 0.1;
    this.heartbeatScheduler();
  }

  private heartbeatScheduler = (): void => {
    if (!this.isHeartbeatRunning || !this.ctx) return;

    const lookahead = 0.15;
    while (this.nextBeatTime < this.ctx.currentTime + lookahead) {
      this.triggerCardiacCycle(this.nextBeatTime);

      const bpm = 54 + Math.pow(this.dreadValue, 1.3) * 110;
      let interval = 60 / bpm;

      if (this.dreadValue > 0.45) {
        const jitter = (Math.random() * 2 - 1) * (this.dreadValue - 0.45) * 0.15 * interval;
        interval += jitter;
      }
      this.nextBeatTime += interval;
    }

    this.heartbeatTimerId = window.setTimeout(this.heartbeatScheduler, 50);
  };

  private triggerCardiacCycle(time: number): void {
    if (!this.ctx || !this.heartbeatFilter) return;

    // S1 "Lub"
    const s1Start = 64 + this.dreadValue * 20;
    const s1Duration = 0.12 - this.dreadValue * 0.02;
    this.triggerHeartThud(time, s1Start, 35, s1Duration, 1.0);

    // S2 "Dub"
    const s2Offset = 0.28 * (60 / (54 + this.dreadValue * 110));
    const s2Start = 88 + this.dreadValue * 28;
    const s2Duration = 0.09 - this.dreadValue * 0.015;
    this.triggerHeartThud(time + s2Offset, s2Start, 44, s2Duration, 0.7);
  }

  private triggerHeartThud(time: number, startFreq: number, endFreq: number, duration: number, scale: number): void {
    if (!this.ctx || !this.heartbeatFilter) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.85 * scale, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.heartbeatFilter);

    osc.start(time);
    osc.stop(time + duration + 0.01);
  }

  private initHazardTextures(): void {
    if (!this.ctx || !this.tapeInput || !this.masterGain) return;

    // Geiger bus
    this.geigerGain = this.ctx.createGain();
    this.geigerGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    this.geigerGain.connect(this.masterGain);

    this.isGeigerRunning = true;
    this.scheduleGeiger();

    // Radio Static bus
    this.staticGain = this.ctx.createGain();
    this.staticGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    this.staticFilter = this.ctx.createBiquadFilter();
    this.staticFilter.type = 'bandpass';
    this.staticFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
    this.staticFilter.Q.setValueAtTime(5.0, this.ctx.currentTime);

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    this.staticSource = this.ctx.createBufferSource();
    this.staticSource.buffer = buffer;
    this.staticSource.loop = true;
    this.staticSource.connect(this.staticFilter);
    this.staticFilter.connect(this.staticGain);
    this.staticGain.connect(this.tapeInput);
    this.staticSource.start();
  }

  private scheduleGeiger = (): void => {
    if (!this.isGeigerRunning || !this.ctx) return;

    const u = Math.random();
    const dt = -Math.log(1.0 - u) / this.geigerLambda;
    this.triggerGeigerClick(this.ctx.currentTime + dt);

    this.geigerTimerId = window.setTimeout(this.scheduleGeiger, Math.min(dt * 1000, 2000));
  };

  private triggerGeigerClick(time: number): void {
    if (!this.ctx || !this.geigerGain) return;

    const len = Math.floor(this.ctx.sampleRate * 0.002);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.3));
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(2900 + (Math.random() * 2 - 1) * 400, time);
    bpf.Q.setValueAtTime(22.0, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, time);

    src.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.geigerGain);

    src.start(time);
    src.stop(time + 0.03);
  }

  // ==========================================
  // PUBLIC CONTROLS & DREAD MAPPING
  // ==========================================

  public setDread(dread: number): void {
    this.dreadValue = Math.max(0, Math.min(1, dread));
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Heartbeat filter open
    if (this.heartbeatFilter) {
      const targetCutoff = 95 + this.dreadValue * 180;
      this.heartbeatFilter.frequency.linearRampToValueAtTime(targetCutoff, now + 0.3);
      this.heartbeatFilter.Q.linearRampToValueAtTime(2.0 + this.dreadValue * 3.0, now + 0.3);
    }

    // 2. Tape wear & hiss
    if (this.wowGain && this.flutterGain && this.tapeHeadFilter && this.hissGain) {
      this.wowGain.gain.linearRampToValueAtTime(0.0015 + this.dreadValue * 0.006, now + 0.5);
      this.flutterGain.gain.linearRampToValueAtTime(0.0004 + this.dreadValue * 0.002, now + 0.5);
      this.tapeHeadFilter.frequency.linearRampToValueAtTime(7500 - this.dreadValue * 4500, now + 0.5);
      this.hissGain.gain.linearRampToValueAtTime(0.03 + this.dreadValue * 0.08, now + 0.5);
    }

    // 3. Binaural theta shift (6 Hz down to disorienting 4 Hz)
    if (this.rightOsc && this.leftOsc) {
      const base = this.leftOsc.frequency.value;
      const beatOffset = 6.0 - this.dreadValue * 1.8;
      this.rightOsc.frequency.linearRampToValueAtTime(base + beatOffset, now + 1.0);
    }

    // 4. Geiger intensity
    this.geigerLambda = 1.5 + Math.pow(this.dreadValue, 2.2) * 65;

    // 5. Radio static volume
    if (this.staticGain) {
      const staticVol = this.dreadValue > 0.4 ? (this.dreadValue - 0.4) * 0.35 : 0.0;
      this.staticGain.gain.linearRampToValueAtTime(staticVol, now + 0.5);
    }
  }

  public playSfx(sfx: string): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    switch (sfx) {
      case 'tape_play': {
        this.synthesizeClick(now, 1200, 0.4);
        setTimeout(() => this.synthesizeClick(now + 0.05, 600, 0.6), 50);
        break;
      }
      case 'tape_stop': {
        this.synthesizeClick(now, 800, 0.7);
        break;
      }
      case 'door_heavy_slam': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);
        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.65);
        break;
      }
      case 'glitch_click': {
        this.synthesizeClick(now, 3200 + Math.random() * 800, 0.5);
        break;
      }
      case 'phone_ring': {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.3);
        osc2.stop(now + 1.3);
        break;
      }
      case 'metallic_screech': {
        this.triggerResonanceBurst(380, 2.0, 0.9);
        break;
      }
    }
  }

  public triggerResonanceBurst(baseFreq: number = 440, duration: number = 2.0, intensity: number = 1.0): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const modalRatios = [1.0, 1.414, 1.732, 2.414];

    const noiseLen = Math.floor(this.ctx.sampleRate * 0.04);
    const buf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.001, now);
    master.gain.linearRampToValueAtTime(0.5 * intensity, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    master.connect(this.masterGain);

    modalRatios.forEach((r, idx) => {
      if (!this.ctx) return;
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(baseFreq * r, now);
      bpf.Q.setValueAtTime(30.0 / (idx + 1), now);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(1.0 / (idx + 1), now);

      noise.connect(bpf);
      bpf.connect(g);
      g.connect(master);
    });

    noise.start(now);
    noise.stop(now + 0.05);
  }

  private synthesizeClick(time: number, freq: number, vol: number): void {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.035);
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume, this.ctx.currentTime + 0.1);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0.0 : this.currentVolume;
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.1);
    }
    return this.isMuted;
  }

  public cleanup(): void {
    if (this.heartbeatTimerId) clearTimeout(this.heartbeatTimerId);
    if (this.geigerTimerId) clearTimeout(this.geigerTimerId);
  }
}

export const audioEngine = AudioEngine.getInstance();
