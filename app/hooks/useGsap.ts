"use client";

import { useEffect, useState } from 'react';

export function useGsap() {
  const [isGsapReady, setIsGsapReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkGsap = () => {
      const hasGsap = !!window.gsap;
      const hasDraggable = !!window.Draggable;
      const hasCreate = typeof window.Draggable?.create === 'function';

      console.log('GSAP Check:', { hasGsap, hasDraggable, hasCreate });

      if (hasGsap && hasDraggable && hasCreate) {
        setIsGsapReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkGsap()) {
      // If not ready, check again in a moment
      const timeoutId = setTimeout(checkGsap, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return isGsapReady;
}