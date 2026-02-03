import { GameState } from './State';
import { Tuning } from '../config/tuning';
import { Vec2 } from '../math/Vec2';

export class Mutations {
    // Returns friction modifier (1.0 = normal, < 1.0 = slippery)
    static getFrictionMod(state: GameState): number {
        const s = state.stress.value;
        // At 0 stress, friction mod is 1.0
        // At 1.0 stress, friction mod is 0.05 (ice)
        return 1.0 - (s * 0.95);
    }
}
