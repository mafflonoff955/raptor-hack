import { Tuning } from '../config/tuning';
import { Time } from './Time';
import { Input } from './Input';
import { Sim } from './Sim';
import { Render } from './Render';
import { Debug } from './Debug';
import { AudioSys } from './Audio';
import { Collapse } from './Collapse';
import { GameState, createInitialState } from './State';

export class Engine {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    running = false;

    time: Time;
    input: Input;
    sim: Sim;
    render: Render;
    debug: Debug;
    audio: AudioSys;
    collapse: Collapse;
    state: GameState;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No 2D context');
        this.ctx = ctx;

        this.time = new Time(Tuning.FixedStep, Tuning.MaxDt);
        this.input = new Input();
        this.sim = new Sim();
        this.render = new Render();
        this.debug = new Debug();
        this.audio = new AudioSys();
        this.collapse = new Collapse();

        this.resize();
        this.state = createInitialState(this.canvas.width, this.canvas.height);

        window.addEventListener('resize', () => this.resize());

        // Restart listener
        window.addEventListener('keydown', (e) => {
            if (this.state.gameOver && (e.key === 'r' || e.key === 'R')) {
                this.state = createInitialState(this.canvas.width, this.canvas.height);
                this.collapse = new Collapse();
            }
        });

        // Start audio on first interaction if needed
        const startAudio = () => {
            this.audio.start();
            window.removeEventListener('keydown', startAudio);
            window.removeEventListener('click', startAudio);
        };
        window.addEventListener('keydown', startAudio);
        window.addEventListener('click', startAudio);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.running = true;
        this.time.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    stop() {
        this.running = false;
    }

    loop(now: number) {
        if (!this.running) return;
        requestAnimationFrame((t) => this.loop(t));

        this.time.update(now);

        while (this.time.accumulator >= Tuning.FixedStep) {
            // Update collapse systems
            this.collapse.update(this.state);

            // Sim update
            this.sim.update(this.state, Tuning.FixedStep, this.input, this.canvas.width, this.canvas.height);

            this.time.accumulator -= Tuning.FixedStep;
        }

        // Audio update
        this.audio.update(this.state);

        this.render.draw(this.ctx, this.state, this.canvas.width, this.canvas.height);
        this.debug.draw(this.ctx, this.state);

        // Show 'start' hint?
        if (!this.audio.started) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px monospace';
            this.ctx.fillText('Press any key to start audio', this.canvas.width / 2 - 100, this.canvas.height - 50);
        }
    }
}
