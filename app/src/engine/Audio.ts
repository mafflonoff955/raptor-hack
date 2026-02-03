import { GameState } from './State';
import { Tuning } from '../config/tuning';

export class AudioSys {
    ctx: AudioContext | null = null;
    masterGain: GainNode | null = null;

    // Voices
    oscA: OscillatorNode | null = null;
    oscB: OscillatorNode | null = null;
    filter: BiquadFilterNode | null = null;

    started = false;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.masterGain = this.ctx.createGain();
                this.masterGain.connect(this.ctx.destination);
                this.masterGain.gain.value = 0.1; // Low volume

                this.filter = this.ctx.createBiquadFilter();
                this.filter.type = 'lowpass';
                this.filter.frequency.value = 800;
                this.filter.connect(this.masterGain);
            }
        }
    }

    async start() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        if (this.started) return;

        if (this.filter) {
            // Drone A
            this.oscA = this.ctx.createOscillator();
            this.oscA.type = 'triangle';
            this.oscA.frequency.value = 220;
            this.oscA.connect(this.filter);
            this.oscA.start();

            // Drone B
            this.oscB = this.ctx.createOscillator();
            this.oscB.type = 'sine';
            this.oscB.frequency.value = 110;
            this.oscB.connect(this.filter);
            this.oscB.start();
        }

        this.started = true;
    }

    update(state: GameState) {
        if (!this.ctx || !this.started || !this.oscA || !this.oscB || !this.filter) return;

        const s = state.stress.value;

        // Detune based on stress
        // 30 cents * stress^2
        const detune = Math.pow(s, 2) * 50 * Math.sin(state.t * 3);
        this.oscA.detune.value = detune;
        this.oscB.detune.value = -detune;

        // Filter cutoff (darker as stressed? No, usually brighter/harsher)
        // Plan says "lerp(1200, 200, stress) (darker as stressed)"
        // Okay, darkening -> shutting down.
        const cutoff = 1200 - s * 1000;
        this.filter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.1);

        // Freq modulation?
        // Base pitch modulation by score?
        // Let's keep it simple drone.
    }
}
