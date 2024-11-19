"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Create a stable initial path that will be the same on server and client
const INITIAL_PATH = "M 197 126 L 161.5 179.5 L 91.5 186.5 L 63.8 126 L 91.5 65.5 L 161.5 72.5 Z";

// Helper function to generate blob path
const generateBlobPath = (radius: number, irregularity: number = 0.5) => {
  const points = 6; // Number of points around the circle
  const angle = (Math.PI * 2) / points;
  const path = [];

  for (let i = 0; i < points; i++) {
    const currentAngle = i * angle;
    const randomRadius = radius + (Math.random() * 2 - 1) * radius * irregularity;
    const x = Math.cos(currentAngle) * randomRadius + 126; // Center x
    const y = Math.sin(currentAngle) * randomRadius + 126; // Center y
    
    if (i === 0) {
      path.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
    } else {
      path.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  }
  
  path.push('Z'); // Close the path
  return path.join(' ');
};

// Generate paths with fixed random seed
const paths = [
  INITIAL_PATH,
  "M 199 126 L 165.1 193.7 L 82.1 202 L 65.5 126 L 92.7 68.3 L 171.7 46.8 Z",
  "M 208.5 126 L 157.2 180 L 91.1 186.4 L 63.8 126 L 90.7 64.8 L 158.7 69.4 Z",
  INITIAL_PATH, // Use the same first path to ensure smooth loop
];

export function GradientBlob() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Check if we're over an interactive element
      const target = e.target as HTMLElement;
      const isInteractive = target.matches('a, button, [role="button"], input, textarea, select, [onclick], .grid-image') ||
                           target.closest('a, button, [role="button"], input, textarea, select, [onclick], .grid-image') !== null;
      setIsOverInteractive(isInteractive);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pathname]);

  // Don't render anything on server or before hydration
  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none z-[9999]"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        opacity: isVisible && !isOverInteractive ? 1 : 0,
      }}
      transition={{
        x: {
          type: "spring",
          mass: 0.3,
          stiffness: 80,
          damping: 15,
          restDelta: 0.001
        },
        y: {
          type: "spring",
          mass: 0.3,
          stiffness: 80,
          damping: 15,
          restDelta: 0.001
        },
        opacity: {
          duration: 0.2,
          ease: "easeInOut"
        }
      }}
      style={{
        position: 'fixed',
        top: -30,
        left: -30,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="120" 
        height="120" 
        viewBox="0 0 252 252" 
        fill="none"
        style={{
          filter: 'blur(1px)',
        }}
      >
        <defs>
          <filter 
            id="filter0_f_133_53" 
            x="0" 
            y="0" 
            width="252" 
            height="252" 
            filterUnits="userSpaceOnUse" 
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="27.5" result="blur"/>
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01" 
              numOctaves="2" 
              result="noise" 
              seed="0"
            />
            <feDisplacementMap 
              in="blur" 
              in2="noise" 
              scale="3" 
              xChannelSelector="R" 
              yChannelSelector="G"
            />
          </filter>
          <linearGradient 
            id="paint0_linear_133_53" 
            x1="96.3251" 
            y1="78.7399" 
            x2="165.127" 
            y2="181.833" 
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#98321A"/>
            <stop offset="0.35" stopColor="#FFB54C"/>
            <stop offset="0.705" stopColor="#49A0CD"/>
            <stop offset="1" stopColor="#576886"/>
          </linearGradient>
        </defs>
        <g filter="url(#filter0_f_133_53)">
          <motion.path
            initial={{ d: INITIAL_PATH }}
            d={INITIAL_PATH}
            fill="url(#paint0_linear_133_53)"
            animate={{
              d: paths,
              scale: [1, 1.02, 0.98, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              d: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.33, 0.66, 1]
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </g>
      </svg>
    </motion.div>
  );
}
