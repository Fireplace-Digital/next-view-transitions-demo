"use client";

import { useEffect, useRef } from 'react';

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const noiseDataRef = useRef<ImageData[]>([]);
  const loopTimeoutRef = useRef<number>();
  const resizeThrottleRef = useRef<number>();

  const createNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imageData.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xff000000;
      }
    }

    noiseDataRef.current.push(imageData);
  };

  const paintNoise = (ctx: CanvasRenderingContext2D) => {
    if (frameRef.current === 9) {
      frameRef.current = 0;
    } else {
      frameRef.current++;
    }

    ctx.putImageData(noiseDataRef.current[frameRef.current], 0, 0);
  };

  const loop = (ctx: CanvasRenderingContext2D) => {
    paintNoise(ctx);

    loopTimeoutRef.current = window.setTimeout(() => {
      window.requestAnimationFrame(() => loop(ctx));
    }, 1000 / 25);
  };

  const setup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Clear previous noise data
    noiseDataRef.current = [];

    // Create new noise frames
    for (let i = 0; i < 10; i++) {
      createNoise(ctx, width, height);
    }

    loop(ctx);
  };

  useEffect(() => {
    setup();

    const handleResize = () => {
      window.clearTimeout(resizeThrottleRef.current);

      resizeThrottleRef.current = window.setTimeout(() => {
        window.clearTimeout(loopTimeoutRef.current);
        setup();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(loopTimeoutRef.current);
      window.clearTimeout(resizeThrottleRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="noise"
      className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.15] mix-blend-overlay"
      aria-hidden="true"
    />
  );
}
