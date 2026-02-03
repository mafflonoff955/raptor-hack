import { Vec2 } from '../math/Vec2';

export interface Target {
    id: number;
    pos: Vec2;
    radius: number;
    value: number;
    phase: number;
    ghost?: boolean;
}

export interface StressState {
    value: number; // 0..1
    baseStress: number; // Floor
    repetition: number;
    window: Vec2[];
    lastMoveVec: Vec2;
}

export interface CollapseState {
    thresholdsHit: boolean[];
}

export interface GameState {
    t: number;
    score: number;
    gameOver: boolean;
    player: {
        pos: Vec2;
        vel: Vec2;
    };
    targets: Target[];
    stress: StressState;
    collapse: CollapseState;
}

export const createInitialState = (width: number, height: number): GameState => ({
    t: 0,
    score: 0,
    gameOver: false,
    player: {
        pos: new Vec2(width / 2, height / 2),
        vel: Vec2.zero,
    },
    targets: [],
    stress: {
        value: 0,
        baseStress: 0,
        repetition: 0,
        window: [],
        lastMoveVec: Vec2.zero,
    },
    collapse: {
        thresholdsHit: [false, false, false, false],
    },
});
