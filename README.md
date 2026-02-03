# 🌀 System Collapse

> *"Every system wants to collapse. Some just need a little push."*

**System Collapse** is an experimental browser game where progress is decay. Every action you take destabilizes the world around you. Your goal isn't to win—it's to experience the most beautiful destruction possible before the system finally gives in.

Built for the **"Break It Beautifully"** Hackathon.

## 🎮 Play Now

[**▶️ Play System Collapse**](https://private-hack2.vercel.app/)

## 📖 Concept

What if breaking something could be more interesting than building it?

You control a simple avatar collecting targets. But every target you collect injects entropy into the system. There is no winning. Only delayed collapse.

**The question becomes: How far can you push it before it all falls apart?**

---

## 🔥 The Phases of Collapse

| Phase | Targets | Effects |
|-------|---------|---------|
| **I: Signal Degradation** | ~5 | Colors shift to ominous blues/purples, chromatic aberration splits visuals |
| **II: Temporal Instability** | ~10 | Time pulses unpredictably, physics oscillate, "ice physics" controls |
| **III: Hallucinations** | ~15 | Ghost targets appear (fake objectives), real targets evade capture |
| **IV: Reality Shear** | ~20 | Color inversion, maximum camera shake and visual distortion |
| **V: System Failure** | ~25 | Complete collapse. The simulation cannot sustain itself. |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Rendering:** Canvas 2D (Raw drawing for maximum control)
- **Audio:** Web Audio API (Procedural real-time synthesis)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Physics:** Custom 60Hz fixed-timestep simulation

## 🧠 Technical Highlights

- **Deterministic Chaos** — All mutations are derived from stress state, not RNG.
- **Fixed-Timestep Simulation** — 60Hz physics for consistent, reproducible behavior across devices.
- **Procedural Audio** — A reactive soundscape that intensifies alongside the system entropy.
- **Pure Engine** — Core game mechanics are decoupled from the UI framework.

---

## 🚀 Getting Started

The project is located in the `/app` directory.

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Setup & Development

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the collapse.

---

## 📁 Repository Structure

```
.
├── app/               # Main application and source code
│   ├── app/           # Next.js App Router
│   ├── src/
│   │   ├── engine/    # Custom Game Engine
│   │   ├── config/    # Gameplay constants
│   │   └── math/      # Vector and noise utilities
│   └── ...
├── LICENSE            # MIT License
├── CONTRIBUTING.md    # How to help break things
└── README.md          # You are here
```

## 🎨 Design Philosophy

1. **Player Agency** — The player causes the destruction. It's not random.
2. **Feedback Loops** — Actions have cascading consequences.
3. **Beauty in Failure** — Collapse looks and sounds intentional—not broken.
4. **60-Second Loop** — Short, intense, replayable sessions.

---

<p align="center">
  <strong>Break it beautifully. 🌀</strong>
</p>
