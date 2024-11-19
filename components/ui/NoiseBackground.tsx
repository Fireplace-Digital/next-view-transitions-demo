"use client";

import { useEffect, useRef } from 'react';

export function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const noiseDataRef = useRef<ImageData[]>([]);
  const loopTimeoutRef = useRef<number>();
  const resizeThrottleRef = useRef<number>();

  const createNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    console.log('Creating noise frame...');
    const idata = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(idata.data.buffer);
    const len = buffer32.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.5) {
        buffer32[i] = 0xff000000;
      }
    }

    noiseDataRef.current.push(idata);
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
    console.log('Setting up noise effect...');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Scale down the canvas size to create bigger pixels
    const scale = 2; // Increase this number for bigger pixels
    const width = Math.floor(window.innerWidth / scale);
    const height = Math.floor(window.innerHeight / scale);

    console.log(`Canvas dimensions: ${width}x${height}`);

    canvas.width = width;
    canvas.height = height;

    // Set CSS size to full window size for scaling
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    // Use nearest-neighbor scaling for sharp pixels
    ctx.imageSmoothingEnabled = false;

    // Clear previous noise data
    noiseDataRef.current = [];

    // Create new noise frames
    for (let i = 0; i < 10; i++) {
      createNoise(ctx, width, height);
    }

    console.log(`Created ${noiseDataRef.current.length} noise frames`);
    loop(ctx);
  };

  useEffect(() => {
    console.log('NoiseBackground component mounted');
    setup();

    const handleResize = () => {
      console.log('Window resized');
      window.clearTimeout(resizeThrottleRef.current);

      resizeThrottleRef.current = window.setTimeout(() => {
        window.clearTimeout(loopTimeoutRef.current);
        setup();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      console.log('Cleaning up noise effect');
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(loopTimeoutRef.current);
      window.clearTimeout(resizeThrottleRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="noise"
      className="noise"
      aria-hidden="true"
      style={{ opacity: 0.4 }}
    />
  );
}
