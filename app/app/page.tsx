'use client';

import { useEffect, useRef } from 'react';
import { Engine } from '../src/engine/Engine';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Prevent double init in Strict Mode
    if (engineRef.current) return;

    const engine = new Engine(canvasRef.current);
    engineRef.current = engine;

    engine.start();

    // Cleanup?
    return () => {
      engine.stop();
      // engineRef.current = null; // Maybe keep it to avoid flicker?
    };
  }, []);

  return (
    <main className="w-full h-full overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </main>
  );
}
