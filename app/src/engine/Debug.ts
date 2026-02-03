import { GameState } from './State';

export class Debug {
    active = false;

    constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'd') this.active = !this.active; // 'D' to toggle
            });
        }
    }

    draw(ctx: CanvasRenderingContext2D, state: GameState) {
        if (!this.active) return;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 60, 250, 150);

        ctx.fillStyle = '#0f0';
        ctx.font = '12px monospace';
        let y = 80;
        const line = (text: string) => { ctx.fillText(text, 20, y); y += 15; };

        line(`FPS: ?`); // Engine should provide FPS or calculate it
        line(`Time: ${state.t.toFixed(1)}`);
        line(`Stress: ${state.stress.value.toFixed(3)}`);
        line(`Repetition: ${state.stress.repetition.toFixed(3)}`);
        line(`Targets: ${state.targets.length}`);
        line(`Player: ${state.player.pos.x.toFixed(0)}, ${state.player.pos.y.toFixed(0)}`);

        // Draw stress bar
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(20, y, 200, 10);
        ctx.fillStyle = '#f00';
        ctx.fillRect(20, y, 200 * state.stress.value, 10);

        ctx.restore();
    }
}
