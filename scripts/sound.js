/**
 * Pecera Social - Procedural Web Audio Synthesizer
 * Zero external audio files required. Realistic bubbles, splashes, rumbling shake and fanfare.
 */

import { store } from './store.js';

class SoundSystem {
  constructor() {
    this.ctx = null;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isEnabled() {
    return Boolean(store.settings.soundEnabled);
  }

  // 1. Gentle Bubble / Bloop sound
  playBubble() {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Fast upward pitch glide for water bubble effect
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // 2. Water Splash when ticket enters the fishbowl
  playSplash() {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Synthesize quick filtered noise + water resonant tones
      [420, 640, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (i * 0.04));
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15 + (i * 0.04));

        gain.gain.setValueAtTime(0.15, now + (i * 0.04));
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22 + (i * 0.04));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + (i * 0.04));
        osc.stop(now + 0.25 + (i * 0.04));
      });
    } catch (e) {}
  }

  // 3. Shaking / Water Rumbling during raffle agitation
  playShaking(durationSeconds = 2.5) {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, now);
      // Frequency modulation for swishing water sound
      for (let i = 0; i < durationSeconds * 10; i++) {
        const t = now + (i * 0.1);
        osc.frequency.linearRampToValueAtTime(70 + (i % 2 === 0 ? 35 : -25), t);
      }

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
      gain.gain.setValueAtTime(0.22, now + durationSeconds - 0.4);
      gain.gain.linearRampToValueAtTime(0.001, now + durationSeconds);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + durationSeconds);
    } catch (e) {}
  }

  // 4. Celebratory Fanfare when the winning ticket is revealed
  playTada() {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Arpeggio notes: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, index) => {
        const noteTime = now + (index * 0.12);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        const duration = index === notes.length - 1 ? 0.9 : 0.25;
        gain.gain.setValueAtTime(0.28, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + duration + 0.05);
      });
    } catch (e) {}
  }

  // 5. Dramatic Versus Intro Impact
  playVersusGong() {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [130.81, 164.81, 196.00].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 1.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
      });
    } catch (e) {}
  }

  // 6. Versus clash / elimination sound
  playVersusClash() {
    if (!this.isEnabled()) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }
}

export const sound = new SoundSystem();
