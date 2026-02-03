import { StressState, GameState } from './State';
import { Tuning } from '../config/tuning';
import { Vec2 } from '../math/Vec2';

export class Stress {
    update(state: GameState, dt: number, inputDir: Vec2) {
        const { stress } = state;

        // push current normalized input to window ONLY if pressing keys
        if (inputDir.magSq() > 0) {
            const moveDir = inputDir.normalize();
            stress.window.push(moveDir);
            if (stress.window.length > Tuning.RepetitionWindowSize) {
                stress.window.shift();
            }
        }

        // Calculate repetition
        let repetition = 0;
        if (stress.window.length > 5) {
            let sum = Vec2.zero;
            for (const v of stress.window) sum = sum.add(v);
            const avgDir = sum.normalize();

            if (stress.window.length > 0) {
                const latest = stress.window[stress.window.length - 1];
                repetition = (latest.dot(avgDir) + 1) / 2;
            }
        }

        stress.repetition = repetition;

        // Stress dynamics
        const t = (repetition - 0.7) / (0.95 - 0.7);
        const curve = Math.max(0, Math.min(1, t)); // clamp 0..1

        const isIdle = inputDir.magSq() === 0;

        // Force 0 gain if idle
        const gain = isIdle ? 0 : (curve * Tuning.StressGain * dt);

        const isNovel = repetition < 0.8;

        let recovery = 0;
        if (isNovel) recovery += Tuning.StressRecovery * dt;
        if (isIdle) recovery += Tuning.StressRecovery * 0.5 * dt; // Bonus recovery for pausing

        // Apply changes
        stress.value += gain;
        stress.value -= recovery;

        // Clamp
        if (stress.value < stress.baseStress) stress.value = stress.baseStress;
        if (stress.value > 1) stress.value = 1;
    }
}
