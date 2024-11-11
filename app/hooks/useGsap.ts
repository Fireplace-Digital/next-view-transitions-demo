"use client";

import { useEffect, useState } from 'react';
import '../types/gsap';

// Paths must be declared outside of the effect
const gsapCore = '../../public/gsap/gsap.js';
const gsapInertia = '../../public/gsap/InertiaPlugin.js';
const gsapDraggable = '../../public/gsap/Draggable.js';

export function useGsap() {
  const [isGsapReady, setIsGsapReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Promise.all([
        import(gsapCore),
        import(gsapInertia),
        import(gsapDraggable)
      ]).then(() => {
        const gsap = window.gsap;
        const Draggable = window.Draggable;

        if (gsap && Draggable) {
          gsap.registerPlugin(Draggable);
          setIsGsapReady(true);
          console.log('GSAP version:', gsap.version);
          console.log('Draggable loaded:', Boolean(Draggable));
        } else {
          console.warn('GSAP or Draggable not found after loading');
        }
      }).catch(err => {
        console.error('Error loading GSAP:', err);
      });
    }
  }, []);

  return isGsapReady;
}

export function useGsapInstance() {
  const isReady = useGsap();
  return {
    gsap: isReady ? window.gsap : null,
    Draggable: isReady ? window.Draggable : null,
    isReady
  } as const;
}

export type GSAP = NonNullable<typeof window.gsap>;
export type Draggable = NonNullable<typeof window.Draggable>;
export type DraggableVars = Parameters<typeof window.Draggable.create>[1];