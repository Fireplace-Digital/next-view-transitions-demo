"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function GsapScripts() {
  useEffect(() => {
    const checkGsap = () => {
      if (window.gsap && window.Draggable) {
        try {
          // Just log the Draggable object status
          console.log('Draggable object:', {
            draggable: window.Draggable,
            methods: Object.getOwnPropertyNames(window.Draggable),
            create: typeof window.Draggable.create
          });
        } catch (error) {
          console.error('Error checking Draggable:', error);
        }
      }
    };
    
    // Initial check
    checkGsap();
    
    // Check again after scripts load
    const timeoutId = setTimeout(checkGsap, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      <Script 
        src="/gsap/gsap.js" 
        strategy="beforeInteractive"
      />
      <Script 
        src="/gsap/InertiaPlugin.js" 
        strategy="beforeInteractive"
      />
      <Script 
        src="/gsap/Draggable.js" 
        strategy="beforeInteractive"
      />
    </>
  );
}