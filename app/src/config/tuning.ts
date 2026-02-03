export const Tuning = {
    // Sim
    FixedStep: 1 / 60,
    MaxDt: 0.1,

    // Player
    PlayerSpeed: 400,
    PlayerRadius: 15,
    PlayerDrag: 0.9, // Friction-like

    // Targets
    TargetCount: 5,
    TargetRadius: 10,
    TargetBaseScore: 100,

    // Stress
    StressGain: 0.08, // Balanced fill
    StressRecovery: 0.20, // Fast recovery
    RepetitionWindowSize: 40, // Balanced window

    // Visuals
    BackgroundColor: '#111',
    PlayerColor: '#fff',
    TargetColor: '#f00',
};
