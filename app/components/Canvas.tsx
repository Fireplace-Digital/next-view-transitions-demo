'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGrid } from '@/app/context/GridContext';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xf4f4f4);  // Light gray background
    
    // Camera setup
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    cameraRef.current = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    cameraRef.current.position.z = 5;

    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false  // We don't need transparency
    });

    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current || !canvasRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update canvas size
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;

      // Update renderer
      rendererRef.current.setSize(width, height, false);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Update camera
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-2]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}