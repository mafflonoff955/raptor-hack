import { GameState, Target } from './State';
import { Tuning } from '../config/tuning';
import { Input } from './Input';
import { Vec2 } from '../math/Vec2';
import { Stress } from './Stress';
import { Mutations } from './Mutations';

export class Sim {
    stressSystem = new Stress();
    teleportTimer = 0;

    update(state: GameState, dt: number, input: Input, width: number, height: number) {
        if (state.gameOver) return; // Stop updates on game over

        state.t += dt;

        // Random teleport every 3 seconds - ONLY in final phase (T4: stress > 0.61)
        if (state.stress.value > 0.61) {
            this.teleportTimer += dt;
            if (this.teleportTimer >= 3.0) {
                this.teleportTimer = 0;
                const margin = 50;
                state.player.pos = new Vec2(
                    margin + Math.random() * (width - 2 * margin),
                    margin + Math.random() * (height - 2 * margin)
                );
                // Reset velocity on teleport for smoother feel
                state.player.vel = Vec2.zero;
            }
        } else {
            this.teleportTimer = 0; // Reset timer when not in final phase
        }

        // Check Collapse Complete
        if (state.stress.value >= 1.0) {
            state.gameOver = true;
            return;
        }

        // Input
        const rawDir = input.getRawDir();

        // Update stress with Input Direction (fix idle death)
        this.stressSystem.update(state, dt, rawDir);

        const frictionMod = Mutations.getFrictionMod(state);

        // Physics
        const accel = 2000;

        // Apply Acceleration
        if (rawDir.magSq() > 0) {
            state.player.vel = state.player.vel.add(rawDir.mul(accel * dt));
        }

        // Apply Drag
        let dragCoeff = 0.85 + (1.0 - frictionMod) * 0.145;

        // PHASE 2: Time Dilation (0.4+)
        // Pulse the physics drag to simulate time warping
        if (state.stress.value > 0.4) {
            const pulse = Math.sin(state.t * 3) * 0.5 + 0.5; // 0..1
            // Warps drag between normal and "sticky"
            dragCoeff -= (pulse * 0.1 * (state.stress.value - 0.4));
        }

        const timeAdjustedDrag = Math.pow(dragCoeff, dt * 60);

        state.player.vel = state.player.vel.mul(timeAdjustedDrag);

        // Integrate pos
        state.player.pos = state.player.pos.add(state.player.vel.mul(dt));

        // Bounds check (bounce?)
        const bounce = -0.5;
        if (state.player.pos.x < 0) { state.player.pos.x = 0; state.player.vel.x *= bounce; }
        if (state.player.pos.x > width) { state.player.pos.x = width; state.player.vel.x *= bounce; }
        if (state.player.pos.y < 0) { state.player.pos.y = 0; state.player.vel.y *= bounce; }
        if (state.player.pos.y > height) { state.player.pos.y = height; state.player.vel.y *= bounce; }

        // Targets
        this.updateTargets(state, width, height, dt);
    }

    updateTargets(state: GameState, width: number, height: number, dt: number) {
        const maxTargets = Tuning.TargetCount;

        if (state.targets.length < maxTargets) {
            this.spawnTarget(state, width, height, false);
        }

        if (state.stress.value > 0.6) {
            const ghostCount = state.targets.filter(t => t.ghost).length;
            if (ghostCount < 3 && Math.random() < 0.05) {
                this.spawnTarget(state, width, height, true);
            }
        }

        const stress = state.stress.value;

        for (let i = state.targets.length - 1; i >= 0; i--) {
            const t = state.targets[i];

            // Jitter
            if (stress > 0.4) {
                const jitter = new Vec2((Math.random() - 0.5) * stress * 2, (Math.random() - 0.5) * stress * 2);
                t.pos = t.pos.add(jitter);
            }

            // Evade
            if (stress > 0.7) {
                const disp = t.pos.sub(state.player.pos);
                const dist = disp.mag();
                if (dist < 150) {
                    const flee = disp.normalize().mul(100 * dt * stress);
                    t.pos = t.pos.add(flee);
                    if (t.pos.x < 0) t.pos.x = 0;
                    if (t.pos.x > width) t.pos.x = width;
                    if (t.pos.y < 0) t.pos.y = 0;
                    if (t.pos.y > height) t.pos.y = height;
                }
            }

            // Collision
            if (state.player.pos.dist(t.pos) < (Tuning.PlayerRadius + t.radius)) {
                if (t.ghost) {
                    state.stress.value += 0.05;
                } else {
                    state.score += t.value;
                    // ENTROPY
                    state.stress.baseStress += 0.04; // After ~25 targets, floor is 1.0
                    if (state.stress.baseStress > 1.0) state.stress.baseStress = 1.0;
                }
                state.targets.splice(i, 1);
            }
        }
    }

    spawnTarget(state: GameState, w: number, h: number, isGhost: boolean) {
        const i = state.score + state.targets.length + state.t;
        const x = (Math.sin(i * 0.1) * 0.5 + 0.5) * (w - 100) + 50;
        const y = (Math.cos(i * 1.3) * 0.5 + 0.5) * (h - 100) + 50;

        state.targets.push({
            id: Math.floor(i),
            pos: new Vec2(x, y),
            radius: Tuning.TargetRadius,
            value: Tuning.TargetBaseScore,
            phase: i,
            ghost: isGhost
        });
    }
}
