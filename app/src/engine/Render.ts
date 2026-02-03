import { GameState } from './State';
import { Tuning } from '../config/tuning';

export class Render {
    draw(ctx: CanvasRenderingContext2D, state: GameState, width: number, height: number) {
        const stress = state.stress.value;

        // PHASE 4: Reality Shear (Invert)
        if (stress > 0.8) {
            ctx.filter = 'invert(1) hue-rotate(180deg)';
        } else {
            ctx.filter = 'none';
        }

        // PHASE 1: Color Shift (Background)
        // Dark -> Navy (0.2) -> Purple (0.5) -> Red (0.9)
        let bg = Tuning.BackgroundColor;
        if (stress > 0.2) {
            // Very hacky HSL interpolation for "Wild" colors
            const t = (stress - 0.2) / 0.8;
            // Hue: 240 (Blue) -> 300 (Purple) -> 0 (Red)
            // 240 + t * 120? No.
            // Let's use RGB blending or hsl
            const h = 240 - (t * 240); // 240 -> 0
            const l = 5 + t * 10; // 5% -> 15% brightness
            bg = `hsl(${h}, 50%, ${l}%)`;
        }

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Save for camera shake
        ctx.save();

        if (stress > 0.05 && !state.gameOver) {
            const shakeAmp = Math.pow(stress, 2) * 20;
            const dx = Math.sin(state.t * 15) * shakeAmp;
            const dy = Math.cos(state.t * 17) * shakeAmp;
            ctx.translate(dx, dy);
        }

        // Player - Fluid morphing blob ONLY in final phase (T4: stress > 0.61)
        if (!state.gameOver) {
            const inFinalPhase = stress > 0.61;

            const drawFluidBlob = (x: number, y: number, baseRadius: number, color: string) => {
                ctx.fillStyle = color;
                ctx.beginPath();

                const numPoints = 32;
                for (let i = 0; i <= numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;

                    // Multiple sine waves at different frequencies for organic fluid look
                    const wave1 = Math.sin(angle * 3 + state.t * 4) * 3;
                    const wave2 = Math.sin(angle * 5 + state.t * 2.5) * 2;
                    const wave3 = Math.sin(angle * 7 + state.t * 3.5) * 1.5;
                    const wave4 = Math.cos(angle * 4 + state.t * 5) * 2;

                    const radiusOffset = wave1 + wave2 + wave3 + wave4;
                    const r = baseRadius + radiusOffset;

                    const px = x + Math.cos(angle) * r;
                    const py = y + Math.sin(angle) * r;

                    if (i === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.closePath();
                ctx.fill();
            };

            const drawCircle = (x: number, y: number, radius: number, color: string) => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            };

            // PHASE 1+: Chromatic Aberration
            if (stress > 0.2) {
                const off = stress * 4;
                ctx.globalCompositeOperation = 'screen';

                if (inFinalPhase) {
                    drawFluidBlob(state.player.pos.x - off, state.player.pos.y, Tuning.PlayerRadius, '#f00');
                    drawFluidBlob(state.player.pos.x, state.player.pos.y, Tuning.PlayerRadius, '#0f0');
                    drawFluidBlob(state.player.pos.x + off, state.player.pos.y, Tuning.PlayerRadius, '#00f');
                } else {
                    drawCircle(state.player.pos.x - off, state.player.pos.y, Tuning.PlayerRadius, '#f00');
                    drawCircle(state.player.pos.x, state.player.pos.y, Tuning.PlayerRadius, '#0f0');
                    drawCircle(state.player.pos.x + off, state.player.pos.y, Tuning.PlayerRadius, '#00f');
                }

                ctx.globalCompositeOperation = 'source-over';
            } else {
                drawCircle(state.player.pos.x, state.player.pos.y, Tuning.PlayerRadius, Tuning.PlayerColor);
            }
        }

        // Targets
        for (const t of state.targets) {
            ctx.beginPath();
            const r = t.radius + Math.sin(state.t * 5 + t.phase) * 2;

            if (t.ghost) {
                ctx.strokeStyle = '#666'; // Dim color for ghost
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]); // Dashed
                ctx.arc(t.pos.x, t.pos.y, r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            } else {
                ctx.fillStyle = Tuning.TargetColor;
                ctx.arc(t.pos.x, t.pos.y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();

        // UI Overlay
        this.drawUI(ctx, state, width, height);
    }

    drawUI(ctx: CanvasRenderingContext2D, state: GameState, w: number, h: number) {
        if (state.gameOver) {
            ctx.fillStyle = 'rgba(50, 0, 0, 0.8)';
            ctx.fillRect(0, 0, w, h);

            ctx.fillStyle = '#f00';
            ctx.font = 'bold 48px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('COLLAPSE COMPLETE', w / 2, h / 2 - 20);

            ctx.fillStyle = '#fff';
            ctx.font = '24px monospace';
            ctx.fillText(`Final Score: ${state.score}`, w / 2, h / 2 + 30);
            ctx.fillText('Press R to Reboot', w / 2, h / 2 + 70);
            return;
        }

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.font = '20px monospace';
        ctx.fillText(`Score: ${state.score}`, 20, 30);

        // Danger bar
        const barW = 200;
        const barH = 10;
        const barX = w / 2 - barW / 2;
        const barY = 30;

        ctx.strokeStyle = '#555';
        ctx.strokeRect(barX, barY, barW, barH);

        // Color gradient for stress
        const s = state.stress.value;
        ctx.fillStyle = s > 0.8 ? '#f00' : (s > 0.4 ? '#ff0' : '#0f0');
        ctx.fillRect(barX, barY, barW * s, barH);

        ctx.font = '12px monospace';
        ctx.fillStyle = '#ccc';
        ctx.fillText('SYSTEM INSTABILITY', barX, barY - 5);
    }
}
