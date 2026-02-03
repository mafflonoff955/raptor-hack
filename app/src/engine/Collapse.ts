import { GameState } from './State';

export class Collapse {
    static Thresholds = [
        { value: 0.23, id: 'T1' },  // Was 0.35, reduced by 1.5x
        { value: 0.40, id: 'T2' },  // Was 0.60, reduced by 1.5x
        { value: 0.53, id: 'T3' },  // Was 0.80, reduced by 1.5x
        { value: 0.61, id: 'T4' },  // Was 0.92, reduced by 1.5x
    ];

    update(state: GameState) {
        const s = state.stress.value;

        // Check thresholds
        // thresholdsHit is currently boolean[]? State definition said boolean[]
        // Let's use indices 0..3

        // We assume state.collapse.thresholdsHit is initialized to false[] size 4?
        // Or we resize it.

        for (let i = 0; i < Collapse.Thresholds.length; i++) {
            if (!state.collapse.thresholdsHit[i] && s >= Collapse.Thresholds[i].value) {
                state.collapse.thresholdsHit[i] = true;
                // Optionally could trigger sound event here if return true
            }
        }
    }

    static getLevel(state: GameState): number {
        return state.collapse.thresholdsHit.filter(x => x).length;
    }
}
